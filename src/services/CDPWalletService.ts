// @ts-nocheck
import { Coinbase, Wallet } from "@coinbase/coinbase-sdk";
import { env } from "../config/env";

// Configure CDP with environment variables

Coinbase.configure({
  apiKeyName: env.CDP_API_KEY_NAME,
  privateKey: env.CDP_PRIVATE_KEY,
});

export class CDPWalletService {
  private wallet?: typeof Wallet;

  constructor() {}

  async createWallet(isMainnet: boolean = false): Promise<typeof Wallet> {
    try {
      const wallet = await Wallet.create({
        networkId: isMainnet
          ? Coinbase.networks.BaseMainnet
          : Coinbase.networks.BaseSepolia,
      });

      console.log(
        "Wallet",
        await (await wallet.getDefaultAddress()).toString()
      );
      this.wallet = wallet;
      return this.wallet;
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to create wallet: ${error}`);
    }
  }

  async requestFaucet(): Promise<string> {
    if (!this.wallet) {
      throw new Error("Wallet not initialized");
    }

    try {
      const faucetTransaction = await this.wallet.faucet();
      return `Faucet transaction completed successfully: ${faucetTransaction.toString()}`;
    } catch (error) {
      throw new Error(`Failed to request from faucet: ${error}`);
    }
  }

  async transferAsset(
    amount: number,
    assetId: string,
    destinationAddress: string,
    gasless: boolean = false
  ): Promise<string> {
    if (!this.wallet) {
      throw new Error("Wallet not initialized");
    }

    try {
      const transfer = await this.wallet.createTransfer({
        amount,
        assetId,
        destination: destinationAddress,
        gasless,
      });

      await transfer.wait();

      if (transfer.getStatus() === "complete") {
        return `Transfer successfully completed: ${transfer.toString()}`;
      } else {
        throw new Error(`Transfer failed: ${transfer.toString()}`);
      }
    } catch (error) {
      throw new Error(`Failed to transfer asset: ${error}`);
    }
  }

  async getBalance(assetId: string): Promise<string> {
    if (!this.wallet) {
      throw new Error("Wallet not initialized");
    }

    try {
      const balance = await this.wallet.getBalance(assetId);
      return `Current balance of ${assetId}: ${balance}`;
    } catch (error) {
      throw new Error(`Failed to get balance: ${error}`);
    }
  }

  async tradeAssets(
    amount: number,
    fromAssetId: string,
    toAssetId: string
  ): Promise<string> {
    if (!this.wallet) {
      throw new Error("Wallet not initialized");
    }

    if (this.wallet.networkId !== Coinbase.networks.BaseMainnet) {
      throw new Error("Trading is only available on Base Mainnet");
    }

    try {
      const trade = await this.wallet.createTrade({
        amount,
        fromAssetId,
        toAssetId,
      });

      await trade.wait();

      if (trade.getStatus() === "complete") {
        return `Trade successfully completed: ${trade.toString()}`;
      } else {
        throw new Error(`Trade failed: ${trade.toString()}`);
      }
    } catch (error) {
      throw new Error(`Failed to trade assets: ${error}`);
    }
  }

  async deployToken(
    name: string,
    symbol: string,
    initialSupply: number
  ): Promise<string> {
    if (!this.wallet) {
      throw new Error("Wallet not initialized");
    }

    try {
      const deployedContract = await this.wallet.deployToken(
        name,
        symbol,
        initialSupply
      );
      await deployedContract.wait();
      return `Token ${name} (${symbol}) created with initial supply of ${initialSupply} and contract address ${deployedContract.contractAddress}`;
    } catch (error) {
      throw new Error(`Failed to deploy token: ${error}`);
    }
  }

  async deployNFT(
    name: string,
    symbol: string,
    baseUri: string
  ): Promise<string> {
    if (!this.wallet) {
      throw new Error("Wallet not initialized");
    }

    try {
      const deployedNFT = await this.wallet.deployNFT(name, symbol, baseUri);
      await deployedNFT.wait();
      return `Successfully deployed NFT contract '${name}' (${symbol}) at address ${deployedNFT.contractAddress} with base URI: ${baseUri}`;
    } catch (error) {
      throw new Error(`Failed to deploy NFT: ${error}`);
    }
  }

  async mintNFT(contractAddress: string, mintTo: string): Promise<string> {
    if (!this.wallet) {
      throw new Error("Wallet not initialized");
    }

    try {
      const mintArgs = {
        to: mintTo,
        quantity: "1",
      };

      const mintInvocation = await this.wallet.invokeContract({
        contractAddress,
        method: "mint",
        args: mintArgs,
      });

      await mintInvocation.wait();
      return `Successfully minted NFT to ${mintTo}`;
    } catch (error) {
      throw new Error(`Failed to mint NFT: ${error}`);
    }
  }

  getWalletAddress(): string {
    if (!this.wallet) {
      throw new Error("Wallet not initialized");
    }
    return this.wallet.getDefaultAddress().toString();
  }

  isMainnet(): boolean {
    if (!this.wallet) {
      throw new Error("Wallet not initialized");
    }
    return this.wallet.networkId === Coinbase.networks.BaseMainnet;
  }
}
