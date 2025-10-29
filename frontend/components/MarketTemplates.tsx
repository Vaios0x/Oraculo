"use client";

import React from 'react';
import { 
  TrendingUp, 
  Globe, 
  DollarSign, 
  Zap, 
  Shield, 
  Activity,
  Bitcoin,
  Circle,
  Calendar,
  Target,
  Rocket,
  Brain,
  Cpu,
  Film,
  Gamepad2,
  Heart,
  Sun,
  Wind,
  Car,
  Building2,
  Users,
  Briefcase,
  Megaphone,
  Plane,
  Satellite,
  Microscope,
  Building,
  Vote,
  Leaf,
  GraduationCap,
  Palette
} from 'lucide-react';

/**
 * 🔮 MarketTemplates Component - Templates to create markets
 * 
 * Component that provides predefined templates to create prediction
 * markets with popular examples and categories updated for 2026
 * 
 * @author Blockchain & Web3 Developer Full Stack Senior
 * @version 1.0.0
 */

export interface MarketTemplate {
  id: string;
  title: string;
  description: string;
  question: string;
  outcomes: string[];
  category: string;
  icon: React.ReactNode;
  color: string;
  endTime: number; // days from today
}

const templates: MarketTemplate[] = [
  // Cryptocurrencies - Updated data for 2026
  {
    id: 'bitcoin-200k-2026',
    title: 'Bitcoin Price Prediction 2026',
    description: 'Prediction on whether Bitcoin will reach $200,000 USD by the end of 2026. Based on technical analysis, institutional adoption and crypto market trends.',
    question: 'Will Bitcoin reach $200,000 USD by the end of 2026?',
    outcomes: ['Yes', 'No'],
    category: 'Cryptocurrencies',
    icon: <Bitcoin className="w-5 h-5" />,
    color: 'bg-orange-500',
    endTime: 365
  },
  {
    id: 'ethereum-15k-2026',
    title: 'Ethereum Price Prediction 2026',
    description: 'Prediction on whether Ethereum will reach $15,000 USD by the end of 2026. Considering scalability improvements, DeFi adoption and network upgrades.',
    question: 'Will Ethereum reach $15,000 USD by the end of 2026?',
    outcomes: ['Yes', 'No'],
    category: 'Cryptocurrencies',
    icon: <Circle className="w-5 h-5" />,
    color: 'bg-blue-500',
    endTime: 365
  },
  {
    id: 'solana-500-2026',
    title: 'Solana Price Prediction 2026',
    description: 'Prediction on whether Solana will reach $500 USD by the end of 2026. Based on ecosystem growth, dApp adoption and network technical improvements.',
    question: 'Will Solana reach $500 USD by the end of 2026?',
    outcomes: ['Yes', 'No'],
    category: 'Cryptocurrencies',
    icon: <Zap className="w-5 h-5" />,
    color: 'bg-purple-500',
    endTime: 365
  },

  // Technology and AI - 2026
  {
    id: 'ai-gpt6-2026',
    title: 'GPT-6 Release 2026',
    description: 'Prediction on the official release of GPT-6 by OpenAI in 2026. Considering current development pace and company announcements.',
    question: 'Will GPT-6 be released by OpenAI in 2026?',
    outcomes: ['Yes', 'No'],
    category: 'Technology',
    icon: <Activity className="w-5 h-5" />,
    color: 'bg-green-500',
    endTime: 365
  },
  {
    id: 'quantum-computing-2026',
    title: 'Quantum Computing Breakthrough 2026',
    description: 'Prediction on whether there will be a significant breakthrough in quantum computing in 2026. Considering developments at IBM, Google, Microsoft and other leading companies.',
    question: 'Will there be a significant breakthrough in quantum computing in 2026?',
    outcomes: ['Yes', 'No'],
    category: 'Technology',
    icon: <Zap className="w-5 h-5" />,
    color: 'bg-indigo-500',
    endTime: 365
  },
  {
    id: 'tesla-robot-2026',
    title: 'Tesla Robot Production 2026',
    description: 'Prediction on whether Tesla will begin mass production of humanoid robots in 2026. Based on Elon Musk\'s announcements and Tesla Bot development.',
    question: 'Will Tesla begin mass production of robots in 2026?',
    outcomes: ['Yes', 'No'],
    category: 'Technology',
    icon: <Target className="w-5 h-5" />,
    color: 'bg-red-500',
    endTime: 365
  },

  // DeFi and Finance - 2026
  {
    id: 'defi-tvl-500b-2026',
    title: 'DeFi TVL Milestone 2026',
    description: 'Prediction on whether total DeFi TVL (Total Value Locked) will exceed $500 billion in 2026. Considering current growth and institutional adoption.',
    question: 'Will total DeFi TVL exceed $500B in 2026?',
    outcomes: ['Yes', 'No'],
    category: 'DeFi',
    icon: <DollarSign className="w-5 h-5" />,
    color: 'bg-green-500',
    endTime: 365
  },
  {
    id: 'fed-rate-cut-2026',
    title: 'Federal Reserve Rate Cut 2026',
    description: 'Prediction on whether the US Federal Reserve will cut interest rates in 2026. Based on economic indicators and monetary policies.',
    question: 'Will the Fed cut interest rates in 2026?',
    outcomes: ['Yes', 'No'],
    category: 'Finance',
    icon: <TrendingUp className="w-5 h-5" />,
    color: 'bg-yellow-500',
    endTime: 365
  },

  // Climate and Environment - 2026
  {
    id: 'climate-goals-2026',
    title: 'Climate Goals 2026',
    description: 'Prediction on climate goals for 2026',
    question: 'Will global climate goals be met in 2026?',
    outcomes: ['Yes', 'No'],
    category: 'Environment',
    icon: <Globe className="w-5 h-5" />,
    color: 'bg-emerald-500',
    endTime: 365
  },
  {
    id: 'renewable-energy-2026',
    title: 'Renewable Energy Milestone 2026',
    description: 'Prediction on renewable energy in 2026',
    question: 'Will renewable energy exceed 50% of global generation in 2026?',
    outcomes: ['Yes', 'No'],
    category: 'Environment',
    icon: <Zap className="w-5 h-5" />,
    color: 'bg-green-500',
    endTime: 365
  },

  // Sports and Entertainment - 2026
  {
    id: 'world-cup-2026',
    title: 'World Cup 2026 Winner',
    description: 'Prediction on the winner of the 2026 World Cup',
    question: 'Will a European team win the 2026 World Cup?',
    outcomes: ['Yes', 'No'],
    category: 'Sports',
    icon: <Target className="w-5 h-5" />,
    color: 'bg-blue-500',
    endTime: 365
  },
  {
    id: 'olympics-2026',
    title: 'Olympics 2026 Success',
    description: 'Prediction on the success of the 2026 Olympics',
    question: 'Will the 2026 Winter Olympics be successful?',
    outcomes: ['Yes', 'No'],
    category: 'Sports',
    icon: <Activity className="w-5 h-5" />,
    color: 'bg-cyan-500',
    endTime: 365
  },

  // Politics and Economy - 2026
  {
    id: 'us-election-2026',
    title: 'US Midterm Elections 2026',
    description: 'Prediction on US midterm elections',
    question: 'Will the Republican party win the 2026 midterm elections?',
    outcomes: ['Yes', 'No'],
    category: 'Politics',
    icon: <Shield className="w-5 h-5" />,
    color: 'bg-red-500',
    endTime: 365
  },
  {
    id: 'global-recession-2026',
    title: 'Global Recession 2026',
    description: 'Prediction on global recession in 2026',
    question: 'Will there be a global recession in 2026?',
    outcomes: ['Yes', 'No'],
    category: 'Economy',
    icon: <TrendingUp className="w-5 h-5" />,
    color: 'bg-yellow-500',
    endTime: 365
  },

  // Additional Cryptocurrencies - 2026
  {
    id: 'cardano-ada-2026',
    title: 'Cardano ADA Price Prediction 2026',
    description: 'Prediction on whether Cardano will reach $5 USD by the end of 2026. Based on smart contract adoption, DeFi ecosystem growth and network upgrades.',
    question: 'Will Cardano reach $5 USD by the end of 2026?',
    outcomes: ['Yes', 'No'],
    category: 'Cryptocurrencies',
    icon: <Circle className="w-5 h-5" />,
    color: 'bg-blue-600',
    endTime: 365
  },
  {
    id: 'crypto-market-cap-2026',
    title: 'Crypto Market Cap Milestone 2026',
    description: 'Prediction on whether the total cryptocurrency market capitalization will exceed $10 trillion USD in 2026.',
    question: 'Will total crypto market cap exceed $10T in 2026?',
    outcomes: ['Yes', 'No'],
    category: 'Cryptocurrencies',
    icon: <DollarSign className="w-5 h-5" />,
    color: 'bg-green-600',
    endTime: 365
  },

  // Space Exploration - 2026
  {
    id: 'mars-mission-2026',
    title: 'Mars Mission 2026',
    description: 'Prediction on whether SpaceX will successfully launch an uncrewed mission to Mars in 2026. Based on Starship development progress.',
    question: 'Will SpaceX launch an uncrewed mission to Mars in 2026?',
    outcomes: ['Yes', 'No'],
    category: 'Space',
    icon: <Rocket className="w-5 h-5" />,
    color: 'bg-red-600',
    endTime: 730
  },
  {
    id: 'moon-base-2026',
    title: 'Lunar Base Construction 2026',
    description: 'Prediction on whether construction of a permanent lunar base will begin in 2026 through NASA\'s Artemis program or international collaboration.',
    question: 'Will construction of a permanent lunar base begin in 2026?',
    outcomes: ['Yes', 'No'],
    category: 'Space',
    icon: <Satellite className="w-5 h-5" />,
    color: 'bg-indigo-600',
    endTime: 730
  },

  // AI and Machine Learning - 2026
  {
    id: 'agi-achievement-2026',
    title: 'AGI Achievement 2026',
    description: 'Prediction on whether a company will achieve Artificial General Intelligence (AGI) in 2026. AGI refers to AI that can perform any intellectual task as well as humans.',
    question: 'Will AGI be achieved by any company in 2026?',
    outcomes: ['Yes', 'No'],
    category: 'Technology',
    icon: <Brain className="w-5 h-5" />,
    color: 'bg-purple-600',
    endTime: 365
  },
  {
    id: 'ai-job-displacement-2026',
    title: 'AI Job Displacement 2026',
    description: 'Prediction on whether AI will displace more than 50 million jobs globally in 2026. Based on automation trends and AI adoption rates.',
    question: 'Will AI displace more than 50M jobs globally in 2026?',
    outcomes: ['Yes', 'No'],
    category: 'Technology',
    icon: <Briefcase className="w-5 h-5" />,
    color: 'bg-orange-600',
    endTime: 365
  },
  {
    id: 'neural-interface-2026',
    title: 'Neural Interface Commercial Release 2026',
    description: 'Prediction on whether Neuralink or another company will receive FDA approval for commercial neural interface devices in 2026.',
    question: 'Will a neural interface device receive FDA approval in 2026?',
    outcomes: ['Yes', 'No'],
    category: 'Technology',
    icon: <Cpu className="w-5 h-5" />,
    color: 'bg-pink-600',
    endTime: 365
  },

  // Healthcare and Medicine - 2026
  {
    id: 'cancer-cure-breakthrough-2026',
    title: 'Major Cancer Treatment Breakthrough 2026',
    description: 'Prediction on whether there will be a major breakthrough in cancer treatment that significantly improves survival rates for common cancers in 2026.',
    question: 'Will there be a major cancer treatment breakthrough in 2026?',
    outcomes: ['Yes', 'No'],
    category: 'Healthcare',
    icon: <Heart className="w-5 h-5" />,
    color: 'bg-red-500',
    endTime: 365
  },
  {
    id: 'longevity-drug-2026',
    title: 'Anti-Aging Drug Approval 2026',
    description: 'Prediction on whether a drug proven to significantly extend human lifespan will receive regulatory approval in 2026.',
    question: 'Will an anti-aging drug receive regulatory approval in 2026?',
    outcomes: ['Yes', 'No'],
    category: 'Healthcare',
    icon: <Heart className="w-5 h-5" />,
    color: 'bg-pink-500',
    endTime: 365
  },

  // Social Media and Tech Platforms - 2026
  {
    id: 'twitter-x-users-2026',
    title: 'X (Twitter) User Growth 2026',
    description: 'Prediction on whether X (formerly Twitter) will exceed 500 million monthly active users in 2026 under Elon Musk\'s leadership.',
    question: 'Will X exceed 500M monthly active users in 2026?',
    outcomes: ['Yes', 'No'],
    category: 'Social Media',
    icon: <Megaphone className="w-5 h-5" />,
    color: 'bg-blue-500',
    endTime: 365
  },
  {
    id: 'metaverse-adoption-2026',
    title: 'Metaverse Daily Active Users 2026',
    description: 'Prediction on whether combined daily active users across major metaverse platforms (Meta, Roblox, Decentraland, etc.) will exceed 500 million in 2026.',
    question: 'Will metaverse platforms exceed 500M daily active users in 2026?',
    outcomes: ['Yes', 'No'],
    category: 'Social Media',
    icon: <Users className="w-5 h-5" />,
    color: 'bg-purple-500',
    endTime: 365
  },

  // Gaming and Entertainment - 2026
  {
    id: 'gaming-industry-revenue-2026',
    title: 'Gaming Industry Revenue 2026',
    description: 'Prediction on whether the global gaming industry revenue will exceed $250 billion USD in 2026. Including console, PC, mobile, and esports.',
    question: 'Will global gaming revenue exceed $250B in 2026?',
    outcomes: ['Yes', 'No'],
    category: 'Gaming',
    icon: <Gamepad2 className="w-5 h-5" />,
    color: 'bg-green-500',
    endTime: 365
  },
  {
    id: 'ai-generated-movie-2026',
    title: 'AI-Generated Movie Box Office 2026',
    description: 'Prediction on whether a feature-length movie primarily generated by AI (script, visuals, or both) will gross over $100 million at the box office in 2026.',
    question: 'Will an AI-generated movie gross over $100M in 2026?',
    outcomes: ['Yes', 'No'],
    category: 'Entertainment',
    icon: <Film className="w-5 h-5" />,
    color: 'bg-indigo-500',
    endTime: 365
  },

  // Renewable Energy and Climate - 2026
  {
    id: 'solar-power-capacity-2026',
    title: 'Global Solar Power Capacity 2026',
    description: 'Prediction on whether global installed solar power capacity will exceed 2 terawatts (TW) in 2026. Based on current installation trends and government commitments.',
    question: 'Will global solar capacity exceed 2TW in 2026?',
    outcomes: ['Yes', 'No'],
    category: 'Environment',
    icon: <Sun className="w-5 h-5" />,
    color: 'bg-yellow-400',
    endTime: 365
  },
  {
    id: 'wind-energy-growth-2026',
    title: 'Wind Energy Growth 2026',
    description: 'Prediction on whether global wind energy capacity will exceed 1.2 terawatts (TW) in 2026. Including both onshore and offshore installations.',
    question: 'Will global wind capacity exceed 1.2TW in 2026?',
    outcomes: ['Yes', 'No'],
    category: 'Environment',
    icon: <Wind className="w-5 h-5" />,
    color: 'bg-blue-400',
    endTime: 365
  },
  {
    id: 'carbon-neutral-city-2026',
    title: 'Carbon Neutral Major City 2026',
    description: 'Prediction on whether a major city (population over 1 million) will achieve carbon neutrality in 2026 through renewable energy and emissions reduction.',
    question: 'Will a major city achieve carbon neutrality in 2026?',
    outcomes: ['Yes', 'No'],
    category: 'Environment',
    icon: <Building className="w-5 h-5" />,
    color: 'bg-emerald-500',
    endTime: 365
  },

  // Autonomous Vehicles - 2026
  {
    id: 'self-driving-cars-2026',
    title: 'Fully Autonomous Vehicle Deployment 2026',
    description: 'Prediction on whether fully autonomous vehicles (Level 5) will be commercially available for public purchase in at least one country in 2026.',
    question: 'Will Level 5 autonomous vehicles be commercially available in 2026?',
    outcomes: ['Yes', 'No'],
    category: 'Transportation',
    icon: <Car className="w-5 h-5" />,
    color: 'bg-gray-600',
    endTime: 365
  },

  // International Relations - 2026
  {
    id: 'global-peace-index-2026',
    title: 'Global Peace Index Improvement 2026',
    description: 'Prediction on whether the Global Peace Index will show improvement compared to 2025, indicating a more peaceful world overall.',
    question: 'Will the Global Peace Index improve in 2026?',
    outcomes: ['Yes', 'No'],
    category: 'Politics',
    icon: <Shield className="w-5 h-5" />,
    color: 'bg-green-600',
    endTime: 365
  },

  // Stock Market - 2026
  {
    id: 'sp500-record-2026',
    title: 'S&P 500 Record High 2026',
    description: 'Prediction on whether the S&P 500 index will reach a new all-time high above 7,000 points in 2026. Based on economic growth and corporate earnings.',
    question: 'Will S&P 500 exceed 7,000 points in 2026?',
    outcomes: ['Yes', 'No'],
    category: 'Finance',
    icon: <TrendingUp className="w-5 h-5" />,
    color: 'bg-green-700',
    endTime: 365
  },

  // Electric Vehicles - 2026
  {
    id: 'ev-market-share-2026',
    title: 'Electric Vehicle Market Share 2026',
    description: 'Prediction on whether electric vehicles will account for more than 30% of global new car sales in 2026. Including battery electric and plug-in hybrid vehicles.',
    question: 'Will EVs account for over 30% of global car sales in 2026?',
    outcomes: ['Yes', 'No'],
    category: 'Transportation',
    icon: <Car className="w-5 h-5" />,
    color: 'bg-teal-600',
    endTime: 365
  },

  // Additional Global Templates - 2026
  {
    id: 'nft-market-recovery-2026',
    title: 'NFT Market Recovery 2026',
    description: 'Prediction on whether the global NFT market will recover to exceed $25 billion in trading volume in 2026. Based on utility-focused projects and institutional adoption.',
    question: 'Will global NFT trading volume exceed $25B in 2026?',
    outcomes: ['Yes', 'No'],
    category: 'Cryptocurrencies',
    icon: <Circle className="w-5 h-5" />,
    color: 'bg-purple-500',
    endTime: 365
  },
  {
    id: 'web3-social-platforms-2026',
    title: 'Web3 Social Platforms 2026',
    description: 'Prediction on whether decentralized social media platforms will reach 100 million monthly active users in 2026. Including Lens Protocol, Farcaster, and similar platforms.',
    question: 'Will Web3 social platforms reach 100M MAU in 2026?',
    outcomes: ['Yes', 'No'],
    category: 'Technology',
    icon: <Users className="w-5 h-5" />,
    color: 'bg-blue-500',
    endTime: 365
  },
  {
    id: 'ai-regulation-eu-2026',
    title: 'EU AI Act Implementation 2026',
    description: 'Prediction on whether the European Union AI Act will be fully implemented and enforced by the end of 2026. Based on regulatory compliance timelines and industry readiness.',
    question: 'Will the EU AI Act be fully implemented by end of 2026?',
    outcomes: ['Yes', 'No'],
    category: 'Technology',
    icon: <Shield className="w-5 h-5" />,
    color: 'bg-indigo-500',
    endTime: 365
  },
  {
    id: 'carbon-capture-scaling-2026',
    title: 'Carbon Capture Technology 2026',
    description: 'Prediction on whether global carbon capture and storage capacity will exceed 100 million tons per year in 2026. Based on current deployment rates and government commitments.',
    question: 'Will global CCS capacity exceed 100M tons/year in 2026?',
    outcomes: ['Yes', 'No'],
    category: 'Environment',
    icon: <Leaf className="w-5 h-5" />,
    color: 'bg-green-600',
    endTime: 365
  },
  {
    id: 'moon-landing-2026',
    title: 'Artemis Moon Landing 2026',
    description: 'Prediction on whether NASA\'s Artemis program will successfully land humans on the Moon in 2026. Based on current mission timelines and technical readiness.',
    question: 'Will NASA land humans on the Moon in 2026?',
    outcomes: ['Yes', 'No'],
    category: 'Space',
    icon: <Rocket className="w-5 h-5" />,
    color: 'bg-red-600',
    endTime: 365
  },
  {
    id: 'crypto-etf-approval-2026',
    title: 'Ethereum ETF Approval 2026',
    description: 'Prediction on whether the SEC will approve a spot Ethereum ETF in 2026. Based on regulatory trends and institutional demand for crypto exposure.',
    question: 'Will a spot Ethereum ETF be approved by SEC in 2026?',
    outcomes: ['Yes', 'No'],
    category: 'Finance',
    icon: <TrendingUp className="w-5 h-5" />,
    color: 'bg-blue-600',
    endTime: 365
  },
  {
    id: 'virtual-reality-adoption-2026',
    title: 'VR Headset Adoption 2026',
    description: 'Prediction on whether virtual reality headsets will reach 50 million active users globally in 2026. Including Meta Quest, Apple Vision Pro, and other platforms.',
    question: 'Will VR headsets reach 50M active users in 2026?',
    outcomes: ['Yes', 'No'],
    category: 'Technology',
    icon: <Activity className="w-5 h-5" />,
    color: 'bg-purple-600',
    endTime: 365
  },
  {
    id: 'global-recession-avoidance-2026',
    title: 'Global Recession Avoidance 2026',
    description: 'Prediction on whether the global economy will avoid a technical recession in 2026. Based on GDP growth, employment rates, and economic indicators.',
    question: 'Will the global economy avoid recession in 2026?',
    outcomes: ['Yes', 'No'],
    category: 'Economy',
    icon: <DollarSign className="w-5 h-5" />,
    color: 'bg-green-500',
    endTime: 365
  },
  {
    id: 'gene-therapy-approval-2026',
    title: 'Gene Therapy Breakthrough 2026',
    description: 'Prediction on whether a gene therapy treatment for a major genetic disease will receive FDA approval in 2026. Based on current clinical trial progress.',
    question: 'Will a major gene therapy receive FDA approval in 2026?',
    outcomes: ['Yes', 'No'],
    category: 'Healthcare',
    icon: <Heart className="w-5 h-5" />,
    color: 'bg-pink-500',
    endTime: 365
  },
  {
    id: 'sustainable-aviation-fuel-2026',
    title: 'Sustainable Aviation Fuel 2026',
    description: 'Prediction on whether sustainable aviation fuel will account for more than 5% of total aviation fuel consumption in 2026. Based on production capacity and airline adoption.',
    question: 'Will SAF account for over 5% of aviation fuel in 2026?',
    outcomes: ['Yes', 'No'],
    category: 'Environment',
    icon: <Plane className="w-5 h-5" />,
    color: 'bg-cyan-500',
    endTime: 365
  },
  {
    id: 'quantum-supremacy-practical-2026',
    title: 'Practical Quantum Supremacy 2026',
    description: 'Prediction on whether quantum computers will solve a commercially valuable problem that classical computers cannot solve efficiently in 2026.',
    question: 'Will quantum computers achieve practical supremacy in 2026?',
    outcomes: ['Yes', 'No'],
    category: 'Technology',
    icon: <Cpu className="w-5 h-5" />,
    color: 'bg-indigo-600',
    endTime: 365
  },
  {
    id: 'crypto-banking-integration-2026',
    title: 'Crypto Banking Integration 2026',
    description: 'Prediction on whether major traditional banks will offer direct cryptocurrency trading services to retail customers in 2026. Based on regulatory clarity and market demand.',
    question: 'Will major banks offer crypto trading in 2026?',
    outcomes: ['Yes', 'No'],
    category: 'Finance',
    icon: <Building2 className="w-5 h-5" />,
    color: 'bg-blue-500',
    endTime: 365
  },
  {
    id: 'ocean-cleanup-technology-2026',
    title: 'Ocean Plastic Cleanup 2026',
    description: 'Prediction on whether ocean cleanup technologies will successfully remove more than 1 million tons of plastic from the oceans in 2026. Based on current cleanup efforts and technology scaling.',
    question: 'Will ocean cleanup remove 1M+ tons of plastic in 2026?',
    outcomes: ['Yes', 'No'],
    category: 'Environment',
    icon: <Globe className="w-5 h-5" />,
    color: 'bg-teal-500',
    endTime: 365
  },
  {
    id: 'ai-drug-discovery-2026',
    title: 'AI Drug Discovery Success 2026',
    description: 'Prediction on whether an AI-discovered drug will receive regulatory approval for a major disease in 2026. Based on current AI drug discovery programs and clinical trials.',
    question: 'Will an AI-discovered drug receive approval in 2026?',
    outcomes: ['Yes', 'No'],
    category: 'Healthcare',
    icon: <Microscope className="w-5 h-5" />,
    color: 'bg-green-500',
    endTime: 365
  },
  {
    id: 'space-tourism-commercial-2026',
    title: 'Commercial Space Tourism 2026',
    description: 'Prediction on whether commercial space tourism will have more than 100 paying customers in 2026. Including SpaceX, Blue Origin, and Virgin Galactic flights.',
    question: 'Will space tourism have 100+ paying customers in 2026?',
    outcomes: ['Yes', 'No'],
    category: 'Space',
    icon: <Rocket className="w-5 h-5" />,
    color: 'bg-purple-500',
    endTime: 365
  },
  {
    id: 'blockchain-voting-adoption-2026',
    title: 'Blockchain Voting Adoption 2026',
    description: 'Prediction on whether a major democratic election will use blockchain-based voting systems in 2026. Based on pilot programs and security validation.',
    question: 'Will a major election use blockchain voting in 2026?',
    outcomes: ['Yes', 'No'],
    category: 'Technology',
    icon: <Vote className="w-5 h-5" />,
    color: 'bg-blue-600',
    endTime: 365
  },
  {
    id: 'fusion-energy-breakthrough-2026',
    title: 'Fusion Energy Breakthrough 2026',
    description: 'Prediction on whether a fusion energy reactor will achieve net energy gain for more than 10 minutes continuously in 2026. Based on ITER and private fusion projects.',
    question: 'Will fusion achieve 10+ minutes net energy gain in 2026?',
    outcomes: ['Yes', 'No'],
    category: 'Environment',
    icon: <Zap className="w-5 h-5" />,
    color: 'bg-yellow-500',
    endTime: 365
  },
  {
    id: 'crypto-payment-adoption-2026',
    title: 'Crypto Payment Adoption 2026',
    description: 'Prediction on whether cryptocurrency payments will account for more than 1% of global retail transactions in 2026. Based on merchant adoption and user acceptance.',
    question: 'Will crypto payments exceed 1% of retail transactions in 2026?',
    outcomes: ['Yes', 'No'],
    category: 'Finance',
    icon: <DollarSign className="w-5 h-5" />,
    color: 'bg-orange-500',
    endTime: 365
  },
  {
    id: 'ai-education-revolution-2026',
    title: 'AI Education Revolution 2026',
    description: 'Prediction on whether AI-powered personalized learning will be used by more than 50 million students globally in 2026. Based on current EdTech adoption and AI integration.',
    question: 'Will AI education reach 50M+ students globally in 2026?',
    outcomes: ['Yes', 'No'],
    category: 'Technology',
    icon: <GraduationCap className="w-5 h-5" />,
    color: 'bg-indigo-500',
    endTime: 365
  },
  {
    id: 'sustainable-fashion-revolution-2026',
    title: 'Sustainable Fashion Revolution 2026',
    description: 'Prediction on whether sustainable fashion will account for more than 20% of global clothing sales in 2026. Based on consumer awareness and industry commitments.',
    question: 'Will sustainable fashion exceed 20% of clothing sales in 2026?',
    outcomes: ['Yes', 'No'],
    category: 'Environment',
    icon: <Palette className="w-5 h-5" />,
    color: 'bg-green-500',
    endTime: 365
  }
];

