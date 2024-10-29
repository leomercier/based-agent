import { OpenAI } from "openai";
import { Message } from "../types/messages";

export class OpenAIService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateResponse(messages: Message[]): Promise<string> {
    try {
      const completion = await this.client.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages as any,
      });

      return completion.choices[0].message.content || "";
    } catch (error) {
      console.error("Error generating OpenAI response:", error);
      throw error;
    }
  }
}
