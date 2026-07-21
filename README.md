# TrustForest Shashikant

## Links
- [Live site](https://trust-forest.vercel.app/)
- [Demo video](#demo-video)
- [Project details](#project-details)
- [Contract details](#contract-details)
- [How it works](#how-it-works)
- [Project structure](#project-structure)
- [Screenshots](#screenshots)
- [Local setup](#local-setup)
- [Scripts](#scripts)
- [App routes](#app-routes)

## Project details
TrustForest is a tree-plantation verification app built with Next.js and a Soroban smart contract.

### Live site
- https://trust-forest.vercel.app/

### Demo video
- https://drive.google.com/file/d/1Ovcw48-qmOTTTP0xJP1_-XJk1xXkbAC1/view?usp=sharing

### Basic stack
- Frontend: Next.js 16, React 19, TypeScript
- Styling: Tailwind CSS 4
- Animation/UI: Framer Motion, Lucide icons
- Wallets: Stellar Wallets Kit
- Image storage: Pinata upload API + IPFS gateway URL
- Contract: Soroban SDK 27, Rust, Stellar

### What this project does
- Planter uploads photo to Pinata, then submits claim with IPFS URI, grid cell, and stake
- Wallet connect uses Stellar Wallets Kit
- Admin reviews each claim and accepts or rejects it
- Accepted claim returns stake and pays fixed `5 XLM` reward (`50,000,000` stroops), then becomes `Paid`
- Rejected claim refunds stake
- Expired or cancelled claims free claim slots again

## User Feedback
| Feedback | Solution | Commit ID |
|----------|----------|-----------|
| The submit button lacks a clear animated loading state other than the spinner. | Added pulse animation to button when processing | `312eba6` |
| The input fields do not have a prominent focus ring when clicked. | Added focus:ring-2 and focus:ring-forest to input elements | `3c32a2d` |
| Nav links are a bit static on hover. | Increased background opacity and added scale transform on hover | `6917b4c` |
| Claim cards don't pop enough when hovering over them. | Added shadow-xl and increased translateY on hover | `9433078` |
| The pending status badge color blends in too much. | Updated Pending badge to be brighter amber with a border | `7e2b6c6` |
| The empty state on the dashboard is confusing when filters hide all claims. | Appended 'Try adjusting filters' to the empty state message | `ad734f1` |
| The statistical numbers in the counter are too small. | Increased font size to text-7xl and made them extrabold | `082d936` |
| The hero section text is hard to read against the busy background. | Added drop-shadow-md to hero headings | `7ce7e8d` |
| The footer lacks visual separation from the rest of the page. | Added a top margin and subtle shadow to the footer | `e01d78d` |
| The tree growth visualizer lacks a continuous pulse effect. | Added animate-pulse to the canopy rings | `8f8566c` |

## Contract details
Contract lives in [`contract/src/lib.rs`](./contract/src/lib.rs).

### Contract name
- `tree-planting-verification`

### Current deployed contract
- `CB3RX6ISHEZXGHXGOU7OLLK5QATU7X6FSM6RWZEKXXXFCRCJRSBHIBYF`

### Core state
- Fixed admin address: `GCGEXUG76FMVLCQHMVEUIQ2GPDEZSSNXQZQITISFUR433LZCD4UPGMYT`
- Next claim ID
- Claim records
- Photo URI index
- Grid cell index

Each claim stores its ID, planter address, photo URI, grid cell, status, stake
amount, submission timestamp, and expiry ledger. No verifier set or vote list
exists in the current contract.

### Main functions
- `init(admin, initializer)`: one-time setup; `initializer` authenticates deployment and `admin` becomes the only decision authority
- `submit_claim`: stores claim, transfers stake, indexes photo and grid cell
- `decide_claim(admin, claim_id, approve)`: authenticated admin accepts or rejects a pending claim; acceptance pays stake plus reward, rejection refunds stake
- `update_claim`: lets planter update pending claim
- `cancel_claim`: lets planter cancel pending claim
- `expire_claim`: closes stale claim after expiry ledger
- `delete_claim`: admin removes rejected or cancelled claim records
- `get_claim`: returns one claim
- `list_claims`: returns claims with optional status filter

### Claim rules
- Photo URI must stay unique
- Grid cell must stay unique
- Stake must be positive
- Only stored admin can call `decide_claim`
- Acceptance changes `Pending` → `Paid` after payout
- Rejection changes `Pending` → `Rejected` and refunds stake
- Expired claims release indexes

## How it works
1. Planter picks photo and app uploads it to Pinata.
2. App stores returned `ipfs://CID` on-chain with grid cell and stake.
3. Contract locks stake and stores claim as `Pending`.
4. Only wallet matching `NEXT_PUBLIC_ADMIN_ADDRESS` sees dashboard accept/reject controls.
5. Contract independently authenticates the admin address, so UI visibility is not the security boundary.
6. Admin acceptance moves claim through payout; rejection refunds stake.
7. Expired or cancelled claims clear reserved indexes.

## Project structure
```text
.
├── app
│   ├── page.tsx
│   ├── submit
│   ├── dashboard
│   ├── how-it-works
│   └── why-stellar
├── components
├── contract
│   ├── Cargo.toml
│   ├── deploy.sh
│   └── src/lib.rs
├── lib
└── README.md
```

## Screenshots
<table>
  <tr>
    <td width="50%">
      <strong>Home page</strong><br><br>
    <img width="1876" height="1005" alt="image" src="https://github.com/user-attachments/assets/6e8ddf0d-2ff8-4204-ab2f-141a7225cc0a" />
    </td>
    <td width="50%">
      <strong>Submit claim form</strong><br><br>
     <img width="1876" height="1005" alt="image" src="https://github.com/user-attachments/assets/89090875-3c62-40a6-941a-f50e125b0e6d" />
    </td>
  </tr>
  <tr>
    <td width="50%">
      <strong>Dashboard</strong><br><br>
     <img width="1876" height="1005" alt="image" src="https://github.com/user-attachments/assets/1073bf5f-c8d1-4867-9235-445c2b647157" />
    </td>
    <td width="50%">
      <strong>How it works</strong><br><br>
      <img width="1876" height="1005" alt="image" src="https://github.com/user-attachments/assets/93c69e33-8d4b-46ae-84a7-ed7bd837a4f3" />
    </td>
  </tr>
  <tr>
    <td width="50%">
      <strong>CI</strong><br><br>
      <img width="1876" height="1005" alt="image" src="https://github.com/user-attachments/assets/33dab175-33bf-4491-97b3-089acc62997f" />
    </td>
    <td width="50%">
      <strong>Mobile responsive</strong><br><br>
     <img width="373" height="920" alt="image" src="https://github.com/user-attachments/assets/0a81d49f-c4f6-4ddc-b93b-6e88da05857f" />
    </td>
  </tr>
</table>

## Local setup
### Frontend
```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

### Frontend checks
```bash
npm run typecheck
npm run lint
```

### Contract build
```bash
npm run contract:build
```

### CD / Docker
- `Dockerfile` added for containerized deployment.
- Next uses `output: "standalone"` so Docker image can run without full source tree.
- Build image with `docker build -t trustforest-shashikant:local .`

### Environment variables
- `NEXT_PUBLIC_CONTRACT_ID`
- `NEXT_PUBLIC_RPC_URL`
- `NEXT_PUBLIC_NETWORK_PASSPHRASE`
- `NEXT_PUBLIC_ADMIN_ADDRESS`
- `NEXT_PUBLIC_PINATA_GATEWAY`
- `PINATA_JWT`
- `PINATA_GATEWAY`
- `ADMIN_ADDRESS`
- `DEPLOYER_IDENTITY`

## Scripts
- `npm run dev`: start Next.js dev server
- `npm run build`: build frontend
- `npm run typecheck`: run TypeScript check
- `npm run lint`: run ESLint
- `npm run contract:build`: build Soroban contract to `wasm32v1-none`

## App routes
- `/` - landing page
- `/submit` - claim submission flow
- `/dashboard` - claim dashboard
- `/how-it-works` - contract flow explanation
- `/why-stellar` - Stellar rationale

## Notes
- `contract/deploy.sh` builds, deploys, and initializes contract on Stellar testnet.
- Deployment uses `DEPLOYER_IDENTITY` to authenticate `init`; it stores the fixed `ADMIN_ADDRESS` separately for later claim decisions.
- Current testnet contract ID is `CB3RX6ISHEZXGHXGOU7OLLK5QATU7X6FSM6RWZEKXXXFCRCJRSBHIBYF`.
- `NEXT_PUBLIC_ADMIN_ADDRESS` gates accept/reject controls to the fixed admin wallet.
- CI uses `npm install --no-package-lock` so frontend checks do not depend on `package-lock.json`.
- Dashboard and claim pages render photo from Pinata/IPFS URI, not local file path.

## Verification Results
- `npm run test`: 4 tests passed.
- `npm run lint`: passed.
- `npm run build`: passed.
- `docker build -t trustforest-shashikant:local .`: Docker daemon required locally.
