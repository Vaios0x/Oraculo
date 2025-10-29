"use client";

import React from 'react';
import { Globe, Users, Eye, CheckCircle } from 'lucide-react';

/**
 * 🌐 PublicVisibilityNotice Component - Aviso de visibilidad pública
 * 
 * Componente que informa a los usuarios que todos los mercados
 * son visibles públicamente en la plataforma
 * 
 * @author Blockchain & Web3 Developer Full Stack Senior
 * @version 1.0.0
 */

export function PublicVisibilityNotice() {
  return (
    <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <Globe className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            🌐 Todos los Mercados son Públicos
          </h3>
          <p className="text-gray-700 mb-3">
            Cualquier mercado creado en devnet por cualquier wallet es visible públicamente 
            para todos los usuarios. Esto permite que la comunidad vea y participe en 
            todos los mercados de predicción disponibles.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-600">Visibilidad Total</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-gray-600">Acceso Comunitario</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-600">Transparencia Completa</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PublicVisibilityNotice;
