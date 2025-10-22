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
  Target
} from 'lucide-react';

/**
 * 🔮 MarketTemplates Component - Plantillas para crear mercados
 * 
 * Componente que proporciona plantillas predefinidas para crear mercados
 * de predicciones con ejemplos populares y categorías actualizadas para 2026
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
  endTime: number; // días desde hoy
}

const templates: MarketTemplate[] = [
  // Criptomonedas - Datos actualizados para 2026
  {
    id: 'bitcoin-200k-2026',
    title: 'Bitcoin Price Prediction 2026',
    description: 'Predicción sobre si Bitcoin alcanzará los $200,000 USD para finales de 2026. Basado en análisis técnico, adopción institucional y tendencias del mercado cripto.',
    question: '¿Llegará Bitcoin a $200,000 USD para finales de 2026?',
    outcomes: ['Sí', 'No'],
    category: 'Criptomonedas',
    icon: <Bitcoin className="w-5 h-5" />,
    color: 'bg-orange-500',
    endTime: 365
  },
  {
    id: 'ethereum-15k-2026',
    title: 'Ethereum Price Prediction 2026',
    description: 'Predicción sobre si Ethereum alcanzará los $15,000 USD para finales de 2026. Considerando las mejoras en escalabilidad, adopción DeFi y actualizaciones de red.',
    question: '¿Llegará Ethereum a $15,000 USD para finales de 2026?',
    outcomes: ['Sí', 'No'],
    category: 'Criptomonedas',
    icon: <Circle className="w-5 h-5" />,
    color: 'bg-blue-500',
    endTime: 365
  },
  {
    id: 'solana-500-2026',
    title: 'Solana Price Prediction 2026',
    description: 'Predicción sobre si Solana alcanzará los $500 USD para finales de 2026. Basado en el crecimiento del ecosistema, adopción de dApps y mejoras técnicas de la red.',
    question: '¿Llegará Solana a $500 USD para finales de 2026?',
    outcomes: ['Sí', 'No'],
    category: 'Criptomonedas',
    icon: <Zap className="w-5 h-5" />,
    color: 'bg-purple-500',
    endTime: 365
  },

  // Tecnología y IA - 2026
  {
    id: 'ai-gpt6-2026',
    title: 'GPT-6 Release 2026',
    description: 'Predicción sobre el lanzamiento oficial de GPT-6 por OpenAI en 2026. Considerando el ritmo de desarrollo actual y los anuncios de la empresa.',
    question: '¿Será lanzado GPT-6 por OpenAI en 2026?',
    outcomes: ['Sí', 'No'],
    category: 'Tecnología',
    icon: <Activity className="w-5 h-5" />,
    color: 'bg-green-500',
    endTime: 365
  },
  {
    id: 'quantum-computing-2026',
    title: 'Quantum Computing Breakthrough 2026',
    description: 'Predicción sobre si habrá un avance significativo en computación cuántica en 2026. Considerando desarrollos en IBM, Google, Microsoft y otras empresas líderes.',
    question: '¿Habrá un avance significativo en computación cuántica en 2026?',
    outcomes: ['Sí', 'No'],
    category: 'Tecnología',
    icon: <Zap className="w-5 h-5" />,
    color: 'bg-indigo-500',
    endTime: 365
  },
  {
    id: 'tesla-robot-2026',
    title: 'Tesla Robot Production 2026',
    description: 'Predicción sobre si Tesla comenzará la producción masiva de robots humanoides en 2026. Basado en los anuncios de Elon Musk y el desarrollo del Tesla Bot.',
    question: '¿Tesla comenzará la producción masiva de robots en 2026?',
    outcomes: ['Sí', 'No'],
    category: 'Tecnología',
    icon: <Target className="w-5 h-5" />,
    color: 'bg-red-500',
    endTime: 365
  },

  // DeFi y Finanzas - 2026
  {
    id: 'defi-tvl-500b-2026',
    title: 'DeFi TVL Milestone 2026',
    description: 'Predicción sobre si el TVL (Total Value Locked) total de DeFi superará los $500 mil millones en 2026. Considerando el crecimiento actual y la adopción institucional.',
    question: '¿Superará el TVL total de DeFi los $500B en 2026?',
    outcomes: ['Sí', 'No'],
    category: 'DeFi',
    icon: <DollarSign className="w-5 h-5" />,
    color: 'bg-green-500',
    endTime: 365
  },
  {
    id: 'fed-rate-cut-2026',
    title: 'Federal Reserve Rate Cut 2026',
    description: 'Predicción sobre si la Reserva Federal de Estados Unidos recortará las tasas de interés en 2026. Basado en indicadores económicos y políticas monetarias.',
    question: '¿La Fed recortará las tasas de interés en 2026?',
    outcomes: ['Sí', 'No'],
    category: 'Finanzas',
    icon: <TrendingUp className="w-5 h-5" />,
    color: 'bg-yellow-500',
    endTime: 365
  },

  // Clima y Medio Ambiente - 2026
  {
    id: 'climate-goals-2026',
    title: 'Climate Goals 2026',
    description: 'Predicción sobre objetivos climáticos para 2026',
    question: '¿Se cumplirán los objetivos climáticos globales en 2026?',
    outcomes: ['Sí', 'No'],
    category: 'Medio Ambiente',
    icon: <Globe className="w-5 h-5" />,
    color: 'bg-emerald-500',
    endTime: 365
  },
  {
    id: 'renewable-energy-2026',
    title: 'Renewable Energy Milestone 2026',
    description: 'Predicción sobre energía renovable en 2026',
    question: '¿Superará la energía renovable el 50% de la generación global en 2026?',
    outcomes: ['Sí', 'No'],
    category: 'Medio Ambiente',
    icon: <Zap className="w-5 h-5" />,
    color: 'bg-green-500',
    endTime: 365
  },

  // Deportes y Entretenimiento - 2026
  {
    id: 'world-cup-2026',
    title: 'World Cup 2026 Winner',
    description: 'Predicción sobre el ganador del Mundial 2026',
    question: '¿Ganará un equipo europeo el Mundial 2026?',
    outcomes: ['Sí', 'No'],
    category: 'Deportes',
    icon: <Target className="w-5 h-5" />,
    color: 'bg-blue-500',
    endTime: 365
  },
  {
    id: 'olympics-2026',
    title: 'Olympics 2026 Success',
    description: 'Predicción sobre el éxito de los Juegos Olímpicos 2026',
    question: '¿Serán exitosos los Juegos Olímpicos de Invierno 2026?',
    outcomes: ['Sí', 'No'],
    category: 'Deportes',
    icon: <Activity className="w-5 h-5" />,
    color: 'bg-cyan-500',
    endTime: 365
  },

  // Política y Economía - 2026
  {
    id: 'us-election-2026',
    title: 'US Midterm Elections 2026',
    description: 'Predicción sobre las elecciones de medio término en EE.UU.',
    question: '¿Ganará el partido republicano las elecciones de medio término 2026?',
    outcomes: ['Sí', 'No'],
    category: 'Política',
    icon: <Shield className="w-5 h-5" />,
    color: 'bg-red-500',
    endTime: 365
  },
  {
    id: 'global-recession-2026',
    title: 'Global Recession 2026',
    description: 'Predicción sobre recesión global en 2026',
    question: '¿Habrá una recesión global en 2026?',
    outcomes: ['Sí', 'No'],
    category: 'Economía',
    icon: <TrendingUp className="w-5 h-5" />,
    color: 'bg-yellow-500',
    endTime: 365
  }
];

export function MarketTemplates({ onSelectTemplate }: { onSelectTemplate: (template: MarketTemplate) => void }) {
  const categories = Array.from(new Set(templates.map(t => t.category)));

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 neural-text-glow mb-2">
          🔮 Plantillas de Mercados
        </h2>
        <p className="text-gray-600">
          Selecciona una plantilla para crear tu mercado de predicciones
        </p>
      </div>

      {categories.map(category => (
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
                  className="neural-card neural-floating cursor-pointer hover:scale-105 transition-all duration-200 p-4 space-y-3"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${template.color} text-white`}>
                      {template.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 neural-text-glow">
                        {template.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {template.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">
                      {template.question}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {template.outcomes.map((outcome, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                        >
                          {outcome}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Duración: {template.endTime} días</span>
                    <span className="neural-status">Usar plantilla</span>
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