export function MarketTemplates({ 
  onSelectTemplate, 
  selectedCategory 
}: { 
  onSelectTemplate: (template: MarketTemplate) => void;
  selectedCategory?: string | null;
}) {
  const categories = Array.from(new Set(templates.map(t => t.category)));
  const filteredCategories = selectedCategory ? [selectedCategory] : categories;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 neural-text-glow mb-2">
          🔮 Market Templates
        </h2>
        <p className="text-gray-600">
          {selectedCategory ? `Templates for ${selectedCategory}` : 'Select a template to create your prediction market'}
        </p>
      </div>

      {filteredCategories.map(category => (
        <div key={category} className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 neural-text-glow">
            {category}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates
              .filter(template => template.category === category)
              .map(template => (
                <div
                  key={template.id}
                  onClick={() => onSelectTemplate(template)}
                  className="matrix-card-enhanced neural-floating cursor-pointer hover:matrix-glow transition-all duration-200 p-4 space-y-3"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${template.color} text-white matrix-glow`}>
                      {template.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold matrix-text-green neural-text-glow">
                        {template.title}
                      </h4>
                      <p className="text-sm matrix-text-white text-opacity-80">
                        {template.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium matrix-text-white">
                      {template.question}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {template.outcomes.map((outcome, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-black/50 text-green-400 rounded-full matrix-glow border border-green-400/30"
                        >
                          {outcome}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm matrix-text-white text-opacity-70">
                    <span>Duration: {template.endTime} days</span>
                    <span className="matrix-text-green matrix-glow">Use template</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export { templates };
export { templates as default };