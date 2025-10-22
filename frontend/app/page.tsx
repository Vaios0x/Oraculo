"use client";

import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { SafeDate } from '../components/HydrationBoundary';
import { Layout, ContentArea, GridContainer } from '../components/Layout';
import ResponsiveLayout from '../components/ResponsiveLayout';
import { OracleDemo } from '../components/OracleDemo';
import { MarketTemplates, MarketTemplate } from '../components/MarketTemplates';
import { CreateMarketForm } from '../components/CreateMarketForm';
import { RealMarketCreator } from '../components/RealMarketCreator';
import { RealMarketList } from '../components/RealMarketList';
import { DemoMarketCreator } from '../components/DemoMarketCreator';
import { WalletButton } from '../components/WalletButton';
import { WalletStatus } from '../components/WalletStatus';
import { useDemoMarkets } from '../hooks/useDemoMarkets';
import { 
  Home, 
  Plus, 
  Wifi, 
  BarChart3, 
  Coins, 
  Shield, 
  TrendingUp,
  BookOpen,
  Code,
  Activity,
  CheckCircle,
  Clock,
  Users,
  DollarSign,
  BarChart,
  ExternalLink,
  Target,
  Zap
} from 'lucide-react';

// Mock data
const mockMarkets = [
  {
    id: '1',
    title: 'Bitcoin Price Prediction',
    description: 'Will Bitcoin reach $100,000 by the end of 2024?',
    outcomes: ['Yes', 'No'],
    totalStaked: 1250,
    endTime: new Date('2024-12-31').getTime(),
    isResolved: false,
    winningOutcome: null
  },
  {
    id: '2',
    title: 'Ethereum Merge Success',
    description: 'Will the Ethereum merge be completed successfully?',
    outcomes: ['Success', 'Failure'],
    totalStaked: 890,
    endTime: new Date('2024-11-15').getTime(),
    isResolved: true,
    winningOutcome: 'Success'
  },
  {
    id: '3',
    title: 'Solana TVL Growth',
    description: 'Will Solana TVL exceed $10B by Q1 2025?',
    outcomes: ['Yes', 'No'],
    totalStaked: 2100,
    endTime: new Date('2025-03-31').getTime(),
    isResolved: false,
    winningOutcome: null
  }
];

