# 🔮 Oráculo Frontend - Solana Cookbook Integration

A modern Next.js frontend for the Oráculo prediction markets platform, built with comprehensive Solana Cookbook integration for optimal performance and security.

## ✨ Features

### 🔗 **Wallet Integration**
- Connect with Phantom, Solflare, and other Solana wallets
- Advanced keypair management with multiple restoration methods
- Secure message signing and verification
- Mnemonic support (BIP39 and BIP44)

### 📊 **Prediction Markets**
- Create and participate in prediction markets
- Real-time market monitoring and updates
- Advanced market resolution with oracle integration
- Comprehensive market analytics

### 💰 **Token Operations**
- Advanced SPL token management
- Token extensions support
- Optimized token transfers with validation
- Token account monitoring and analytics

### 🚀 **Transaction Optimization**
- Compute unit optimization with automatic estimation
- Priority fee calculation and management
- Transaction batching for efficiency
- Advanced error handling and retry logic

### 🛡️ **Security & Best Practices**
- Comprehensive security validations
- Performance monitoring and analytics
- Industry best practices implementation
- Advanced error handling and logging

### 📱 **Progressive Web App (PWA)**
- Mobile-first responsive design
- Offline functionality
- Push notifications
- App-like experience

## 🚀 Tech Stack

- **Next.js 14** - React framework with App Router
- **Solana Kit** - Modern Solana development toolkit
- **@solana/web3.js** - Solana JavaScript SDK
- **@solana/spl-token** - SPL Token program integration
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type safety and developer experience
- **Lucide React** - Beautiful icon library

## 📦 Solana Cookbook Integration

This frontend implements comprehensive Solana Cookbook best practices:

### 🔑 **Wallet Management**
- Create and restore keypairs from multiple sources
- Advanced keypair validation and verification
- Secure message signing and verification
- Mnemonic phrase support with HD key derivation

### 💸 **Transaction Operations**
- Optimized SOL and token transfers
- Advanced transaction cost calculation
- Priority fee management
- Compute unit optimization
- Transaction batching and retry logic

### 🏦 **Account Management**
- PDA (Program Derived Address) operations
- Account creation with rent exemption
- Advanced account validation
- Account monitoring and analytics

### 🪙 **Token Operations**
- SPL token mint and account management
- Token extensions support
- Advanced token transfers with validation
- Token account filtering and analytics

### 📊 **Monitoring & Analytics**
- Real-time network health monitoring
- Transaction performance tracking
- Advanced event subscriptions
- Comprehensive error handling

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Solana wallet (Phantom, Solflare, etc.)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Configuration

The app is configured to connect to Solana Devnet by default. To change networks, update the `network` state in `components/solana-provider.tsx`.

## 📁 Project Structure

```
frontend/
├── app/                           # Next.js app directory
│   ├── layout.tsx                # Root layout with Solana provider
│   ├── page.tsx                  # Main page component
│   ├── solana-cookbook/          # Solana Cookbook demo page
│   │   └── page.tsx              # Cookbook demo implementation
│   └── globals.css               # Global styles
├── components/                    # React components
│   ├── solana-provider.tsx       # Solana wallet context
│   ├── solana-cookbook-provider.tsx  # Cookbook integration provider
│   ├── solana-cookbook-demo.tsx  # Cookbook demo component
│   ├── wallet-connect-button.tsx # Wallet connection UI
│   ├── market-card.tsx          # Market display component
│   └── create-market-form.tsx   # Market creation form
├── lib/                          # Utility libraries
│   ├── solana-cookbook-integration.ts    # Main Cookbook integration
│   ├── advanced-solana-operations.ts    # Advanced operations
│   ├── solana-cookbook-best-practices.ts # Best practices
│   ├── rpc-client.ts             # RPC client with modern methods
│   └── websocket-client.ts       # WebSocket client for real-time updates
└── public/                       # Static assets
```

## 🔧 Solana Cookbook Features

