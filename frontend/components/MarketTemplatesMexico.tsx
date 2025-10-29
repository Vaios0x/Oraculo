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
  Vote,
  Building,
  Trophy,
  Music,
  Utensils,
  Heart,
  GraduationCap,
  Leaf,
  Smartphone,
  Scale,
  Palette,
  Train,
  Plane,
  Coins,
  BookOpen,
  Shield as Security,
  Home,
  MapPin
} from 'lucide-react';

/**
 * 🇲🇽 MarketTemplatesMexico Component - Templates for Mexico
 * 
 * Component that provides predefined templates to create prediction
 * markets specific to Mexico with cultural, economic, political,
 * sports, social and philosophical themes
 * 
 * @author Blockchain & Web3 Developer Full Stack Senior
 * @version 3.0.0 - México Edition
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
  // 🏛️ MEXICAN POLITICS
  {
    id: 'mx-politics-1',
    title: '2026 Presidential Elections',
    description: 'Prediction on the results of the 2026 Mexican presidential elections, considering the current political landscape and electoral trends.',
    question: 'Will Morena win the 2026 presidential elections?',
    outcomes: ['Yes, Morena wins', 'No, opposition wins'],
    category: 'Politics',
    icon: <Vote className="w-5 h-5" />,
    color: 'bg-red-500',
    endTime: 365
  },
  {
    id: 'mx-politics-2',
    title: 'Electoral Reform 2025',
    description: 'Prediction on the approval of the electoral reform that seeks to modernize the Mexican electoral system.',
    question: 'Will the electoral reform proposed by INE be approved in 2025?',
    outcomes: ['Yes, approved', 'No, not approved'],
    category: 'Politics',
    icon: <Scale className="w-5 h-5" />,
    color: 'bg-blue-500',
    endTime: 180
  },
  {
    id: 'mx-politics-3',
    title: 'AMLO and the 4T',
    description: 'Prediction on the approval ratings of President López Obrador at the end of his term in 2024.',
    question: 'Will AMLO finish his six-year term with approval above 60%?',
    outcomes: ['Yes, above 60%', 'No, below 60%'],
    category: 'Politics',
    icon: <Building className="w-5 h-5" />,
    color: 'bg-orange-500',
    endTime: 90
  },

  // 💰 MEXICAN ECONOMY
  {
    id: 'mx-economy-1',
    title: 'Mexican Peso vs Dollar 2026',
    description: 'Prediction on the strength of the Mexican peso against the US dollar, considering monetary and economic policies.',
    question: 'Will the Mexican peso strengthen to less than 18 pesos per dollar in 2026?',
    outcomes: ['Yes, less than $18', 'No, more than $18'],
    category: 'Economy',
    icon: <DollarSign className="w-5 h-5" />,
    color: 'bg-green-500',
    endTime: 365
  },
  {
    id: 'mx-economy-2',
    title: 'Mexico Inflation 2025',
    description: 'Prediction on inflationary control in Mexico, considering Bank of Mexico policies and external factors.',
    question: 'Will inflation in Mexico be below 4% in 2025?',
    outcomes: ['Yes, below 4%', 'No, above 4%'],
    category: 'Economy',
    icon: <TrendingUp className="w-5 h-5" />,
    color: 'bg-yellow-500',
    endTime: 365
  },
  {
    id: 'mx-economy-3',
    title: 'USMCA and Trade',
    description: 'Prediction on the growth of Mexican exports under USMCA and commercial integration.',
    question: 'Will Mexico increase its exports to 15% of GDP in 2026?',
    outcomes: ['Yes, 15% or more', 'No, less than 15%'],
    category: 'Economy',
    icon: <Globe className="w-5 h-5" />,
    color: 'bg-blue-600',
    endTime: 730
  },

  // ⚽ MEXICAN SPORTS
  {
    id: 'mx-sports-1',
    title: 'Mexican National Team World Cup 2026',
    description: 'Prediction on the performance of the Mexican National Team in the 2026 Soccer World Cup in the United States.',
    question: 'Will Mexico reach the quarterfinals in the 2026 World Cup?',
    outcomes: ['Yes, quarterfinals or better', 'No, round of 16 or less'],
    category: 'Sports',
    icon: <Trophy className="w-5 h-5" />,
    color: 'bg-green-600',
    endTime: 730
  },
  {
    id: 'mx-sports-2',
    title: 'Liga MX Clausura 2025',
    description: 'Prediction on the champion of the 2025 Clausura tournament of Liga MX.',
    question: 'Will América win the 2025 Clausura tournament?',
    outcomes: ['Yes, América wins', 'No, another team'],
    category: 'Sports',
    icon: <Circle className="w-5 h-5" />,
    color: 'bg-yellow-600',
    endTime: 180
  },
  {
    id: 'mx-sports-3',
    title: 'Mexican Boxing 2025',
    description: 'Prediction on the conquest of world titles by Mexican boxers in 2025.',
    question: 'Will a Mexican boxer win a world title in 2025?',
    outcomes: ['Yes, world title', 'No, without title'],
    category: 'Sports',
    icon: <Target className="w-5 h-5" />,
    color: 'bg-red-600',
    endTime: 365
  },

  // 🎭 MEXICAN CULTURE
  {
    id: 'mx-culture-1',
    title: 'Day of the Dead 2025',
    description: 'Prediction on the international recognition of Day of the Dead as world cultural heritage.',
    question: 'Will Day of the Dead be declared Cultural Heritage of Humanity in 2025?',
    outcomes: ['Yes, world heritage', 'No, not declared'],
    category: 'Culture',
    icon: <Calendar className="w-5 h-5" />,
    color: 'bg-purple-500',
    endTime: 365
  },
  {
    id: 'mx-culture-2',
    title: 'Mexican Cinema 2026',
    description: 'Prediction on the success of Mexican cinema at the 2026 Academy Awards.',
    question: 'Will a Mexican film win the Oscar for Best Picture in 2026?',
    outcomes: ['Yes, Oscar won', 'No, without Oscar'],
    category: 'Culture',
    icon: <Palette className="w-5 h-5" />,
    color: 'bg-indigo-500',
    endTime: 730
  },
  {
    id: 'mx-culture-3',
    title: 'Regional Music 2025',
    description: 'Prediction on the dominance of Mexican regional genre on music streaming platforms.',
    question: 'Will Mexican regional genre surpass pop in streams in 2025?',
    outcomes: ['Yes, more streams', 'No, pop dominates'],
    category: 'Culture',
    icon: <Music className="w-5 h-5" />,
    color: 'bg-pink-500',
    endTime: 365
  },

  // 🌮 MEXICAN GASTRONOMY
  {
    id: 'mx-food-1',
    title: 'Tacos al Pastor Worldwide',
    description: 'Prediction on the international recognition of tacos al pastor as the best dish in the world.',
    question: 'Will tacos al pastor be recognized as the best dish in the world in 2025?',
    outcomes: ['Yes, best dish', 'No, another dish'],
    category: 'Gastronomy',
    icon: <Utensils className="w-5 h-5" />,
    color: 'bg-orange-600',
    endTime: 365
  },
  {
    id: 'mx-food-2',
    title: 'Mexican Michelin Restaurants',
    description: 'Prediction on the growth of Mexican restaurants with Michelin recognition.',
    question: 'Will Mexico have 10 restaurants with Michelin stars in 2026?',
    outcomes: ['Yes, 10 or more', 'No, less than 10'],
    category: 'Gastronomy',
    icon: <Target className="w-5 h-5" />,
    color: 'bg-yellow-500',
    endTime: 730
  },

  // 🏥 HEALTH AND SOCIETY
  {
    id: 'mx-health-1',
    title: 'Health System 2025',
    description: 'Prediction on universal coverage of the Mexican health system through IMSS.',
    question: 'Will IMSS have universal coverage in 2025?',
    outcomes: ['Yes, universal coverage', 'No, partial coverage'],
    category: 'Health',
    icon: <Heart className="w-5 h-5" />,
    color: 'bg-green-500',
    endTime: 365
  },
  {
    id: 'mx-health-2',
    title: 'COVID-19 Vaccination',
    description: 'Prediction on COVID-19 vaccination coverage in the Mexican population.',
    question: 'Will Mexico reach 90% COVID-19 vaccination in 2025?',
    outcomes: ['Yes, 90% or more', 'No, less than 90%'],
    category: 'Health',
    icon: <Shield className="w-5 h-5" />,
    color: 'bg-blue-500',
    endTime: 180
  },

  // 🎓 MEXICAN EDUCATION
  {
    id: 'mx-education-1',
    title: 'Digital Education 2026',
    description: 'Prediction on the digitization of the Mexican education system and access to educational technology.',
    question: 'Will 80% of Mexican students have access to digital education in 2026?',
    outcomes: ['Yes, 80% or more', 'No, less than 80%'],
    category: 'Education',
    icon: <GraduationCap className="w-5 h-5" />,
    color: 'bg-indigo-600',
    endTime: 730
  },
  {
    id: 'mx-education-2',
    title: 'Public Universities',
    description: 'Prediction on the budget sufficiency of Mexican public universities.',
    question: 'Will public universities have sufficient budget in 2025?',
    outcomes: ['Yes, sufficient budget', 'No, insufficient budget'],
    category: 'Education',
    icon: <Building className="w-5 h-5" />,
    color: 'bg-purple-600',
    endTime: 365
  },

  // 🌍 ENVIRONMENT
  {
    id: 'mx-environment-1',
    title: 'Renewable Energy 2026',
    description: 'Prediction on Mexico\'s energy transition to renewable sources.',
    question: 'Will Mexico generate 50% renewable energy in 2026?',
    outcomes: ['Yes, 50% or more', 'No, less than 50%'],
    category: 'Environment',
    icon: <Leaf className="w-5 h-5" />,
    color: 'bg-green-600',
    endTime: 730
  },
  {
    id: 'mx-environment-2',
    title: 'Mexico City Pollution',
    description: 'Prediction on the improvement of air quality in Mexico City.',
    question: 'Will Mexico City have less than 50 environmental contingency days in 2025?',
    outcomes: ['Yes, less than 50 days', 'No, 50 days or more'],
    category: 'Environment',
    icon: <Activity className="w-5 h-5" />,
    color: 'bg-gray-500',
    endTime: 365
  },

  // 🚀 MEXICAN TECHNOLOGY
  {
    id: 'mx-tech-1',
    title: 'Mexican Startups 2025',
    description: 'Prediction on the growth of the Mexican startup ecosystem and the emergence of unicorns.',
    question: 'Will Mexico have 5 tech unicorns in 2025?',
    outcomes: ['Yes, 5 or more unicorns', 'No, less than 5'],
    category: 'Technology',
    icon: <Zap className="w-5 h-5" />,
    color: 'bg-purple-500',
    endTime: 365
  },
  {
    id: 'mx-tech-2',
    title: '5G in Mexico 2026',
    description: 'Prediction on the implementation of the 5G network in Mexican territory.',
    question: 'Will 70% of Mexico have 5G coverage in 2026?',
    outcomes: ['Yes, 70% or more', 'No, less than 70%'],
    category: 'Technology',
    icon: <Smartphone className="w-5 h-5" />,
    color: 'bg-blue-500',
    endTime: 730
  },

  // 🏛️ INSTITUTIONS
  {
    id: 'mx-institutions-1',
    title: 'Judicial Reform 2025',
    description: 'Prediction on the approval of the reform to the Mexican judicial system.',
    question: 'Will the judicial reform proposed by SCJN be approved in 2025?',
    outcomes: ['Yes, approved', 'No, not approved'],
    category: 'Institutions',
    icon: <Scale className="w-5 h-5" />,
    color: 'bg-gray-600',
    endTime: 365
  },
  {
    id: 'mx-institutions-2',
    title: 'Government Transparency',
    description: 'Prediction on the improvement of Mexican government transparency indexes.',
    question: 'Will Mexico improve its transparency ranking to top 50 worldwide in 2026?',
    outcomes: ['Yes, top 50', 'No, outside top 50'],
    category: 'Institutions',
    icon: <Target className="w-5 h-5" />,
    color: 'bg-yellow-600',
    endTime: 730
  },

  // 🎭 ART AND ENTERTAINMENT
  {
    id: 'mx-art-1',
    title: 'International Mexican Art',
    description: 'Prediction on the international recognition of contemporary Mexican art.',
    question: 'Will a Mexican artist win the Turner Prize in 2025?',
    outcomes: ['Yes, Turner Prize', 'No, without prize'],
    category: 'Art',
    icon: <Palette className="w-5 h-5" />,
    color: 'bg-pink-600',
    endTime: 365
  },
  {
    id: 'mx-art-2',
    title: 'National Theater 2026',
    description: 'Prediction on attendance at the National Theater and the popularity of theater in Mexico.',
    question: 'Will the National Theater have 1 million spectators in 2026?',
    outcomes: ['Yes, 1M or more', 'No, less than 1M'],
    category: 'Art',
    icon: <Circle className="w-5 h-5" />,
    color: 'bg-red-500',
    endTime: 730
  },

  // 🏘️ URBAN DEVELOPMENT
  {
    id: 'mx-urban-1',
    title: 'Maya Train 2025',
    description: 'Prediction on the completion and full operation of the Maya Train project.',
    question: 'Will the Maya Train be 100% operational in 2025?',
    outcomes: ['Yes, 100% operational', 'No, partially'],
    category: 'Development',
    icon: <Train className="w-5 h-5" />,
    color: 'bg-green-500',
    endTime: 365
  },
  {
    id: 'mx-urban-2',
    title: 'Social Housing 2026',
    description: 'Prediction on the construction of social housing and access to housing in Mexico.',
    question: 'Will Mexico build 500,000 social housing units in 2026?',
    outcomes: ['Yes, 500K or more', 'No, less than 500K'],
    category: 'Development',
    icon: <Home className="w-5 h-5" />,
    color: 'bg-blue-600',
    endTime: 730
  },

  // 🌮 MEXICAN TOURISM
  {
    id: 'mx-tourism-1',
    title: 'International Tourism 2025',
    description: 'Prediction on the recovery of international tourism in Mexico post-pandemic.',
    question: 'Will Mexico receive 50 million international tourists in 2025?',
    outcomes: ['Yes, 50M or more', 'No, less than 50M'],
    category: 'Tourism',
    icon: <Plane className="w-5 h-5" />,
    color: 'bg-cyan-500',
    endTime: 365
  },
  {
    id: 'mx-tourism-2',
    title: 'Magic Towns 2026',
    description: 'Prediction on the expansion of the Magic Towns program in Mexico.',
    question: 'Will Mexico have 200 Magic Towns in 2026?',
    outcomes: ['Yes, 200 or more', 'No, less than 200'],
    category: 'Tourism',
    icon: <MapPin className="w-5 h-5" />,
    color: 'bg-orange-500',
    endTime: 730
  },

  // 💰 MEXICAN CRYPTOCURRENCIES
  {
    id: 'mx-crypto-1',
    title: 'Bitcoin Legal Mexico 2025',
    description: 'Prediction on the legal adoption of Bitcoin as legal tender in Mexico.',
    question: 'Will Bitcoin be recognized as legal tender in Mexico in 2025?',
    outcomes: ['Yes, legal tender', 'No, without recognition'],
    category: 'Cryptocurrencies',
    icon: <Bitcoin className="w-5 h-5" />,
    color: 'bg-orange-600',
    endTime: 365
  },
  {
    id: 'mx-crypto-2',
    title: 'CBDC Mexico 2026',
    description: 'Prediction on the launch of the Mexican digital peso by the Bank of Mexico.',
    question: 'Will Mexico launch its central bank digital currency (CBDC) in 2026?',
    outcomes: ['Yes, CBDC launched', 'No, without CBDC'],
    category: 'Cryptocurrencies',
    icon: <Coins className="w-5 h-5" />,
    color: 'bg-blue-500',
    endTime: 730
  },

  // 🎓 MEXICAN PHILOSOPHY
  {
    id: 'mx-philosophy-1',
    title: 'Latin American Philosophy 2025',
    description: 'Prediction on the international recognition of Mexican and Latin American philosophy.',
    question: 'Will a Mexican philosopher win the Nobel Prize in Literature in 2025?',
    outcomes: ['Yes, Nobel won', 'No, without Nobel'],
    category: 'Philosophy',
    icon: <BookOpen className="w-5 h-5" />,
    color: 'bg-purple-600',
    endTime: 365
  },
  {
    id: 'mx-philosophy-2',
    title: 'Decolonial Thought 2026',
    description: 'Prediction on the inclusion of decolonial thought in Mexican higher education.',
    question: 'Will decolonial thought be included in the Mexican university curriculum in 2026?',
    outcomes: ['Yes, included', 'No, without inclusion'],
    category: 'Philosophy',
    icon: <Globe className="w-5 h-5" />,
    color: 'bg-green-600',
    endTime: 730
  },

  // 🏛️ PUBLIC SECURITY
  {
    id: 'mx-security-1',
    title: 'Citizen Security 2025',
    description: 'Prediction on the improvement of citizen security indexes and reduction of homicides.',
    question: 'Will Mexico reduce homicides by 20% during 2025?',
    outcomes: ['Yes, 20% less', 'No, without reduction'],
    category: 'Security',
    icon: <Security className="w-5 h-5" />,
    color: 'bg-red-600',
    endTime: 365
  },
  {
    id: 'mx-security-2',
    title: 'National Guard 2026',
    description: 'Prediction on the growth and consolidation of the Mexican National Guard.',
    question: 'Will the National Guard have 200,000 members in 2026?',
    outcomes: ['Yes, 200K members', 'No, fewer members'],
    category: 'Security',
    icon: <Shield className="w-5 h-5" />,
    color: 'bg-blue-600',
    endTime: 730
  },

  // 🌮 MEXICAN MIGRATION
  {
    id: 'mx-migration-1',
    title: 'Mexico Remittances 2025',
    description: 'Prediction on the growth of remittances sent by Mexicans abroad.',
    question: 'Will remittances to Mexico exceed 60 billion dollars in 2025?',
    outcomes: ['Yes, 60B or more', 'No, less than 60B'],
    category: 'Migration',
    icon: <DollarSign className="w-5 h-5" />,
    color: 'bg-green-500',
    endTime: 365
  },
  {
    id: 'mx-migration-2',
    title: 'Return of Migrants 2026',
    description: 'Prediction on the return of Mexican migrants from the United States and other countries.',
    question: 'Will more than 100,000 Mexicans return from abroad in 2026?',
    outcomes: ['Yes, 100K or more', 'No, less than 100K'],
    category: 'Migration',
    icon: <Home className="w-5 h-5" />,
    color: 'bg-orange-500',
    endTime: 730
  }
];

interface MarketTemplatesMexicoProps {
  onSelectTemplate: (template: MarketTemplate) => void;
}

export function MarketTemplatesMexico({ 
  onSelectTemplate, 
  selectedCategory 
}: MarketTemplatesMexicoProps & { selectedCategory?: string | null }) {
  const categories = Array.from(new Set(templates.map(t => t.category)));
  const filteredCategories = selectedCategory ? [selectedCategory] : categories;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 neural-text-glow mb-4">
          🇲🇽 Prediction Markets for Mexico
        </h2>
        <p className="text-gray-600 text-lg">
          {selectedCategory ? `Templates for ${selectedCategory} - Mexican context` : 'Specific templates for the Mexican context with cultural, economic, political and social themes'}
        </p>
        {!selectedCategory && (
          <div className="mt-4 text-sm text-gray-500">
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full mr-2">Politics</span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full mr-2">Economy</span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full mr-2">Sports</span>
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">Culture</span>
          </div>
        )}
      </div>

      {/* Categories */}
      {filteredCategories.map(category => (
        <div key={category} className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 neural-text-glow flex items-center">
            {category === 'Politics' && <Vote className="w-5 h-5 mr-2 text-red-500" />}
            {category === 'Economy' && <DollarSign className="w-5 h-5 mr-2 text-green-500" />}
            {category === 'Sports' && <Trophy className="w-5 h-5 mr-2 text-blue-500" />}
            {category === 'Culture' && <Music className="w-5 h-5 mr-2 text-purple-500" />}
            {category === 'Gastronomy' && <Utensils className="w-5 h-5 mr-2 text-orange-500" />}
            {category === 'Health' && <Heart className="w-5 h-5 mr-2 text-pink-500" />}
            {category === 'Education' && <GraduationCap className="w-5 h-5 mr-2 text-indigo-500" />}
            {category === 'Environment' && <Leaf className="w-5 h-5 mr-2 text-green-600" />}
            {category === 'Technology' && <Zap className="w-5 h-5 mr-2 text-purple-500" />}
            {category === 'Institutions' && <Scale className="w-5 h-5 mr-2 text-gray-500" />}
            {category === 'Art' && <Palette className="w-5 h-5 mr-2 text-pink-500" />}
            {category === 'Development' && <Building className="w-5 h-5 mr-2 text-blue-500" />}
            {category === 'Tourism' && <Plane className="w-5 h-5 mr-2 text-cyan-500" />}
            {category === 'Cryptocurrencies' && <Bitcoin className="w-5 h-5 mr-2 text-orange-500" />}
            {category === 'Philosophy' && <BookOpen className="w-5 h-5 mr-2 text-purple-500" />}
            {category === 'Security' && <Shield className="w-5 h-5 mr-2 text-red-500" />}
            {category === 'Migration' && <Home className="w-5 h-5 mr-2 text-orange-500" />}
            {category}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates
              .filter(template => template.category === category)
              .map(template => (
                <div
                  key={template.id}
                  onClick={() => onSelectTemplate(template)}
                  className="matrix-card-enhanced neural-floating cursor-pointer hover:matrix-glow transition-all duration-300 group"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 ${template.color} rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform matrix-glow`}>
                        {template.icon}
                      </div>
                      <span className="text-xs font-medium matrix-text-white bg-black/50 px-2 py-1 rounded matrix-glow">
                        {template.endTime} days
                      </span>
                    </div>
                    
                    <h4 className="text-lg font-semibold matrix-text-green neural-text-glow mb-2 group-hover:text-green-400 transition-colors">
                      {template.title}
                    </h4>
                    
                    <p className="matrix-text-white text-opacity-80 text-sm mb-4 line-clamp-3">
                      {template.description}
                    </p>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium matrix-text-white">
                        {template.question}
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        {template.outcomes.map((outcome, index) => (
                          <span
                            key={index}
                            className="text-xs bg-black/50 text-green-400 px-2 py-1 rounded-full matrix-glow border border-green-400/30"
                          >
                            {outcome}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs matrix-text-white text-opacity-70">
                        {template.category}
                      </span>
                      <div className="flex items-center matrix-text-green group-hover:text-green-400 matrix-glow">
                        <span className="text-sm font-medium">Create Market</span>
                        <Zap className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export { MarketTemplatesMexico as default };
export { templates };