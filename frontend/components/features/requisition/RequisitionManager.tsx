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
  User,
  Calendar,
  Package,
  Search,
  Filter,
  Send,
  Eye,
  AlertCircle
} from 'lucide-react';

export function RequisitionManager() {
  const { products, updateStock } = useProducts();
  const { requisitions, addRequisition, updateRequisitionStatus } = useRequisitions();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showNewRequisition, setShowNewRequisition] = useState(false);
  const [selectedRequisition, setSelectedRequisition] = useState<any>(null);
  
  const [newRequisition, setNewRequisition] = useState({
    employeeName: '',
    department: '',
    items: [{ productId: '', productName: '', quantity: 1, justification: '' }],
    priority: 'normal' as 'low' | 'normal' | 'high' | 'urgent',
    notes: ''
  });

  const filteredRequisitions = requisitions.filter(req => {
    const matchesSearch = req.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.items.some(item => item.productName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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

  const handleApproveRequisition = (requisitionId: string) => {
    const requisition = requisitions.find(r => r.id === requisitionId);
    if (requisition) {
      // Add stock for each item in the requisition
      requisition.items.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
          updateStock(product.id, product.stock + item.quantity);
        }
      });
      
      // Update requisition status to approved
      updateRequisitionStatus(requisitionId, 'approved');
    }
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
    pending: requisitions.filter(r => r.status === 'pending').length,
    approved: requisitions.filter(r => r.status === 'approved').length,
    rejected: requisitions.filter(r => r.status === 'rejected').length,
    fulfilled: requisitions.filter(r => r.status === 'fulfilled').length,
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-green-400" />
          <h2 className="text-lg font-semibold text-white">Requisition Management</h2>
        </div>
        <p className="text-gray-300 text-sm mt-1">
          Submit requests for new components. When approved, stock will be automatically added to inventory.
        </p>
      </div>

      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-amber-500/10 border-amber-500/20 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-400 text-sm font-medium">Pending</p>
              <p className="text-2xl font-bold text-white">{statusCounts.pending}</p>
            </div>
            <Clock className="w-8 h-8 text-amber-400" />
          </div>
        </Card>

        <Card className="bg-green-500/10 border-green-500/20 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-400 text-sm font-medium">Approved</p>
              <p className="text-2xl font-bold text-white">{statusCounts.approved}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </Card>

        <Card className="bg-red-500/10 border-red-500/20 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-400 text-sm font-medium">Rejected</p>
              <p className="text-2xl font-bold text-white">{statusCounts.rejected}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
        </Card>

        <Card className="bg-blue-500/10 border-blue-500/20 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-400 text-sm font-medium">Fulfilled</p>
              <p className="text-2xl font-bold text-white">{statusCounts.fulfilled}</p>
            </div>
            <Package className="w-8 h-8 text-blue-400" />
          </div>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search requisitions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-700 border-slate-600 text-white w-64"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white rounded-md px-3 py-2"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="fulfilled">Fulfilled</option>
            </select>
          </div>
        </div>

        <Dialog open={showNewRequisition} onOpenChange={setShowNewRequisition}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              New Requisition
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Requisition</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Employee Name</Label>
                  <Input
                    value={newRequisition.employeeName}
                    onChange={(e) => setNewRequisition({...newRequisition, employeeName: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label>Department</Label>
                  <Input
                    value={newRequisition.department}
                    onChange={(e) => setNewRequisition({...newRequisition, department: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>

              <div>
                <Label>Priority</Label>
                <select
                  value={newRequisition.priority}
                  onChange={(e) => setNewRequisition({...newRequisition, priority: e.target.value as 'low' | 'normal' | 'high' | 'urgent'})}
                  className="w-full bg-slate-700 border-slate-600 text-white rounded-md px-3 py-2"
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Requested Items</Label>
                  <Button
                    type="button"
                    onClick={handleAddItem}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add Item
                  </Button>
                </div>
                
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {newRequisition.items.map((item, index) => (
                    <div key={index} className="bg-slate-700/50 rounded-lg p-3">
                      <div className="grid grid-cols-12 gap-2 items-start">
                        <div className="col-span-4">
                          <Label className="text-xs">Product</Label>
                          <select
                            value={item.productId}
                            onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                            className="w-full bg-slate-600 border-slate-500 text-white rounded px-2 py-1 text-sm"
                          >
                            <option value="">Select Product</option>
                            {products.map(product => (
                              <option key={product.id} value={product.id}>
                                {product.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-span-2">
                          <Label className="text-xs">Quantity</Label>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                            className="bg-slate-600 border-slate-500 text-white text-sm"
                            min="1"
                          />
                        </div>
                        <div className="col-span-5">
                          <Label className="text-xs">Justification</Label>
                          <Input
                            value={item.justification}
                            onChange={(e) => handleItemChange(index, 'justification', e.target.value)}
                            placeholder="Why is this needed?"
                            className="bg-slate-600 border-slate-500 text-white text-sm"
                          />
                        </div>
                        <div className="col-span-1 flex items-end">
                          <Button
                            type="button"
                            onClick={() => handleRemoveItem(index)}
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
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
                  placeholder="Any additional information or special requirements..."
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <Button onClick={handleSubmitRequisition} className="w-full bg-blue-600 hover:bg-blue-700">
                <Send className="w-4 h-4 mr-2" />
                Submit Requisition
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Requisitions List */}
      <div className="space-y-4">
        {filteredRequisitions.map((requisition) => (
          <Card key={requisition.id} className="bg-slate-800/50 border-slate-700/50 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className="bg-blue-500/20 p-2 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">REQ-{requisition.id.slice(-6).toUpperCase()}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>{requisition.employeeName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Package className="w-3 h-3" />
                      <span>{requisition.department}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(requisition.createdAt).toLocaleDateString()}</span>
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
              <h4 className="text-white font-medium">Requested Items:</h4>
              <div className="bg-slate-700/30 rounded-lg p-3">
                {requisition.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-1">
                    <span className="text-gray-300">{item.productName}</span>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-blue-400">Qty: {item.quantity}</span>
                      {item.justification && (
                        <span className="text-gray-400 italic">"{item.justification}"</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {requisition.notes && (
              <div className="mb-4">
                <h4 className="text-white font-medium mb-1">Notes:</h4>
                <p className="text-gray-300 text-sm bg-slate-700/30 rounded p-2">{requisition.notes}</p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {requisition.status === 'pending' && (
                  <>
                    <Button
                      onClick={() => handleApproveRequisition(requisition.id)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white transition-all duration-200 hover:scale-105"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Approve & Add Stock
                    </Button>
                    <Button
                      onClick={() => updateRequisitionStatus(requisition.id, 'rejected')}
                      size="sm"
                      variant="outline"
                      className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white transition-all duration-200 hover:scale-105"
                    >
                      <XCircle className="w-3 h-3 mr-1" />
                      Reject
                    </Button>
                  </>
                )}
                {requisition.status === 'approved' && (
                  <Button
                    onClick={() => updateRequisitionStatus(requisition.id, 'fulfilled')}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Package className="w-3 h-3 mr-1" />
                    Mark Fulfilled
                  </Button>
                )}
              </div>
              
              <Button
                onClick={() => setSelectedRequisition(requisition)}
                size="sm"
                variant="ghost"
                className="text-gray-400 hover:text-white"
              >
                <Eye className="w-3 h-3 mr-1" />
                View Details
              </Button>
            </div>
          </Card>
        ))}

        {filteredRequisitions.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No requisitions found</p>
          </div>
        )}
      </div>
    </div>
  );
}