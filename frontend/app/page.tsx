"use client";

import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { SafeDate } from '../components/HydrationBoundary';
import { Layout, ContentArea, GridContainer } from '../components/Layout';
import ResponsiveLayout from '../components/ResponsiveLayout';
import { MarketTemplates, MarketTemplate } from '../components/MarketTemplates';
import { CreateMarketForm } from '../components/CreateMarketForm';
import { RealMarketCreator } from '../components/RealMarketCreator';
import { RealMarketList } from '../components/RealMarketList';
import { DemoMarketCreator } from '../components/DemoMarketCreator';
import { WalletButton } from '../components/WalletButton';
import { MatrixBackground, MatrixGrid, MatrixScan } from '../components/MatrixBackground';
import { CypherpunkManifesto } from '../components/CypherpunkManifesto';
import { CypherpunkStats } from '../components/CypherpunkStats';
import { CypherpunkRoadmap } from '../components/CypherpunkRoadmap';
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
  const [selectedTemplate, setSelectedTemplate] = useState<MarketTemplate | undefined>();
  const [showTemplates, setShowTemplates] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showDemoCreator, setShowDemoCreator] = useState(false);
  const [randomPercentages, setRandomPercentages] = useState<number[]>([]);
  const [showShipyardAward, setShowShipyardAward] = useState(false);

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
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  const sidebar = (
    <div className="matrix-bg relative">
      {/* Matrix Background Effects */}
      <div className="absolute inset-0 overflow-hidden matrix-background-container pointer-events-none">
        <MatrixBackground intensity="low" speed={0.6} />
        <MatrixGrid />
        <MatrixScan />
      </div>
      
      {/* Logo Section */}
      <div className="p-6 border-b border-white/20 relative z-10">
        <div className="flex items-center space-x-3">
          <TrendingUp className="h-8 w-8 text-neural-primary neural-text-glow" />
          <div>
            <h1 className="text-2xl font-bold matrix-text-green neural-text-glow">Oráculo</h1>
            <p className="text-sm matrix-text-white text-opacity-80">Prediction Markets on Solana</p>
          </div>
        </div>
      </div>

      {/* Wallet Connection */}
      <div className="p-4 border-b border-white/20">
        <WalletButton />
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
                  ? 'bg-black text-green-400 matrix-glow' 
                  : 'matrix-text-white hover:bg-green-500/10 hover:text-green-400'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
          
          <button
            onClick={() => setActiveTab('shipyard')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeTab === 'shipyard'
                ? 'bg-black text-green-400 matrix-glow' 
                : 'matrix-text-white hover:bg-green-500/10 hover:text-green-400'
            }`}
          >
            <Zap className="w-5 h-5" />
            <span className="font-medium">🚀 Shipyard MX</span>
          </button>
          
          <button
            onClick={() => setShowDemoCreator(!showDemoCreator)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              showDemoCreator 
                ? 'bg-black text-green-400 matrix-glow' 
                : 'matrix-text-white hover:bg-green-500/10 hover:text-green-400'
            }`}
          >
            <Zap className="w-5 h-5" />
            <span className="font-medium">Demo Mercado</span>
          </button>
          
        </div>
      </nav>
    </div>
  );

  const contentHeader = (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold matrix-text-green neural-text-glow">
        {activeTab === 'markets' && 'Prediction Markets'}
        {activeTab === 'create' && 'Create Market'}
        {activeTab === 'templates' && 'Market Templates'}
        {activeTab === 'network' && 'Network Status'}
        {activeTab === 'dashboard' && 'Dashboard'}
        {activeTab === 'tokens' && 'Token Management'}
        {activeTab === 'analytics' && 'Market Analytics'}
      </h2>
      {activeTab === 'markets' && (
        <button className="matrix-button-enhanced" onClick={() => setActiveTab('create')}>
          Create Market
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen">
    <Layout sidebar={sidebar}>
      <ContentArea header={contentHeader}>
        {/* Tab Content */}
        {activeTab === 'markets' && (
          <div className="space-y-6">
            <GridContainer>
              {allMarkets.map((market, index) => (
                <div 
                  key={market.id} 
                  className="matrix-card-enhanced neural-floating"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold matrix-text-green neural-text-glow">{market.title}</h3>
                        {market.id.startsWith('demo-') && (
                          <span className="px-2 py-1 text-xs font-semibold matrix-text-white bg-black/50 rounded-full matrix-glow">
                            DEMO
                          </span>
                        )}
                      </div>
                      {market.isResolved ? (
                        <div className="flex items-center space-x-2">
                          <div className="neural-pulse-dot bg-green-400 matrix-glow"></div>
                          <span className="text-sm matrix-text-green font-medium">Resolved</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-neural-pulse matrix-glow"></div>
                          <span className="text-sm matrix-text-green font-medium">Active</span>
                        </div>
                      )}
                    </div>
                    
                    <p className="matrix-text-white text-opacity-90 line-clamp-2">{market.description}</p>
                    
                    <div className="space-y-3">
                      {market.outcomes.map((outcome, outcomeIndex) => (
                        <div key={outcomeIndex} className="bg-black/50 p-2 rounded-lg matrix-glow">
                          <div className="flex justify-between items-center">
                            <span className="text-sm matrix-text-white">{outcome}</span>
                            <span className="text-sm font-medium matrix-text-green">
                              {isClient ? (randomPercentages[outcomeIndex] || 0) : 0}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-black/50 p-3 rounded-lg matrix-glow">
                        <span className="matrix-text-white text-opacity-80 block">Total Staked</span>
                        <span className="matrix-text-green font-semibold">
                          {market.totalStaked.toLocaleString()} SOL
                        </span>
                      </div>
                      <div className="bg-black/50 p-3 rounded-lg matrix-glow">
                        <span className="matrix-text-white text-opacity-80 block">Ends</span>
                        <SafeDate 
                          date={market.endTime}
                          format="date"
                          className="matrix-text-white font-semibold"
                          fallback="Loading..."
                        />
                      </div>
                    </div>
                    
                    {market.isResolved ? (
                      <div className="bg-black/50 p-3 rounded-lg matrix-glow">
                        <span className="text-sm matrix-text-green">
                          Resolved: {market.winningOutcome}
                        </span>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <button className="matrix-button-enhanced flex-1 text-sm">
                          Stake
                        </button>
                        {publicKey && (
                          <button 
                            onClick={() => handleResolve(market.id, 'Yes')}
                            className="matrix-button-enhanced px-3 py-2 text-sm font-medium hover:bg-black transition-colors"
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

        {activeTab === 'shipyard' && (
          <div className="space-y-8">
            {/* Shipyard MX Award Header */}
            <div className="matrix-card-enhanced p-8 text-center space-y-6">
              <div className="flex items-center justify-center space-x-4">
                <Zap className="w-16 h-16 text-green-400 matrix-glow" />
                <div>
                  <h1 className="text-4xl font-bold matrix-text-green">
                    🚀 Shipyard MX Award
                  </h1>
                  <p className="text-xl matrix-text-white">
                    Top Mexican Projects with Cypherpunk Values
                        </p>
                      </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="matrix-card-enhanced p-4">
                  <div className="text-3xl font-bold matrix-text-green">1,500</div>
                  <div className="text-sm matrix-text-white">USDC Total Prizes</div>
                        </div>
                <div className="matrix-card-enhanced p-4">
                  <div className="text-3xl font-bold matrix-text-green">🇲🇽</div>
                  <div className="text-sm matrix-text-white">Mexican Innovation</div>
                      </div>
                <div className="matrix-card-enhanced p-4">
                  <div className="text-3xl font-bold matrix-text-green">🔐</div>
                  <div className="text-sm matrix-text-white">Cypherpunk Values</div>
                  </div>
                </div>
              </div>

            {/* Cypherpunk Manifesto */}
            <CypherpunkManifesto />

            {/* Cypherpunk Stats */}
            <CypherpunkStats />

            {/* Cypherpunk Roadmap */}
            <CypherpunkRoadmap />
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="space-y-6">
            <MarketTemplates onSelectTemplate={handleTemplateSelect} />
          </div>
        )}

        {activeTab === 'network' && (
          <div className="space-y-8">
            {/* Network Status Header */}
            <div className="matrix-card-enhanced p-6 text-center">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse matrix-glow"></div>
                <h2 className="text-2xl font-bold matrix-text-green">Solana Network Status</h2>
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse matrix-glow"></div>
                </div>
              <p className="matrix-text-white text-opacity-80">Real-time blockchain metrics and network health</p>
              </div>
              
            {/* Main Network Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Current Slot */}
              <div className="matrix-card-enhanced neural-floating">
                <div className="text-center p-6">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center mr-3 matrix-glow">
                      <span className="text-green-400 text-lg">#</span>
                    </div>
                    <h3 className="text-lg font-semibold matrix-text-white">Current Slot</h3>
                  </div>
                  <p className="text-3xl font-bold matrix-text-green neural-text-glow">2,847,392</p>
                  <p className="text-sm matrix-text-white text-opacity-70 mt-2">Last updated: 2 seconds ago</p>
                  <div className="mt-3 flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs matrix-text-green">Live</span>
                  </div>
                </div>
              </div>
              
              {/* TPS */}
              <div className="matrix-card-enhanced neural-floating" style={{ animationDelay: '0.1s' }}>
                <div className="text-center p-6">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center mr-3 matrix-glow">
                      <span className="text-green-400 text-lg">⚡</span>
                </div>
                    <h3 className="text-lg font-semibold matrix-text-white">TPS</h3>
              </div>
                  <p className="text-3xl font-bold matrix-text-green neural-text-glow">3,247</p>
                  <p className="text-sm matrix-text-white text-opacity-70 mt-2">Transactions per second</p>
                  <div className="mt-3">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-green-400 h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
                    <span className="text-xs matrix-text-green mt-1 block">85% capacity</span>
          </div>
                </div>
              </div>
              
              {/* Block Height */}
              <div className="matrix-card-enhanced neural-floating" style={{ animationDelay: '0.2s' }}>
                <div className="text-center p-6">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center mr-3 matrix-glow">
                      <span className="text-green-400 text-lg">🔗</span>
                    </div>
                    <h3 className="text-lg font-semibold matrix-text-white">Block Height</h3>
                  </div>
                  <p className="text-3xl font-bold matrix-text-green neural-text-glow">284,739,201</p>
                  <p className="text-sm matrix-text-white text-opacity-70 mt-2">Latest block</p>
                  <div className="mt-3 flex items-center justify-center space-x-2">
                    <span className="text-xs matrix-text-white">Block time: ~400ms</span>
                  </div>
                </div>
              </div>

              {/* Network Health */}
              <div className="matrix-card-enhanced neural-floating" style={{ animationDelay: '0.3s' }}>
                <div className="text-center p-6">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center mr-3 matrix-glow">
                      <span className="text-green-400 text-lg">💚</span>
                    </div>
                    <h3 className="text-lg font-semibold matrix-text-white">Health</h3>
                  </div>
                  <p className="text-3xl font-bold matrix-text-green neural-text-glow">98.7%</p>
                  <p className="text-sm matrix-text-white text-opacity-70 mt-2">Network uptime</p>
                  <div className="mt-3">
                    <div className="flex items-center justify-center space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                    </div>
                    <span className="text-xs matrix-text-green mt-1 block">Excellent</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Network Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Validator Information */}
              <div className="matrix-card-enhanced">
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center matrix-glow matrix-glow">
                      <span className="text-green-400 text-xl">🛡️</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold matrix-text-green">Validator Network</h3>
                      <p className="matrix-text-white text-opacity-80">Active validators and consensus</p>
                    </div>
                  </div>
                  
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                      <span className="matrix-text-white">Active Validators</span>
                      <span className="matrix-text-green font-semibold">1,847</span>
                  </div>
                  <div className="flex justify-between items-center">
                      <span className="matrix-text-white">Stake Weight</span>
                      <span className="matrix-text-green font-semibold">98.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                      <span className="matrix-text-white">Epoch Progress</span>
                      <span className="matrix-text-green font-semibold">67.3%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="matrix-text-white">Next Epoch</span>
                      <span className="matrix-text-white">~2.3 days</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Network Performance */}
              <div className="matrix-card-enhanced">
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center matrix-glow matrix-glow">
                      <span className="text-green-400 text-xl">📊</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold matrix-text-green">Performance Metrics</h3>
                      <p className="matrix-text-white text-opacity-80">Network throughput and latency</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="matrix-text-white">Avg Block Time</span>
                      <span className="matrix-text-green font-semibold">400ms</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="matrix-text-white">Finality Time</span>
                      <span className="matrix-text-green font-semibold">1.2s</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="matrix-text-white">Vote Latency</span>
                      <span className="matrix-text-green font-semibold">150ms</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="matrix-text-white">Cluster Time</span>
                      <span className="matrix-text-white">±50ms</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Network Actions */}
            <div className="matrix-card-enhanced">
              <div className="p-6">
                <h3 className="text-xl font-bold matrix-text-green mb-6 text-center">Network Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="matrix-button-enhanced p-4 text-center">
                    <div className="text-2xl mb-2">🔄</div>
                    <div className="font-semibold matrix-text-white">Refresh Data</div>
                    <div className="text-sm matrix-text-white text-opacity-70">Update metrics</div>
                  </button>
                  
                  <button className="matrix-button-enhanced p-4 text-center">
                    <div className="text-2xl mb-2">📈</div>
                    <div className="font-semibold matrix-text-white">View Charts</div>
                    <div className="text-sm matrix-text-white text-opacity-70">Performance graphs</div>
                  </button>
                  
                  <button className="matrix-button-enhanced p-4 text-center">
                    <div className="text-2xl mb-2">⚙️</div>
                    <div className="font-semibold matrix-text-white">Settings</div>
                    <div className="text-sm matrix-text-white text-opacity-70">Configure alerts</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Dashboard Header */}
            <div className="matrix-card-enhanced p-6 text-center">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse matrix-glow"></div>
                <h2 className="text-3xl font-bold matrix-text-green">Trading Dashboard</h2>
                <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse matrix-glow"></div>
              </div>
              <p className="matrix-text-white text-opacity-80">Real-time portfolio analytics and market insights</p>
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Portfolio Overview */}
              <div className="matrix-card-enhanced neural-floating">
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center matrix-glow matrix-glow">
                      <span className="text-green-400 text-xl">💰</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold matrix-text-green">Portfolio Overview</h3>
                      <p className="matrix-text-white text-opacity-80">Your trading performance</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-black/50 rounded-lg">
                      <span className="matrix-text-white">Total Staked</span>
                      <span className="matrix-text-green font-bold text-lg">1,250 SOL</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-black/50 rounded-lg">
                      <span className="matrix-text-white">Active Markets</span>
                      <span className="matrix-text-green font-bold text-lg">12</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-black/50 rounded-lg">
                      <span className="matrix-text-white">Total Returns</span>
                      <span className="matrix-text-green font-bold text-lg">+15.3%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-black/50 rounded-lg">
                      <span className="matrix-text-white">Win Rate</span>
                      <span className="matrix-text-green font-bold text-lg">78.5%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Market Performance */}
              <div className="matrix-card-enhanced neural-floating" style={{ animationDelay: '0.1s' }}>
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center matrix-glow matrix-glow">
                      <span className="text-green-400 text-xl">📈</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold matrix-text-green">Market Performance</h3>
                      <p className="matrix-text-white text-opacity-80">Trading analytics</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-3 bg-black/50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="matrix-text-white text-sm">Bitcoin Prediction</span>
                        <span className="matrix-text-green text-sm">+23.4%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-green-400 h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-black/50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="matrix-text-white text-sm">Ethereum Merge</span>
                        <span className="matrix-text-green text-sm">+18.7%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-green-400 h-2 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-black/50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="matrix-text-white text-sm">Solana TVL</span>
                        <span className="matrix-text-red text-sm">-5.2%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-red-400 h-2 rounded-full" style={{ width: '20%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="matrix-card-enhanced neural-floating" style={{ animationDelay: '0.2s' }}>
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center matrix-glow matrix-glow">
                      <span className="text-green-400 text-xl">⚡</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold matrix-text-green">Quick Actions</h3>
                      <p className="matrix-text-white text-opacity-80">Fast trading tools</p>
                    </div>
                  </div>
                  
                <div className="space-y-3">
                    <button className="matrix-button-enhanced w-full p-3 text-left">
                  <div className="flex items-center space-x-3">
                        <span className="text-xl">🎯</span>
                        <div>
                          <div className="font-semibold matrix-text-white">Create Market</div>
                          <div className="text-sm matrix-text-white text-opacity-70">Start new prediction</div>
                  </div>
                      </div>
                    </button>
                    
                    <button className="matrix-button-enhanced w-full p-3 text-left">
                  <div className="flex items-center space-x-3">
                        <span className="text-xl">📊</span>
                        <div>
                          <div className="font-semibold matrix-text-white">View Analytics</div>
                          <div className="text-sm matrix-text-white text-opacity-70">Detailed insights</div>
                  </div>
                      </div>
                    </button>
                    
                    <button className="matrix-button-enhanced w-full p-3 text-left">
                  <div className="flex items-center space-x-3">
                        <span className="text-xl">🔔</span>
                        <div>
                          <div className="font-semibold matrix-text-white">Set Alerts</div>
                          <div className="text-sm matrix-text-white text-opacity-70">Price notifications</div>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity & Market Trends */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <div className="matrix-card-enhanced">
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center matrix-glow">
                      <span className="text-green-400 text-xl">🔄</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold matrix-text-green">Recent Activity</h3>
                      <p className="matrix-text-white text-opacity-80">Your latest transactions</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-3 bg-black/50 rounded-lg">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <div className="flex-1">
                        <div className="matrix-text-white font-medium">Staked 50 SOL</div>
                        <div className="matrix-text-white text-opacity-70 text-sm">Bitcoin prediction • 2 hours ago</div>
                      </div>
                      <div className="matrix-text-green font-semibold">+50 SOL</div>
                    </div>
                    
                    <div className="flex items-center space-x-4 p-3 bg-black/50 rounded-lg">
                      <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                      <div className="flex-1">
                        <div className="matrix-text-white font-medium">Market Resolved</div>
                        <div className="matrix-text-white text-opacity-70 text-sm">Ethereum Merge • 1 day ago</div>
                      </div>
                      <div className="matrix-text-green font-semibold">+23.4%</div>
                    </div>
                    
                    <div className="flex items-center space-x-4 p-3 bg-black/50 rounded-lg">
                      <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                      <div className="flex-1">
                        <div className="matrix-text-white font-medium">Created Market</div>
                        <div className="matrix-text-white text-opacity-70 text-sm">Solana TVL • 3 days ago</div>
                      </div>
                      <div className="matrix-text-white text-opacity-70">New</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Market Trends */}
              <div className="matrix-card-enhanced">
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center matrix-glow">
                      <span className="text-green-400 text-xl">📊</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold matrix-text-green">Market Trends</h3>
                      <p className="matrix-text-white text-opacity-80">Popular predictions</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-3 bg-black/50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="matrix-text-white font-medium">Bitcoin Price</span>
                        <span className="matrix-text-green text-sm">🔥 Trending</span>
                      </div>
                      <div className="matrix-text-white text-opacity-70 text-sm">1,247 active stakers</div>
                    </div>
                    
                    <div className="p-3 bg-black/50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="matrix-text-white font-medium">Ethereum Merge</span>
                        <span className="matrix-text-green text-sm">✅ Resolved</span>
                      </div>
                      <div className="matrix-text-white text-opacity-70 text-sm">892 participants</div>
                    </div>
                    
                    <div className="p-3 bg-black/50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="matrix-text-white font-medium">Solana TVL</span>
                        <span className="matrix-text-orange text-sm">📈 Growing</span>
                      </div>
                      <div className="matrix-text-white text-opacity-70 text-sm">456 active stakers</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trading Statistics */}
            <div className="matrix-card-enhanced">
              <div className="p-6">
                <h3 className="text-2xl font-bold matrix-text-green mb-6 text-center">Trading Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-black/50 rounded-lg">
                    <div className="text-3xl font-bold matrix-text-green mb-2">47</div>
                    <div className="matrix-text-white text-sm">Total Trades</div>
                  </div>
                  
                  <div className="text-center p-4 bg-black/50 rounded-lg">
                    <div className="text-3xl font-bold matrix-text-green mb-2">78.5%</div>
                    <div className="matrix-text-white text-sm">Win Rate</div>
                  </div>
                  
                  <div className="text-center p-4 bg-black/50 rounded-lg">
                    <div className="text-3xl font-bold matrix-text-green mb-2">+15.3%</div>
                    <div className="matrix-text-white text-sm">Total Return</div>
                  </div>
                  
                  <div className="text-center p-4 bg-black/50 rounded-lg">
                    <div className="text-3xl font-bold matrix-text-green mb-2">1,250</div>
                    <div className="matrix-text-white text-sm">SOL Staked</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tokens' && (
          <div className="space-y-8">
            {/* Token Management Header */}
            <div className="matrix-card-enhanced p-6 text-center">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse matrix-glow"></div>
                <h2 className="text-3xl font-bold matrix-text-green">Token Management</h2>
                <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse matrix-glow"></div>
                  </div>
              <p className="matrix-text-white text-opacity-80">Manage your SOL tokens and staking positions</p>
                </div>

            {/* Token Overview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* SOL Balance */}
              <div className="matrix-card-enhanced neural-floating">
                <div className="p-6 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center matrix-glow mr-3">
                      <span className="text-green-400 text-2xl">💰</span>
                    </div>
                    <h3 className="text-lg font-semibold matrix-text-white">SOL Balance</h3>
                  </div>
                  <p className="text-3xl font-bold matrix-text-green neural-text-glow">1,250.50</p>
                  <p className="matrix-text-white text-opacity-70 mt-2">Available for staking</p>
                  <div className="mt-3 flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs matrix-text-green">Live</span>
                  </div>
                </div>
              </div>
              
              {/* Staked Amount */}
              <div className="matrix-card-enhanced neural-floating" style={{ animationDelay: '0.1s' }}>
                <div className="p-6 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center matrix-glow mr-3">
                      <span className="text-green-400 text-2xl">🔒</span>
                  </div>
                    <h3 className="text-lg font-semibold matrix-text-white">Staked Amount</h3>
                </div>
                  <p className="text-3xl font-bold matrix-text-green neural-text-glow">890.25</p>
                  <p className="matrix-text-white text-opacity-70 mt-2">Currently staked</p>
                  <div className="mt-3">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-400 h-2 rounded-full" style={{ width: '71%' }}></div>
                    </div>
                    <span className="text-xs matrix-text-blue mt-1 block">71% staked</span>
                  </div>
                </div>
              </div>
              
              {/* Total Value */}
              <div className="matrix-card-enhanced neural-floating" style={{ animationDelay: '0.2s' }}>
                <div className="p-6 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center matrix-glow mr-3">
                      <span className="text-green-400 text-2xl">💎</span>
                  </div>
                    <h3 className="text-lg font-semibold matrix-text-white">Total Value</h3>
                </div>
                  <p className="text-3xl font-bold matrix-text-green neural-text-glow">$2,140.75</p>
                  <p className="matrix-text-white text-opacity-70 mt-2">USD equivalent</p>
                  <div className="mt-3 flex items-center justify-center space-x-2">
                    <span className="text-xs matrix-text-green">+5.2%</span>
                    <span className="text-xs matrix-text-white">24h</span>
                  </div>
                </div>
              </div>

              {/* Rewards */}
              <div className="matrix-card-enhanced neural-floating" style={{ animationDelay: '0.3s' }}>
                <div className="p-6 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center matrix-glow mr-3">
                      <span className="text-green-400 text-2xl">🎁</span>
                    </div>
                    <h3 className="text-lg font-semibold matrix-text-white">Rewards</h3>
                  </div>
                  <p className="text-3xl font-bold matrix-text-green neural-text-glow">45.75</p>
                  <p className="matrix-text-white text-opacity-70 mt-2">SOL earned</p>
                  <div className="mt-3">
                    <div className="flex items-center justify-center space-x-1">
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                    </div>
                    <span className="text-xs matrix-text-orange mt-1 block">High</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Token Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Staking Actions */}
              <div className="matrix-card-enhanced">
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center matrix-glow">
                      <span className="text-green-400 text-xl">⚡</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold matrix-text-green">Staking Actions</h3>
                      <p className="matrix-text-white text-opacity-80">Manage your staking positions</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <button className="matrix-button-enhanced w-full p-4 text-left">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">🔒</span>
                        <div>
                          <div className="font-semibold matrix-text-white">Stake SOL</div>
                          <div className="text-sm matrix-text-white text-opacity-70">Lock tokens for rewards</div>
                        </div>
                      </div>
                    </button>
                    
                    <button className="matrix-button-enhanced w-full p-4 text-left">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">🔓</span>
                        <div>
                          <div className="font-semibold matrix-text-white">Unstake SOL</div>
                          <div className="text-sm matrix-text-white text-opacity-70">Release staked tokens</div>
                        </div>
                      </div>
                    </button>
                    
                    <button className="matrix-button-enhanced w-full p-4 text-left">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">💰</span>
                        <div>
                          <div className="font-semibold matrix-text-white">Claim Rewards</div>
                          <div className="text-sm matrix-text-white text-opacity-70">Withdraw earned rewards</div>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Token Transfers */}
              <div className="matrix-card-enhanced">
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center matrix-glow">
                      <span className="text-green-400 text-xl">🔄</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold matrix-text-green">Token Transfers</h3>
                      <p className="matrix-text-white text-opacity-80">Send and receive tokens</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <button className="matrix-button-enhanced w-full p-4 text-left">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">📤</span>
                        <div>
                          <div className="font-semibold matrix-text-white">Send SOL</div>
                          <div className="text-sm matrix-text-white text-opacity-70">Transfer to another wallet</div>
                        </div>
                      </div>
                    </button>
                    
                    <button className="matrix-button-enhanced w-full p-4 text-left">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">📥</span>
                        <div>
                          <div className="font-semibold matrix-text-white">Receive SOL</div>
                          <div className="text-sm matrix-text-white text-opacity-70">Get your wallet address</div>
                        </div>
                      </div>
                    </button>
                    
                    <button className="matrix-button-enhanced w-full p-4 text-left">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">📊</span>
                        <div>
                          <div className="font-semibold matrix-text-white">Transaction History</div>
                          <div className="text-sm matrix-text-white text-opacity-70">View all transactions</div>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Token Portfolio */}
            <div className="matrix-card-enhanced">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center matrix-glow">
                    <span className="text-green-400 text-xl">📈</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold matrix-text-green">Token Portfolio</h3>
                    <p className="matrix-text-white text-opacity-80">Your token holdings and performance</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-black/50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="matrix-text-white font-medium">SOL</span>
                      <span className="matrix-text-green text-sm">+5.2%</span>
                    </div>
                    <div className="matrix-text-white text-2xl font-bold">1,250.50</div>
                    <div className="matrix-text-white text-opacity-70 text-sm">$2,140.75</div>
                  </div>
                  
                  <div className="p-4 bg-black/50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="matrix-text-white font-medium">USDC</span>
                      <span className="matrix-text-white text-sm">0.0%</span>
                    </div>
                    <div className="matrix-text-white text-2xl font-bold">0.00</div>
                    <div className="matrix-text-white text-opacity-70 text-sm">$0.00</div>
                  </div>
                  
                  <div className="p-4 bg-black/50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="matrix-text-white font-medium">Rewards</span>
                      <span className="matrix-text-green text-sm">+12.3%</span>
                    </div>
                    <div className="matrix-text-white text-2xl font-bold">45.75</div>
                    <div className="matrix-text-white text-opacity-70 text-sm">$78.25</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Token Statistics */}
            <div className="matrix-card-enhanced">
              <div className="p-6">
                <h3 className="text-2xl font-bold matrix-text-green mb-6 text-center">Token Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-black/50 rounded-lg">
                    <div className="text-3xl font-bold matrix-text-green mb-2">1,250</div>
                    <div className="matrix-text-white text-sm">Total SOL</div>
                  </div>
                  
                  <div className="text-center p-4 bg-black/50 rounded-lg">
                    <div className="text-3xl font-bold matrix-text-green mb-2">890</div>
                    <div className="matrix-text-white text-sm">Staked SOL</div>
                  </div>
                  
                  <div className="text-center p-4 bg-black/50 rounded-lg">
                    <div className="text-3xl font-bold matrix-text-green mb-2">45.75</div>
                    <div className="matrix-text-white text-sm">Rewards Earned</div>
                  </div>
                  
                  <div className="text-center p-4 bg-black/50 rounded-lg">
                    <div className="text-3xl font-bold matrix-text-green mb-2">5.2%</div>
                    <div className="matrix-text-white text-sm">APY</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {/* Analytics Header */}
            <div className="matrix-card-enhanced p-6 text-center">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse matrix-glow"></div>
                <h2 className="text-3xl font-bold matrix-text-green">Market Analytics</h2>
                <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse matrix-glow"></div>
                </div>
              <p className="matrix-text-white text-opacity-80">Advanced market insights and performance metrics</p>
                </div>

            {/* Analytics Overview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Markets */}
              <div className="matrix-card-enhanced neural-floating">
                <div className="p-6 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center matrix-glow mr-3">
                      <span className="text-green-400 text-2xl">📊</span>
              </div>
                    <h3 className="text-lg font-semibold matrix-text-white">Total Markets</h3>
                  </div>
                  <p className="text-3xl font-bold matrix-text-green neural-text-glow">47</p>
                  <p className="matrix-text-white text-opacity-70 mt-2">Active predictions</p>
                  <div className="mt-3 flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs matrix-text-green">Live</span>
                  </div>
                </div>
              </div>
              
              {/* Total Volume */}
              <div className="matrix-card-enhanced neural-floating" style={{ animationDelay: '0.1s' }}>
                <div className="p-6 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center matrix-glow mr-3">
                      <span className="text-green-400 text-2xl">💰</span>
                    </div>
                    <h3 className="text-lg font-semibold matrix-text-white">Total Volume</h3>
                  </div>
                  <p className="text-3xl font-bold matrix-text-green neural-text-glow">2,847</p>
                  <p className="matrix-text-white text-opacity-70 mt-2">SOL staked</p>
                  <div className="mt-3">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-400 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <span className="text-xs matrix-text-blue mt-1 block">85% growth</span>
                  </div>
                </div>
              </div>
              
              {/* Success Rate */}
              <div className="matrix-card-enhanced neural-floating" style={{ animationDelay: '0.2s' }}>
                <div className="p-6 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center matrix-glow mr-3">
                      <span className="text-green-400 text-2xl">🎯</span>
                    </div>
                    <h3 className="text-lg font-semibold matrix-text-white">Success Rate</h3>
                  </div>
                  <p className="text-3xl font-bold matrix-text-green neural-text-glow">78.5%</p>
                  <p className="matrix-text-white text-opacity-70 mt-2">Prediction accuracy</p>
                  <div className="mt-3 flex items-center justify-center space-x-2">
                    <span className="text-xs matrix-text-green">+12.3%</span>
                    <span className="text-xs matrix-text-white">vs last month</span>
                  </div>
                </div>
              </div>

              {/* Active Users */}
              <div className="matrix-card-enhanced neural-floating" style={{ animationDelay: '0.3s' }}>
                <div className="p-6 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center matrix-glow mr-3">
                      <span className="text-green-400 text-2xl">👥</span>
                    </div>
                    <h3 className="text-lg font-semibold matrix-text-white">Active Users</h3>
                  </div>
                  <p className="text-3xl font-bold matrix-text-green neural-text-glow">1,247</p>
                  <p className="matrix-text-white text-opacity-70 mt-2">Monthly active</p>
                  <div className="mt-3">
                    <div className="flex items-center justify-center space-x-1">
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                    </div>
                    <span className="text-xs matrix-text-orange mt-1 block">High</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Market Performance Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Performing Markets */}
              <div className="matrix-card-enhanced">
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center matrix-glow">
                      <span className="text-green-400 text-xl">🏆</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold matrix-text-green">Top Markets</h3>
                      <p className="matrix-text-white text-opacity-80">Best performing predictions</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-3 bg-black/50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="matrix-text-white font-medium">Bitcoin Price 2025</span>
                        <span className="matrix-text-green text-sm">+23.4%</span>
                      </div>
                      <div className="matrix-text-white text-opacity-70 text-sm">1,247 participants</div>
                    </div>
                    
                    <div className="p-3 bg-black/50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="matrix-text-white font-medium">Ethereum Merge</span>
                        <span className="matrix-text-green text-sm">+18.7%</span>
                      </div>
                      <div className="matrix-text-white text-opacity-70 text-sm">892 participants</div>
                    </div>
                    
                    <div className="p-3 bg-black/50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="matrix-text-white font-medium">Solana TVL Growth</span>
                        <span className="matrix-text-green text-sm">+15.2%</span>
                      </div>
                      <div className="matrix-text-white text-opacity-70 text-sm">456 participants</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Market Categories */}
              <div className="matrix-card-enhanced">
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center matrix-glow">
                      <span className="text-green-400 text-xl">📈</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold matrix-text-green">Categories</h3>
                      <p className="matrix-text-white text-opacity-80">Market distribution</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-3 bg-black/50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="matrix-text-white font-medium">Cryptocurrency</span>
                        <span className="matrix-text-green text-sm">45%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-green-400 h-2 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-black/50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="matrix-text-white font-medium">Politics</span>
                        <span className="matrix-text-blue text-sm">25%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-blue-400 h-2 rounded-full" style={{ width: '25%' }}></div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-black/50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="matrix-text-white font-medium">Sports</span>
                        <span className="matrix-text-purple text-sm">20%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-purple-400 h-2 rounded-full" style={{ width: '20%' }}></div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-black/50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="matrix-text-white font-medium">Economy</span>
                        <span className="matrix-text-orange text-sm">10%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-orange-400 h-2 rounded-full" style={{ width: '10%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Analytics Actions */}
            <div className="matrix-card-enhanced">
              <div className="p-6">
                <h3 className="text-2xl font-bold matrix-text-green mb-6 text-center">Analytics Tools</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="matrix-button-enhanced p-4 text-center">
                    <div className="text-2xl mb-2">📊</div>
                    <div className="font-semibold matrix-text-white">View Charts</div>
                    <div className="text-sm matrix-text-white text-opacity-70">Detailed market graphs</div>
                  </button>
                  
                  <button className="matrix-button-enhanced p-4 text-center">
                    <div className="text-2xl mb-2">📈</div>
                    <div className="font-semibold matrix-text-white">Export Data</div>
                    <div className="text-sm matrix-text-white text-opacity-70">Download analytics</div>
                  </button>
                  
                  <button className="matrix-button-enhanced p-4 text-center">
                    <div className="text-2xl mb-2">🔔</div>
                    <div className="font-semibold matrix-text-white">Set Alerts</div>
                    <div className="text-sm matrix-text-white text-opacity-70">Market notifications</div>
                  </button>
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

        {/* Demo Market Creator Section */}
        {showDemoCreator && (
          <div className="mt-8">
            <DemoMarketCreator />
          </div>
        )}


      </ContentArea>
    </Layout>
    </div>
  );
}