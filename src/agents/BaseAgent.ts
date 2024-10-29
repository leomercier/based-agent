import { AgentConfig } from "../types";
import { CDPWalletService } from "../services/CDPWalletService";
import { OpenAI } from "openai";
import { env } from "../config/env";

export class BaseAgent {
  private name: string;
  private instructions: string;
  private functions: Function[];
  private walletService: CDPWalletService;
  private openai?: OpenAI;

  constructor(config: AgentConfig) {
    this.name = config.name;
    this.instructions = config.instructions;
    this.functions = config.functions;
    this.walletService = new CDPWalletService();

    if (env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: env.OPENAI_API_KEY,
      });
    }
  }

  public async initialize(isMainnet: boolean = false): Promise<void> {
    await this.walletService.createWallet(isMainnet);
  }

  public async createToken(
    name: string,
    symbol: string,
    initialSupply: number
  ): Promise<string> {
    try {
      return await this.walletService.deployToken(name, symbol, initialSupply);
    } catch (error) {
      return `Error creating token: ${
        error instanceof Error ? error.message : String(error)
      }`;
    }
  }

  public async transferAsset(
    amount: number,
    assetId: string,
    destinationAddress: string
  ): Promise<string> {
    try {
      const isMainnet = this.walletService.isMainnet();
      const isUsdc = assetId.toLowerCase() === "usdc";
      const gasless = isMainnet && isUsdc;

      return await this.walletService.transferAsset(
        amount,
        assetId,
        destinationAddress,
        gasless
      );
    } catch (error) {
      return `Error transferring asset: ${
        error instanceof Error ? error.message : String(error)
      }`;
    }
  }

  public async getBalance(assetId: string): Promise<string> {
    try {
      return await this.walletService.getBalance(assetId);
    } catch (error) {
      return `Error getting balance: ${
        error instanceof Error ? error.message : String(error)
      }`;
    }
  }

  public async requestFaucet(): Promise<string> {
    try {
      if (this.walletService.isMainnet()) {
        return "Error: The faucet is only available on Base Sepolia testnet.";
      }
      return await this.walletService.requestFaucet();
    } catch (error) {
      return `Error requesting from faucet: ${
        error instanceof Error ? error.message : String(error)
      }`;
    }
  }

  public async generateArt(prompt: string): Promise<string> {
    if (!this.openai) {
      return "Error: OpenAI API key not configured";
    }

    try {
      const response = await this.openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        size: "1024x1024",
        quality: "standard",
        n: 1,
      });

      const imageUrl = response.data[0].url;
      return `Generated artwork available at: ${imageUrl}`;
    } catch (error) {
      return `Error generating artwork: ${
        error instanceof Error ? error.message : String(error)
      }`;
    }
  }

  public async deployNFT(
    name: string,
    symbol: string,
    baseUri: string
  ): Promise<string> {
    try {
      return await this.walletService.deployNFT(name, symbol, baseUri);
    } catch (error) {
      return `Error deploying NFT: ${
        error instanceof Error ? error.message : String(error)
      }`;
    }
  }

  public async mintNFT(
    contractAddress: string,
    mintTo: string
  ): Promise<string> {
    try {
      return await this.walletService.mintNFT(contractAddress, mintTo);
    } catch (error) {
      return `Error minting NFT: ${
        error instanceof Error ? error.message : String(error)
      }`;
    }
  }

  public async swapAssets(
    amount: number,
    fromAssetId: string,
    toAssetId: string
  ): Promise<string> {
    try {
      if (!this.walletService.isMainnet()) {
        return "Error: Asset swaps are only available on Base Mainnet.";
      }
      return await this.walletService.tradeAssets(
        amount,
        fromAssetId,
        toAssetId
      );
    } catch (error) {
      return `Error swapping assets: ${
        error instanceof Error ? error.message : String(error)
      }`;
    }
  }

  public getAddress(): string {
    return this.walletService.getWalletAddress();
  }

  public getName(): string {
    return this.name;
  }

  public getInstructions(): string {
    return this.instructions;
  }

  public getFunctions(): Function[] {
    return this.functions;
  }
}
