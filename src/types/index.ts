export interface AgentConfig {
  name: string;
  instructions: string;
  functions: Function[];
}

export interface TwitterConfig {
  apiKey: string;
  apiSecret: string;
  accessToken: string;
  accessTokenSecret: string;
}

export interface TokenConfig {
  name: string;
  symbol: string;
  initialSupply: number;
}

export interface NFTConfig {
  name: string;
  symbol: string;
  baseUri: string;
}

export interface TransferConfig {
  amount: number;
  assetId: string;
  destinationAddress: string;
}
