'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  image: string;
  description: string;
  function?: string;
  specifications: Record<string, string>;
  lowStockThreshold?: number;
  criticalStockThreshold?: number;
}

interface ProductContextType {
  products: Product[];
  loading: boolean;
  searchTerm: string;
  selectedCategory: string;
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: string) => void;
  updateStock: (productId: string, newStock: number) => void;
  addProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
  updateProductThresholds: (productId: string, lowThreshold: number, criticalThreshold: number) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    // Simulate API call to load products
    const loadProducts = async () => {
      setLoading(true);
      
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'Arduino Uno R3',
          category: 'microcontrollers',
          stock: 15,
          image: '/pictures/adrino_R3.png',
          description: 'Microcontroller board based on the ATmega328P',
          function: 'Microcontroller Development',
          specifications: {
            'Operating Voltage': '5V',
            'Input Voltage': '7-12V',
            'Digital I/O Pins': '14',
            'Analog Input Pins': '6'
          },
          lowStockThreshold: 20,
          criticalStockThreshold: 5
        },
        {
          id: '2',
          name: 'Resistor Kit (600pcs)',
          category: 'resistors',
          stock: 25,
          image: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=400',
          description: 'Assorted resistor kit with various resistance values',
          function: 'Current Limiting',
          specifications: {
            'Resistance Range': '10Ω to 1MΩ',
            'Tolerance': '±5%',
            'Power Rating': '1/4W',
            'Package': 'Through-hole'
          }
        },
        {
          id: '3',
          name: 'Capacitor Set (120pcs)',
          category: 'capacitors',
          stock: 8,
          image: 'https://images.pexels.com/photos/343457/pexels-photo-343457.jpeg?auto=compress&cs=tinysrgb&w=400',
          description: 'Electrolytic and ceramic capacitor assortment',
          specifications: {
            'Capacitance Range': '10pF to 1000µF',
            'Voltage Rating': '16V to 50V',
            'Types': 'Ceramic, Electrolytic',
            'Tolerance': '±20%'
          },
          lowStockThreshold: 15,
          criticalStockThreshold: 3
        },
        {
          id: '4',
          name: 'LED Starter Kit',
          category: 'semiconductors',
          stock: 30,
          image: 'https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg?auto=compress&cs=tinysrgb&w=400',
          description: 'Assorted LEDs in various colors and sizes',
          specifications: {
            'Colors': 'Red, Green, Blue, Yellow, White',
            'Forward Voltage': '1.8V to 3.3V',
            'Forward Current': '20mA',
            'Viewing Angle': '120°'
          }
        },
        {
          id: '5',
          name: 'Breadboard (830 tie points)',
          category: 'connectors',
          stock: 20,
          image: 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=400',
          description: 'Solderless breadboard for prototyping',
          specifications: {
            'Tie Points': '830',
            'Size': '165mm x 55mm',
            'Pitch': '2.54mm',
            'Material': 'ABS Plastic'
          }
        },
        {
          id: '6',
          name: 'Temperature Sensor (DS18B20)',
          category: 'sensors',
          stock: 12,
          image: 'https://images.pexels.com/photos/60582/newton-s-cradle-balls-sphere-action-60582.jpeg?auto=compress&cs=tinysrgb&w=400',
          description: 'Digital temperature sensor with 1-wire interface',
          function: 'Temperature Monitoring',
          specifications: {
            'Temperature Range': '-55°C to +125°C',
            'Accuracy': '±0.5°C',
            'Resolution': '9 to 12 bits',
            'Interface': '1-Wire'
          }
        },
        {
          id: '7',
          name: 'Jumper Wire Kit',
          category: 'connectors',
          stock: 18,
          image: 'https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg?auto=compress&cs=tinysrgb&w=400',
          description: 'Male-to-male, male-to-female, female-to-female wires',
          specifications: {
            'Length': '20cm',
            'Wire Gauge': '24AWG',
            'Types': 'M-M, M-F, F-F',
            'Colors': 'Assorted'
          }
        },
        {
          id: '8',
          name: 'Ultrasonic Sensor (HC-SR04)',
          category: 'sensors',
          stock: 22,
          image: '/pictures/Ultrasonic_Sensor_(HC-SR04).png',
          description: 'Ultrasonic ranging module for distance measurement',
          specifications: {
            'Operating Voltage': '5V',
            'Measuring Range': '2cm to 400cm',
            'Accuracy': '±3mm',
            'Frequency': '40kHz'
          }
        },
        {
          id: '9',
          name: 'Servo Motor (SG90)',
          category: 'semiconductors',
          stock: 14,
          image: 'https://images.pexels.com/photos/343457/pexels-photo-343457.jpeg?auto=compress&cs=tinysrgb&w=400',
          description: 'Micro servo motor for precise positioning',
          specifications: {
            'Operating Voltage': '4.8V to 6V',
            'Torque': '1.8kg/cm',
            'Speed': '0.1s/60°',
            'Rotation': '180°'
          }
        },
        {
          id: '10',
          name: 'Transistor Kit (200pcs)',
          category: 'semiconductors',
          stock: 6,
          image: 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=400',
          description: 'Assorted NPN and PNP transistors',
          specifications: {
            'Types': 'NPN, PNP',
            'Package': 'TO-92',
            'Voltage': '40V to 60V',
            'Current': '100mA to 1A'
          },
          lowStockThreshold: 12,
          criticalStockThreshold: 4
        }
      ];

      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProducts(mockProducts);
      setLoading(false);
    };

    loadProducts();
  }, []);

  const updateStock = (productId: string, newStock: number) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId ? { ...product, stock: newStock } : product
      )
    );
  };

  const addProduct = (product: Product) => {
    setProducts(prevProducts => [...prevProducts, product]);
  };

  const removeProduct = (productId: string) => {
    setProducts(prevProducts => prevProducts.filter(product => product.id !== productId));
  };

  const updateProductThresholds = (productId: string, lowThreshold: number, criticalThreshold: number) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId 
          ? { ...product, lowStockThreshold: lowThreshold, criticalStockThreshold: criticalThreshold }
          : product
      )
    );
  };

  const value = {
    products,
    loading,
    searchTerm,
    selectedCategory,
    setSearchTerm,
    setSelectedCategory,
    updateStock,
    addProduct,
    removeProduct,
    updateProductThresholds,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}