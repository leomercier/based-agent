import { Swarm, Agent, createAgentFunction } from "ts-swarm";
import { Message, StreamChunk } from "../types/messages";
import { BaseAgent } from "../agents/BaseAgent";
import { env } from "../config/env";

export class SwarmService {
  private swarm: Swarm;

  constructor() {
    this.swarm = new Swarm({ apiKey: env.OPENAI_API_KEY });
  }

  private createAgentFunctions(baseAgent: BaseAgent) {
    // Create token function
    const createToken = createAgentFunction({
      name: "createToken",
      func: async ({
        name,
        symbol,
        initialSupply,
      }: {
        name: string;
        symbol: string;
        initialSupply: number;
      }) => {
        console.log("Creating token", name, symbol, initialSupply);
        return await baseAgent.createToken(name, symbol, initialSupply);
      },
      descriptor: {
        name: "createToken",
        description: "Create a new ERC-20 token",
        parameters: {
          name: {
            type: "string",
            required: true,
            description: "The name of the token",
          },
          symbol: {
            type: "string",
            required: true,
            description: "The symbol of the token",
          },
          initialSupply: {
            type: "number",
            required: true,
            description: "The initial supply of tokens",
          },
        },
      },
    });

    // Transfer asset function
    const transferAsset = createAgentFunction({
      name: "transferAsset",
      func: async ({
        amount,
        assetId,
        destinationAddress,
      }: {
        amount: number;
        assetId: string;
        destinationAddress: string;
      }) => {
        console.log("Transferring asset", amount, assetId, destinationAddress);
        return await baseAgent.transferAsset(
          amount,
          assetId,
          destinationAddress
        );
      },
      descriptor: {
        name: "transferAsset",
        description: "Transfer assets to a specific address",
        parameters: {
          amount: {
            type: "number",
            required: true,
            description: "Amount to transfer",
          },
          assetId: {
            type: "string",
            required: true,
            description: 'Asset identifier ("eth", "usdc") or contract address',
          },
          destinationAddress: {
            type: "string",
            required: true,
            description: "Recipient's address",
          },
        },
      },
    });

    // Similar pattern for other functions...
    const requestFaucet = createAgentFunction({
      name: "requestFaucet",
      func: async () => {
        console.log("Requesting faucet");
        return await baseAgent.requestFaucet();
      },
      descriptor: {
        name: "requestFaucet",
        description: "Request ETH from the Base Sepolia testnet faucet",
        parameters: {},
      },
    });

    return [createToken, transferAsset, requestFaucet];
  }

  private createSwarmAgent(baseAgent: BaseAgent): Agent {
    return new Agent({
      name: baseAgent.getName(),
      instructions: baseAgent.getInstructions(),
      functions: this.createAgentFunctions(baseAgent),
      tool_choice: "auto",
      parallel_tool_calls: true,
    });
  }

  async run(
    baseAgent: BaseAgent,
    messages: Message[],
    stream: boolean = false
  ): Promise<AsyncGenerator<StreamChunk, void, unknown>> {
    const swarmAgent = await this.createSwarmAgent(baseAgent);

    // if (stream) {
    //   return this.handleStreamingResponse(swarmAgent, messages);
    // } else {
    return this.handleNormalResponse(swarmAgent, messages);
    // }
  }

  private async *handleStreamingResponse(
    swarmAgent: Agent,
    messages: Message[]
  ): AsyncGenerator<StreamChunk, void, unknown> {
    try {
      const response = await this.swarm.run({
        agent: swarmAgent,
        messages: messages,
        stream: true,
      });

      yield {
        sender: swarmAgent.name,
        content: "Processing request...",
      };

      // @ts-ignore
      for await (const chunk of response.chunks) {
        if (chunk.content) {
          yield {
            sender: swarmAgent.name,
            content: chunk.content,
          };
        }

        if (chunk.function_call) {
          yield {
            sender: swarmAgent.name,
            tool_calls: [
              {
                function: {
                  name: chunk.function_call.name,
                  arguments: JSON.stringify(chunk.function_call.arguments),
                },
              },
            ],
          };
        }
      }

      yield {
        content: "Task completed",
        delim: "end",
        // @ts-ignore
        response: { messages: response.messages },
      };
    } catch (error) {
      yield {
        content: `Error: ${
          error instanceof Error ? error.message : String(error)
        }`,
        delim: "end",
        response: { messages: [] },
      };
    }
  }

  private async *handleNormalResponse(
    swarmAgent: Agent,
    messages: Message[]
  ): AsyncGenerator<StreamChunk, void, unknown> {
    try {
      const response = await this.swarm.run({
        agent: swarmAgent,
        messages: messages,
      });

      yield {
        sender: swarmAgent.name,
        content: response.messages[response.messages.length - 1].content,
        response: { messages: response.messages },
      };
    } catch (error) {
      yield {
        content: `Error: ${
          error instanceof Error ? error.message : String(error)
        }`,
        response: { messages: [] },
      };
    }
  }
}
