export interface AgentFunction {
  name: string;
  func: (...args: any[]) => Promise<string> | string;
  descriptor: {
    name: string;
    description: string;
    parameters: Record<
      string,
      {
        type: string;
        required: boolean;
        description: string;
      }
    >;
  };
}
