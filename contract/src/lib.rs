#![no_std]

use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, panic_with_error,
    token::StellarAssetClient, Address, Env, String, Vec,
};

const FIXED_REWARD_STROOPS: i128 = 50_000_000;
const CLAIM_EXPIRY_LEDGER_WINDOW: u32 = 5_000;
const TESTNET_NATIVE_ASSET_CONTRACT_ID: &str =
    "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC";

#[contracttype]
#[derive(Clone, Eq, PartialEq)]
pub enum ClaimStatus {
    Pending,
    Approved,
    Rejected,
    Paid,
    Cancelled,
    Expired,
}

#[contracttype]
#[derive(Clone, Eq, PartialEq)]
pub struct Claim {
    pub id: u64,
    pub planter: Address,
    pub photo_uri: String,
    pub grid_cell: String,
    pub status: ClaimStatus,
    pub stake_amount: i128,
    pub timestamp: u64,
    pub expiry_ledger: u32,
}

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Initialized,
    Admin,
    NextClaimId,
    Claim(u64),
    PhotoIndex(String),
    GridIndex(String),
}

#[contracterror]
#[derive(Copy, Clone, Eq, PartialEq)]
pub enum Error {
    AlreadyInitialized = 1,
    ClaimNotFound = 2,
    DuplicatePhotoUri = 3,
    DuplicateGridCell = 4,
    InvalidStateTransition = 5,
    Unauthorized = 6,
    InvalidStake = 7,
    NotInitialized = 8,
}

#[contract]
pub struct TreePlantingContract;

#[contractimpl]
impl TreePlantingContract {
    pub fn init(env: Env, admin: Address, initializer: Address) {
        if env.storage().persistent().has(&DataKey::Initialized) {
            panic_with_error!(&env, Error::AlreadyInitialized);
        }

        initializer.require_auth();
        env.storage().persistent().set(&DataKey::Initialized, &true);
        env.storage().persistent().set(&DataKey::Admin, &admin);
        env.storage().persistent().set(&DataKey::NextClaimId, &1u64);
    }

    pub fn submit_claim(
        env: Env,
        planter: Address,
        photo_uri: String,
        grid_cell: String,
        stake: i128,
    ) -> u64 {
        planter.require_auth();
        Self::require_initialized(&env);

        if stake <= 0 {
            panic_with_error!(&env, Error::InvalidStake);
        }

        Self::ensure_unique_photo(&env, &photo_uri);
        Self::ensure_unique_grid(&env, &grid_cell);

        let claim_id = Self::next_claim_id(&env);
        let claim = Claim {
            id: claim_id,
            planter: planter.clone(),
            photo_uri: photo_uri.clone(),
            grid_cell: grid_cell.clone(),
            status: ClaimStatus::Pending,
            stake_amount: stake,
            timestamp: env.ledger().timestamp(),
            expiry_ledger: env
                .ledger()
                .sequence()
                .saturating_add(CLAIM_EXPIRY_LEDGER_WINDOW),
        };

        Self::native_asset(&env).transfer(&planter, &env.current_contract_address(), &stake);

        env.storage()
            .persistent()
            .set(&DataKey::Claim(claim_id), &claim);
        env.storage()
            .persistent()
            .set(&DataKey::PhotoIndex(photo_uri), &claim_id);
        env.storage()
            .persistent()
            .set(&DataKey::GridIndex(grid_cell), &claim_id);

        env.storage()
            .persistent()
            .set(&DataKey::NextClaimId, &(claim_id + 1));

        claim_id
    }

    pub fn decide_claim(env: Env, admin: Address, claim_id: u64, approve: bool) {
        admin.require_auth();
        Self::require_initialized(&env);
        Self::require_admin(&env, &admin);

        let mut claim = Self::get_claim_or_panic(&env, claim_id);
        Self::ensure_pending(&env, &claim);

        if approve {
            claim.status = ClaimStatus::Approved;
            env.storage()
                .persistent()
                .set(&DataKey::Claim(claim_id), &claim);
            Self::payout(&env, claim_id);
        } else {
            claim.status = ClaimStatus::Rejected;
            env.storage()
                .persistent()
                .set(&DataKey::Claim(claim_id), &claim);
            Self::refund_stake(&env, &claim.planter, claim.stake_amount);
        }
    }

    pub fn get_claim(env: Env, claim_id: u64) -> Claim {
        Self::require_initialized(&env);
        Self::get_claim_or_panic(&env, claim_id)
    }

    pub fn list_claims(env: Env, status: Option<ClaimStatus>) -> Vec<Claim> {
        Self::require_initialized(&env);

        let next_id = Self::next_claim_id(&env);
        let mut claims = Vec::new(&env);
        let mut claim_id = 1u64;

        while claim_id < next_id {
            if let Some(claim) = env
                .storage()
                .persistent()
                .get::<DataKey, Claim>(&DataKey::Claim(claim_id))
            {
                if let Some(filter) = status.clone() {
                    if claim.status != filter {
                        claim_id += 1;
                        continue;
                    }
                }
                claims.push_back(claim);
            }
            claim_id += 1;
        }

        claims
    }

