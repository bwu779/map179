import React, { useState, useMemo } from 'react';
import { Users, Search, MapPin, Clock, Shield, Eye, EyeOff, Filter } from 'lucide-react';
import { useUserContext } from '../context/UserContext';
import { usePrivacyContext } from '../context/PrivacyContext';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'staff';
  department: string;
  lastSeen: Date;
  currentLocation?: {
    building: string;
    room: string;
  };
  privacyLevel: 'public' | 'friends' | 'private';
  isOnline: boolean;
  consentGiven: boolean;
}

const UserPanel: React.FC = () => {
  const { hasPermission } = usePrivacyContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'student' | 'teacher' | 'staff'>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Simulated user data
  const allUsers: User[] = [
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice.johnson@university.edu',
      role: 'student',
      department: 'Computer Science',
      lastSeen: new Date(Date.now() - 5 * 60000),
      currentLocation: { building: 'Library', room: 'Study Hall A' },
      privacyLevel: 'public',
      isOnline: true,
      consentGiven: true
    },
    {
      id: '2',
      name: 'Prof. Robert Smith',
      email: 'r.smith@university.edu',
      role: 'teacher',
      department: 'Physics',
      lastSeen: new Date(Date.now() - 15 * 60000),
      currentLocation: { building: 'Science Building', room: 'Lab 205' },
      privacyLevel: 'friends',
      isOnline: true,
      consentGiven: true
    },
    {
      id: '3',
      name: 'Bob Wilson',
      email: 'bob.wilson@university.edu',
      role: 'student',
      department: 'Engineering',
      lastSeen: new Date(Date.now() - 45 * 60000),
      currentLocation: { building: 'Student Center', room: 'Cafeteria' },
      privacyLevel: 'public',
      isOnline: false,
      consentGiven: true
    },
    {
      id: '4',
      name: 'Dr. Sarah Brown',
      email: 's.brown@university.edu',
      role: 'teacher',
      department: 'Engineering',
      lastSeen: new Date(Date.now() - 30 * 60000),
      currentLocation: { building: 'Engineering', room: 'Office 301' },
      privacyLevel: 'private',
      isOnline: true,
      consentGiven: true
    },
    {
      id: '5',
      name: 'Carol Davis',
      email: 'carol.davis@university.edu',
      role: 'staff',
      department: 'IT Support',
      lastSeen: new Date(Date.now() - 2 * 60000),
      currentLocation: { building: 'Admin Building', room: 'IT Support' },
      privacyLevel: 'public',
      isOnline: true,
      consentGiven: true
    },
    {
      id: '6',
      name: 'Mike Chen',
      email: 'mike.chen@university.edu',
      role: 'student',
      department: 'Mathematics',
      lastSeen: new Date(Date.now() - 2 * 60 * 60000),
      privacyLevel: 'friends',
      isOnline: false,
      consentGiven: false
    }
  ];

  const filteredUsers = useMemo(() => {
    return allUsers.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.department.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = filterRole === 'all' || user.role === filterRole;
      
      const hasAccess = hasPermission('view_location', user.id) || user.privacyLevel === 'public';
      
      return matchesSearch && matchesRole && hasAccess;
    });
  }, [searchTerm, filterRole, allUsers, hasPermission]);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'student': return 'bg-blue-100 text-blue-800';
      case 'teacher': return 'bg-red-100 text-red-800';
      case 'staff': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPrivacyIcon = (level: string) => {
    switch (level) {
      case 'public': return <Eye className="h-4 w-4 text-green-600" />;
      case 'friends': return <Shield className="h-4 w-4 text-yellow-600" />;
      case 'private': return <EyeOff className="h-4 w-4 text-red-600" />;
      default: return <Shield className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatLastSeen = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg border-2 border-amber-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Users className="h-6 w-6 text-amber-600" />
            <div>
              <h2 className="text-xl font-bold text-amber-900">People Directory</h2>
              <p className="text-amber-700 text-sm">Manage and track campus community</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
              className="px-3 py-2 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition-colors"
            >
              {viewMode === 'list' ? 'Grid View' : 'List View'}
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as any)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="all">All Roles</option>
              <option value="student">Students</option>
              <option value="teacher">Teachers</option>
              <option value="staff">Staff</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-amber-50 p-3 rounded-lg">
            <p className="text-sm text-amber-700">Total Users</p>
            <p className="text-2xl font-bold text-amber-900">{filteredUsers.length}</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-sm text-green-700">Online Now</p>
            <p className="text-2xl font-bold text-green-900">{filteredUsers.filter(u => u.isOnline).length}</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-700">Students</p>
            <p className="text-2xl font-bold text-blue-900">{filteredUsers.filter(u => u.role === 'student').length}</p>
          </div>
          <div className="bg-red-50 p-3 rounded-lg">
            <p className="text-sm text-red-700">Faculty</p>
            <p className="text-2xl font-bold text-red-900">{filteredUsers.filter(u => u.role === 'teacher').length}</p>
          </div>
        </div>
      </div>

      {/* User List/Grid */}
      <div className="bg-white rounded-xl shadow-lg border-2 border-amber-200">
        <div className="p-6">
          <div className={viewMode === 'list' ? 'space-y-3' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'}>
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${
                  !user.consentGiven ? 'opacity-50' : ''
                }`}
                onClick={() => setSelectedUser(user)}
              >
                <div className={viewMode === 'list' ? 'flex items-center justify-between' : 'space-y-3'}>
                  <div className={viewMode === 'list' ? 'flex items-center space-x-4' : ''}>
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      {user.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>

                    <div className={viewMode === 'list' ? '' : 'text-center'}>
                      <h3 className="font-semibold text-gray-900">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                        {getPrivacyIcon(user.privacyLevel)}
                        {!user.consentGiven && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                            No Consent
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className={`text-sm ${viewMode === 'list' ? 'text-right' : 'text-center mt-3'}`}>
                    {user.currentLocation && user.consentGiven ? (
                      <div className="flex items-center space-x-1 text-green-600">
                        <MapPin className="h-4 w-4" />
                        <span>{user.currentLocation.building}</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1 text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>Location hidden</span>
                      </div>
                    )}
                    <p className="text-gray-500 text-xs mt-1">
                      {formatLastSeen(user.lastSeen)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No users found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 shadow-xl max-w-md w-full border-2 border-amber-200">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {selectedUser.name.charAt(0)}
                    </span>
                  </div>
                  {selectedUser.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{selectedUser.name}</h3>
                  <p className="text-sm text-gray-600">{selectedUser.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(selectedUser.role)}`}>
                      {selectedUser.role}
                    </span>
                    {getPrivacyIcon(selectedUser.privacyLevel)}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Department</label>
                <p className="text-gray-900">{selectedUser.department}</p>
              </div>

              {selectedUser.currentLocation && selectedUser.consentGiven && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Current Location</label>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-amber-600" />
                    <p className="text-gray-900">
                      {selectedUser.currentLocation.building} - {selectedUser.currentLocation.room}
                    </p>
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-700">Last Seen</label>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <p className="text-gray-900">{formatLastSeen(selectedUser.lastSeen)}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Privacy Level</label>
                <div className="flex items-center space-x-2">
                  {getPrivacyIcon(selectedUser.privacyLevel)}
                  <p className="text-gray-900 capitalize">{selectedUser.privacyLevel}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Consent Status</label>
                <p className={`font-medium ${selectedUser.consentGiven ? 'text-green-600' : 'text-red-600'}`}>
                  {selectedUser.consentGiven ? 'Consent Given' : 'No Consent'}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200 space-y-2">
                <button className="w-full px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg transition-colors">
                  View Location History
                </button>
                <button className="w-full px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg transition-colors">
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPanel;