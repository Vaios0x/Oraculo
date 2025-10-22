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
 * 🇲🇽 MarketTemplatesMexico Component - Plantillas para México
 * 
 * Componente que proporciona plantillas predefinidas para crear mercados
 * de predicciones específicos para México con temas culturales, económicos,
 * políticos, deportivos, sociales y filosóficos
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
  endTime: number; // días desde hoy
}

const templates: MarketTemplate[] = [
  // 🏛️ POLÍTICA MEXICANA
  {
    id: 'mx-politics-1',
    title: 'Elecciones Presidenciales 2026',
    description: 'Predicción sobre el resultado de las elecciones presidenciales mexicanas de 2026, considerando el panorama político actual y las tendencias electorales.',
    question: '¿Ganará Morena las elecciones presidenciales de 2026?',
    outcomes: ['Sí, Morena gana', 'No, gana oposición'],
    category: 'Política',
    icon: <Vote className="w-5 h-5" />,
    color: 'bg-red-500',
    endTime: 365
  },
  {
    id: 'mx-politics-2',
    title: 'Reforma Electoral 2025',
    description: 'Predicción sobre la aprobación de la reforma electoral que busca modernizar el sistema electoral mexicano.',
    question: '¿Se aprobará la reforma electoral propuesta por el INE en 2025?',
    outcomes: ['Sí se aprueba', 'No se aprueba'],
    category: 'Política',
    icon: <Scale className="w-5 h-5" />,
    color: 'bg-blue-500',
    endTime: 180
  },
  {
    id: 'mx-politics-3',
    title: 'AMLO y el 4T',
    description: 'Predicción sobre los niveles de aprobación del presidente López Obrador al final de su mandato en 2024.',
    question: '¿Terminará AMLO su sexenio con aprobación mayor al 60%?',
    outcomes: ['Sí, mayor 60%', 'No, menor 60%'],
    category: 'Política',
    icon: <Building className="w-5 h-5" />,
    color: 'bg-orange-500',
    endTime: 90
  },

  // 💰 ECONOMÍA MEXICANA
  {
    id: 'mx-economy-1',
    title: 'Peso Mexicano vs Dólar 2026',
    description: 'Predicción sobre la fortaleza del peso mexicano frente al dólar estadounidense, considerando políticas monetarias y económicas.',
    question: '¿El peso mexicano se fortalecerá a menos de 18 pesos por dólar en 2026?',
    outcomes: ['Sí, menos de $18', 'No, más de $18'],
    category: 'Economía',
    icon: <DollarSign className="w-5 h-5" />,
    color: 'bg-green-500',
    endTime: 365
  },
  {
    id: 'mx-economy-2',
    title: 'Inflación México 2025',
    description: 'Predicción sobre el control inflacionario en México, considerando las políticas del Banco de México y factores externos.',
    question: '¿La inflación en México será menor al 4% en 2025?',
    outcomes: ['Sí, menor 4%', 'No, mayor 4%'],
    category: 'Economía',
    icon: <TrendingUp className="w-5 h-5" />,
    color: 'bg-yellow-500',
    endTime: 365
  },
  {
    id: 'mx-economy-3',
    title: 'T-MEC y Comercio',
    description: 'Predicción sobre el crecimiento de las exportaciones mexicanas bajo el T-MEC y la integración comercial.',
    question: '¿México aumentará sus exportaciones al 15% del PIB en 2026?',
    outcomes: ['Sí, 15% o más', 'No, menos 15%'],
    category: 'Economía',
    icon: <Globe className="w-5 h-5" />,
    color: 'bg-blue-600',
    endTime: 730
  },

  // ⚽ DEPORTES MEXICANOS
  {
    id: 'mx-sports-1',
    title: 'Selección Mexicana Mundial 2026',
    description: 'Predicción sobre el desempeño de la Selección Mexicana en el Mundial de Fútbol 2026 en Estados Unidos.',
    question: '¿México llegará a cuartos de final en el Mundial 2026?',
    outcomes: ['Sí, cuartos o más', 'No, octavos o menos'],
    category: 'Deportes',
    icon: <Trophy className="w-5 h-5" />,
    color: 'bg-green-600',
    endTime: 730
  },
  {
    id: 'mx-sports-2',
    title: 'Liga MX Clausura 2025',
    description: 'Predicción sobre el campeón del torneo Clausura 2025 de la Liga MX.',
    question: '¿América ganará el torneo Clausura 2025?',
    outcomes: ['Sí, América gana', 'No, otro equipo'],
    category: 'Deportes',
    icon: <Circle className="w-5 h-5" />,
    color: 'bg-yellow-600',
    endTime: 180
  },
  {
    id: 'mx-sports-3',
    title: 'Boxeo Mexicano 2025',
    description: 'Predicción sobre la conquista de títulos mundiales por boxeadores mexicanos en 2025.',
    question: '¿Un boxeador mexicano ganará un título mundial en 2025?',
    outcomes: ['Sí, título mundial', 'No, sin título'],
    category: 'Deportes',
    icon: <Target className="w-5 h-5" />,
    color: 'bg-red-600',
    endTime: 365
  },

  // 🎭 CULTURA MEXICANA
  {
    id: 'mx-culture-1',
    title: 'Día de Muertos 2025',
    description: 'Predicción sobre el reconocimiento internacional del Día de Muertos como patrimonio cultural mundial.',
    question: '¿El Día de Muertos será declarado Patrimonio Cultural de la Humanidad en 2025?',
    outcomes: ['Sí, patrimonio mundial', 'No, no se declara'],
    category: 'Cultura',
    icon: <Calendar className="w-5 h-5" />,
    color: 'bg-purple-500',
    endTime: 365
  },
  {
    id: 'mx-culture-2',
    title: 'Cine Mexicano 2026',
    description: 'Predicción sobre el éxito del cine mexicano en los premios Oscar de 2026.',
    question: '¿Una película mexicana ganará el Oscar a Mejor Película en 2026?',
    outcomes: ['Sí, Oscar ganado', 'No, sin Oscar'],
    category: 'Cultura',
    icon: <Palette className="w-5 h-5" />,
    color: 'bg-indigo-500',
    endTime: 730
  },
  {
    id: 'mx-culture-3',
    title: 'Música Regional 2025',
    description: 'Predicción sobre el dominio del género regional mexicano en las plataformas de streaming musical.',
    question: '¿El género regional mexicano superará al pop en streams en 2025?',
    outcomes: ['Sí, más streams', 'No, pop domina'],
    category: 'Cultura',
    icon: <Music className="w-5 h-5" />,
    color: 'bg-pink-500',
    endTime: 365
  },

  // 🌮 GASTRONOMÍA MEXICANA
  {
    id: 'mx-food-1',
    title: 'Tacos al Pastor Mundial',
    description: 'Predicción sobre el reconocimiento internacional de los tacos al pastor como el mejor platillo mundial.',
    question: '¿Los tacos al pastor serán reconocidos como el mejor platillo del mundo en 2025?',
    outcomes: ['Sí, mejor platillo', 'No, otro platillo'],
    category: 'Gastronomía',
    icon: <Utensils className="w-5 h-5" />,
    color: 'bg-orange-600',
    endTime: 365
  },
  {
    id: 'mx-food-2',
    title: 'Restaurantes Mexicanos Michelin',
    description: 'Predicción sobre el crecimiento de restaurantes mexicanos con reconocimiento Michelin.',
    question: '¿México tendrá 10 restaurantes con estrella Michelin en 2026?',
    outcomes: ['Sí, 10 o más', 'No, menos de 10'],
    category: 'Gastronomía',
    icon: <Target className="w-5 h-5" />,
    color: 'bg-yellow-500',
    endTime: 730
  },

  // 🏥 SALUD Y SOCIEDAD
  {
    id: 'mx-health-1',
    title: 'Sistema de Salud 2025',
    description: 'Predicción sobre la cobertura universal del sistema de salud mexicano a través del IMSS.',
    question: '¿El IMSS tendrá cobertura universal en 2025?',
    outcomes: ['Sí, cobertura universal', 'No, cobertura parcial'],
    category: 'Salud',
    icon: <Heart className="w-5 h-5" />,
    color: 'bg-green-500',
    endTime: 365
  },
  {
    id: 'mx-health-2',
    title: 'Vacunación COVID-19',
    description: 'Predicción sobre la cobertura de vacunación contra COVID-19 en la población mexicana.',
    question: '¿México alcanzará 90% de vacunación COVID-19 en 2025?',
    outcomes: ['Sí, 90% o más', 'No, menos 90%'],
    category: 'Salud',
    icon: <Shield className="w-5 h-5" />,
    color: 'bg-blue-500',
    endTime: 180
  },

  // 🎓 EDUCACIÓN MEXICANA
  {
    id: 'mx-education-1',
    title: 'Educación Digital 2026',
    description: 'Predicción sobre la digitalización del sistema educativo mexicano y acceso a tecnología educativa.',
    question: '¿El 80% de estudiantes mexicanos tendrá acceso a educación digital en 2026?',
    outcomes: ['Sí, 80% o más', 'No, menos 80%'],
    category: 'Educación',
    icon: <GraduationCap className="w-5 h-5" />,
    color: 'bg-indigo-600',
    endTime: 730
  },
  {
    id: 'mx-education-2',
    title: 'Universidades Públicas',
    description: 'Predicción sobre la suficiencia presupuestal de las universidades públicas mexicanas.',
    question: '¿Las universidades públicas tendrán presupuesto suficiente en 2025?',
    outcomes: ['Sí, presupuesto suficiente', 'No, presupuesto insuficiente'],
    category: 'Educación',
    icon: <Building className="w-5 h-5" />,
    color: 'bg-purple-600',
    endTime: 365
  },

  // 🌍 MEDIO AMBIENTE
  {
    id: 'mx-environment-1',
    title: 'Energías Renovables 2026',
    description: 'Predicción sobre la transición energética mexicana hacia fuentes renovables.',
    question: '¿México generará 50% de energía renovable en 2026?',
    outcomes: ['Sí, 50% o más', 'No, menos 50%'],
    category: 'Medio Ambiente',
    icon: <Leaf className="w-5 h-5" />,
    color: 'bg-green-600',
    endTime: 730
  },
  {
    id: 'mx-environment-2',
    title: 'Contaminación CDMX',
    description: 'Predicción sobre la mejora de la calidad del aire en la Ciudad de México.',
    question: '¿La Ciudad de México tendrá menos de 50 días de contingencia ambiental en 2025?',
    outcomes: ['Sí, menos 50 días', 'No, 50 días o más'],
    category: 'Medio Ambiente',
    icon: <Activity className="w-5 h-5" />,
    color: 'bg-gray-500',
    endTime: 365
  },

  // 🚀 TECNOLOGÍA MEXICANA
  {
    id: 'mx-tech-1',
    title: 'Startups Mexicanas 2025',
    description: 'Predicción sobre el crecimiento del ecosistema de startups mexicanas y la aparición de unicornios.',
    question: '¿México tendrá 5 unicornios tecnológicos en 2025?',
    outcomes: ['Sí, 5 o más unicornios', 'No, menos de 5'],
    category: 'Tecnología',
    icon: <Zap className="w-5 h-5" />,
    color: 'bg-purple-500',
    endTime: 365
  },
  {
    id: 'mx-tech-2',
    title: '5G en México 2026',
    description: 'Predicción sobre la implementación de la red 5G en territorio mexicano.',
    question: '¿El 70% de México tendrá cobertura 5G en 2026?',
    outcomes: ['Sí, 70% o más', 'No, menos 70%'],
    category: 'Tecnología',
    icon: <Smartphone className="w-5 h-5" />,
    color: 'bg-blue-500',
    endTime: 730
  },

  // 🏛️ INSTITUCIONES
  {
    id: 'mx-institutions-1',
    title: 'Reforma Judicial 2025',
    description: 'Predicción sobre la aprobación de la reforma al sistema judicial mexicano.',
    question: '¿Se aprobará la reforma judicial propuesta por la SCJN en 2025?',
    outcomes: ['Sí se aprueba', 'No se aprueba'],
    category: 'Instituciones',
    icon: <Scale className="w-5 h-5" />,
    color: 'bg-gray-600',
    endTime: 365
  },
  {
    id: 'mx-institutions-2',
    title: 'Transparencia Gubernamental',
    description: 'Predicción sobre la mejora en los índices de transparencia gubernamental mexicana.',
    question: '¿México mejorará su ranking de transparencia a top 50 mundial en 2026?',
    outcomes: ['Sí, top 50', 'No, fuera top 50'],
    category: 'Instituciones',
    icon: <Target className="w-5 h-5" />,
    color: 'bg-yellow-600',
    endTime: 730
  },

  // 🎭 ARTE Y ENTRETENIMIENTO
  {
    id: 'mx-art-1',
    title: 'Arte Mexicano Internacional',
    description: 'Predicción sobre el reconocimiento internacional del arte contemporáneo mexicano.',
    question: '¿Un artista mexicano ganará el Premio Turner en 2025?',
    outcomes: ['Sí, Premio Turner', 'No, sin premio'],
    category: 'Arte',
    icon: <Palette className="w-5 h-5" />,
    color: 'bg-pink-600',
    endTime: 365
  },
  {
    id: 'mx-art-2',
    title: 'Teatro Nacional 2026',
    description: 'Predicción sobre la asistencia al Teatro Nacional y la popularidad del teatro en México.',
    question: '¿El Teatro Nacional tendrá 1 millón de espectadores en 2026?',
    outcomes: ['Sí, 1M o más', 'No, menos 1M'],
    category: 'Arte',
    icon: <Circle className="w-5 h-5" />,
    color: 'bg-red-500',
    endTime: 730
  },

  // 🏘️ DESARROLLO URBANO
  {
    id: 'mx-urban-1',
    title: 'Tren Maya 2025',
    description: 'Predicción sobre la finalización y operación completa del proyecto Tren Maya.',
    question: '¿El Tren Maya estará 100% operativo en 2025?',
    outcomes: ['Sí, 100% operativo', 'No, parcialmente'],
    category: 'Desarrollo',
    icon: <Train className="w-5 h-5" />,
    color: 'bg-green-500',
    endTime: 365
  },
  {
    id: 'mx-urban-2',
    title: 'Vivienda Social 2026',
    description: 'Predicción sobre la construcción de vivienda social y el acceso a la vivienda en México.',
    question: '¿México construirá 500,000 viviendas sociales en 2026?',
    outcomes: ['Sí, 500K o más', 'No, menos 500K'],
    category: 'Desarrollo',
    icon: <Home className="w-5 h-5" />,
    color: 'bg-blue-600',
    endTime: 730
  },

  // 🌮 TURISMO MEXICANO
  {
    id: 'mx-tourism-1',
    title: 'Turismo Internacional 2025',
    description: 'Predicción sobre la recuperación del turismo internacional en México post-pandemia.',
    question: '¿México recibirá 50 millones de turistas internacionales en 2025?',
    outcomes: ['Sí, 50M o más', 'No, menos 50M'],
    category: 'Turismo',
    icon: <Plane className="w-5 h-5" />,
    color: 'bg-cyan-500',
    endTime: 365
  },
  {
    id: 'mx-tourism-2',
    title: 'Pueblos Mágicos 2026',
    description: 'Predicción sobre la expansión del programa Pueblos Mágicos en México.',
    question: '¿México tendrá 200 Pueblos Mágicos en 2026?',
    outcomes: ['Sí, 200 o más', 'No, menos 200'],
    category: 'Turismo',
    icon: <MapPin className="w-5 h-5" />,
    color: 'bg-orange-500',
    endTime: 730
  },

  // 💰 CRIPTOMONEDAS MEXICANAS
  {
    id: 'mx-crypto-1',
    title: 'Bitcoin Legal México 2025',
    description: 'Predicción sobre la adopción legal de Bitcoin como moneda de curso legal en México.',
    question: '¿Bitcoin será reconocido como moneda de curso legal en México en 2025?',
    outcomes: ['Sí, curso legal', 'No, sin reconocimiento'],
    category: 'Criptomonedas',
    icon: <Bitcoin className="w-5 h-5" />,
    color: 'bg-orange-600',
    endTime: 365
  },
  {
    id: 'mx-crypto-2',
    title: 'CBDC México 2026',
    description: 'Predicción sobre el lanzamiento del peso digital mexicano por parte del Banco de México.',
    question: '¿México lanzará su moneda digital del banco central (CBDC) en 2026?',
    outcomes: ['Sí, CBDC lanzada', 'No, sin CBDC'],
    category: 'Criptomonedas',
    icon: <Coins className="w-5 h-5" />,
    color: 'bg-blue-500',
    endTime: 730
  },

  // 🎓 FILOSOFÍA MEXICANA
  {
    id: 'mx-philosophy-1',
    title: 'Filosofía Latinoamericana 2025',
    description: 'Predicción sobre el reconocimiento internacional de la filosofía mexicana y latinoamericana.',
    question: '¿Un filósofo mexicano ganará el Premio Nobel de Literatura en 2025?',
    outcomes: ['Sí, Nobel ganado', 'No, sin Nobel'],
    category: 'Filosofía',
    icon: <BookOpen className="w-5 h-5" />,
    color: 'bg-purple-600',
    endTime: 365
  },
  {
    id: 'mx-philosophy-2',
    title: 'Pensamiento Decolonial 2026',
    description: 'Predicción sobre la inclusión del pensamiento decolonial en la educación superior mexicana.',
    question: '¿El pensamiento decolonial será incluido en el currículo universitario mexicano en 2026?',
    outcomes: ['Sí, incluido', 'No, sin inclusión'],
    category: 'Filosofía',
    icon: <Globe className="w-5 h-5" />,
    color: 'bg-green-600',
    endTime: 730
  },

  // 🏛️ SEGURIDAD PÚBLICA
  {
    id: 'mx-security-1',
    title: 'Seguridad Ciudadana 2025',
    description: 'Predicción sobre la mejora en los índices de seguridad ciudadana y reducción de homicidios.',
    question: '¿México reducirá los homicidios en 20% durante 2025?',
    outcomes: ['Sí, 20% menos', 'No, sin reducción'],
    category: 'Seguridad',
    icon: <Security className="w-5 h-5" />,
    color: 'bg-red-600',
    endTime: 365
  },
  {
    id: 'mx-security-2',
    title: 'Guardia Nacional 2026',
    description: 'Predicción sobre el crecimiento y consolidación de la Guardia Nacional mexicana.',
    question: '¿La Guardia Nacional tendrá 200,000 elementos en 2026?',
    outcomes: ['Sí, 200K elementos', 'No, menos elementos'],
    category: 'Seguridad',
    icon: <Shield className="w-5 h-5" />,
    color: 'bg-blue-600',
    endTime: 730
  },

  // 🌮 MIGRACIÓN MEXICANA
  {
    id: 'mx-migration-1',
    title: 'Remesas México 2025',
    description: 'Predicción sobre el crecimiento de las remesas enviadas por mexicanos en el exterior.',
    question: '¿Las remesas a México superarán los 60 mil millones de dólares en 2025?',
    outcomes: ['Sí, 60B o más', 'No, menos 60B'],
    category: 'Migración',
    icon: <DollarSign className="w-5 h-5" />,
    color: 'bg-green-500',
    endTime: 365
  },
  {
    id: 'mx-migration-2',
    title: 'Retorno Migrantes 2026',
    description: 'Predicción sobre el retorno de migrantes mexicanos desde Estados Unidos y otros países.',
    question: '¿Más de 100,000 mexicanos regresarán del extranjero en 2026?',
    outcomes: ['Sí, 100K o más', 'No, menos 100K'],
    category: 'Migración',
    icon: <Home className="w-5 h-5" />,
    color: 'bg-orange-500',
    endTime: 730
  }
];

