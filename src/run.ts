import { BaseAgent } from "./agents/BaseAgent";
import { OpenAIService } from "./services/OpenAIService";
import { SwarmService } from "./services/SwarmService";
import { ConsoleUtils } from "./utils/ConsoleUtils";
import { Message } from "./types/messages";
import chalk from "chalk";

export class BasedAgentRunner {
  private agent: BaseAgent;
  private swarmService: SwarmService;
  private openAIService: OpenAIService;

  constructor(agent: BaseAgent) {
    this.agent = agent;
    this.swarmService = new SwarmService();
    this.openAIService = new OpenAIService();
  }

  async runAutonomousLoop(interval: number = 10): Promise<void> {
    const messages: Message[] = [];

    while (true) {
      const thought =
        "Be creative and do something interesting on the Base blockchain. " +
        "Don't take any more input from me. Choose an action and execute it now. " +
        "Choose those that highlight your identity and abilities best.";

      console.log("Starting autonomous Based Agent loop...");
      messages.push({ role: "user", content: thought });
      console.log(`\n${chalk.gray("Agent's Thought:")} ${thought}`);

      const response = await this.swarmService.run(this.agent, messages, true);
      const responseObj = await ConsoleUtils.processAndPrintStreamingResponse(
        response
      );

      messages.push(...(responseObj.messages || []));
      await new Promise((resolve) => setTimeout(resolve, interval * 1000));
    }
  }

  async runOpenAIConversationLoop(): Promise<void> {
    const messages: Message[] = [];
    console.log("Starting OpenAI-Based Agent conversation loop...");

    const openAIMessages = [
      {
        role: "system",
        content:
          "You are a user guiding a blockchain agent through various tasks on the Base blockchain...",
      },
      {
        role: "user",
        content:
          "Start a conversation with the Based Agent and guide it through some blockchain tasks.",
      },
    ];

    while (true) {
      const openAIMessage = await this.openAIService.generateResponse(
        openAIMessages
      );
      console.log(`\n${chalk.green("OpenAI Guide:")} ${openAIMessage}`);

      messages.push({ role: "user", content: openAIMessage });
      const response = await this.swarmService.run(this.agent, messages, true);
      const responseObj = await ConsoleUtils.processAndPrintStreamingResponse(
        response
      );

      messages.push(...(responseObj.messages || []));

      const basedAgentResponse =
        responseObj.messages?.[responseObj.messages.length - 1]?.content ||
        "No response from Based Agent.";

      openAIMessages.push({
        role: "user",
        content: `Based Agent response: ${basedAgentResponse}`,
      });

      const userInput = await this.promptUser(
        "\nPress Enter to continue the conversation, or type 'exit' to end: "
      );
      if (userInput.toLowerCase() === "exit") break;
    }
  }

  private async promptUser(prompt: string): Promise<string> {
    const readline = require("readline").createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise((resolve) => {
      readline.question(prompt, (answer: string) => {
        readline.close();
        resolve(answer);
      });
    });
  }

  async chooseMode(): Promise<string> {
    while (true) {
      console.log("\nAvailable modes:");
      console.log("1. chat    - Interactive chat mode");
      console.log("2. auto    - Autonomous action mode");
      console.log("3. two-agent - AI-to-agent conversation mode");

      const choice = (
        await this.promptUser("\nChoose a mode (enter number or name): ")
      )
        .toLowerCase()
        .trim();

      const modeMap: { [key: string]: string } = {
        "1": "chat",
        "2": "auto",
        "3": "two-agent",
        chat: "chat",
        auto: "auto",
        "two-agent": "two-agent",
      };

      if (choice in modeMap) {
        return modeMap[choice];
      }
      console.log("Invalid choice. Please try again.");
    }
  }

  async start(): Promise<void> {
    console.log("Starting Based Agent...");
    await this.agent.initialize();
    const mode = await this.chooseMode();
    console.log(`\nStarting ${mode} mode...`);

    const modeFunctions: { [key: string]: () => Promise<void> } = {
      chat: () => Promise.resolve(), // Implement run_demo_loop equivalent
      auto: () => this.runAutonomousLoop(),
      "two-agent": () => this.runOpenAIConversationLoop(),
    };

    await modeFunctions[mode]();
  }
}

// if (require.main === module) {
const agent = new BaseAgent({
  name: "Based Agent",
  instructions: "You are a helpful agent that can interact onchain...",
  functions: [], // Add your functions here
});

const runner = new BasedAgentRunner(agent);
runner.start().catch(console.error);
// }
