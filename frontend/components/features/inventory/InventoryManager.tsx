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
  Plus, 
  Trash2, 
  Search,
  AlertTriangle,
  CheckCircle,
  Loader2,
  X,
  Upload,
  Image
} from 'lucide-react';

export function InventoryManager() {
  const { products, addProduct, removeProduct } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [successStates, setSuccessStates] = useState<Record<string, boolean>>({});
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    stock: 0,
    description: '',
    minStock: 10,
    image: '',
    specifications: {} as Record<string, string>
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setNewProduct(prev => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addSpecification = () => {
    if (specKey && specValue) {
      setNewProduct(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [specKey]: specValue
        }
      }));
      setSpecKey('');
      setSpecValue('');
    }
  };

  const removeSpecification = (key: string) => {
    setNewProduct(prev => {
      const newSpecs = { ...prev.specifications };
      delete newSpecs[key];
      return { ...prev, specifications: newSpecs };
    });
  };


  const handleAddProduct = async () => {
    if (newProduct.name && newProduct.category) {
      setLoadingStates(prev => ({ ...prev, 'add-product': true }));
      
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addProduct({
        ...newProduct,
        id: Date.now().toString(),
        image: newProduct.image || 'https://images.pexels.com/photos/159298/circuit-board-computer-electronics-159298.jpeg?auto=compress&cs=tinysrgb&w=400'
      });
      
      setNewProduct({
        name: '',
        category: '',
        stock: 0,
        description: '',
        minStock: 10,
        image: '',
        specifications: {}
      });
      setSelectedImage(null);
      setImagePreview('');
      setSpecKey('');
      setSpecValue('');
      
      setLoadingStates(prev => ({ ...prev, 'add-product': false }));
      setSuccessStates(prev => ({ ...prev, 'add-product': true }));
      
      setTimeout(() => {
        setSuccessStates(prev => ({ ...prev, 'add-product': false }));
      }, 1500);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    setLoadingStates(prev => ({ ...prev, [`delete-${productId}`]: true }));
    
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 600));
    
    removeProduct(productId);
    setConfirmDelete(null);
    setLoadingStates(prev => ({ ...prev, [`delete-${productId}`]: false }));
  };

  const getStockStatus = (stock: number, minStock: number = 10) => {
    if (stock === 0) return { status: 'out', color: 'text-red-400', bg: 'bg-red-500/10' };
    if (stock <= minStock) return { status: 'low', color: 'text-amber-400', bg: 'bg-amber-500/10' };
    return { status: 'good', color: 'text-green-400', bg: 'bg-green-500/10' };
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-white">Inventory Overview</h2>
        </div>
        <p className="text-gray-300 text-sm mt-1">
          View current stock levels and product information. Stock is automatically updated when requisitions are approved.
        </p>
      </div>

      {/* Header with Search and Add Product */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-700 border-slate-600 text-white"
          />
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700 text-white">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Product Name</Label>
                <Input
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label>Category</Label>
                <Input
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label>Initial Stock</Label>
                <Input
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({...newProduct, stock: parseInt(e.target.value)})}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label>Product Image</Label>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="bg-slate-700 border-slate-600 text-white file:bg-blue-600 file:text-white file:border-0 file:rounded file:px-3 file:py-1"
                    />
                    <Upload className="w-4 h-4 text-gray-400" />
                  </div>
                  {imagePreview && (
                    <div className="relative w-24 h-24">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg border border-slate-600"
                      />
                    </div>
                  )}
                  {!imagePreview && (
                    <div className="w-24 h-24 bg-slate-700 border-2 border-dashed border-slate-600 rounded-lg flex items-center justify-center">
                      <Image className="w-6 h-6 text-gray-500" />
                    </div>
                  )}
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Input
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label>Key Specifications</Label>
                <div className="space-y-3 mt-2">
                  {/* Current Specifications */}
                  {Object.keys(newProduct.specifications).length > 0 && (
                    <div className="space-y-2">
                      {Object.entries(newProduct.specifications).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-2 p-2 bg-slate-700 rounded">
                          <span className="text-white text-sm flex-1">{key}: {value}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeSpecification(key)}
                            className="h-6 w-6 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/20"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Add New Specification */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Specification name"
                      value={specKey}
                      onChange={(e) => setSpecKey(e.target.value)}
                      className="flex-1 bg-slate-700 border-slate-600 text-white"
                    />
                    <Input
                      placeholder="Value"
                      value={specValue}
                      onChange={(e) => setSpecValue(e.target.value)}
                      className="flex-1 bg-slate-700 border-slate-600 text-white"
                    />
                    <Button
                      size="sm"
                      onClick={addSpecification}
                      disabled={!specKey || !specValue}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <Button 
                onClick={handleAddProduct} 
                disabled={loadingStates['add-product'] || !newProduct.name || !newProduct.category}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
              >
                {loadingStates['add-product'] ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : successStates['add-product'] ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                    Added!
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => {
          const stockStatus = getStockStatus(product.stock);
          
          return (
            <Card key={product.id} className="bg-slate-800/50 border-slate-700/50 p-4 relative">
              <div className="absolute top-3 right-3">
                {confirmDelete === product.id ? (
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteProduct(product.id)}
                      disabled={loadingStates[`delete-${product.id}`]}
                      className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-all duration-200"
                    >
                      {loadingStates[`delete-${product.id}`] ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <CheckCircle className="w-6 h-6" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setConfirmDelete(null)}
                      className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-500/20 transition-all duration-200"
                    >
                      <X className="w-6 h-6" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setConfirmDelete(product.id)}
                    className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-all duration-200 hover:scale-110"
                  >
                    <Trash2 className="w-6 h-6" />
                  </Button>
                )}
              </div>
              <div className="flex items-start gap-3">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0 pr-12">
                  <h3 className="font-semibold text-white truncate">{product.name}</h3>
                  <p className="text-gray-400 text-sm capitalize">{product.category}</p>
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
                        {product.stock} in stock
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


                {/* Product Information */}
                <div className="bg-slate-700/30 rounded-lg p-3">
                  <p className="text-gray-300 text-sm">{product.description}</p>
                  {product.specifications && Object.keys(product.specifications).length > 0 && (
                    <div className="mt-2 space-y-1">
                      <p className="text-gray-400 text-xs font-medium">Key Specifications:</p>
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(product.specifications).slice(0, 3).map(([key, value]) => (
                          <Badge key={key} variant="secondary" className="text-xs">
                            {key}: {value}
                          </Badge>
                        ))}
                      </div>
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
          <p className="text-gray-400 text-lg">No products found</p>
        </div>
      )}
    </div>
  );
}