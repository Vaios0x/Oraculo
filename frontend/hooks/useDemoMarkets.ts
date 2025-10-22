"use client";

import { useState, useEffect, useCallback } from 'react';
import { PublicKey } from '@solana/web3.js';

export interface DemoMarket {
  id: string;
  title: string;
  description: string;
  question: string;
  outcomes: string[];
  category: string;
  signature: string;
  marketAddress: string;
  createdAt: number;
  endTime: number;
  isResolved: boolean;
  winningOutcome?: string;
  totalStaked: number;
}

const DEMO_MARKETS_KEY = 'oraculo-demo-markets';

export function useDemoMarkets() {
  const [demoMarkets, setDemoMarkets] = useState<DemoMarket[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar mercados demo desde localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(DEMO_MARKETS_KEY);
      if (stored) {
        const markets = JSON.parse(stored);
        setDemoMarkets(markets);
      }
    } catch (error) {
      console.error('Error loading demo markets:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Guardar mercados demo en localStorage
  const saveDemoMarkets = useCallback((markets: DemoMarket[]) => {
    try {
      localStorage.setItem(DEMO_MARKETS_KEY, JSON.stringify(markets));
      setDemoMarkets(markets);
    } catch (error) {
      console.error('Error saving demo markets:', error);
    }
  }, []);

  // Agregar un nuevo mercado demo
  const addDemoMarket = useCallback((marketData: {
    title: string;
    description: string;
    question: string;
    outcomes: string[];
    category: string;
    signature: string;
    marketAddress: PublicKey;
    endTime: number;
  }) => {
    // Verificar que la fecha sea de noviembre 2025 en adelante
    const november2025 = Math.floor(new Date('2025-11-01').getTime() / 1000);
    let finalEndTime = marketData.endTime;
    
    if (finalEndTime < november2025) {
      // Si la fecha es anterior a noviembre 2025, establecer a diciembre 2025
      finalEndTime = Math.floor(new Date('2025-12-31').getTime() / 1000);
      console.log('⚠️ Fecha de mercado DEVNET corregida a diciembre 2025');
    }
    
    const newMarket: DemoMarket = {
      id: `demo-${Date.now()}`,
      title: marketData.title,
      description: marketData.description,
      question: marketData.question,
      outcomes: marketData.outcomes,
      category: marketData.category,
      signature: marketData.signature,
      marketAddress: marketData.marketAddress.toString(),
      createdAt: Date.now(),
      endTime: finalEndTime,
      isResolved: false,
      totalStaked: Math.floor(Math.random() * 1000) + 100, // Mock staked amount
    };

    const updatedMarkets = [newMarket, ...demoMarkets];
    saveDemoMarkets(updatedMarkets);
    return newMarket;
  }, [demoMarkets, saveDemoMarkets]);

  // Resolver un mercado demo
  const resolveDemoMarket = useCallback((marketId: string, winningOutcome: string) => {
    const updatedMarkets = demoMarkets.map(market => 
      market.id === marketId 
        ? { ...market, isResolved: true, winningOutcome }
        : market
    );
    saveDemoMarkets(updatedMarkets);
  }, [demoMarkets, saveDemoMarkets]);

  // Eliminar un mercado demo
  const removeDemoMarket = useCallback((marketId: string) => {
    const updatedMarkets = demoMarkets.filter(market => market.id !== marketId);
    saveDemoMarkets(updatedMarkets);
  }, [demoMarkets, saveDemoMarkets]);

  // Limpiar todos los mercados demo
  const clearDemoMarkets = useCallback(() => {
    localStorage.removeItem(DEMO_MARKETS_KEY);
    setDemoMarkets([]);
  }, []);

  return {
    demoMarkets,
    loading,
    addDemoMarket,
    resolveDemoMarket,
    removeDemoMarket,
    clearDemoMarkets,
  };
}
