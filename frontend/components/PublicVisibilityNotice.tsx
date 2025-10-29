"use client";

import React from 'react';
import { Globe, Users, Eye, CheckCircle } from 'lucide-react';

/**
 * 🌐 PublicVisibilityNotice Component - Public visibility notice
 * 
 * Component that informs users that all markets
 * are publicly visible on the platform
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
            🌐 All Markets are Public
          </h3>
          <p className="text-gray-700 mb-3">
            Any market created on devnet by any wallet is publicly visible 
            to all users. This allows the community to see and participate in 
            all available prediction markets.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-600">Full Visibility</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-gray-600">Community Access</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-600">Full Transparency</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PublicVisibilityNotice;