export default function OraculoApp() {
  const { publicKey, signTransaction } = useWallet();
  const { demoMarkets, resolveDemoMarket } = useDemoMarkets();
  const [activeTab, setActiveTab] = useState('markets');
  const [isClient, setIsClient] = useState(false);
  const [showOracleDemo, setShowOracleDemo] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<MarketTemplate | undefined>();
  const [showTemplates, setShowTemplates] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showRealCreator, setShowRealCreator] = useState(false);
  const [showRealMarkets, setShowRealMarkets] = useState(false);
  const [showDemoCreator, setShowDemoCreator] = useState(false);
  const [randomPercentages, setRandomPercentages] = useState<number[]>([]);

  // Combinar mercados mock y demo
  const allMarkets = React.useMemo(() => {
    const combinedMarkets = [...mockMarkets];
    
    // Agregar mercados demo
    demoMarkets.forEach(demoMarket => {
      combinedMarkets.push({
        id: demoMarket.id,
        title: demoMarket.title,
        description: demoMarket.question,
        outcomes: demoMarket.outcomes,
        totalStaked: demoMarket.totalStaked,
        endTime: demoMarket.endTime,
        isResolved: demoMarket.isResolved,
        winningOutcome: demoMarket.winningOutcome || null
      });
    });
    
    return combinedMarkets;
  }, [demoMarkets]);

  useEffect(() => {
    setIsClient(true);
    setRandomPercentages(allMarkets.map(() => Math.floor(Math.random() * 100)));
  }, [allMarkets]);

  const handleResolve = async (marketId: string, winningOutcome: string) => {
    console.log(`Resolving market ${marketId} with outcome: ${winningOutcome}`);
    
    // Si es un mercado demo, usar el hook de demo markets
    if (marketId.startsWith('demo-')) {
      resolveDemoMarket(marketId, winningOutcome);
    } else {
      // Para mercados mock, solo log
      console.log(`Mock market ${marketId} resolved with: ${winningOutcome}`);
    }
  };

  const handleTemplateSelect = (template: MarketTemplate) => {
    setSelectedTemplate(template);
    setShowTemplates(false);
    setShowCreateForm(true);
    setActiveTab('create');
  };

  const handleMarketCreate = async (marketData: any) => {
    console.log('Creating market with data:', marketData);
    // Aquí implementarías la lógica de creación del mercado
    // Usando el hook useOracle o el cliente Oracle
  };

  const navItems = [
    { id: 'markets', label: 'Markets', icon: <Home className="w-4 h-4" /> },
    { id: 'create', label: 'Create', icon: <Plus className="w-4 h-4" /> },
    { id: 'network', label: 'Network', icon: <Wifi className="w-4 h-4" /> },
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'tokens', label: 'Tokens', icon: <Coins className="w-4 h-4" /> },
    { id: 'migration', label: 'Migration', icon: <Shield className="w-4 h-4" /> },
    { id: 'cookbook', label: 'Cookbook', icon: <BookOpen className="w-4 h-4" /> }
  ];

  const sidebar = (
    <>
      {/* Logo Section */}
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center space-x-3">
          <TrendingUp className="h-8 w-8 text-neural-primary neural-text-glow" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 neural-text-glow">Oráculo</h1>
            <p className="text-sm text-gray-600">Prediction Markets on Solana</p>
          </div>
        </div>
      </div>

      {/* Wallet Connection */}
      <div className="p-4 border-b border-white/20">
        <WalletButton />
      </div>

      {/* Wallet Status Compact */}
      <div className="p-4 border-b border-white/20">
        <WalletStatus />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === item.id 
                  ? 'bg-neural-primary/20 text-neural-primary' 
                  : 'text-gray-600 hover:bg-white/10 hover:text-gray-900'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
          
          <button
            onClick={() => setShowTemplates(true)}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-gray-600 hover:bg-white/10 hover:text-gray-900"
          >
            <Target className="w-5 h-5" />
            <span className="font-medium">Plantillas</span>
          </button>
          
          <button
            onClick={() => setShowOracleDemo(!showOracleDemo)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              showOracleDemo 
                ? 'bg-neural-primary/20 text-neural-primary' 
                : 'text-gray-600 hover:bg-white/10 hover:text-gray-900'
            }`}
          >
            <Code className="w-5 h-5" />
            <span className="font-medium">Oracle Demo</span>
          </button>
          
          <button
            onClick={() => setShowRealCreator(!showRealCreator)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              showRealCreator 
                ? 'bg-neural-primary/20 text-neural-primary' 
                : 'text-gray-600 hover:bg-white/10 hover:text-gray-900'
            }`}
          >
            <Target className="w-5 h-5" />
            <span className="font-medium">Crear Mercado</span>
          </button>
          
          <button
            onClick={() => setShowRealMarkets(!showRealMarkets)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              showRealMarkets 
                ? 'bg-neural-primary/20 text-neural-primary' 
                : 'text-gray-600 hover:bg-white/10 hover:text-gray-900'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span className="font-medium">Mercados Reales</span>
          </button>
          
          <button
            onClick={() => setShowDemoCreator(!showDemoCreator)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              showDemoCreator 
                ? 'bg-neural-primary/20 text-neural-primary' 
                : 'text-gray-600 hover:bg-white/10 hover:text-gray-900'
            }`}
          >
            <Zap className="w-5 h-5" />
            <span className="font-medium">Demo Mercado</span>
          </button>
          
        </div>
      </nav>
    </>
  );

  const contentHeader = (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold text-gray-900 neural-text-glow">
        {activeTab === 'markets' && 'Prediction Markets'}
        {activeTab === 'create' && 'Create Market'}
        {activeTab === 'templates' && 'Market Templates'}
        {activeTab === 'network' && 'Network Status'}
        {activeTab === 'dashboard' && 'Dashboard'}
        {activeTab === 'tokens' && 'Token Management'}
        {activeTab === 'migration' && 'Migration Tools'}
        {activeTab === 'cookbook' && 'Developer Cookbook'}
      </h2>
      {activeTab === 'markets' && (
        <button className="neural-button" onClick={() => setActiveTab('create')}>
          Create Market
        </button>
      )}
    </div>
  );

  return (
    <Layout sidebar={sidebar}>
      <ContentArea header={contentHeader}>
        {/* Tab Content */}
        {activeTab === 'markets' && (
          <div className="space-y-6">
            <GridContainer>
              {allMarkets.map((market, index) => (
                <div 
                  key={market.id} 
                  className="neural-card neural-floating"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold text-gray-900 neural-text-glow">{market.title}</h3>
                        {market.id.startsWith('demo-') && (
                          <span className="px-2 py-1 text-xs font-semibold text-purple-700 bg-purple-100 rounded-full">
                            DEMO
                          </span>
                        )}
                      </div>
                      {market.isResolved ? (
                        <div className="flex items-center space-x-2">
                          <div className="neural-pulse-dot bg-green-500"></div>
                          <span className="text-sm text-green-600 font-medium">Resolved</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full animate-neural-pulse"></div>
                          <span className="text-sm text-orange-600 font-medium">Active</span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-gray-600 line-clamp-2">{market.description}</p>
                    
                    <div className="space-y-3">
                      {market.outcomes.map((outcome, outcomeIndex) => (
                        <div key={outcomeIndex} className="neural-glass p-2 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">{outcome}</span>
                            <span className="text-sm font-medium text-neural-primary">
                              {isClient ? (randomPercentages[outcomeIndex] || 0) : 0}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="neural-glass p-3 rounded-lg">
                        <span className="text-gray-500 block">Total Staked</span>
                        <span className="text-neural-primary font-semibold">
                          {market.totalStaked.toLocaleString()} SOL
                        </span>
                      </div>
                      <div className="neural-glass p-3 rounded-lg">
                        <span className="text-gray-500 block">Ends</span>
                        <SafeDate 
                          date={market.endTime}
                          format="date"
                          className="text-gray-900 font-semibold"
                          fallback="Loading..."
                        />
                      </div>
                    </div>
                    
                    {market.isResolved ? (
                      <div className="neural-connection p-3 rounded-lg">
                        <span className="text-sm text-green-700">
                          Resolved: {market.winningOutcome}
                        </span>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <button className="neural-button flex-1 text-sm">
                          Stake
                        </button>
                        {publicKey && (
                          <button 
                            onClick={() => handleResolve(market.id, 'Yes')}
                            className="neural-glass px-3 py-2 text-sm font-medium hover:bg-white/20 transition-colors"
                          >
                            Resolve
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </GridContainer>
          </div>
        )}

        {activeTab === 'create' && (
          <div className="space-y-6">
            <DemoMarketCreator />
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="space-y-6">
            <MarketTemplates onSelectTemplate={handleTemplateSelect} />
          </div>
        )}

        {activeTab === 'network' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="neural-card neural-floating">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 neural-text-glow">Current Slot</h3>
                  <p className="text-4xl font-bold text-neural-primary neural-text-glow">2,847,392</p>
                  <p className="text-sm text-gray-500 mt-2">Last updated: 2 seconds ago</p>
                </div>
              </div>
              
              <div className="neural-card neural-floating" style={{ animationDelay: '0.1s' }}>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 neural-text-glow">TPS</h3>
                  <p className="text-4xl font-bold text-green-600 neural-text-glow">3,247</p>
                  <p className="text-sm text-gray-500 mt-2">Transactions per second</p>
                </div>
              </div>
              
              <div className="neural-card neural-floating" style={{ animationDelay: '0.2s' }}>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 neural-text-glow">Block Height</h3>
                  <p className="text-4xl font-bold text-blue-600 neural-text-glow">284,739,201</p>
                  <p className="text-sm text-gray-500 mt-2">Latest block</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="neural-card neural-floating">
                <h3 className="text-lg font-semibold text-gray-900 neural-text-glow mb-4">Portfolio Overview</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Staked</span>
                    <span className="text-neural-primary font-semibold">1,250 SOL</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Active Markets</span>
                    <span className="text-green-600 font-semibold">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Returns</span>
                    <span className="text-blue-600 font-semibold">+15.3%</span>
                  </div>
                </div>
              </div>
              
              <div className="neural-card neural-floating" style={{ animationDelay: '0.1s' }}>
                <h3 className="text-lg font-semibold text-gray-900 neural-text-glow mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Staked 50 SOL on Bitcoin prediction</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Market resolved: Ethereum Merge</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Created new market: Solana TVL</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tokens' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="neural-card neural-floating">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="neural-glass p-2 rounded-lg">
                    <Coins className="h-6 w-6 text-neural-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 neural-text-glow">SOL Balance</h3>
                </div>
                <p className="text-3xl font-bold text-neural-primary neural-text-glow">1,250.50</p>
                <p className="text-sm text-gray-500 mt-2">Available for staking</p>
              </div>
              
              <div className="neural-card neural-floating" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="neural-glass p-2 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-green-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 neural-text-glow">Staked Amount</h3>
                </div>
                <p className="text-3xl font-bold text-green-600 neural-text-glow">890.25</p>
                <p className="text-sm text-gray-500 mt-2">Currently staked</p>
              </div>
              
              <div className="neural-card neural-floating" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="neural-glass p-2 rounded-lg">
                    <DollarSign className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 neural-text-glow">Total Value</h3>
                </div>
                <p className="text-3xl font-bold text-blue-600 neural-text-glow">$2,140.75</p>
                <p className="text-sm text-gray-500 mt-2">USD equivalent</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'migration' && (
          <div className="space-y-6">
            <div className="neural-card neural-floating">
              <h3 className="text-xl font-semibold text-gray-900 neural-text-glow mb-6">Migration Tools</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="neural-glass p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Token Migration</h4>
                  <p className="text-sm text-gray-600 mb-4">Migrate tokens to new program versions</p>
                  <button className="neural-button text-sm">Start Migration</button>
                </div>
                <div className="neural-glass p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Account Migration</h4>
                  <p className="text-sm text-gray-600 mb-4">Migrate account data to new formats</p>
                  <button className="neural-button text-sm">Start Migration</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cookbook' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="neural-card neural-floating">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="neural-glass p-2 rounded-lg">
                    <Code className="h-6 w-6 text-neural-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 neural-text-glow">Smart Contracts</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Deploy and manage prediction market smart contracts.
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Deploy market contracts</li>
                  <li>• Configure parameters</li>
                  <li>• Set resolution conditions</li>
                  <li>• Handle disputes</li>
                </ul>
              </div>
              
              <div className="neural-card neural-floating" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="neural-glass p-2 rounded-lg">
                    <Activity className="h-6 w-6 text-neural-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 neural-text-glow">Transaction Operations</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Advanced transaction handling with optimization and monitoring.
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Send SOL and tokens</li>
                  <li>• Calculate transaction costs</li>
                  <li>• Add memos and priority fees</li>
                  <li>• Optimize compute units</li>
                </ul>
              </div>
              
              <div className="neural-card neural-floating" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="neural-glass p-2 rounded-lg">
                    <Activity className="h-6 w-6 text-neural-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 neural-text-glow">Account Management</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Comprehensive account operations and data management.
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Create accounts</li>
                  <li>• Calculate creation costs</li>
                  <li>• PDA operations</li>
                  <li>• Account validation</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Templates Modal */}
        {showTemplates && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="neural-card neural-floating max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 neural-text-glow">
                  🔮 Plantillas de Mercados
                </h2>
                <button
                  onClick={() => setShowTemplates(false)}
                  className="neural-glass p-2 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <span className="text-xl">×</span>
                </button>
              </div>
              <MarketTemplates onSelectTemplate={handleTemplateSelect} />
            </div>
          </div>
        )}

        {/* Oracle Demo Section */}
        {showOracleDemo && (
          <div className="mt-8">
            <OracleDemo />
          </div>
        )}

        {/* Real Market Creator Section */}
        {showRealCreator && (
          <div className="mt-8">
            <RealMarketCreator
              selectedTemplate={selectedTemplate}
              onTemplateSelect={setSelectedTemplate}
              onMarketCreate={handleMarketCreate}
            />
          </div>
        )}

        {/* Real Markets List Section */}
        {showRealMarkets && (
          <div className="mt-8">
            <RealMarketList />
          </div>
        )}

        {/* Demo Market Creator Section */}
        {showDemoCreator && (
          <div className="mt-8">
            <DemoMarketCreator />
          </div>
        )}


      </ContentArea>
    </Layout>
  );
}