    pub fn update_claim(
        env: Env,
        planter: Address,
        claim_id: u64,
        new_photo_uri: String,
        new_grid_cell: String,
    ) {
        planter.require_auth();
        Self::require_initialized(&env);

        let mut claim = Self::get_claim_or_panic(&env, claim_id);
        if planter != claim.planter {
            panic_with_error!(&env, Error::Unauthorized);
        }
        Self::ensure_pending(&env, &claim);

        if new_photo_uri != claim.photo_uri {
            Self::ensure_unique_photo(&env, &new_photo_uri);
        }
        if new_grid_cell != claim.grid_cell {
            Self::ensure_unique_grid(&env, &new_grid_cell);
        }

        env.storage()
            .persistent()
            .remove(&DataKey::PhotoIndex(claim.photo_uri.clone()));
        env.storage()
            .persistent()
            .remove(&DataKey::GridIndex(claim.grid_cell.clone()));

        claim.photo_uri = new_photo_uri.clone();
        claim.grid_cell = new_grid_cell.clone();

        env.storage()
            .persistent()
            .set(&DataKey::Claim(claim_id), &claim);
        env.storage()
            .persistent()
            .set(&DataKey::PhotoIndex(new_photo_uri), &claim_id);
        env.storage()
            .persistent()
            .set(&DataKey::GridIndex(new_grid_cell), &claim_id);
    }

    pub fn cancel_claim(env: Env, planter: Address, claim_id: u64) {
        planter.require_auth();
        Self::require_initialized(&env);

        let mut claim = Self::get_claim_or_panic(&env, claim_id);
        if planter != claim.planter {
            panic_with_error!(&env, Error::Unauthorized);
        }
        Self::ensure_pending(&env, &claim);

        Self::refund_stake(&env, &claim.planter, claim.stake_amount);
        claim.status = ClaimStatus::Cancelled;
        env.storage()
            .persistent()
            .set(&DataKey::Claim(claim_id), &claim);
        Self::clear_claim_indices(&env, &claim);
    }

    pub fn delete_claim(env: Env, admin: Address, claim_id: u64) {
        admin.require_auth();
        Self::require_initialized(&env);
        Self::require_admin(&env, &admin);

        let claim = Self::get_claim_or_panic(&env, claim_id);
        if claim.status != ClaimStatus::Rejected && claim.status != ClaimStatus::Cancelled {
            panic_with_error!(&env, Error::InvalidStateTransition);
        }

        Self::clear_claim_indices(&env, &claim);
        env.storage().persistent().remove(&DataKey::Claim(claim_id));
    }

    pub fn expire_claim(env: Env, _caller: Address, claim_id: u64) {
        Self::require_initialized(&env);

        let mut claim = Self::get_claim_or_panic(&env, claim_id);
        Self::ensure_pending(&env, &claim);

        if env.ledger().sequence() <= claim.expiry_ledger {
            panic_with_error!(&env, Error::InvalidStateTransition);
        }

        Self::refund_stake(&env, &claim.planter, claim.stake_amount);
        claim.status = ClaimStatus::Expired;
        env.storage()
            .persistent()
            .set(&DataKey::Claim(claim_id), &claim);
        Self::clear_claim_indices(&env, &claim);
    }
}

impl TreePlantingContract {
    fn payout(env: &Env, claim_id: u64) {
        let mut claim = Self::get_claim_or_panic(env, claim_id);
        if claim.status != ClaimStatus::Approved {
            panic_with_error!(env, Error::InvalidStateTransition);
        }

        let amount = claim.stake_amount + FIXED_REWARD_STROOPS;
        Self::native_asset(env).transfer(&env.current_contract_address(), &claim.planter, &amount);

        claim.status = ClaimStatus::Paid;
        env.storage()
            .persistent()
            .set(&DataKey::Claim(claim_id), &claim);
    }

    fn refund_stake(env: &Env, planter: &Address, stake_amount: i128) {
        Self::native_asset(env).transfer(&env.current_contract_address(), planter, &stake_amount);
    }

    fn native_asset(env: &Env) -> StellarAssetClient<'_> {
        let token_address = Address::from_str(env, TESTNET_NATIVE_ASSET_CONTRACT_ID);
        StellarAssetClient::new(env, &token_address)
    }

    fn require_initialized(env: &Env) {
        if !env.storage().persistent().has(&DataKey::Initialized) {
            panic_with_error!(env, Error::NotInitialized);
        }
    }

    fn require_admin(env: &Env, admin: &Address) {
        let stored_admin = Self::get_admin(env);
        if admin != &stored_admin {
            panic_with_error!(env, Error::Unauthorized);
        }
    }

    fn ensure_unique_photo(env: &Env, photo_uri: &String) {
        if env
            .storage()
            .persistent()
            .has(&DataKey::PhotoIndex(photo_uri.clone()))
        {
            panic_with_error!(env, Error::DuplicatePhotoUri);
        }
    }

    fn ensure_unique_grid(env: &Env, grid_cell: &String) {
        if env
            .storage()
            .persistent()
            .has(&DataKey::GridIndex(grid_cell.clone()))
        {
            panic_with_error!(env, Error::DuplicateGridCell);
        }
    }

    fn ensure_pending(env: &Env, claim: &Claim) {
        if claim.status != ClaimStatus::Pending {
            panic_with_error!(env, Error::InvalidStateTransition);
        }
    }

    fn clear_claim_indices(env: &Env, claim: &Claim) {
        env.storage()
            .persistent()
            .remove(&DataKey::PhotoIndex(claim.photo_uri.clone()));
        env.storage()
            .persistent()
            .remove(&DataKey::GridIndex(claim.grid_cell.clone()));
    }

    fn get_admin(env: &Env) -> Address {
        match env.storage().persistent().get(&DataKey::Admin) {
            Some(admin) => admin,
            None => panic_with_error!(env, Error::NotInitialized),
        }
    }

    fn next_claim_id(env: &Env) -> u64 {
        match env.storage().persistent().get(&DataKey::NextClaimId) {
            Some(id) => id,
            None => panic_with_error!(env, Error::NotInitialized),
        }
    }

    fn get_claim_or_panic(env: &Env, claim_id: u64) -> Claim {
        match env.storage().persistent().get(&DataKey::Claim(claim_id)) {
            Some(claim) => claim,
            None => panic_with_error!(env, Error::ClaimNotFound),
        }
    }
}
