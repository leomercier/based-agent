# 🔵 Based Agent (TypeScript Edition)

A TypeScript implementation of the autonomous blockchain interaction agent, built on the Coinbase Developer Platform (CDP) and OpenAI's Swarm.

## 🚀 Features

- **Fully Typed**: Complete TypeScript implementation with proper type definitions
- **Modern Architecture**: Clean service-based architecture with dependency injection
- **Enhanced Error Handling**: Robust error handling and type safety
- **Autonomous Execution**: Self-directing blockchain interactions
- **Multiple Operation Modes**: Chat, autonomous, and two-agent conversation modes

## 🛠 Core Capabilities

- Token Management
  - Create ERC-20 tokens
  - Transfer assets
  - Check balances
- NFT Operations

  - Deploy NFT contracts
  - Mint NFTs
  - Manage collections

- Asset Operations

  - Swap assets (mainnet only)
  - Request testnet ETH
  - Monitor balances

- AI Integration
  - DALL-E art generation
  - Autonomous decision making
  - Multi-agent conversations

## 🏗 Project Structure

```
src/
├── agents/           # Agent implementations
├── config/           # Configuration files
├── services/         # Core services
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
└── index.ts         # Main entry point
```

## 📋 Prerequisites

- Node.js (18+)
- Yarn package manager
- Coinbase Developer Platform API key
- OpenAI API key

## 🔧 Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/based-agent-ts.git
cd based-agent-ts
```

2. Install dependencies:

```bash
yarn install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Edit `.env` and add your API keys:

```
CDP_API_KEY_NAME=your_cdp_key_name
CDP_PRIVATE_KEY=your_cdp_private_key
OPENAI_API_KEY=your_openai_key
```

4. Build the project:

```bash
yarn build
```

## 🎮 Usage

Start the agent:

```bash
yarn start
```

Choose your preferred mode:

1. Chat mode: Direct interaction with the agent
2. Autonomous mode: Agent operates independently
3. Two-agent mode: OpenAI agent guides the Based Agent

## 📝 Development

- Build the project:

```bash
yarn build
```

- Run in development mode with hot reload:

```bash
yarn dev
```

- Run tests:

```bash
yarn test
```

## 🧪 Testing

The project includes a comprehensive test suite using Jest:

```bash
# Run all tests
yarn test

# Run tests with coverage
yarn test:coverage

# Run tests in watch mode
yarn test:watch
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## ⚠️ Disclaimer

This project is for educational purposes only. Exercise caution with blockchain interactions and never use real assets in testing environments.

## 🔑 Environment Variables

Required environment variables:

- `CDP_API_KEY_NAME`: Your Coinbase Developer Platform API key name
- `CDP_PRIVATE_KEY`: Your CDP private key
- `OPENAI_API_KEY`: Your OpenAI API key
- `BASE_RPC_URL`: (Optional) Custom RPC URL for Base network

## 📚 Resources

- [Coinbase Developer Platform Documentation](https://docs.cdp.coinbase.com)
- [OpenAI Documentation](https://platform.openai.com/docs)
- [Base Network Documentation](https://docs.base.org)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
