'use client';

import { useProducts } from '@/contexts/ProductContext';
import { useAlerts } from '@/contexts/AlertContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  AlertTriangle, 
  Bell, 
  CheckCircle, 
  X,
  Settings,
  Package,
  TrendingDown,
  Edit,
  Save
} from 'lucide-react';
import { useState } from 'react';

export function StockAlerts() {
  const { products, updateStock, updateProductThresholds } = useProducts();
  const { alerts, dismissAlert, clearAllAlerts } = useAlerts();
  const [showThresholdSettings, setShowThresholdSettings] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [alertSettings, setAlertSettings] = useState({
    enableEmailAlerts: false,
    enablePushNotifications: true
  });

  const lowStockItems = products.filter(product => {
    const lowThreshold = product.lowStockThreshold ?? 10;
    const criticalThreshold = product.criticalStockThreshold ?? 5;
    return product.stock <= lowThreshold && product.stock > criticalThreshold;
  });
  
  const criticalStockItems = products.filter(product => {
    const criticalThreshold = product.criticalStockThreshold ?? 5;
    return product.stock <= criticalThreshold && product.stock > 0;
  });

  const outOfStockItems = products.filter(product => product.stock === 0);

  const handleQuickRestock = (productId: string, quantity: number) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      updateStock(productId, product.stock + quantity);
    }
  };

  const handleUpdateThresholds = (productId: string, lowThreshold: number, criticalThreshold: number) => {
    updateProductThresholds(productId, lowThreshold, criticalThreshold);
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      default:
        return <Bell className="w-4 h-4 text-blue-400" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'border-red-500/20 bg-red-500/10';
      case 'warning':
        return 'border-amber-500/20 bg-amber-500/10';
      default:
        return 'border-blue-500/20 bg-blue-500/10';
    }
  };

  return (
    <div className="space-y-6">
      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-red-500/10 border-red-500/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-400 text-sm font-medium">Critical Stock</p>
              <p className="text-2xl font-bold text-white">{criticalStockItems.length}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
        </Card>

        <Card className="bg-amber-500/10 border-amber-500/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-400 text-sm font-medium">Low Stock</p>
              <p className="text-2xl font-bold text-white">{lowStockItems.length}</p>
            </div>
            <TrendingDown className="w-8 h-8 text-amber-400" />
          </div>
        </Card>

        <Card className="bg-gray-500/10 border-gray-500/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Out of Stock</p>
              <p className="text-2xl font-bold text-white">{outOfStockItems.length}</p>
            </div>
            <Package className="w-8 h-8 text-gray-400" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Alerts */}
        <Card className="bg-slate-800/50 border-slate-700/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Active Alerts</h3>
              <Badge variant="secondary">{alerts.length}</Badge>
            </div>
            {alerts.length > 0 && (
              <Button
                onClick={clearAllAlerts}
                size="sm"
                variant="ghost"
                className="text-gray-400 hover:text-white"
              >
                Clear All
              </Button>
            )}
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {alerts.length > 0 ? (
              alerts.map((alert) => (
                <div key={alert.id} className={`rounded-lg p-4 border ${getAlertColor(alert.type)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1">
                        <h4 className="font-medium text-white">{alert.productName}</h4>
                        <p className="text-gray-300 text-sm">{alert.message}</p>
                        <p className="text-gray-500 text-xs mt-1">
                          {new Date(alert.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => dismissAlert(alert.id)}
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <p className="text-gray-400">No active alerts</p>
              </div>
            )}
          </div>
        </Card>

        {/* Per-Product Threshold Settings */}
        <Card className="bg-slate-800/50 border-slate-700/50 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Product Alert Thresholds</h3>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {products.map((product) => (
              <div key={product.id} className="bg-slate-700/30 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-white mb-1">{product.name}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-300">
                      <span>Current Stock: {product.stock}</span>
                      <Badge variant="outline" className="text-xs">
                        Low: {product.lowStockThreshold ?? 10}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Critical: {product.criticalStockThreshold ?? 5}
                      </Badge>
                    </div>
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-blue-400 hover:text-white"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-800 border-slate-700 text-white">
                      <DialogHeader>
                        <DialogTitle>Set Alert Thresholds for {product.name}</DialogTitle>
                      </DialogHeader>
                      <ThresholdEditor 
                        product={product} 
                        onUpdate={handleUpdateThresholds}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-700">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-white">Email Alerts</Label>
                <Button
                  size="sm"
                  variant={alertSettings.enableEmailAlerts ? "default" : "outline"}
                  onClick={() => setAlertSettings({
                    ...alertSettings,
                    enableEmailAlerts: !alertSettings.enableEmailAlerts
                  })}
                  className="h-6"
                >
                  {alertSettings.enableEmailAlerts ? 'ON' : 'OFF'}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-white">Push Notifications</Label>
                <Button
                  size="sm"
                  variant={alertSettings.enablePushNotifications ? "default" : "outline"}
                  onClick={() => setAlertSettings({
                    ...alertSettings,
                    enablePushNotifications: !alertSettings.enablePushNotifications
                  })}
                  className="h-6"
                >
                  {alertSettings.enablePushNotifications ? 'ON' : 'OFF'}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>      
    </div>
  );
}

// Threshold Editor Component
function ThresholdEditor({ 
  product, 
  onUpdate 
}: { 
  product: any; 
  onUpdate: (productId: string, lowThreshold: number, criticalThreshold: number) => void;
}) {
  const [lowThreshold, setLowThreshold] = useState(product.lowStockThreshold ?? 10);
  const [criticalThreshold, setCriticalThreshold] = useState(product.criticalStockThreshold ?? 5);
  const [isOpen, setIsOpen] = useState(true);

  const handleSave = () => {
    if (criticalThreshold >= lowThreshold) {
      alert('Critical threshold must be less than low threshold');
      return;
    }
    onUpdate(product.id, lowThreshold, criticalThreshold);
    setIsOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="bg-slate-700/30 rounded-lg p-3 mb-4">
        <div className="text-sm text-gray-300">
          <p><strong>Current Stock:</strong> {product.stock}</p>
          <p><strong>Category:</strong> {product.category}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-white">Low Stock Threshold</Label>
          <Input
            type="number"
            value={lowThreshold}
            onChange={(e) => setLowThreshold(parseInt(e.target.value) || 0)}
            className="bg-slate-700 border-slate-600 text-white"
            min="1"
          />
          <p className="text-gray-400 text-xs mt-1">
            Alert when stock reaches this level
          </p>
        </div>

        <div>
          <Label className="text-white">Critical Stock Threshold</Label>
          <Input
            type="number"
            value={criticalThreshold}
            onChange={(e) => setCriticalThreshold(parseInt(e.target.value) || 0)}
            className="bg-slate-700 border-slate-600 text-white"
            min="0"
            max={lowThreshold - 1}
          />
          <p className="text-gray-400 text-xs mt-1">
            High-priority alert when stock reaches this level
          </p>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
          <h4 className="text-blue-400 font-medium mb-2">Preview</h4>
          <div className="text-sm text-gray-300 space-y-1">
            <p>• <strong>Stock {lowThreshold + 1}+:</strong> <span className="text-green-400">Normal</span></p>
            <p>• <strong>Stock {criticalThreshold + 1}-{lowThreshold}:</strong> <span className="text-amber-400">Low Stock Warning</span></p>
            <p>• <strong>Stock 1-{criticalThreshold}:</strong> <span className="text-red-400">Critical Alert</span></p>
            <p>• <strong>Stock 0:</strong> <span className="text-red-500">Out of Stock</span></p>
          </div>
        </div>

        <Button onClick={handleSave} className="w-full bg-blue-600 hover:bg-blue-700">
          <Save className="w-4 h-4 mr-2" />
          Save Thresholds
        </Button>
      </div>
    </div>
  );
}