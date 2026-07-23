export const CONTRACT_NAME = "tree-planting-verification";
export const CONTRACT_NETWORK = "Stellar testnet";
export const DEPLOYED_CONTRACT_ID =
  "CB3RX6ISHEZXGHXGOU7OLLK5QATU7X6FSM6RWZEKXXXFCRCJRSBHIBYF";

export const CONTRACT_SOURCE_URL =
  "https://github.com/rajnishd99/Trust-Forest/blob/main/contract/src/lib.rs";
export const CONTRACT_FOLDER_URL =
  "https://github.com/rajnishd99/Trust-Forest/tree/main/contract";

export function getContractId() {
  return (
    process.env.NEXT_PUBLIC_CONTRACT_ID ??
    process.env.CONTRACT_ID ??
    DEPLOYED_CONTRACT_ID
  );
}

export function getContractExplorerUrl(contractId = getContractId()) {
  return `https://stellar.expert/explorer/testnet/contract/${contractId}`;
}
