import React, { useState, useEffect, useRef } from 'react';
import { Users, MapPin, Activity, AlertTriangle } from 'lucide-react';
import { useLocationContext } from '../context/LocationContext';
import { useUserContext } from '../context/UserContext';

interface MapUser {
  id: string;
  name: string;
  role: 'student' | 'teacher' | 'staff';
  x: number;
  y: number;
  lastSeen: Date;
  building: string;
  room: string;
}

const MapView: React.FC = () => {
  const { locations, addLocation } = useLocationContext();
  const { users } = useUserContext();
  const [selectedUser, setSelectedUser] = useState<MapUser | null>(null);
  const [showTrails, setShowTrails] = useState(true);
  const [mapUsers, setMapUsers] = useState<MapUser[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Simulate real-time location updates
  useEffect(() => {
    const interval = setInterval(() => {
      const simulatedUsers: MapUser[] = [
        {
          id: '1',
          name: 'Alice Johnson',
          role: 'student',
          x: Math.random() * 600 + 50,
          y: Math.random() * 400 + 50,
          lastSeen: new Date(),
          building: 'Library',
          room: 'Study Hall A'
        },
        {
          id: '2',
          name: 'Prof. Smith',
          role: 'teacher',
          x: Math.random() * 600 + 50,
          y: Math.random() * 400 + 50,
          lastSeen: new Date(),
          building: 'Science Building',
          room: 'Lab 205'
        },
        {
          id: '3',
          name: 'Bob Wilson',
          role: 'student',
          x: Math.random() * 600 + 50,
          y: Math.random() * 400 + 50,
          lastSeen: new Date(),
          building: 'Student Center',
          room: 'Cafeteria'
        },
        {
          id: '4',
          name: 'Dr. Brown',
          role: 'teacher',
          x: Math.random() * 600 + 50,
          y: Math.random() * 400 + 50,
          lastSeen: new Date(),
          building: 'Engineering',
          room: 'Office 301'
        },
        {
          id: '5',
          name: 'Carol Davis',
          role: 'staff',
          x: Math.random() * 600 + 50,
          y: Math.random() * 400 + 50,
          lastSeen: new Date(),
          building: 'Admin Building',
          room: 'IT Support'
        }
      ];
      
      setMapUsers(simulatedUsers);
      
      // Add to location history
      simulatedUsers.forEach(user => {
        addLocation({
          userId: user.id,
          x: user.x,
          y: user.y,
          timestamp: new Date(),
          building: user.building,
          room: user.room
        });
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [addLocation]);

  // Draw campus map
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw parchment-style background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#fef7cd');
    gradient.addColorStop(0.5, '#fef3c7');
    gradient.addColorStop(1, '#fed7aa');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw building outlines
    const buildings = [
      { name: 'Library', x: 100, y: 100, w: 120, h: 80, color: '#8b5a2b' },
      { name: 'Science Building', x: 300, y: 80, w: 100, h: 120, color: '#7c3aed' },
      { name: 'Student Center', x: 150, y: 250, w: 140, h: 100, color: '#dc2626' },
      { name: 'Engineering', x: 400, y: 200, w: 110, h: 90, color: '#059669' },
      { name: 'Admin Building', x: 500, y: 50, w: 80, h: 100, color: '#ea580c' }
    ];

    buildings.forEach(building => {
      ctx.fillStyle = building.color + '40';
      ctx.fillRect(building.x, building.y, building.w, building.h);
      ctx.strokeStyle = building.color;
      ctx.lineWidth = 2;
      ctx.strokeRect(building.x, building.y, building.w, building.h);
      
      ctx.fillStyle = building.color;
      ctx.font = '12px serif';
      ctx.textAlign = 'center';
      ctx.fillText(building.name, building.x + building.w/2, building.y + building.h/2);
    });

    // Draw pathways
    ctx.strokeStyle = '#8b5a2b';
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(50, 300);
    ctx.lineTo(600, 300);
    ctx.moveTo(250, 50);
    ctx.lineTo(250, 400);
    ctx.stroke();
    ctx.setLineDash([]);

  }, []);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'student': return '#3b82f6';
      case 'teacher': return '#dc2626';
      case 'staff': return '#059669';
      default: return '#6b7280';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'teacher': return '👨‍🏫';
      case 'staff': return '👨‍💼';
      default: return '👨‍🎓';
    }
  };

  return (
    <div className="relative h-96 md:h-[500px]">
      {/* Map Canvas */}
      <canvas
        ref={canvasRef}
        width={700}
        height={500}
        className="absolute inset-0 w-full h-full object-contain border-2 border-amber-300 rounded-lg"
        style={{ imageRendering: 'pixelated' }}
      />

      {/* User Markers */}
      <div className="absolute inset-0 w-full h-full">
        {mapUsers.map(user => (
          <div
            key={user.id}
            className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000"
            style={{
              left: `${(user.x / 700) * 100}%`,
              top: `${(user.y / 500) * 100}%`
            }}
            onClick={() => setSelectedUser(user)}
          >
            {/* Animated pulse ring */}
            <div 
              className="absolute inset-0 rounded-full animate-ping opacity-30"
              style={{ backgroundColor: getRoleColor(user.role), width: '24px', height: '24px', margin: '-4px' }}
            />
            
            {/* User marker */}
            <div
              className="relative w-4 h-4 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-xs"
              style={{ backgroundColor: getRoleColor(user.role) }}
            >
              <span className="text-white text-xs font-bold">
                {getRoleIcon(user.role)}
              </span>
            </div>

            {/* Movement trail */}
            {showTrails && (
              <div className="absolute inset-0">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 rounded-full opacity-20 animate-pulse"
                    style={{
                      backgroundColor: getRoleColor(user.role),
                      left: `${-2 - i * 3}px`,
                      top: `${Math.sin(i) * 2}px`,
                      animationDelay: `${i * 200}ms`
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 left-4 space-y-2">
        <button
          onClick={() => setShowTrails(!showTrails)}
          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
            showTrails ? 'bg-amber-200 text-amber-900' : 'bg-white text-gray-700 hover:bg-amber-50'
          }`}
        >
          {showTrails ? 'Hide Trails' : 'Show Trails'}
        </button>
      </div>

      {/* Live Stats */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="flex items-center space-x-2 text-sm">
          <Activity className="h-4 w-4 text-green-600 animate-pulse" />
          <span className="font-medium text-gray-800">{mapUsers.length} Active</span>
        </div>
        <div className="text-xs text-gray-600 mt-1">
          Last update: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 shadow-xl max-w-sm w-full border-2 border-amber-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{selectedUser.name}</h3>
                <p className="text-sm text-gray-600 capitalize">{selectedUser.role}</p>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-amber-600" />
                <div>
                  <p className="font-medium text-gray-800">{selectedUser.building}</p>
                  <p className="text-sm text-gray-600">{selectedUser.room}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm text-gray-800">Last seen</p>
                  <p className="text-xs text-gray-600">{selectedUser.lastSeen.toLocaleString()}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200">
                <button className="w-full px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg transition-colors text-sm">
                  View Location History
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;