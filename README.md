# ElectroStock Pro 🔌

**Modern Electronic Components Warehouse Management System**

A comprehensive inventory management solution designed specifically for electronic components warehouses, featuring dual-mode access for administrators and end-users with an intuitive vending machine interface.

![ElectroStock Pro](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![React](https://img.shields.io/badge/React-18-61dafb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-38bdf8)

## 🚀 Features

### 🔧 Admin Mode
- **Comprehensive Dashboard** - Real-time inventory overview with analytics
- **Product Management** - Add, edit, and remove electronic components
- **Smart Inventory Tracking** - Automatic stock level monitoring
- **Custom Specifications** - User-defined key specifications for each component
- **Stock Alerts** - Low stock and critical stock notifications
- **Requisition Management** - Handle stock requests and approvals
- **Image Upload** - Visual component identification

### 👤 User Mode (Vending Machine Interface)
- **Intuitive Component Selection** - Browse and search electronic components
- **Smart Quantity Control** - Quick quantity buttons (+1, +10, -10, -1) and custom input
- **Shopping Cart System** - Add multiple items before checkout
- **Real-time Stock Validation** - Prevents over-ordering
- **Instant Inventory Updates** - Changes reflect immediately on admin side
- **Visual Product Cards** - Clear component information and availability

### 🎯 Key Capabilities
- **Dual-Mode Interface** - Seamless switching between admin and user modes
- **Real-time Synchronization** - All changes update instantly across both interfaces
- **Component Categories** - Organized by microcontrollers, sensors, resistors, etc.
- **Stock Status Indicators** - Visual indicators for stock levels (Good/Low/Out of Stock)
- **Search & Filter** - Quick component discovery
- **Responsive Design** - Works on desktop, tablet, and mobile devices

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Shadcn/ui** - Modern UI components
- **Lucide React** - Beautiful icons
- **React Context API** - State management

### Architecture
- **Component-Based** - Modular and reusable components
- **Context Providers** - Centralized state management
- **Real-time Updates** - Instant synchronization between admin and user modes
- **Responsive Design** - Mobile-first approach

## 📦 Installation

### Prerequisites
- Node.js 18.0 or higher
- npm or yarn package manager

### Setup
1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/electrostock-pro.git
   cd electrostock-pro
   ```

2. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

## 🚀 Usage

### Admin Mode
1. **Dashboard**: View inventory overview and analytics
2. **Add Products**: 
   - Upload component images
   - Add custom specifications (Operating Voltage, Current Rating, etc.)
   - Set stock levels and thresholds
3. **Manage Inventory**: Monitor stock levels and receive alerts
4. **Process Requisitions**: Handle user requests and approvals

### User Mode (Vending Machine)
1. **Browse Components**: Search and filter available components
2. **Add to Cart**: Use quick quantity buttons or custom amounts
3. **Review Cart**: Modify quantities with +/-10, +/-1 controls
4. **Take Items**: Process entire cart with automatic stock deduction

### Mode Switching
- Click the **"Switch to User"** or **"Switch to Admin"** button in the top-right corner
- No login required - instant role switching for demonstration purposes

## 📊 Component Categories

- **Microcontrollers** - Arduino, ESP32, Raspberry Pi modules
- **Sensors** - Temperature, ultrasonic, motion sensors
- **Resistors** - Various resistance values and power ratings
- **Capacitors** - Electrolytic and ceramic capacitors
- **Semiconductors** - LEDs, transistors, diodes
- **Connectors** - Breadboards, jumper wires, headers

## 🔧 Configuration

### Mock Data
The system includes pre-populated mock data with common electronic components:
- Arduino Uno R3
- Temperature Sensors (DS18B20)
- Ultrasonic Sensors (HC-SR04)
- Resistor and Capacitor kits
- LED starter kits
- Servo motors

### Customization
- **Add new categories** in the ProductContext
- **Modify component specifications** through the admin interface
- **Adjust stock thresholds** for different alert levels
- **Customize UI colors** in the Tailwind configuration

## 🎨 Screenshots

### Admin Dashboard
![Admin Dashboard](tes)

### Vending Machine Interface
![Vending Machine](https://via.placeholder.com/800x400/059669/ffffff?text=Vending+Machine+Interface)

### Component Management
![Component Management](https://via.placeholder.com/800x400/2563eb/ffffff?text=Component+Management)

## 🔮 Future Enhancements

- [ ] **Database Integration** - PostgreSQL/MongoDB backend
- [ ] **User Authentication** - Role-based access control
- [ ] **Barcode Scanning** - Quick component identification
- [ ] **Supplier Management** - Vendor and purchase order tracking
- [ ] **Reporting System** - Usage analytics and inventory reports
- [ ] **Mobile App** - Native iOS/Android applications
- [ ] **API Integration** - Third-party inventory systems
- [ ] **Multi-location Support** - Multiple warehouse management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


---

**Built with ❤️ for the electronics community**

*ElectroStock Pro - Making component management as easy as selecting from a vending machine*