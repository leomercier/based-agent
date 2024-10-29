export interface CDPConfig {
  apiKeyName: string;
  privateKey: string;
}

export interface TradeConfig {
  amount: number;
  fromAssetId: string;
  toAssetId: string;
}

export interface TransferConfig {
  amount: number;
  assetId: string;
  destination: string;
  gasless?: boolean;
}

export interface NFTDeployConfig {
  name: string;
  symbol: string;
  baseUri: string;
}

export interface TokenDeployConfig {
  name: string;
  symbol: string;
  initialSupply: number;
}
