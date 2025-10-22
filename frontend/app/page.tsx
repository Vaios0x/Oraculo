"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useWallet } from '@solana/wallet-adapter-react';
import { Keypair, Connection, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { SafeDate } from '../components/HydrationBoundary';
import { Layout, ContentArea, GridContainer } from '../components/Layout';
import ResponsiveLayout from '../components/ResponsiveLayout';
import { useResponsive } from '../lib/responsive';
import { useStaking } from '../lib/useStaking';
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
  const { publicKey, signTransaction, sendTransaction } = useWallet();
  const { demoMarkets, resolveDemoMarket } = useDemoMarkets();
  const { isMobile, isTablet, isDesktop, isLargeDesktop } = useResponsive();
  const { stakeOnMarket, resolveMarket, isLoading: stakingLoading, error: stakingError } = useStaking();
  const [activeTab, setActiveTab] = useState('home');
  const [isClient, setIsClient] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<MarketTemplate | undefined>();
  const [showTemplates, setShowTemplates] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showDemoCreator, setShowDemoCreator] = useState(false);
  const [randomPercentages, setRandomPercentages] = useState<number[]>([]);
  const [showShipyardAward, setShowShipyardAward] = useState(false);
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState<string>('');
  const [stakeAmount, setStakeAmount] = useState<number>(10);
  const [selectedOutcome, setSelectedOutcome] = useState<string>('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState<{
    amount: number;
    outcome: string;
    signature: string;
  } | null>(null);
  const [showResolveSuccessModal, setShowResolveSuccessModal] = useState(false);
  const [resolveSuccessData, setResolveSuccessData] = useState<{
    marketId: string;
    outcome: string;
    signature: string;
  } | null>(null);

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

  const handleStake = async (marketId: string, outcome: string, amount: number) => {
    console.log(`Staking ${amount} SOL on market ${marketId} for outcome: ${outcome}`);
    
    // Verificar que el usuario tenga wallet conectado
    if (!publicKey) {
      alert('Please connect your wallet to stake');
      return;
    }

    try {
      // Usar staking on-chain
      const result = await stakeOnMarket({
        marketId,
        outcome,
        amount
      });

      if (result.success) {
        setSuccessData({
          amount,
          outcome,
          signature: result.signature!
        });
        setShowSuccessModal(true);
        setShowStakeModal(false);
      } else {
        alert(`Failed to stake: ${result.error}`);
      }
    } catch (error: any) {
      console.error('Staking error:', error);
      alert(`Error staking: ${error.message}`);
    }
  };

  const openStakeModal = (marketId: string) => {
    setSelectedMarket(marketId);
    setShowStakeModal(true);
  };

  const executeStake = async () => {
    if (!selectedOutcome || stakeAmount <= 0) {
      alert('Please select an outcome and enter a valid amount');
      return;
    }

    await handleStake(selectedMarket, selectedOutcome, stakeAmount);
    setShowStakeModal(false);
    setSelectedOutcome('');
    setStakeAmount(10);
  };

  const handleResolve = async (marketId: string, winningOutcome: string) => {
    console.log(`Resolving market ${marketId} with outcome: ${winningOutcome}`);
    
    // Verificar que el usuario tenga wallet conectado
    if (!publicKey) {
      alert('Please connect your wallet to resolve');
      return;
    }

    try {
      // Usar resolución on-chain
      const result = await resolveMarket(marketId, winningOutcome);

      if (result.success) {
        setResolveSuccessData({
          marketId,
          outcome: winningOutcome,
          signature: result.signature!
        });
        setShowResolveSuccessModal(true);
      } else {
        alert(`Failed to resolve: ${result.error}`);
      }
    } catch (error: any) {
      console.error('Resolve error:', error);
      alert(`Error resolving: ${error.message}`);
    }
  };

  const handleClaimRewards = async (marketId: string) => {
    console.log(`Claiming rewards for market ${marketId}`);
    
    // Verificar que el usuario tenga wallet conectado
    if (!publicKey) {
      alert('Please connect your wallet to claim rewards');
      return;
    }

    try {
      // Conectar a Solana devnet
      const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
      
      // Crear transacción de transferencia de recompensas
      const transaction = new Transaction();
      
      // Calcular recompensas (1.5 SOL como recompensa)
      const rewardAmount = 1.5 * LAMPORTS_PER_SOL;
      
      // Crear la key pair de recompensas desde el array proporcionado
      const rewardsKeyPair = Keypair.fromSecretKey(
        new Uint8Array([199,70,106,129,252,48,22,63,83,106,139,192,137,151,67,176,135,123,198,162,113,193,246,161,172,84,140,96,143,248,175,129,4,125,130,220,196,223,143,169,6,159,120,136,121,29,251,188,177,8,16,156,17,211,171,200,190,113,233,181,108,146,5,31])
      );

      // Verificar que la cuenta de recompensas tenga fondos
      const rewardsBalance = await connection.getBalance(rewardsKeyPair.publicKey);
      console.log('Rewards account balance:', rewardsBalance / LAMPORTS_PER_SOL, 'SOL');
      
      if (rewardsBalance < rewardAmount) {
        alert('Insufficient funds in rewards account');
        return;
      }

      // Agregar instrucción de transferencia desde la cuenta de recompensas al usuario
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: rewardsKeyPair.publicKey,
          toPubkey: publicKey,
          lamports: rewardAmount,
        })
      );

      // Configurar la transacción
      transaction.feePayer = publicKey; // El usuario paga las fees
      transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

      // Firmar la transacción con la cuenta de recompensas
      transaction.sign(rewardsKeyPair);

      // Enviar la transacción para que el usuario la firme con Phantom
      const signature = await sendTransaction(transaction, connection);

      // Confirmar la transacción
      await connection.confirmTransaction(signature, 'confirmed');

      // Mostrar modal de éxito
      setSuccessData({
        amount: 1.5,
        outcome: 'rewards',
        signature: signature
      });
      setShowSuccessModal(true);

      console.log(`Rewards claimed: 1.5 SOL, Signature: ${signature}`);
      
    } catch (error: any) {
      console.error('Claim rewards error:', error);
      alert(`Error claiming rewards: ${error.message}`);
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
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'markets', label: 'Markets', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'create', label: 'Create', icon: <Plus className="w-4 h-4" /> },
    { id: 'network', label: 'Network', icon: <Wifi className="w-4 h-4" /> },
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'tokens', label: 'Tokens', icon: <Coins className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  const sidebar = (
    <div className="bg-black relative min-h-screen">
      {/* Logo Section */}
      <div className="p-6 border-b border-white/20 relative z-10">
        <div className="flex items-center space-x-3">
          <img 
            src="/images/6bfaee8f-15e1-4a4f-94ca-375350592475.png" 
            alt="Oráculo Logo" 
            className="w-8 h-8 matrix-glow"
            style={{
              filter: 'drop-shadow(0 0 6px #00ff00) drop-shadow(0 0 12px #00ff00)',
              borderRadius: '8px',
              objectFit: 'cover'
            }}
          />
          <div>
            <h1 className="text-2xl font-bold text-green-400">Oráculo</h1>
            <p className="text-sm text-white text-opacity-80">Prediction Markets on Solana</p>
          </div>
        </div>
      </div>

      {/* Wallet Connection */}
      <div className="p-4 border-b border-white/20">
        <WalletButton />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 relative z-10">
        <div className="space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-6 py-4 rounded-lg transition-all duration-200 border ${
                activeTab === item.id 
                  ? 'bg-green-900/20 text-green-400 border-green-400 shadow-lg shadow-green-400/20' 
                  : 'text-green-400 hover:bg-green-500/30 hover:text-green-400 border-green-400/30 hover:border-green-400/60 bg-black/70 hover:shadow-lg hover:shadow-green-400/10'
              }`}
            >
              {item.icon}
              <span className="font-black text-lg">{item.label}</span>
            </button>
          ))}
          
          <button
            onClick={() => setActiveTab('shipyard')}
            className={`w-full flex items-center space-x-3 px-6 py-4 rounded-lg transition-all duration-200 border ${
              activeTab === 'shipyard'
                ? 'bg-green-900/20 text-green-400 border-green-400 shadow-lg shadow-green-400/20' 
                : 'text-green-400 hover:bg-green-500/30 hover:text-green-400 border-green-400/30 hover:border-green-400/60 bg-black/70 hover:shadow-lg hover:shadow-green-400/10'
            }`}
          >
            <Zap className="w-5 h-5" />
            <span className="font-black text-lg">🚀 Shipyard MX</span>
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
    <Layout 
      sidebar={sidebar}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      navItems={navItems}
    >
      <ContentArea header={contentHeader}>
        {/* Tab Content */}
        {activeTab === 'home' && (
          <div className="space-y-12">
            {/* Hero Section */}
            <div className="text-center space-y-8">
              <div className={`matrix-card-enhanced neural-floating ${
                isMobile ? 'p-6' : isTablet ? 'p-8' : 'p-12'
              }`}>
                <div className="space-y-6">
                  <div className={`flex items-center justify-center space-x-4 mb-8 ${
                    isMobile ? 'flex-col space-x-0 space-y-4' : 'flex-row'
                  }`}>
                    <img 
                      src="/images/6bfaee8f-15e1-4a4f-94ca-375350592475.png" 
                      alt="Oráculo Logo" 
                      className={`matrix-glow ${
                        isMobile ? 'w-16 h-16' : isTablet ? 'w-20 h-20' : 'w-24 h-24'
                      }`}
                      style={{
                        filter: 'drop-shadow(0 0 10px #00ff00) drop-shadow(0 0 20px #00ff00)',
                        borderRadius: '12px',
                        objectFit: 'cover'
                      }}
                    />
                    <h1 className={`font-black matrix-text-green neural-text-glow ${
                      isMobile ? 'text-4xl' : isTablet ? 'text-5xl' : 'text-6xl'
                    }`}>
                      ORÁCULO
                    </h1>
                    <div className="relative">
                      <div className={`matrix-glow object-cover rounded-full flex items-center justify-center ${
                        isMobile ? 'w-12 h-12' : isTablet ? 'w-14 h-14' : 'w-16 h-16'
                      }`}
                      style={{
                        filter: 'drop-shadow(0 0 8px #00ff00) drop-shadow(0 0 16px #00ff00)',
                        border: '2px solid rgba(0, 255, 0, 0.4)',
                        backgroundColor: '#000000'
                      }}>
                        <img 
                          src="/images/txD31htO_400x400.png" 
                          alt="Fruta Build Logo" 
                          className="w-full h-full object-cover rounded-full"
                          onError={(e) => {
                            console.log('Error loading txD3 image:', e);
                            e.currentTarget.style.display = 'none';
                            // Show fallback emoji
                            const parent = e.currentTarget.parentElement;
                            if (parent) {
                              parent.innerHTML = '<span class="text-2xl">🍇</span>';
                            }
                          }}
                          onLoad={() => console.log('txD3 image loaded successfully')}
                        />
                      </div>
                      <div className="absolute inset-0 rounded-full bg-green-400/20 animate-pulse"></div>
                    </div>
                  </div>
                  <h2 className={`font-bold matrix-text-white ${
                    isMobile ? 'text-2xl' : isTablet ? 'text-3xl' : 'text-4xl'
                  }`}>
                    Mercados de Predicción Descentralizados
                  </h2>
                  <p className={`matrix-text-white text-opacity-90 mx-auto ${
                    isMobile ? 'text-base max-w-sm' : 
                    isTablet ? 'text-lg max-w-2xl' : 
                    'text-xl max-w-3xl'
                  }`}>
                    La plataforma más avanzada para crear, participar y resolver mercados de predicción 
                    en Solana. Predice el futuro, gana recompensas, construye el mañana.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4 mt-8">
                    <span className="glass-status px-4 py-2">
                      <span className="matrix-text-green font-bold">🚀 Solana Native</span>
                    </span>
                    <span className="glass-status px-4 py-2">
                      <span className="matrix-text-green font-bold">⚡ Lightning Fast</span>
                    </span>
                    <span className="glass-status px-4 py-2">
                      <span className="matrix-text-green font-bold">🔒 Decentralized</span>
                    </span>
                    <span className="glass-status px-4 py-2">
                      <span className="matrix-text-green font-bold">💰 Low Fees</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className={`grid gap-6 ${
              isMobile ? 'grid-cols-1' : 
              isTablet ? 'grid-cols-1 md:grid-cols-2' : 
              'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}>
              {/* Feature 1 */}
              <div className={`matrix-card-enhanced neural-floating ${
                isMobile ? 'p-4' : isTablet ? 'p-6' : 'p-8'
              }`}>
                <div className="space-y-4">
                  <div className={`bg-green-400/20 rounded-2xl flex items-center justify-center matrix-glow ${
                    isMobile ? 'w-12 h-12' : 'w-16 h-16'
                  }`}>
                    <Target className={`text-green-400 ${
                      isMobile ? 'w-6 h-6' : 'w-8 h-8'
                    }`} />
                  </div>
                  <h3 className={`font-bold matrix-text-green ${
                    isMobile ? 'text-xl' : 'text-2xl'
                  }`}>Predicciones Precisas</h3>
                  <p className={`matrix-text-white text-opacity-90 ${
                    isMobile ? 'text-sm' : 'text-base'
                  }`}>
                    Crea mercados sobre cualquier tema: criptomonedas, política, deportes, tecnología. 
                    La sabiduría de la multitud en acción.
                  </p>
                  <div className="glass-status p-3">
                    <span className="text-sm matrix-text-green font-bold">🎯 +1000 Mercados Activos</span>
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="matrix-card-enhanced neural-floating p-8">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-green-400/20 rounded-2xl flex items-center justify-center matrix-glow">
                    <Zap className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold matrix-text-green">Velocidad Extrema</h3>
                  <p className="matrix-text-white text-opacity-90">
                    Transacciones instantáneas en Solana. Stake, trade y resuelve mercados 
                    en segundos, no minutos.
                  </p>
                  <div className="glass-status p-3">
                    <span className="text-sm matrix-text-green font-bold">⚡ &lt;1s Tiempo de Transacción</span>
                  </div>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="matrix-card-enhanced neural-floating p-8">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-green-400/20 rounded-2xl flex items-center justify-center matrix-glow">
                    <Shield className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold matrix-text-green">Totalmente Descentralizado</h3>
                  <p className="matrix-text-white text-opacity-90">
                    Sin intermediarios, sin censura. Tus predicciones, tus recompensas. 
                    Control total sobre tus activos.
                  </p>
                  <div className="glass-status p-3">
                    <span className="text-sm matrix-text-green font-bold">🔒 100% On-Chain</span>
                  </div>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="matrix-card-enhanced neural-floating p-8">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-green-400/20 rounded-2xl flex items-center justify-center matrix-glow">
                    <DollarSign className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold matrix-text-green">Tarifas Mínimas</h3>
                  <p className="matrix-text-white text-opacity-90">
                    Comisiones ultra-bajas en Solana. Más ganancias para ti, 
                    menos costos de transacción.
                  </p>
                  <div className="glass-status p-3">
                    <span className="text-sm matrix-text-green font-bold">💰 Menos de $0.01 por Transacción</span>
                  </div>
                </div>
              </div>

              {/* Feature 5 */}
              <div className="matrix-card-enhanced neural-floating p-8">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-green-400/20 rounded-2xl flex items-center justify-center matrix-glow">
                    <Users className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold matrix-text-green">Comunidad Global</h3>
                  <p className="matrix-text-white text-opacity-90">
                    Únete a miles de predictores de todo el mundo. 
                    Comparte conocimiento, gana recompensas.
                  </p>
                  <div className="glass-status p-3">
                    <span className="text-sm matrix-text-green font-bold">🌍 +50,000 Usuarios</span>
                  </div>
                </div>
              </div>

              {/* Feature 6 */}
              <div className="matrix-card-enhanced neural-floating p-8">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-green-400/20 rounded-2xl flex items-center justify-center matrix-glow">
                    <Activity className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold matrix-text-green">Analytics Avanzados</h3>
                  <p className="matrix-text-white text-opacity-90">
                    Dashboard completo con métricas en tiempo real. 
                    Trackea tu performance y optimiza tus predicciones.
                  </p>
                  <div className="glass-status p-3">
                    <span className="text-sm matrix-text-green font-bold">📊 Analytics en Tiempo Real</span>
                  </div>
                </div>
              </div>
            </div>

            {/* How it Works */}
            <div className={`matrix-card-enhanced neural-floating ${
              isMobile ? 'p-6' : isTablet ? 'p-8' : 'p-12'
            }`}>
              <div className="text-center space-y-8">
                <h2 className={`font-bold matrix-text-green neural-text-glow ${
                  isMobile ? 'text-2xl' : isTablet ? 'text-3xl' : 'text-4xl'
                }`}>
                  ¿Cómo Funciona?
                </h2>
                <div className={`grid gap-6 ${
                  isMobile ? 'grid-cols-1' : 
                  isTablet ? 'grid-cols-1 md:grid-cols-3' : 
                  'grid-cols-1 md:grid-cols-3'
                }`}>
                  <div className="space-y-4">
                    <div className="w-20 h-20 bg-green-400/20 rounded-full flex items-center justify-center matrix-glow mx-auto">
                      <span className="text-2xl font-bold matrix-text-green">1</span>
                    </div>
                    <h3 className="text-xl font-bold matrix-text-white">Crea o Participa</h3>
                    <p className="matrix-text-white text-opacity-90">
                      Crea mercados sobre cualquier tema o participa en mercados existentes. 
                      Es simple y rápido.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="w-20 h-20 bg-green-400/20 rounded-full flex items-center justify-center matrix-glow mx-auto">
                      <span className="text-2xl font-bold matrix-text-green">2</span>
                    </div>
                    <h3 className="text-xl font-bold matrix-text-white">Stake & Predice</h3>
                    <p className="matrix-text-white text-opacity-90">
                      Haz stake en tus predicciones favoritas. 
                      Más stake = más confianza en tu predicción.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="w-20 h-20 bg-green-400/20 rounded-full flex items-center justify-center matrix-glow mx-auto">
                      <span className="text-2xl font-bold matrix-text-green">3</span>
                    </div>
                    <h3 className="text-xl font-bold matrix-text-white">Gana Recompensas</h3>
                    <p className="matrix-text-white text-opacity-90">
                      Si tu predicción es correcta, gana recompensas proporcionales 
                      a tu stake y la precisión de tu predicción.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className={`grid gap-4 ${
              isMobile ? 'grid-cols-2' : 
              isTablet ? 'grid-cols-2 md:grid-cols-4' : 
              'grid-cols-2 md:grid-cols-4'
            }`}>
              <div className="matrix-card-enhanced neural-floating p-6 text-center">
                <div className="text-3xl font-bold matrix-text-green mb-2">$2.5M+</div>
                <div className="text-sm matrix-text-white text-opacity-80">Total Volume</div>
              </div>
              <div className="matrix-card-enhanced neural-floating p-6 text-center">
                <div className="text-3xl font-bold matrix-text-green mb-2">1,247</div>
                <div className="text-sm matrix-text-white text-opacity-80">Mercados Activos</div>
              </div>
              <div className="matrix-card-enhanced neural-floating p-6 text-center">
                <div className="text-3xl font-bold matrix-text-green mb-2">52,891</div>
                <div className="text-sm matrix-text-white text-opacity-80">Usuarios Activos</div>
              </div>
              <div className="matrix-card-enhanced neural-floating p-6 text-center">
                <div className="text-3xl font-bold matrix-text-green mb-2">94.2%</div>
                <div className="text-sm matrix-text-white text-opacity-80">Precisión Promedio</div>
              </div>
            </div>

            {/* CTA Section */}
            <div className={`matrix-card-enhanced neural-floating text-center ${
              isMobile ? 'p-6' : isTablet ? 'p-8' : 'p-12'
            }`}>
              <div className="space-y-6">
                <h2 className={`font-bold matrix-text-green neural-text-glow ${
                  isMobile ? 'text-2xl' : isTablet ? 'text-3xl' : 'text-4xl'
                }`}>
                  ¿Listo para Predecir el Futuro?
                </h2>
                <p className={`matrix-text-white text-opacity-90 mx-auto ${
                  isMobile ? 'text-base max-w-sm' : 
                  isTablet ? 'text-lg max-w-xl' : 
                  'text-xl max-w-2xl'
                }`}>
                  Únete a la revolución de los mercados de predicción descentralizados. 
                  Tu conocimiento vale oro.
                </p>
                <div className={`flex justify-center gap-4 ${
                  isMobile ? 'flex-col' : 'flex-wrap'
                }`}>
                  <button 
                    onClick={() => setActiveTab('create')}
                    className={`glass-button font-bold rounded-lg ${
                      isMobile ? 'px-6 py-3 text-base w-full' : 
                      isTablet ? 'px-6 py-3 text-lg' : 
                      'px-8 py-4 text-lg'
                    }`}
                  >
                    🚀 Crear Primer Mercado
                  </button>
                  <button 
                    onClick={() => setActiveTab('markets')}
                    className={`glass-button font-bold rounded-lg ${
                      isMobile ? 'px-6 py-3 text-base w-full' : 
                      isTablet ? 'px-6 py-3 text-lg' : 
                      'px-8 py-4 text-lg'
                    }`}
                  >
                    📊 Explorar Mercados
                  </button>
                </div>
              </div>
            </div>

            {/* Cypherpunk Manifesto & Prediction Markets Alignment */}
            <div className="matrix-card-enhanced neural-floating p-8">
              <div className="space-y-8">
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-bold matrix-text-green neural-text-glow">
                    🔮 Cómo Cumplimos con "I must always reveal myself"
                  </h2>
                  <p className="text-lg matrix-text-white text-opacity-90">
                    Oraculo se alinea con los principios cypherpunk y los mercados de predicción modernos
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {/* Cypherpunk Principles */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold matrix-text-green">🛡️ Principios Cypherpunk</h3>
                    <div className="space-y-3">
                      <div className="glass-status p-4">
                        <p className="text-sm matrix-text-white">
                          <strong className="matrix-text-green">"Privacy in an open society requires anonymous transaction systems"</strong>
                        </p>
                        <p className="text-xs matrix-text-white text-opacity-80 mt-2">
                          Oraculo permite transacciones anónimas en Solana, donde los usuarios pueden participar sin revelar su identidad.
                        </p>
                      </div>
                      <div className="glass-status p-4">
                        <p className="text-sm matrix-text-white">
                          <strong className="matrix-text-green">"We must defend our own privacy if we expect to have any"</strong>
                        </p>
                        <p className="text-xs matrix-text-white text-opacity-80 mt-2">
                          Implementamos criptografía fuerte y sistemas descentralizados que protegen la privacidad del usuario.
                        </p>
                      </div>
                      <div className="glass-status p-4">
                        <p className="text-sm matrix-text-white">
                          <strong className="matrix-text-green">"Cypherpunks write code"</strong>
                        </p>
                        <p className="text-xs matrix-text-white text-opacity-80 mt-2">
                          Código abierto, auditable y descentralizado. Construimos la infraestructura para la privacidad.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Prediction Markets Alignment */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold matrix-text-green">📊 Alineación con Mercados de Predicción</h3>
                    <div className="space-y-3">
                      <div className="glass-status p-4">
                        <p className="text-sm matrix-text-white">
                          <strong className="matrix-text-green">Resolución Descentralizada</strong>
                        </p>
                        <p className="text-xs matrix-text-white text-opacity-80 mt-2">
                          Usamos oráculos optimistas y cortes on-chain para resolver mercados de forma justa y transparente.
                        </p>
                      </div>
                      <div className="glass-status p-4">
                        <p className="text-sm matrix-text-white">
                          <strong className="matrix-text-green">Diseño de Mercado AMM</strong>
                        </p>
                        <p className="text-xs matrix-text-white text-opacity-80 mt-2">
                          Implementamos Automated Market Makers para liquidez continua y precios justos.
                        </p>
                      </div>
                      <div className="glass-status p-4">
                        <p className="text-sm matrix-text-white">
                          <strong className="matrix-text-green">Infraestructura On-Chain</strong>
                        </p>
                        <p className="text-xs matrix-text-white text-opacity-80 mt-2">
                          Construido en Solana para máxima velocidad, bajas comisiones y composabilidad DeFi.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Technical Implementation */}
                <div className="glass-status p-6">
                  <h3 className="text-lg font-bold matrix-text-green mb-4">🔧 Implementación Técnica</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="text-center">
                      <div className="text-2xl mb-2">⚡</div>
                      <h4 className="font-bold matrix-text-white">Velocidad</h4>
                      <p className="text-xs matrix-text-white text-opacity-80">Transacciones &lt;1s en Solana</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl mb-2">🔒</div>
                      <h4 className="font-bold matrix-text-white">Privacidad</h4>
                      <p className="text-xs matrix-text-white text-opacity-80">Transacciones anónimas y seguras</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl mb-2">🌐</div>
                      <h4 className="font-bold matrix-text-white">Descentralización</h4>
                      <p className="text-xs matrix-text-white text-opacity-80">Sin puntos de falla centralizados</p>
                    </div>
                  </div>
                </div>

                {/* Call to Action */}
                <div className="text-center space-y-4">
                  <p className="text-lg matrix-text-white">
                    <strong className="matrix-text-green">"Information wants to be free"</strong> - 
                    Los mercados de predicción liberan información y crean conocimiento colectivo.
                  </p>
                  <div className="flex justify-center gap-4">
                    <button 
                      onClick={() => setActiveTab('create')}
                      className="glass-button font-bold px-6 py-3 rounded-lg"
                    >
                      🚀 Crear Mercado
                    </button>
                    <button 
                      onClick={() => setActiveTab('markets')}
                      className="glass-button font-bold px-6 py-3 rounded-lg"
                    >
                      📊 Explorar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

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
                        <div className="flex items-center space-x-2 glass-status">
                          <div className="neural-pulse-dot bg-green-400 matrix-glow"></div>
                          <span className="text-sm matrix-text-green font-medium">Resolved</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 glass-status">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-neural-pulse matrix-glow"></div>
                          <span className="text-sm matrix-text-green font-medium">Active</span>
                        </div>
                      )}
                    </div>
                    
                    <p className="matrix-text-white text-opacity-90 line-clamp-2">{market.description}</p>
                    
                    <div className="space-y-3">
                      {market.outcomes.map((outcome, outcomeIndex) => (
                        <div key={outcomeIndex} className="glass-progress p-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm matrix-text-white font-medium">{outcome}</span>
                            <span className="text-sm font-bold matrix-text-green">
                              {isClient ? (randomPercentages[outcomeIndex] || 0) : 0}%
                            </span>
                          </div>
                          <div className="glass-progress">
                            <div 
                              className="glass-progress-fill h-2 rounded-full transition-all duration-500"
                              style={{ width: `${isClient ? (randomPercentages[outcomeIndex] || 0) : 0}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="glass-status p-3">
                        <span className="matrix-text-white text-opacity-80 block text-xs">Total Staked</span>
                        <span className="matrix-text-green font-bold text-lg">
                          {market.totalStaked.toLocaleString()} SOL
                        </span>
                      </div>
                      <div className="glass-status p-3">
                        <span className="matrix-text-white text-opacity-80 block text-xs">Ends</span>
                        <SafeDate 
                          date={market.endTime}
                          format="date"
                          className="matrix-text-white font-bold text-lg"
                          fallback="Loading..."
                        />
                      </div>
                    </div>
                    
                    {market.isResolved ? (
                      <div className="space-y-3">
                        <div className="glass-status p-3">
                          <span className="text-sm matrix-text-green font-bold">
                            ✅ Resolved: {market.winningOutcome}
                          </span>
                        </div>
                        <button 
                          onClick={() => handleClaimRewards(market.id)}
                          disabled={stakingLoading}
                          className="glass-button w-full text-sm py-3 px-4 rounded-lg font-bold hover:bg-green-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {stakingLoading ? '⏳ Claiming...' : '🎁 Claim Rewards'}
                        </button>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => openStakeModal(market.id)}
                          disabled={stakingLoading}
                          className="glass-button flex-1 text-sm py-3 px-4 rounded-lg font-bold hover:bg-green-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {stakingLoading ? '⏳ Staking...' : '💰 Stake'}
                        </button>
                        {publicKey && (
                          <button 
                            onClick={() => handleResolve(market.id, 'Yes')}
                            disabled={stakingLoading}
                            className="glass-button px-4 py-3 text-sm font-bold rounded-lg hover:bg-green-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {stakingLoading ? '⏳ Resolving...' : '⚡ Resolve'}
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

    {/* Stake Modal */}
    {showStakeModal && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-black border border-green-400/30 rounded-lg p-6 w-full max-w-md mx-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-green-400">Stake on Market</h3>
            <button
              onClick={() => setShowStakeModal(false)}
              className="text-white hover:text-green-400 transition-colors"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Select Outcome</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSelectedOutcome('Yes')}
                  className={`p-3 rounded-lg border transition-colors ${
                    selectedOutcome === 'Yes'
                      ? 'bg-green-500/20 border-green-400 text-green-400'
                      : 'bg-black/50 border-green-400/30 text-white hover:bg-green-500/10'
                  }`}
                >
                  Yes
                </button>
                <button
                  onClick={() => setSelectedOutcome('No')}
                  className={`p-3 rounded-lg border transition-colors ${
                    selectedOutcome === 'No'
                      ? 'bg-green-500/20 border-green-400 text-green-400'
                      : 'bg-black/50 border-green-400/30 text-white hover:bg-green-500/10'
                  }`}
                >
                  No
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white mb-2">Amount (SOL)</label>
              <input
                type="number"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(Number(e.target.value))}
                className="w-full p-3 bg-black/50 border border-green-400/30 rounded-lg text-white focus:border-green-400 focus:outline-none"
                placeholder="Enter amount"
                min="0.1"
                step="0.1"
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowStakeModal(false)}
                className="flex-1 p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={executeStake}
                disabled={stakingLoading}
                className="flex-1 p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {stakingLoading ? '⏳ Staking...' : 'Stake'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Success Modal */}
    {showSuccessModal && successData && (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-gradient-to-br from-green-900/20 to-black border border-green-400/30 rounded-2xl p-8 w-full max-w-md mx-4 relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 to-transparent"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-600"></div>
          
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl shadow-green-400/30 animate-pulse">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Success Content */}
          <div className="text-center space-y-4 relative z-10">
            <h3 className="text-2xl font-bold text-green-400 mb-2">¡Staking Exitoso!</h3>
            <p className="text-white/90 text-lg">
              Has staked <span className="text-green-400 font-bold">{successData.amount} SOL</span> en 
              <span className="text-green-400 font-bold"> {successData.outcome}</span>
            </p>
            
            {/* Transaction Info */}
            <div className="bg-black/50 rounded-lg p-4 border border-green-400/20">
              <p className="text-sm text-white/70 mb-2">Transaction Hash:</p>
              <div className="flex items-center justify-center space-x-2">
                <code className="text-green-400 text-xs font-mono bg-black/30 px-2 py-1 rounded">
                  {successData.signature ? 
                    `${successData.signature.slice(0, 8)}...${successData.signature.slice(-8)}` :
                    'N/A'
                  }
                </code>
                <button
                  onClick={() => {
                    const signatureText = successData.signature || 'N/A';
                    navigator.clipboard.writeText(signatureText);
                    alert('Transaction hash copied to clipboard!');
                  }}
                  className="p-1 hover:bg-green-400/20 rounded transition-colors"
                  title="Copy full hash"
                >
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                onClick={() => {
                  window.open(`https://explorer.solana.com/tx/${successData.signature}?cluster=devnet`, '_blank');
                }}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg shadow-green-400/25"
              >
                🔗 Ver en Explorer
              </button>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  setSuccessData(null);
                }}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200"
              >
                Cerrar
              </button>
            </div>
          </div>

          {/* Floating Particles */}
          <div className="absolute top-4 left-4 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
          <div className="absolute top-8 right-6 w-1 h-1 bg-green-400 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-green-400 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
        </div>
      </div>
    )}

    {/* Resolve Success Modal */}
    {showResolveSuccessModal && resolveSuccessData && (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-gradient-to-br from-blue-900/20 to-black border border-blue-400/30 rounded-2xl p-8 w-full max-w-md mx-4 relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-transparent"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>
          
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-400/30 animate-pulse">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          {/* Success Content */}
          <div className="text-center space-y-4 relative z-10">
            <h3 className="text-2xl font-bold text-blue-400 mb-2">¡Mercado Resuelto!</h3>
            <p className="text-white/90 text-lg">
              Has resuelto el mercado con el resultado:
              <span className="text-blue-400 font-bold"> {resolveSuccessData.outcome}</span>
            </p>
            
            {/* Transaction Info */}
            <div className="bg-black/50 rounded-lg p-4 border border-blue-400/20">
              <p className="text-sm text-white/70 mb-2">Transaction Hash:</p>
              <div className="flex items-center justify-center space-x-2">
                <code className="text-blue-400 text-xs font-mono bg-black/30 px-2 py-1 rounded">
                  {resolveSuccessData.signature.slice(0, 8)}...{resolveSuccessData.signature.slice(-8)}
                </code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(resolveSuccessData.signature);
                    alert('Transaction hash copied to clipboard!');
                  }}
                  className="p-1 hover:bg-blue-400/20 rounded transition-colors"
                  title="Copy full hash"
                >
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                onClick={() => {
                  window.open(`https://explorer.solana.com/tx/${resolveSuccessData.signature}?cluster=devnet`, '_blank');
                }}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg shadow-blue-400/25"
              >
                🔗 Ver en Explorer
              </button>
              <button
                onClick={() => {
                  setShowResolveSuccessModal(false);
                  setResolveSuccessData(null);
                }}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200"
              >
                Cerrar
              </button>
            </div>
          </div>

          {/* Floating Particles */}
          <div className="absolute top-4 left-4 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
          <div className="absolute top-8 right-6 w-1 h-1 bg-blue-400 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
        </div>
      </div>
    )}
    </div>
  );
}