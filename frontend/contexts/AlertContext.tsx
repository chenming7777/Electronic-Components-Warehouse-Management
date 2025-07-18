'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useProducts } from './ProductContext';

interface Alert {
  id: string;
  productId: string;
  productName: string;
  type: 'info' | 'warning' | 'critical';
  message: string;
  timestamp: string;
}

interface AlertContextType {
  alerts: Alert[];
  addAlert: (alert: Omit<Alert, 'id' | 'timestamp'>) => void;
  dismissAlert: (alertId: string) => void;
  clearAllAlerts: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function useAlerts() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlerts must be used within an AlertProvider');
  }
  return context;
}

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const { products } = useProducts();

  // Monitor stock levels and generate alerts
  useEffect(() => {
    const checkStockLevels = () => {
      const newAlerts: Alert[] = [];

      products.forEach(product => {
        const existingAlert = alerts.find(alert => 
          alert.productId === product.id && 
          (alert.type === 'critical' || alert.type === 'warning')
        );

        // Use product-specific thresholds or default values
        const criticalThreshold = product.criticalStockThreshold ?? 5;
        const lowThreshold = product.lowStockThreshold ?? 10;

        if (product.stock === 0 && !existingAlert) {
          newAlerts.push({
            id: `${product.id}-out-${Date.now()}`,
            productId: product.id,
            productName: product.name,
            type: 'critical',
            message: 'Out of stock - immediate restocking required',
            timestamp: new Date().toISOString()
          });
        } else if (product.stock <= criticalThreshold && product.stock > 0 && !existingAlert) {
          newAlerts.push({
            id: `${product.id}-critical-${Date.now()}`,
            productId: product.id,
            productName: product.name,
            type: 'critical',
            message: `Critical stock level: ${product.stock} remaining (threshold: ${criticalThreshold})`,
            timestamp: new Date().toISOString()
          });
        } else if (product.stock <= lowThreshold && product.stock > criticalThreshold && !existingAlert) {
          newAlerts.push({
            id: `${product.id}-low-${Date.now()}`,
            productId: product.id,
            productName: product.name,
            type: 'warning',
            message: `Low stock level: ${product.stock} remaining (threshold: ${lowThreshold})`,
            timestamp: new Date().toISOString()
          });
        }
      });

      if (newAlerts.length > 0) {
        setAlerts(prevAlerts => [...prevAlerts, ...newAlerts]);
      }

      // Remove alerts for products that are now well-stocked
      setAlerts(prevAlerts => 
        prevAlerts.filter(alert => {
          const product = products.find(p => p.id === alert.productId);
          if (!product) return false;
          
          const criticalThreshold = product.criticalStockThreshold ?? 5;
          const lowThreshold = product.lowStockThreshold ?? 10;
          
          if (alert.type === 'critical' && product.stock > criticalThreshold) return false;
          if (alert.type === 'warning' && product.stock > lowThreshold) return false;
          
          return true;
        })
      );
    };

    checkStockLevels();
  }, [products]);

  const addAlert = (alertData: Omit<Alert, 'id' | 'timestamp'>) => {
    const newAlert: Alert = {
      ...alertData,
      id: `${alertData.productId}-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    setAlerts(prevAlerts => [newAlert, ...prevAlerts]);
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== alertId));
  };

  const clearAllAlerts = () => {
    setAlerts([]);
  };

  const value = {
    alerts,
    addAlert,
    dismissAlert,
    clearAllAlerts,
  };

  return (
    <AlertContext.Provider value={value}>
      {children}
    </AlertContext.Provider>
  );
}