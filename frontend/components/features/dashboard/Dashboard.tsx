'use client';

import { useProducts } from '@/contexts/ProductContext';
import { useAlerts } from '@/contexts/AlertContext';
import { useRequisitions } from '@/contexts/RequisitionContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Package, 
  AlertTriangle, 
  BarChart3,
  Activity,
  Newspaper,
} from 'lucide-react';

export function Dashboard() {
  const { products } = useProducts();
  const { alerts } = useAlerts();
  const { getPendingRequestsCount } = useRequisitions();

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
  const lowStockItems = products.filter(product => product.stock <= 10).length;
  const outOfStockItems = products.filter(product => product.stock === 0).length;
  const pendingRequests = getPendingRequestsCount();

  const categoryStats = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = { count: 0, stock: 0, value: 0 };
    }
    acc[product.category].count++;
    acc[product.category].stock += product.stock;
    acc[product.category].value += product.stock;
    return acc;
  }, {} as Record<string, { count: number; stock: number; value: number }>);

  const recentAlerts = alerts.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Products</p>
              <p className="text-2xl font-bold text-white">{totalProducts}</p>
            </div>
            <Package className="w-8 h-8 text-blue-400" />
          </div>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Stock</p>
              <p className="text-2xl font-bold text-white">{totalStock.toLocaleString()}</p>
            </div>
            <Activity className="w-8 h-8 text-green-400" />
          </div>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending Requests</p>
              <p className="text-2xl font-bold text-white">{pendingRequests}</p>
            </div>
            <Newspaper className="w-8 h-8 text-emerald-400" /> 
          </div>
        </Card> 

        <Card className="bg-slate-800/50 border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Low Stock Items</p>
              <p className="text-2xl font-bold text-amber-400">{lowStockItems}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-amber-400" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Overview */}
        <Card className="bg-slate-800/50 border-slate-700/50 p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Category Overview</h3>
          </div>
          <div className="space-y-4">
            {Object.entries(categoryStats).map(([category, stats]) => (
              <div key={category} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white capitalize">{category.replace('-', ' ')}</span>
                  <Badge variant="secondary">{stats.count} items</Badge>
                </div>
                <Progress 
                  value={(stats.stock / totalStock) * 100} 
                  className="h-2 bg-slate-700"
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Alerts */}
        <Card className="bg-slate-800/50 border-slate-700/50 p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-semibold text-white">Recent Alerts</h3>
          </div>
          <div className="space-y-3">
            {recentAlerts.length > 0 ? (
              recentAlerts.map((alert) => (
                <div key={alert.id} className="bg-slate-700/50 rounded-lg p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-white font-medium">{alert.productName}</p>
                      <p className="text-gray-400 text-sm">{alert.message}</p>
                      <p className="text-gray-500 text-xs mt-1">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <Badge 
                      variant={alert.type === 'critical' ? 'destructive' : 'secondary'}
                      className="ml-2"
                    >
                      {alert.type}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-4">No recent alerts</p>
            )}
          </div>
        </Card>
      </div>

      {/* Stock Status Summary */}
      <Card className="bg-slate-800/50 border-slate-700/50 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Stock Status Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-green-400 font-medium">In Stock</span>
            </div>
            <p className="text-2xl font-bold text-white mt-2">
              {products.filter(p => p.stock > 10).length}
            </p>
            <p className="text-green-300 text-sm">Items well stocked</p>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
              <span className="text-amber-400 font-medium">Low Stock</span>
            </div>
            <p className="text-2xl font-bold text-white mt-2">{lowStockItems}</p>
            <p className="text-amber-300 text-sm">Items need restocking</p>
          </div>

          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-red-400 font-medium">Out of Stock</span>
            </div>
            <p className="text-2xl font-bold text-white mt-2">{outOfStockItems}</p>
            <p className="text-red-300 text-sm">Items unavailable</p>
          </div>
        </div>
      </Card>
    </div>
  );
}