interface MarketTemplatesMexicoProps {
  onSelectTemplate: (template: MarketTemplate) => void;
}

export function MarketTemplatesMexico({ onSelectTemplate }: MarketTemplatesMexicoProps) {
  const categories = Array.from(new Set(templates.map(t => t.category)));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 neural-text-glow mb-4">
          🇲🇽 Mercados de Predicción para México
        </h2>
        <p className="text-gray-600 text-lg">
          Plantillas específicas para el contexto mexicano con temas culturales, económicos, políticos y sociales
        </p>
        <div className="mt-4 text-sm text-gray-500">
          <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full mr-2">Política</span>
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full mr-2">Economía</span>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full mr-2">Deportes</span>
          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">Cultura</span>
        </div>
      </div>

      {/* Categories */}
      {categories.map(category => (
        <div key={category} className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 neural-text-glow flex items-center">
            {category === 'Política' && <Vote className="w-5 h-5 mr-2 text-red-500" />}
            {category === 'Economía' && <DollarSign className="w-5 h-5 mr-2 text-green-500" />}
            {category === 'Deportes' && <Trophy className="w-5 h-5 mr-2 text-blue-500" />}
            {category === 'Cultura' && <Music className="w-5 h-5 mr-2 text-purple-500" />}
            {category === 'Gastronomía' && <Utensils className="w-5 h-5 mr-2 text-orange-500" />}
            {category === 'Salud' && <Heart className="w-5 h-5 mr-2 text-pink-500" />}
            {category === 'Educación' && <GraduationCap className="w-5 h-5 mr-2 text-indigo-500" />}
            {category === 'Medio Ambiente' && <Leaf className="w-5 h-5 mr-2 text-green-600" />}
            {category === 'Tecnología' && <Zap className="w-5 h-5 mr-2 text-purple-500" />}
            {category === 'Instituciones' && <Scale className="w-5 h-5 mr-2 text-gray-500" />}
            {category === 'Arte' && <Palette className="w-5 h-5 mr-2 text-pink-500" />}
            {category === 'Desarrollo' && <Building className="w-5 h-5 mr-2 text-blue-500" />}
            {category === 'Turismo' && <Plane className="w-5 h-5 mr-2 text-cyan-500" />}
            {category === 'Criptomonedas' && <Bitcoin className="w-5 h-5 mr-2 text-orange-500" />}
            {category === 'Filosofía' && <BookOpen className="w-5 h-5 mr-2 text-purple-500" />}
            {category === 'Seguridad' && <Shield className="w-5 h-5 mr-2 text-red-500" />}
            {category === 'Migración' && <Home className="w-5 h-5 mr-2 text-orange-500" />}
            {category}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates
              .filter(template => template.category === category)
              .map(template => (
                <div
                  key={template.id}
                  onClick={() => onSelectTemplate(template)}
                  className="neural-card neural-floating cursor-pointer hover:neural-glow transition-all duration-300 group"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 ${template.color} rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                        {template.icon}
                      </div>
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {template.endTime} días
                      </span>
                    </div>
                    
                    <h4 className="text-lg font-semibold text-gray-900 neural-text-glow mb-2 group-hover:text-neural-primary transition-colors">
                      {template.title}
                    </h4>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {template.description}
                    </p>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">
                        {template.question}
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        {template.outcomes.map((outcome, index) => (
                          <span
                            key={index}
                            className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                          >
                            {outcome}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {template.category}
                      </span>
                      <div className="flex items-center text-neural-primary group-hover:text-neural-primary-dark">
                        <span className="text-sm font-medium">Crear Mercado</span>
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