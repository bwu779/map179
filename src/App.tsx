import React, { useState, useEffect } from 'react';
import { Users, Map, Shield, BarChart3, Search, Settings, Eye, EyeOff } from 'lucide-react';
import MapView from './components/MapView';
import UserPanel from './components/UserPanel';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import PrivacyControls from './components/PrivacyControls';
import AIQueryInterface from './components/AIQueryInterface';
import { LocationProvider } from './context/LocationContext';
import { PrivacyProvider } from './context/PrivacyContext';
import { UserProvider } from './context/UserContext';

type View = 'map' | 'users' | 'analytics' | 'privacy' | 'ai-query';

function App() {
  const [activeView, setActiveView] = useState<View>('map');
  const [isMapVisible, setIsMapVisible] = useState(true);
  
  const navigationItems = [
    { id: 'map' as View, icon: Map, label: 'Live Map', description: 'Real-time campus visualization' },
    { id: 'ai-query' as View, icon: Search, label: 'AI Query', description: 'Intelligent location search' },
    { id: 'users' as View, icon: Users, label: 'People', description: 'User management & tracking' },
    { id: 'analytics' as View, icon: BarChart3, label: 'Analytics', description: 'Movement patterns & insights' },
    { id: 'privacy' as View, icon: Shield, label: 'Privacy', description: 'Security & consent controls' },
  ];

  return (
    <UserProvider>
      <PrivacyProvider>
        <LocationProvider>
          <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
            {/* Header */}
            <header className="bg-gradient-to-r from-amber-900 via-yellow-800 to-orange-900 text-white shadow-lg border-b-4 border-amber-600">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between py-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-amber-100 p-2 rounded-lg">
                      <Map className="h-8 w-8 text-amber-800" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold tracking-tight">Marauder's Map</h1>
                      <p className="text-amber-200 text-sm">University Location Intelligence Platform</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setIsMapVisible(!isMapVisible)}
                      className="flex items-center space-x-2 px-3 py-2 bg-amber-700 hover:bg-amber-600 rounded-lg transition-colors"
                    >
                      {isMapVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      <span className="text-sm">{isMapVisible ? 'Hide Map' : 'Show Map'}</span>
                    </button>
                    
                    <div className="bg-amber-700 px-3 py-2 rounded-lg">
                      <p className="text-sm font-medium">Campus Admin</p>
                      <p className="text-xs text-amber-200">Security Level: High</p>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {/* Navigation */}
              <div className="mb-6">
                <nav className="flex flex-wrap gap-2">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveView(item.id)}
                        className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                          activeView === item.id
                            ? 'bg-amber-200 text-amber-900 shadow-md border-2 border-amber-400'
                            : 'bg-white text-gray-700 hover:bg-amber-50 hover:text-amber-800 border-2 border-gray-200 hover:border-amber-300'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <div className="text-left">
                          <div className="font-semibold text-sm">{item.label}</div>
                          <div className="text-xs opacity-75">{item.description}</div>
                        </div>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Main Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Map Section */}
                {isMapVisible && (
                  <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border-2 border-amber-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-amber-100 to-yellow-100 px-6 py-4 border-b border-amber-200">
                      <h2 className="text-xl font-bold text-amber-900">Live Campus Map</h2>
                      <p className="text-amber-700 text-sm">Real-time location tracking and visualization</p>
                    </div>
                    <MapView />
                  </div>
                )}

                {/* Side Panel */}
                <div className={`${isMapVisible ? 'lg:col-span-1' : 'lg:col-span-3'} space-y-6`}>
                  {activeView === 'map' && (
                    <div className="bg-white rounded-xl shadow-lg border-2 border-amber-200 p-6">
                      <h3 className="text-lg font-bold text-amber-900 mb-4">Map Controls</h3>
                      <div className="space-y-3">
                        <button className="w-full px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg transition-colors">
                          Show All Users
                        </button>
                        <button className="w-full px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg transition-colors">
                          Filter by Building
                        </button>
                        <button className="w-full px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg transition-colors">
                          View Heat Map
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {activeView === 'ai-query' && <AIQueryInterface />}
                  {activeView === 'users' && <UserPanel />}
                  {activeView === 'analytics' && <AnalyticsDashboard />}
                  {activeView === 'privacy' && <PrivacyControls />}
                </div>
              </div>
            </div>

            {/* Footer */}
            <footer className="bg-amber-900 text-white mt-12 py-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="mb-4 md:mb-0">
                    <p className="text-amber-200">&copy; 2025 University Marauder's Map Platform</p>
                    <p className="text-xs text-amber-300">Secure • Privacy-First • AI-Powered</p>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-amber-200">Privacy Compliant</span>
                    <span className="text-amber-200">•</span>
                    <span className="text-amber-200">GDPR & FERPA</span>
                    <span className="text-amber-200">•</span>
                    <span className="text-amber-200">End-to-End Encrypted</span>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </LocationProvider>
      </PrivacyProvider>
    </UserProvider>
  );
}

export default App;