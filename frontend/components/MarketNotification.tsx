"use client";

import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

/**
 * 🔮 MarketNotification Component - Notificaciones de mercados
 * 
 * Componente que muestra notificaciones cuando se crean, actualizan o resuelven mercados
 * 
 * @author Blockchain & Web3 Developer Full Stack Senior
 * @version 1.0.0
 */

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  timestamp: number;
  autoClose?: boolean;
  duration?: number;
}

interface MarketNotificationProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
}

export function MarketNotification({ notifications, onRemove }: MarketNotificationProps) {
  const [visibleNotifications, setVisibleNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    setVisibleNotifications(notifications);
  }, [notifications]);

  useEffect(() => {
    // Auto-remove notifications after duration
    notifications.forEach(notification => {
      if (notification.autoClose && notification.duration) {
        setTimeout(() => {
          onRemove(notification.id);
        }, notification.duration);
      }
    });
  }, [notifications, onRemove]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  if (visibleNotifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {visibleNotifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-4 rounded-lg border shadow-lg neural-floating transition-all duration-300 ${getNotificationStyles(notification.type)}`}
        >
          <div className="flex items-start space-x-3">
            {getNotificationIcon(notification.type)}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold">{notification.title}</h4>
              <p className="text-sm mt-1">{notification.message}</p>
              <p className="text-xs mt-2 opacity-75">
                {new Date(notification.timestamp).toLocaleTimeString()}
              </p>
            </div>
            <button
              onClick={() => onRemove(notification.id)}
              className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// Hook para gestionar notificaciones
export function useMarketNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      autoClose: notification.autoClose ?? true,
      duration: notification.duration ?? 5000, // 5 segundos por defecto
    };

    setNotifications(prev => [...prev, newNotification]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const addSuccessNotification = (title: string, message: string, duration?: number) => {
    addNotification({
      type: 'success',
      title,
      message,
      duration,
    });
  };

  const addErrorNotification = (title: string, message: string, duration?: number) => {
    addNotification({
      type: 'error',
      title,
      message,
      duration: duration ?? 10000, // 10 segundos para errores
    });
  };

  const addInfoNotification = (title: string, message: string, duration?: number) => {
    addNotification({
      type: 'info',
      title,
      message,
      duration,
    });
  };

  const addWarningNotification = (title: string, message: string, duration?: number) => {
    addNotification({
      type: 'warning',
      title,
      message,
      duration,
    });
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    addSuccessNotification,
    addErrorNotification,
    addInfoNotification,
    addWarningNotification,
  };
}
