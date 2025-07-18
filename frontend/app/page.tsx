'use client';

import { useState, useEffect } from 'react';
import { Dashboard } from '@/components/features/dashboard/Dashboard';
import { InventoryManager } from '@/components/features/inventory/InventoryManager';
import { StockAlerts } from '@/components/features/alerts/StockAlerts';
import { RequisitionManager } from '@/components/features/requisition/RequisitionManager';
import { VendingMachine } from '@/components/features/vending/VendingMachine';
import { ProductProvider } from '@/contexts/ProductContext';
import { AlertProvider } from '@/contexts/AlertContext';
import { RequisitionProvider } from '@/contexts/RequisitionContext';
import { UserProvider, useUser } from '@/contexts/UserContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Package, AlertTriangle, BarChart3, FileText, User, Settings, ShoppingCart } from 'lucide-react';

function MainContent() {
  const { role, setRole, isAdmin } = useUser();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-blue-500/30 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 p-3 rounded-lg">
                <Package className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">ElectroStock Pro</h1>
                <p className="text-blue-200">Electronic Components Warehouse Management</p>
              </div>
            </div>
            
            {/* Role Toggle Button */}
            <div className="flex items-center gap-4">
              <div className="text-white text-sm">
                Current: <span className="font-semibold capitalize">{role}</span>
              </div>
              <Button
                onClick={() => setRole(role === 'admin' ? 'user' : 'admin')}
                variant="outline"
                className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
              >
                {role === 'admin' ? (
                  <>
                    <User className="w-4 h-4 mr-2" />
                    Switch to User
                  </>
                ) : (
                  <>
                    <Settings className="w-4 h-4 mr-2" />
                    Switch to Admin
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-blue-500/30 p-6">
          {isAdmin ? (
            <Tabs defaultValue="dashboard" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border-slate-700">
                <TabsTrigger value="dashboard" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="inventory" className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Inventory
                </TabsTrigger>
                <TabsTrigger value="alerts" className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Alerts
                </TabsTrigger>
                <TabsTrigger value="requisitions" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Requisitions
                </TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard" className="mt-6">
                <Dashboard />
              </TabsContent>

              <TabsContent value="inventory" className="mt-6">
                <InventoryManager />
              </TabsContent>

              <TabsContent value="alerts" className="mt-6">
                <StockAlerts />
              </TabsContent>

              <TabsContent value="requisitions" className="mt-6">
                <RequisitionManager />
              </TabsContent>
            </Tabs>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-6">
                <ShoppingCart className="w-5 h-5 text-green-400" />
                <h2 className="text-xl font-semibold text-white">Component Vending System</h2>
              </div>
              <VendingMachine />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading Warehouse System...</div>
      </div>
    );
  }

  return (
    <UserProvider>
      <ProductProvider>
        <AlertProvider>
          <RequisitionProvider>
            <MainContent />
          </RequisitionProvider>
        </AlertProvider>
      </ProductProvider>
    </UserProvider>
  );
}