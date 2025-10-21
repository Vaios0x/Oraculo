"use client";

import React from 'react';
import { OraculoCookbookProvider } from '../../components/solana-cookbook-provider';
import OraculoSolanaCookbookDemo from '../../components/solana-cookbook-demo';

/**
 * 🔮 Oráculo Solana Cookbook Page
 * 
 * Página principal para demostrar la integración completa del Solana Cookbook
 * con el proyecto Oráculo - Mercado de Predicciones Descentralizado
 * 
 * @author Blockchain & Web3 Developer Full Stack Senior
 * @version 1.0.0
 */

export default function SolanaCookbookPage() {
  return (
    <OraculoCookbookProvider initialNetwork="devnet">
      <OraculoSolanaCookbookDemo />
    </OraculoCookbookProvider>
  );
}
