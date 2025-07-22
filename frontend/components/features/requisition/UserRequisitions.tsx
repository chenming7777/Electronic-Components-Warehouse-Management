'use client';

import { useState } from 'react';
import { useProducts } from '@/contexts/ProductContext';
import { useRequisitions } from '@/contexts/RequisitionContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  FileText, 
  Plus, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Calendar,
  Package,
  Send,
  RotateCcw,
  Trash2
} from 'lucide-react';

export function UserRequisitions() {
  const { products } = useProducts();
  const { requisitions, addRequisition, updateRequisitionStatus } = useRequisitions();
  const [showNewRequisition, setShowNewRequisition] = useState(false);
  
  const [newRequisition, setNewRequisition] = useState({
    employeeName: '',
    department: '',
    items: [{ productId: '', productName: '', quantity: 1, justification: '' }],
    priority: 'normal' as 'low' | 'normal' | 'high' | 'urgent',
    notes: ''
  });

  // Filter to show only current user's requisitions (in a real app, this would filter by actual user ID)
  const userRequisitions = requisitions.slice(0, 3); // Simulating user's own requisitions

  const handleAddItem = () => {
    setNewRequisition({
      ...newRequisition,
      items: [...newRequisition.items, { productId: '', productName: '', quantity: 1, justification: '' }]
    });
  };

  const handleRemoveItem = (index: number) => {
    setNewRequisition({
      ...newRequisition,
      items: newRequisition.items.filter((_, i) => i !== index)
    });
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const updatedItems = newRequisition.items.map((item, i) => {
      if (i === index) {
        if (field === 'productId') {
          const product = products.find(p => p.id === value);
          return { ...item, productId: value, productName: product?.name || '' };
        }
        return { ...item, [field]: value };
      }
      return item;
    });
    setNewRequisition({ ...newRequisition, items: updatedItems });
  };

  const handleSubmitRequisition = () => {
    if (newRequisition.employeeName && newRequisition.department && newRequisition.items.length > 0) {
      addRequisition(newRequisition);
      setNewRequisition({
        employeeName: '',
        department: '',
        items: [{ productId: '', productName: '', quantity: 1, justification: '' }],
        priority: 'normal' as 'low' | 'normal' | 'high' | 'urgent',
        notes: ''
      });
      setShowNewRequisition(false);
    }
  };

  const handleCancelRequisition = (requisitionId: string) => {
    updateRequisitionStatus(requisitionId, 'rejected');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'approved': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'rejected': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'fulfilled': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'high': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'normal': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'low': return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const statusCounts = {
    pending: userRequisitions.filter(r => r.status === 'pending').length,
    approved: userRequisitions.filter(r => r.status === 'approved').length,
    rejected: userRequisitions.filter(r => r.status === 'rejected').length,
    fulfilled: userRequisitions.filter(r => r.status === 'fulfilled').length,
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-white">My Requisition Requests</h2>
        </div>
        <p className="text-gray-300 text-sm mt-1">
          Request components you need for your projects. Track the status of your submissions and manage pending requests.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-amber-500/10 border-amber-500/20 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-400 text-sm font-medium">Pending</p>
              <p className="text-2xl font-bold text-white">{statusCounts.pending}</p>
            </div>
            <Clock className="w-6 h-6 text-amber-400" />
          </div>
        </Card>

        <Card className="bg-green-500/10 border-green-500/20 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-400 text-sm font-medium">Approved</p>
              <p className="text-2xl font-bold text-white">{statusCounts.approved}</p>
            </div>
            <CheckCircle className="w-6 h-6 text-green-400" />
          </div>
        </Card>

        <Card className="bg-red-500/10 border-red-500/20 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-400 text-sm font-medium">Rejected</p>
              <p className="text-2xl font-bold text-white">{statusCounts.rejected}</p>
            </div>
            <XCircle className="w-6 h-6 text-red-400" />
          </div>
        </Card>

        <Card className="bg-blue-500/10 border-blue-500/20 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-400 text-sm font-medium">Fulfilled</p>
              <p className="text-2xl font-bold text-white">{statusCounts.fulfilled}</p>
            </div>
            <Package className="w-6 h-6 text-blue-400" />
          </div>
        </Card>
      </div>

      {/* New Requisition Button */}
      <div className="flex justify-center md:justify-start">
        <Dialog open={showNewRequisition} onOpenChange={setShowNewRequisition}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
              <Plus className="w-5 h-5 mr-2" />
              Request New Components
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">Request Components</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Your Name *</Label>
                  <Input
                    value={newRequisition.employeeName}
                    onChange={(e) => setNewRequisition({...newRequisition, employeeName: e.target.value})}
                    placeholder="Enter your full name"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label>Department *</Label>
                  <Input
                    value={newRequisition.department}
                    onChange={(e) => setNewRequisition({...newRequisition, department: e.target.value})}
                    placeholder="e.g. Electronics Lab, R&D"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>

              <div>
                <Label>Request Priority</Label>
                <select
                  value={newRequisition.priority}
                  onChange={(e) => setNewRequisition({...newRequisition, priority: e.target.value as 'low' | 'normal' | 'high' | 'urgent'})}
                  className="w-full bg-slate-700 border-slate-600 text-white rounded-md px-3 py-2"
                >
                  <option value="low">Low - Can wait</option>
                  <option value="normal">Normal - Standard timeline</option>
                  <option value="high">High - Needed soon</option>
                  <option value="urgent">Urgent - Critical for project</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Components Needed *</Label>
                  <Button
                    type="button"
                    onClick={handleAddItem}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add Component
                  </Button>
                </div>
                
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {newRequisition.items.map((item, index) => (
                    <div key={index} className="bg-slate-700/50 rounded-lg p-3">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-start">
                        <div className="md:col-span-4">
                          <Label className="text-xs">Component</Label>
                          <select
                            value={item.productId}
                            onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                            className="w-full bg-slate-600 border-slate-500 text-white rounded px-2 py-1 text-sm"
                          >
                            <option value="">Select Component</option>
                            {products.map(product => (
                              <option key={product.id} value={product.id}>
                                {product.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <Label className="text-xs">Quantity</Label>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                            className="bg-slate-600 border-slate-500 text-white text-sm"
                            min="1"
                          />
                        </div>
                        <div className="md:col-span-5">
                          <Label className="text-xs">Why do you need this? *</Label>
                          <Input
                            value={item.justification}
                            onChange={(e) => handleItemChange(index, 'justification', e.target.value)}
                            placeholder="Brief explanation of use case"
                            className="bg-slate-600 border-slate-500 text-white text-sm"
                          />
                        </div>
                        <div className="md:col-span-1 flex items-end">
                          {newRequisition.items.length > 1 && (
                            <Button
                              type="button"
                              onClick={() => handleRemoveItem(index)}
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Additional Notes</Label>
                <Textarea
                  value={newRequisition.notes}
                  onChange={(e) => setNewRequisition({...newRequisition, notes: e.target.value})}
                  placeholder="Any additional context, deadlines, or special requirements..."
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <Button 
                onClick={handleSubmitRequisition} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3"
                disabled={!newRequisition.employeeName || !newRequisition.department || newRequisition.items.some(item => !item.productId || !item.justification)}
              >
                <Send className="w-4 h-4 mr-2" />
                Submit Request
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* My Requisitions List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">My Recent Requests</h3>
        {userRequisitions.map((requisition) => (
          <Card key={requisition.id} className="bg-slate-800/50 border-slate-700/50 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className="bg-blue-500/20 p-2 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">REQ-{requisition.id.slice(-6).toUpperCase()}</h4>
                  <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(requisition.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Package className="w-3 h-3" />
                      <span>{requisition.items.length} item{requisition.items.length > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge className={getPriorityColor(requisition.priority)}>
                  {requisition.priority}
                </Badge>
                <Badge className={getStatusColor(requisition.status)}>
                  {requisition.status}
                </Badge>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <h5 className="text-white font-medium">Requested Components:</h5>
              <div className="bg-slate-700/30 rounded-lg p-3 space-y-1">
                {requisition.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-300">{item.productName}</span>
                    <span className="text-blue-400">Qty: {item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {requisition.notes && (
              <div className="mb-4">
                <h5 className="text-white font-medium mb-1">Notes:</h5>
                <p className="text-gray-300 text-sm bg-slate-700/30 rounded p-2">{requisition.notes}</p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">
                {requisition.status === 'pending' && (
                  <div className="flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>Awaiting approval</span>
                  </div>
                )}
                {requisition.status === 'approved' && (
                  <div className="flex items-center gap-1 text-green-400">
                    <CheckCircle className="w-3 h-3" />
                    <span>Approved - components will be added to inventory</span>
                  </div>
                )}
                {requisition.status === 'rejected' && (
                  <div className="flex items-center gap-1 text-red-400">
                    <XCircle className="w-3 h-3" />
                    <span>Request was declined</span>
                  </div>
                )}
                {requisition.status === 'fulfilled' && (
                  <div className="flex items-center gap-1 text-blue-400">
                    <Package className="w-3 h-3" />
                    <span>Completed - components available in vending machine</span>
                  </div>
                )}
              </div>
              
              {requisition.status === 'pending' && (
                <Button
                  onClick={() => handleCancelRequisition(requisition.id)}
                  size="sm"
                  variant="outline"
                  className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Cancel Request
                </Button>
              )}
            </div>
          </Card>
        ))}

        {userRequisitions.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No requisitions yet</p>
            <p className="text-gray-500 text-sm mt-1">Click "Request New Components" to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}