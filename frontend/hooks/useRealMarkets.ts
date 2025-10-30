import { useState, useEffect, useCallback } from 'react';
import { useOracle } from './useOracle';

/**
 * 🔮 useRealMarkets Hook - Hook para gestionar mercados reales
 * 
 * Hook que proporciona funcionalidades para cargar, filtrar y gestionar
 * mercados reales desde Solana con caché y optimizaciones
 * 
 * @author Blockchain & Web3 Developer Full Stack Senior
 * @version 1.0.0
 */

interface RealMarket {
  address: string;
  title: string;
  description: string;
  endTime: number;
  outcomes: string[];
  totalStaked: number;
  isResolved: boolean;
  winningOutcome?: number;
  privacyLevel: number;
  creator: string;
}

interface UseRealMarketsReturn {
  markets: RealMarket[];
  loading: boolean;
  error: string | null;
  showActiveOnly: boolean;
  setShowActiveOnly: (active: boolean) => void;
  loadMarkets: () => Promise<void>;
  refreshMarkets: () => Promise<void>;
  totalMarkets: number;
  activeMarkets: number;
  resolvedMarkets: number;
  totalStaked: number;
}

export function useRealMarkets(): UseRealMarketsReturn {
  const { getAllMarkets, getActiveMarkets, loading: oracleLoading, error: oracleError, programId } = useOracle();
  const [markets, setMarkets] = useState<RealMarket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showActiveOnly, setShowActiveOnly] = useState(false); // Mostrar TODOS los mercados por defecto
  const [lastUpdate, setLastUpdate] = useState<number>(0);

  // Caché de mercados (2 minutos para actualizaciones más frecuentes)
  const CACHE_DURATION = 2 * 60 * 1000; // 2 minutos
  const [cachedMarkets, setCachedMarkets] = useState<RealMarket[]>([]);
  const [cacheTimestamp, setCacheTimestamp] = useState<number>(0);

  // Cargar mercados desde Solana
  const loadMarkets = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);

      // Verificar caché si no es forzado
      if (!forceRefresh && cachedMarkets.length > 0 && Date.now() - cacheTimestamp < CACHE_DURATION) {
        console.log('📦 Usando mercados desde caché');
        setMarkets(cachedMarkets);
        setLoading(false);
        return;
      }

      console.log('🔮 Cargando mercados reales desde Solana...');
      
      // Obtener mercados activos o todos los mercados
      const realMarkets = showActiveOnly 
        ? await getActiveMarkets() 
        : await getAllMarkets();

      console.log('📊 Mercados encontrados:', realMarkets.length);

      // Convertir a formato RealMarket (usar la dirección real del mercado)
      const convertedMarkets: RealMarket[] = realMarkets.map((market) => ({
        address: market.address,
        title: market.title,
        description: market.description,
        endTime: market.endTime,
        outcomes: market.outcomes,
        totalStaked: market.totalStaked,
        isResolved: market.isResolved,
        winningOutcome: market.winningOutcome,
        privacyLevel: market.privacyLevel,
        creator: market.creator
      }));

      setMarkets(convertedMarkets);
      setCachedMarkets(convertedMarkets);
      setCacheTimestamp(Date.now());
      setLastUpdate(Date.now());
      
      console.log('✅ Mercados cargados exitosamente:', convertedMarkets.length);
    } catch (err) {
      console.error('❌ Error cargando mercados:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      
      // Si hay error y no hay caché, mostrar mercados de ejemplo como fallback
      if (cachedMarkets.length === 0) {
        // Asegurar fechas de noviembre 2025 en adelante
        const november2025 = Math.floor(new Date('2025-11-01').getTime() / 1000);
        const december2025 = Math.floor(new Date('2025-12-31').getTime() / 1000);
        const june2026 = Math.floor(new Date('2026-06-15').getTime() / 1000);
        
        const exampleMarkets: RealMarket[] = [
          {
            address: "example-bitcoin-2026",
            title: "¿Llegará Bitcoin a $200,000 en 2026?",
            description: "Predicción sobre el precio de Bitcoin para finales de 2026",
            endTime: december2025, // Diciembre 2025
            outcomes: ["Sí", "No"],
            totalStaked: 1250,
            isResolved: false,
            privacyLevel: 1,
            creator: "7uxEQsj9W6Kvf6Fimd2NkuYMxmY75Cs4KyZMMcJmqEL2"
          },
          {
            address: "example-gpt6-2026",
            title: "¿Será lanzado GPT-6 en 2026?",
            description: "Predicción sobre el lanzamiento de GPT-6 por OpenAI",
            endTime: june2026, // Junio 2026
            outcomes: ["Sí", "No"],
            totalStaked: 890,
            isResolved: false,
            privacyLevel: 1,
            creator: "DPdNmG6KptafxXNpeTX2UEnuVqikTh5WWjumsrnzoGo1"
          }
        ];
        setMarkets(exampleMarkets);
      }
    } finally {
      setLoading(false);
    }
  }, [getAllMarkets, getActiveMarkets, showActiveOnly, cachedMarkets, cacheTimestamp]);

  // Refrescar mercados (forzar recarga)
  const refreshMarkets = useCallback(async () => {
    await loadMarkets(true);
  }, [loadMarkets]);

  // Cargar mercados cuando cambie el filtro
  useEffect(() => {
    loadMarkets();
  }, [showActiveOnly]);

  // Cargar mercados inicialmente
  useEffect(() => {
    loadMarkets();
  }, []);

  // Calcular estadísticas
  const totalMarkets = markets.length;
  const activeMarkets = markets.filter(m => !m.isResolved).length;
  const resolvedMarkets = markets.filter(m => m.isResolved).length;
  const totalStaked = markets.reduce((sum, m) => sum + m.totalStaked, 0);

  return {
    markets,
    loading: loading || oracleLoading,
    error: error || oracleError,
    showActiveOnly,
    setShowActiveOnly,
    loadMarkets,
    refreshMarkets,
    totalMarkets,
    activeMarkets,
    resolvedMarkets,
    totalStaked,
  };
}
