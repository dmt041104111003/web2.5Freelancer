export const APTOS_NETWORK = "testnet";
export const APTOS_NODE_URL = "https://fullnode.testnet.aptoslabs.com";
export const APTOS_FAUCET_URL =  "https://faucet.testnet.aptoslabs.com";


export const CONTRACT_ADDRESS ="0x82de70fe28be545a232cb19f24084475555459b55f7b6cc70ceb352a8644f947";

export const DID = {
  BURN_DID: `${CONTRACT_ADDRESS}::did_registry::burn_did`,
  CREATE_PROFILE: `${CONTRACT_ADDRESS}::did_registry::create_profile`,
  UPDATE_PROFILE: `${CONTRACT_ADDRESS}::did_registry::update_profile`,
  IS_PROFILE_VERIFIED: `${CONTRACT_ADDRESS}::did_registry::is_profile_verified`,
} as const;

export const ZKP = {
  ADD_ZKP_PROOF: `${CONTRACT_ADDRESS}::zkp_lookup::add_zkp_proof`,
  ADD_ZKP_PROOF_INTERNAL: `${CONTRACT_ADDRESS}::zkp_lookup::add_zkp_proof_internal`,
} as const;

