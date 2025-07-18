'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface RequisitionItem {
  productId: string;
  productName: string;
  quantity: number;
  justification: string;
}

// │ > Now for the entire system do you think there is any other function can be added? The use case is to let the PCB board researcher or development team have      │
// │   this vending machine like system for them to knowing what component they can have so to save their time                                                        

interface Requisition {
  id: string;
  employeeName: string;
  department: string;
  items: RequisitionItem[];
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'pending' | 'approved' | 'rejected' | 'fulfilled';
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface RequisitionContextType {
  requisitions: Requisition[];
  addRequisition: (requisitionData: Omit<Requisition, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => void;
  updateRequisitionStatus: (requisitionId: string, status: Requisition['status']) => void;
  getRequisitionsByStatus: (status: Requisition['status']) => Requisition[];
  getRequisitionsByEmployee: (employeeName: string) => Requisition[];
  getPendingRequestsCount: () => number;
}

const RequisitionContext = createContext<RequisitionContextType | undefined>(undefined);

export function useRequisitions() {
  const context = useContext(RequisitionContext);
  if (!context) {
    throw new Error('useRequisitions must be used within a RequisitionProvider');
  }
  return context;
}

export function RequisitionProvider({ children }: { children: ReactNode }) {
  const [requisitions, setRequisitions] = useState<Requisition[]>([
    {
      id: '1',
      employeeName: 'John Smith',
      department: 'Electronics Lab',
      items: [
        { productId: '1', productName: 'Arduino Uno R3', quantity: 5, justification: 'Student projects for embedded systems course' },
        { productId: '2', productName: 'Resistor Kit (600pcs)', quantity: 2, justification: 'Lab inventory running low' }
      ],
      priority: 'high',
      status: 'pending',
      notes: 'Needed for upcoming semester projects. Students will be working on IoT devices.',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      employeeName: 'Sarah Johnson',
      department: 'R&D Department',
      items: [
        { productId: '6', productName: 'Temperature Sensor (DS18B20)', quantity: 10, justification: 'Prototype development for climate monitoring system' },
        { productId: '8', productName: 'Ultrasonic Sensor (HC-SR04)', quantity: 8, justification: 'Distance measurement modules for robotics project' }
      ],
      priority: 'urgent',
      status: 'approved',
      notes: 'Critical for client demo next week. Please expedite processing.',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '3',
      employeeName: 'Mike Chen',
      department: 'Quality Assurance',
      items: [
        { productId: '3', productName: 'Capacitor Set (120pcs)', quantity: 1, justification: 'Testing component reliability for new product line' }
      ],
      priority: 'normal',
      status: 'fulfilled',
      notes: 'Standard testing procedure for incoming components.',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '4',
      employeeName: 'Lisa Wang',
      department: 'Production',
      items: [
        { productId: '4', productName: 'LED Starter Kit', quantity: 20, justification: 'Assembly line indicators for new production setup' },
        { productId: '7', productName: 'Jumper Wire Kit', quantity: 15, justification: 'Wiring harness prototypes' }
      ],
      priority: 'high',
      status: 'rejected',
      notes: 'Budget constraints for Q4. Please resubmit with reduced quantities or defer to next quarter.',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]);

  const addRequisition = (requisitionData: Omit<Requisition, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
    const newRequisition: Requisition = {
      ...requisitionData,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setRequisitions(prev => [newRequisition, ...prev]);
  };

  const updateRequisitionStatus = (requisitionId: string, status: Requisition['status']) => {
    setRequisitions(prev =>
      prev.map(req =>
        req.id === requisitionId
          ? { ...req, status, updatedAt: new Date().toISOString() }
          : req
      )
    );
  };

  const getRequisitionsByStatus = (status: Requisition['status']) => {
    return requisitions.filter(req => req.status === status);
  };

  const getRequisitionsByEmployee = (employeeName: string) => {
    return requisitions.filter(req => req.employeeName.toLowerCase().includes(employeeName.toLowerCase()));
  };

  const getPendingRequestsCount = () => {
    return requisitions.filter(req => req.status === 'pending').length;
  };

  const value = {
    requisitions,
    addRequisition,
    updateRequisitionStatus,
    getRequisitionsByStatus,
    getRequisitionsByEmployee,
    getPendingRequestsCount,
  };

  return (
    <RequisitionContext.Provider value={value}>
      {children}
    </RequisitionContext.Provider>
  );
}