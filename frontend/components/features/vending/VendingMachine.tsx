'use client';

import { useState } from 'react';
import { useProducts } from '@/contexts/ProductContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Package, 
  ShoppingCart, 
  Minus, 
  Plus, 
  CheckCircle, 
  Loader2, 
  AlertTriangle,
  Search,
  X
} from 'lucide-react';

export function VendingMachine() {
  const { products, updateStock } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [requestedQuantity, setRequestedQuantity] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [cart, setCart] = useState<{[key: string]: number}>({});

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: any, quantity: number) => {
    if (quantity > product.stock) return;
    
    setCart(prev => ({
      ...prev,
      [product.id]: (prev[product.id] || 0) + quantity
    }));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      delete newCart[productId];
      return newCart;
    });
  };

  const getTotalCartItems = () => {
    return Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  };

  const processCart = async () => {
    if (Object.keys(cart).length === 0) return;
    
    setIsProcessing(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update stock for all items in cart
    Object.entries(cart).forEach(([productId, quantity]) => {
      const product = products.find(p => p.id === productId);
      if (product) {
        updateStock(productId, product.stock - quantity);
      }
    });
    
    setCart({});
    setIsProcessing(false);
    setShowSuccess(true);
    
    // Hide success message after 2 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 2000);
  };

  const getStockStatus = (stock: number, minStock: number = 10) => {
    if (stock === 0) return { status: 'out', color: 'text-red-400', bg: 'bg-red-500/10' };
    if (stock <= minStock) return { status: 'low', color: 'text-amber-400', bg: 'bg-amber-500/10' };
    return { status: 'good', color: 'text-green-400', bg: 'bg-green-500/10' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-green-400" />
          <h2 className="text-lg font-semibold text-white">Component Vending Machine</h2>
        </div>
        <p className="text-gray-300 text-sm mt-1">
          Select components and quantities you need. Items will be automatically deducted from inventory.
        </p>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-green-400 font-medium">Items successfully dispensed!</span>
          </div>
        </div>
      )}

      {/* Search and Cart */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-700 border-slate-600 text-white"
          />
        </div>

        {/* Cart Summary */}
        <div className="flex items-center gap-4">
          <div className="text-white">
            Cart: {getTotalCartItems()} items
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="border-green-500 text-green-400 hover:bg-green-500/10"
                disabled={Object.keys(cart).length === 0}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                View Cart
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700 text-white">
              <DialogHeader>
                <DialogTitle>Shopping Cart</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {Object.entries(cart).map(([productId, quantity]) => {
                  const product = products.find(p => p.id === productId);
                  if (!product) return null;
                  
                  return (
                    <div key={productId} className="p-3 bg-slate-700/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div>
                            <h4 className="font-medium">{product.name}</h4>
                            <p className="text-sm text-gray-400">Available: {product.stock}</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFromCart(productId)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const newQuantity = Math.max(0, quantity - 10);
                              if (newQuantity === 0) {
                                removeFromCart(productId);
                              } else {
                                setCart(prev => ({ ...prev, [productId]: newQuantity }));
                              }
                            }}
                            disabled={quantity <= 10}
                            className="h-8 w-8 p-0 text-xs text-black"
                          >
                            -10
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const newQuantity = Math.max(0, quantity - 1);
                              if (newQuantity === 0) {
                                removeFromCart(productId);
                              } else {
                                setCart(prev => ({ ...prev, [productId]: newQuantity }));
                              }
                            }}
                            className="h-8 w-8 p-0 text-xs text-black"
                          >
                            -1
                          </Button>
                          <span className="min-w-12 text-center font-medium text-white">
                            {quantity}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const newQuantity = Math.min(product.stock, quantity + 1);
                              setCart(prev => ({ ...prev, [productId]: newQuantity }));
                            }}
                            disabled={quantity >= product.stock}
                            className="h-8 w-8 p-0 text-xs text-black"
                          >
                            +1
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const newQuantity = Math.min(product.stock, quantity + 10);
                              setCart(prev => ({ ...prev, [productId]: newQuantity }));
                            }}
                            disabled={quantity + 10 > product.stock}
                            className="h-8 w-8 p-0 text-xs text-black"
                          >
                            +10
                          </Button>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-400">Quantity</div>
                          <div className="font-medium text-white">{quantity}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {Object.keys(cart).length > 0 && (
                  <Button 
                    onClick={processCart}
                    disabled={isProcessing}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Take Items
                      </>
                    )}
                  </Button>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => {
          const stockStatus = getStockStatus(product.stock);
          const inCart = cart[product.id] || 0;
          
          return (
            <Card key={product.id} className="bg-slate-800/50 border-slate-700/50 p-4">
              <div className="flex items-start gap-3">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate">{product.name}</h3>
                  <p className="text-gray-400 text-sm capitalize">{product.category}</p>
                  {product.function && (
                    <p className="text-green-400 text-xs mt-1">{product.function}</p>
                  )}
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {/* Stock Status */}
                <div className={`${stockStatus.bg} rounded-lg p-3`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {stockStatus.status === 'out' && <AlertTriangle className="w-4 h-4 text-red-400" />}
                      {stockStatus.status === 'low' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                      {stockStatus.status === 'good' && <CheckCircle className="w-4 h-4 text-green-400" />}
                      <span className={`font-medium ${stockStatus.color}`}>
                        {product.stock} available
                      </span>
                    </div>
                    <Badge 
                      variant={stockStatus.status === 'out' ? 'destructive' : 
                              stockStatus.status === 'low' ? 'secondary' : 'default'}
                    >
                      {stockStatus.status === 'out' ? 'Out of Stock' :
                       stockStatus.status === 'low' ? 'Low Stock' : 'In Stock'}
                    </Badge>
                  </div>
                </div>

                {/* Add to Cart Action */}
                <div className="space-y-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        onClick={() => setSelectedProduct(product)}
                        disabled={product.stock === 0}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add to Cart
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-800 border-slate-700 text-white">
                      <DialogHeader>
                        <DialogTitle>Add {selectedProduct?.name} to Cart</DialogTitle>
                      </DialogHeader>
                      {selectedProduct && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={selectedProduct.image}
                              alt={selectedProduct.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div>
                              <h4 className="font-medium">{selectedProduct.name}</h4>
                              <p className="text-gray-400 text-sm">{selectedProduct.description}</p>
                              <p className="text-green-400 text-sm">Available: {selectedProduct.stock}</p>
                            </div>
                          </div>
                          
                          <div>
                            <Label>Quantity</Label>
                            <div className="space-y-3 mt-2">
                              {/* Quick quantity buttons */}
                              <div className="grid grid-cols-2 gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setRequestedQuantity(Math.max(1, requestedQuantity - 10))}
                                  disabled={requestedQuantity <= 10}
                                  className="text-xs text-black"
                                >
                                  -10
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setRequestedQuantity(Math.min(selectedProduct.stock, requestedQuantity + 10))}
                                  disabled={requestedQuantity + 10 > selectedProduct.stock}
                                  className="text-xs text-black"
                                >
                                  +10
                                </Button>
                              </div>
                              
                              {/* Fine control */}
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setRequestedQuantity(Math.max(1, requestedQuantity - 1))}
                                  disabled={requestedQuantity <= 1}
                                >
                                  <Minus className="w-4 h-4 text-black"/>
                                </Button>
                                <Input
                                  type="number"
                                  value={requestedQuantity}
                                  onChange={(e) => setRequestedQuantity(Math.max(1, Math.min(selectedProduct.stock, parseInt(e.target.value) || 1)))}
                                  className="w-20 text-center bg-slate-700 border-slate-600 text-white"
                                  min="1"
                                  max={selectedProduct.stock}
                                />
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setRequestedQuantity(Math.min(selectedProduct.stock, requestedQuantity + 1))}
                                  disabled={requestedQuantity >= selectedProduct.stock}
                                >
                                  <Plus className="w-4 h-4 text-black" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              onClick={() => setSelectedProduct(null)}
                              className="flex-1 text-black"
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={() => {
                                addToCart(selectedProduct, requestedQuantity);
                                setSelectedProduct(null);
                                setRequestedQuantity(1);
                              }}
                              disabled={requestedQuantity > selectedProduct.stock}
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                            >
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              Add to Cart
                            </Button>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  
                  {inCart > 0 && (
                    <div className="text-center">
                      <Badge variant="secondary" className="text-xs">
                        {inCart} in cart
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No components found</p>
        </div>
      )}
    </div>
  );
}