export interface ContractAddresses {
  BASENAMES_REGISTRAR_CONTROLLER_ADDRESS_MAINNET: string;
  BASENAMES_REGISTRAR_CONTROLLER_ADDRESS_TESTNET: string;
  L2_RESOLVER_ADDRESS_MAINNET: string;
  L2_RESOLVER_ADDRESS_TESTNET: string;
}

export interface ContractConfig {
  addresses: ContractAddresses;
  abis: {
    l2_resolver: any[];
    registrar: any[];
  };
}
