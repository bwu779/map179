import React, { useState, useMemo } from 'react';
import { BarChart3, TrendingUp, Users, MapPin, Clock, Activity, AlertTriangle, Eye } from 'lucide-react';

interface AnalyticsData {
  timeRange: '1h' | '24h' | '7d' | '30d';
  totalUsers: number;
  activeUsers: number;
  buildingOccupancy: { name: string; count: number; capacity: number }[];
  popularLocations: { name: string; visits: number; avgDuration: number }[];
  movementPatterns: { hour: number; activity: number }[];
  alerts: { type: string; count: number; severity: 'low' | 'medium' | 'high' }[];
  privacyMetrics: { level: string; count: number; percentage: number }[];
}

const AnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
  const [selectedMetric, setSelectedMetric] = useState<string>('occupancy');

  const analyticsData: AnalyticsData = useMemo(() => {
    // Simulate different data based on time range
    const baseData = {
      '1h': { totalUsers: 45, activeUsers: 34 },
      '24h': { totalUsers: 127, activeUsers: 89 },
      '7d': { totalUsers: 312, activeUsers: 276 },
      '30d': { totalUsers: 1248, activeUsers: 1089 }
    };

    return {
      timeRange,
      totalUsers: baseData[timeRange].totalUsers,
      activeUsers: baseData[timeRange].activeUsers,
      buildingOccupancy: [
        { name: 'Library', count: 23, capacity: 150 },
        { name: 'Student Center', count: 34, capacity: 200 },
        { name: 'Science Building', count: 18, capacity: 100 },
        { name: 'Engineering', count: 12, capacity: 80 },
        { name: 'Admin Building', count: 8, capacity: 50 }
      ],
      popularLocations: [
        { name: 'Library Study Hall', visits: 156, avgDuration: 127 },
        { name: 'Student Center Cafeteria', visits: 234, avgDuration: 45 },
        { name: 'Science Lab 205', visits: 89, avgDuration: 178 },
        { name: 'Engineering Workshop', visits: 67, avgDuration: 203 },
        { name: 'Computer Lab', visits: 123, avgDuration: 95 }
      ],
      movementPatterns: Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        activity: Math.floor(Math.random() * 100) + 20
      })),
      alerts: [
        { type: 'After-hours access', count: 3, severity: 'medium' as const },
        { type: 'Capacity exceeded', count: 1, severity: 'high' as const },
        { type: 'Unusual movement', count: 5, severity: 'low' as const },
        { type: 'Privacy violation attempt', count: 2, severity: 'high' as const }
      ],
      privacyMetrics: [
        { level: 'Public', count: 45, percentage: 35.4 },
        { level: 'Friends', count: 52, percentage: 40.9 },
        { level: 'Private', count: 30, percentage: 23.6 }
      ]
    };
  }, [timeRange]);

  const getOccupancyPercentage = (count: number, capacity: number) => {
    return (count / capacity) * 100;
  };

  const getOccupancyColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-red-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const maxActivity = Math.max(...analyticsData.movementPatterns.map(p => p.activity));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg border-2 border-amber-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <BarChart3 className="h-6 w-6 text-amber-600" />
            <div>
              <h2 className="text-xl font-bold text-amber-900">Analytics Dashboard</h2>
              <p className="text-amber-700 text-sm">Campus activity insights and patterns</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {(['1h', '24h', '7d', '30d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-amber-200 text-amber-900'
                    : 'bg-gray-100 text-gray-600 hover:bg-amber-50'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <p className="text-sm text-blue-700">Total Users</p>
            </div>
            <p className="text-2xl font-bold text-blue-900">{analyticsData.totalUsers}</p>
            <p className="text-xs text-blue-600">+12% from last period</p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-green-600 animate-pulse" />
              <p className="text-sm text-green-700">Active Now</p>
            </div>
            <p className="text-2xl font-bold text-green-900">{analyticsData.activeUsers}</p>
            <p className="text-xs text-green-600">
              {((analyticsData.activeUsers / analyticsData.totalUsers) * 100).toFixed(1)}% online
            </p>
          </div>

          <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-amber-600" />
              <p className="text-sm text-amber-700">Locations</p>
            </div>
            <p className="text-2xl font-bold text-amber-900">{analyticsData.buildingOccupancy.length}</p>
            <p className="text-xs text-amber-600">Buildings tracked</p>
          </div>

          <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <p className="text-sm text-red-700">Alerts</p>
            </div>
            <p className="text-2xl font-bold text-red-900">
              {analyticsData.alerts.reduce((sum, alert) => sum + alert.count, 0)}
            </p>
            <p className="text-xs text-red-600">
              {analyticsData.alerts.filter(a => a.severity === 'high').length} high priority
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Building Occupancy */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-amber-200 p-6">
          <h3 className="text-lg font-bold text-amber-900 mb-4 flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Building Occupancy</span>
          </h3>
          
          <div className="space-y-3">
            {analyticsData.buildingOccupancy.map((building) => {
              const percentage = getOccupancyPercentage(building.count, building.capacity);
              return (
                <div key={building.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-800">{building.name}</span>
                    <span className="text-sm text-gray-600">
                      {building.count}/{building.capacity} ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${getOccupancyColor(percentage)}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Movement Patterns */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-amber-200 p-6">
          <h3 className="text-lg font-bold text-amber-900 mb-4 flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Activity Patterns (24h)</span>
          </h3>
          
          <div className="relative h-48 flex items-end justify-between space-x-1">
            {analyticsData.movementPatterns.map((pattern) => (
              <div key={pattern.hour} className="flex flex-col items-center space-y-1 flex-1">
                <div
                  className="w-full bg-gradient-to-t from-amber-500 to-amber-300 rounded-t transition-all duration-500"
                  style={{ height: `${(pattern.activity / maxActivity) * 100}%` }}
                />
                <span className="text-xs text-gray-500">
                  {pattern.hour.toString().padStart(2, '0')}
                </span>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Peak activity: {Math.max(...analyticsData.movementPatterns.map(p => p.activity))} movements at{' '}
              {analyticsData.movementPatterns.find(p => p.activity === maxActivity)?.hour}:00
            </p>
          </div>
        </div>

        {/* Popular Locations */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-amber-200 p-6">
          <h3 className="text-lg font-bold text-amber-900 mb-4 flex items-center space-x-2">
            <Eye className="h-5 w-5" />
            <span>Popular Locations</span>
          </h3>
          
          <div className="space-y-3">
            {analyticsData.popularLocations.slice(0, 5).map((location, index) => (
              <div key={location.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                    index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-gray-400' :
                    index === 2 ? 'bg-amber-600' : 'bg-gray-300'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{location.name}</p>
                    <p className="text-sm text-gray-600">{location.visits} visits</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">{location.avgDuration}m</p>
                  <p className="text-xs text-gray-500">avg duration</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Alerts */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-amber-200 p-6">
          <h3 className="text-lg font-bold text-amber-900 mb-4 flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Security Alerts</span>
          </h3>
          
          <div className="space-y-3">
            {analyticsData.alerts.map((alert, index) => (
              <div key={index} className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{alert.type}</p>
                    <p className="text-sm opacity-75">{alert.count} incidents</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                    alert.severity === 'high' ? 'bg-red-200 text-red-800' :
                    alert.severity === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                    'bg-green-200 text-green-800'
                  }`}>
                    {alert.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg transition-colors text-sm font-medium">
            View All Alerts
          </button>
        </div>
      </div>

      {/* Privacy Metrics */}
      <div className="bg-white rounded-xl shadow-lg border-2 border-amber-200 p-6">
        <h3 className="text-lg font-bold text-amber-900 mb-4 flex items-center space-x-2">
          <Eye className="h-5 w-5" />
          <span>Privacy Distribution</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {analyticsData.privacyMetrics.map((metric) => (
            <div key={metric.level} className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-800">{metric.level}</span>
                <span className="text-sm text-gray-600">{metric.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className="h-2 bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${metric.percentage}%` }}
                />
              </div>
              <p className="text-sm text-gray-600">{metric.count} users</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;