### **Wallet Management**
```typescript
// Create new keypair
const keypair = await client.createKeypair();

// Restore from bytes
const restored = await client.restoreKeypairFromBytes(keypairBytes);

// Restore from Base58
const base58Keypair = await client.restoreKeypairFromBase58(base58String);

// Sign and verify message
const { signature, verified } = await client.signAndVerifyMessage(keypairBytes, message);
```

### **Transaction Operations**
```typescript
// Send SOL with optimization
const signature = await client.sendSOL(recipient, amount);

// Send tokens with validation
const tokenSignature = await client.sendTokens(recipient, mint, amount, decimals);

// Add memo to transaction
const memoSignature = await client.addMemo("Hello Oraculo!");

// Add priority fees
const prioritySignature = await client.addPriorityFees(5000);
```

### **Account Management**
```typescript
// Create account with rent exemption
const accountSignature = await client.createAccount(payer, newAccount, space);

// Calculate account creation cost
const cost = await client.calculateAccountCreationCost(space);

// Get account balance
const balance = await client.getAccountBalance(pubkey);
```

### **Token Operations**
```typescript
// Get token mint information
const tokenInfo = await client.getTokenMint(mintAddress);

// Get token account balance
const balance = await client.getTokenAccountBalance(tokenAccount);

// Get all token accounts by owner
const accounts = await client.getTokenAccountsByOwner(owner, programId);
```

### **Advanced Operations**
```typescript
// Create optimized transaction
const transaction = await advancedOps.createOptimizedTransaction(
  instructions,
  payer,
  { computeUnitLimit: 10000, priorityFee: 1000 }
);

// Send with advanced configuration
const result = await advancedOps.sendAdvancedTransaction(
  transaction,
  signers,
  { skipPreflight: false, maxRetries: 3 }
);

// Monitor transactions with filters
const subscriptionId = await advancedOps.monitorTransactionsAdvanced(
  { addresses: [marketAddress], programs: [programId] },
  (transaction) => console.log('New transaction:', transaction)
);
```

## 🎯 Best Practices Implementation

### **Security**
- Comprehensive transaction validation
- Program whitelist/blacklist support
- Compute unit and fee limits
- Account validation and verification

### **Performance**
- Automatic compute unit estimation
- Optimal priority fee calculation
- Transaction batching and optimization
- Connection pooling and load balancing

### **Monitoring**
- Real-time network health monitoring
- Transaction performance tracking
- Error rate monitoring and alerting
- Comprehensive logging and analytics

## 🔗 Integration with Rust Program

This frontend is designed to work seamlessly with the `oraculo_token_integration` Rust program. The key integration points are:

1. **Create Market**: Calls `CreateTokenMarket` instruction
2. **Stake Tokens**: Calls `StakeTokens` instruction  
3. **Distribute Winnings**: Calls `DistributeWinnings` instruction
4. **Market Resolution**: Integrates with oracle data for automatic resolution

## 📱 PWA Features

- **Offline Support**: Core functionality works offline
- **Push Notifications**: Real-time market updates
- **App-like Experience**: Native app feel on mobile devices
- **Installation**: Can be installed on home screen

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Docker
```bash
docker build -t oraculo-frontend .
docker run -p 3000:3000 oraculo-frontend
```

## 🧪 Testing

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Run development server
npm run dev
```

## 📚 Documentation

- [Solana Cookbook](https://solanacookbook.com/) - Comprehensive Solana development guide
- [Solana Kit Documentation](https://kit.solana.com/) - Modern Solana development toolkit
- [Next.js Documentation](https://nextjs.org/docs) - Next.js framework guide
- [Tailwind CSS](https://tailwindcss.com/docs) - Utility-first CSS framework

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Live Demo](https://oraculo.vercel.app)
- [Documentation](https://docs.oraculo.dev)
- [Discord](https://discord.gg/oraculo)
- [Twitter](https://twitter.com/oraculo_dev)

---

**Built with ❤️ by the Oráculo Team**