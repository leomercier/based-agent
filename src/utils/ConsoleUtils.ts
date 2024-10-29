import type { Message, StreamChunk, ResponseObject } from "../types/messages";
import chalk from "chalk";

export class ConsoleUtils {
  static processAndPrintStreamingResponse(
    response: AsyncGenerator<StreamChunk, void, unknown>
  ): Promise<ResponseObject> {
    return new Promise(async (resolve) => {
      let content = "";
      let lastSender = "";

      let responseObj: ResponseObject = { messages: [] };

      for await (const chunk of response) {
        if (chunk.sender) {
          lastSender = chunk.sender;
        }

        if (chunk.content !== null && chunk.content !== undefined) {
          if (!content && lastSender) {
            process.stdout.write(chalk.blue(`${lastSender}:`) + " ");
            lastSender = "";
          }
          process.stdout.write(chunk.content);
          content += chunk.content;
        }

        if (chunk.tool_calls) {
          for (const toolCall of chunk.tool_calls) {
            if (!toolCall.function.name) continue;
            console.log(
              chalk.blue(`${lastSender}: `) +
                chalk.magenta(`${toolCall.function.name}()`)
            );
          }
        }

        if (chunk.delim === "end" && content) {
          console.log(); // End of response message
          content = "";
        }

        if (chunk.response) {
          responseObj = chunk.response;
          resolve(responseObj);
        }
      }
    });
  }

  static prettyPrintMessages(messages: Message[]): void {
    for (const message of messages) {
      if (message.role !== "assistant") continue;

      // Print agent name in blue
      process.stdout.write(chalk.blue(`${message.sender}:`) + " ");

      // Print response, if any
      if (message.content) {
        console.log(message.content);
      }

      // Print tool calls in purple, if any
      const toolCalls = message.tool_calls || [];
      if (toolCalls.length > 1) {
        console.log();
      }

      for (const toolCall of toolCalls) {
        const { name, arguments: args } = toolCall.function;
        const argStr = JSON.stringify(JSON.parse(args)).replace(/:/g, "=");
        console.log(chalk.magenta(`${name}`) + `(${argStr.slice(1, -1)})`);
      }
    }
  }
}
