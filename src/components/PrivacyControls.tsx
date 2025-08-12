import React, { useState } from 'react';
import { Shield, Lock, Eye, EyeOff, Users, Settings, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { usePrivacyContext } from '../context/PrivacyContext';

interface ConsentRecord {
  userId: string;
  name: string;
  email: string;
  consentGiven: boolean;
  consentDate?: Date;
  dataTypes: string[];
  retentionPeriod: string;
  canWithdraw: boolean;
}

interface PrivacyPolicy {
  id: string;
  title: string;
  description: string;
  dataTypes: string[];
  purpose: string;
  retentionPeriod: string;
  isRequired: boolean;
  isActive: boolean;
}

const PrivacyControls: React.FC = () => {
  const { privacySettings, updatePrivacySettings, hasPermission } = usePrivacyContext();
  const [activeTab, setActiveTab] = useState<'settings' | 'consent' | 'policies' | 'audits'>('settings');
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ConsentRecord | null>(null);

  // Mock data for demonstration
  const consentRecords: ConsentRecord[] = [
    {
      userId: '1',
      name: 'Alice Johnson',
      email: 'alice.johnson@university.edu',
      consentGiven: true,
      consentDate: new Date('2024-01-15'),
      dataTypes: ['location', 'activity', 'schedule'],
      retentionPeriod: '2 years',
      canWithdraw: true
    },
    {
      userId: '2',
      name: 'Bob Wilson',
      email: 'bob.wilson@university.edu',
      consentGiven: false,
      dataTypes: [],
      retentionPeriod: 'N/A',
      canWithdraw: true
    },
    {
      userId: '3',
      name: 'Prof. Smith',
      email: 'r.smith@university.edu',
      consentGiven: true,
      consentDate: new Date('2024-02-01'),
      dataTypes: ['location', 'schedule'],
      retentionPeriod: '1 year',
      canWithdraw: false
    }
  ];

  const privacyPolicies: PrivacyPolicy[] = [
    {
      id: 'location-tracking',
      title: 'Location Tracking',
      description: 'Track real-time and historical location data using ID card scans and mobile app',
      dataTypes: ['GPS coordinates', 'Building entry/exit', 'Room occupancy'],
      purpose: 'Campus security and space management',
      retentionPeriod: '2 years',
      isRequired: true,
      isActive: true
    },
    {
      id: 'activity-monitoring',
      title: 'Activity Monitoring',
      description: 'Monitor movement patterns and activity levels for analytics',
      dataTypes: ['Movement patterns', 'Time stamps', 'Duration tracking'],
      purpose: 'Campus planning and optimization',
      retentionPeriod: '1 year',
      isRequired: false,
      isActive: true
    },
    {
      id: 'social-interactions',
      title: 'Social Interaction Analysis',
      description: 'Analyze proximity and interaction patterns for research purposes',
      dataTypes: ['Proximity data', 'Interaction frequency', 'Group formations'],
      purpose: 'Academic research and social studies',
      retentionPeriod: '6 months',
      isRequired: false,
      isActive: false
    }
  ];

  const auditLogs = [
    { id: 1, action: 'Data Access', user: 'Admin', target: 'Alice Johnson', timestamp: new Date(), result: 'Granted' },
    { id: 2, action: 'Consent Withdrawal', user: 'Bob Wilson', target: 'Self', timestamp: new Date(Date.now() - 3600000), result: 'Success' },
    { id: 3, action: 'Privacy Policy Update', user: 'System', target: 'Location Tracking', timestamp: new Date(Date.now() - 7200000), result: 'Updated' },
    { id: 4, action: 'Data Export', user: 'Research Team', target: 'Anonymized Dataset', timestamp: new Date(Date.now() - 10800000), result: 'Approved' }
  ];

  const handleConsentUpdate = (userId: string, consent: boolean) => {
    // In real implementation, this would update the database
    console.log(`Updating consent for user ${userId} to ${consent}`);
    setShowConsentModal(false);
    setSelectedUser(null);
  };

  const handlePolicyToggle = (policyId: string) => {
    // In real implementation, this would update policy status
    console.log(`Toggling policy ${policyId}`);
  };

  const tabs = [
    { id: 'settings' as const, label: 'Privacy Settings', icon: Settings },
    { id: 'consent' as const, label: 'Consent Management', icon: CheckCircle },
    { id: 'policies' as const, label: 'Data Policies', icon: Shield },
    { id: 'audits' as const, label: 'Audit Logs', icon: Eye }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg border-2 border-amber-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Shield className="h-6 w-6 text-amber-600" />
          <div>
            <h2 className="text-xl font-bold text-amber-900">Privacy & Security Controls</h2>
            <p className="text-amber-700 text-sm">Manage data privacy, consent, and compliance</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-amber-200 text-amber-900'
                    : 'bg-gray-100 text-gray-600 hover:bg-amber-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Privacy Settings */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-xl shadow-lg border-2 border-amber-200 p-6">
          <h3 className="text-lg font-bold text-amber-900 mb-6">Global Privacy Settings</h3>
          
          <div className="space-y-6">
            {/* Data Collection Settings */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <Lock className="h-5 w-5 text-amber-600" />
                <span>Data Collection</span>
              </h4>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">Real-time Location Tracking</p>
                    <p className="text-sm text-gray-600">Track users' current locations via ID cards and mobile apps</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">Historical Data Storage</p>
                    <p className="text-sm text-gray-600">Store location history for analytics and patterns</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">Anonymous Analytics</p>
                    <p className="text-sm text-gray-600">Collect anonymized data for campus improvements</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Access Controls */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <Eye className="h-5 w-5 text-amber-600" />
                <span>Access Controls</span>
              </h4>
              
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-gray-800 mb-2">Default Privacy Level</p>
                  <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500">
                    <option value="public">Public - Visible to all authorized users</option>
                    <option value="friends">Friends - Visible to approved connections</option>
                    <option value="private">Private - Visible to user and admin only</option>
                  </select>
                </div>
                
                <div>
                  <p className="font-medium text-gray-800 mb-2">Data Retention Period</p>
                  <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500">
                    <option value="6m">6 months</option>
                    <option value="1y">1 year</option>
                    <option value="2y">2 years</option>
                    <option value="5y">5 years</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Compliance */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Compliance Status</span>
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800">GDPR Compliant</span>
                  </div>
                  <span className="text-sm text-green-600">Active</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800">FERPA Compliant</span>
                  </div>
                  <span className="text-sm text-green-600">Active</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <span className="font-medium text-yellow-800">CCPA Compliance</span>
                  </div>
                  <span className="text-sm text-yellow-600">Review Required</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Consent Management */}
      {activeTab === 'consent' && (
        <div className="bg-white rounded-xl shadow-lg border-2 border-amber-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-amber-900">Consent Management</h3>
            <div className="text-sm text-gray-600">
              {consentRecords.filter(r => r.consentGiven).length} of {consentRecords.length} users consented
            </div>
          </div>
          
          <div className="space-y-4">
            {consentRecords.map((record) => (
              <div key={record.userId} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${record.consentGiven ? 'bg-green-500' : 'bg-red-500'}`} />
                    <div>
                      <p className="font-medium text-gray-900">{record.name}</p>
                      <p className="text-sm text-gray-600">{record.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className={`font-medium ${record.consentGiven ? 'text-green-600' : 'text-red-600'}`}>
                        {record.consentGiven ? 'Consent Given' : 'No Consent'}
                      </p>
                      {record.consentDate && (
                        <p className="text-xs text-gray-500">
                          {record.consentDate.toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    
                    <button
                      onClick={() => setSelectedUser(record)}
                      className="px-3 py-1 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition-colors text-sm"
                    >
                      Manage
                    </button>
                  </div>
                </div>
                
                {record.consentGiven && (
                  <div className="mt-3 text-sm text-gray-600">
                    <p><strong>Data Types:</strong> {record.dataTypes.join(', ')}</p>
                    <p><strong>Retention:</strong> {record.retentionPeriod}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Data Policies */}
      {activeTab === 'policies' && (
        <div className="bg-white rounded-xl shadow-lg border-2 border-amber-200 p-6">
          <h3 className="text-lg font-bold text-amber-900 mb-6">Data Usage Policies</h3>
          
          <div className="space-y-4">
            {privacyPolicies.map((policy) => (
              <div key={policy.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-semibold text-gray-900">{policy.title}</h4>
                      {policy.isRequired && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                          Required
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-3">{policy.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-gray-800">Data Types:</p>
                        <ul className="text-gray-600 mt-1">
                          {policy.dataTypes.map((type, index) => (
                            <li key={index}>• {type}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <p className="font-medium text-gray-800">Purpose:</p>
                        <p className="text-gray-600 mt-1">{policy.purpose}</p>
                        <p className="font-medium text-gray-800 mt-2">Retention:</p>
                        <p className="text-gray-600">{policy.retentionPeriod}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-4">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={policy.isActive}
                        onChange={() => handlePolicyToggle(policy.id)}
                        disabled={policy.isRequired}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600 disabled:opacity-50"></div>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Audit Logs */}
      {activeTab === 'audits' && (
        <div className="bg-white rounded-xl shadow-lg border-2 border-amber-200 p-6">
          <h3 className="text-lg font-bold text-amber-900 mb-6">Privacy Audit Logs</h3>
          
          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    log.result === 'Success' || log.result === 'Granted' || log.result === 'Approved' || log.result === 'Updated'
                      ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <div>
                    <p className="font-medium text-gray-900">{log.action}</p>
                    <p className="text-sm text-gray-600">
                      {log.user} → {log.target}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`font-medium text-sm ${
                    log.result === 'Success' || log.result === 'Granted' || log.result === 'Approved' || log.result === 'Updated'
                      ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {log.result}
                  </p>
                  <p className="text-xs text-gray-500">
                    {log.timestamp.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex justify-between items-center">
            <button className="px-4 py-2 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition-colors">
              Export Audit Log
            </button>
            <p className="text-sm text-gray-600">
              Showing last 10 entries • {auditLogs.length} total
            </p>
          </div>
        </div>
      )}

      {/* Consent Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 shadow-xl max-w-md w-full border-2 border-amber-200">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Manage Consent</h3>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="font-medium text-gray-800">{selectedUser.name}</p>
                <p className="text-sm text-gray-600">{selectedUser.email}</p>
              </div>

              <div>
                <p className="font-medium text-gray-800">Current Status:</p>
                <p className={`${selectedUser.consentGiven ? 'text-green-600' : 'text-red-600'}`}>
                  {selectedUser.consentGiven ? 'Consent Given' : 'No Consent'}
                </p>
              </div>

              {selectedUser.consentGiven && (
                <>
                  <div>
                    <p className="font-medium text-gray-800">Data Types:</p>
                    <p className="text-gray-600 text-sm">{selectedUser.dataTypes.join(', ')}</p>
                  </div>
                  
                  <div>
                    <p className="font-medium text-gray-800">Retention Period:</p>
                    <p className="text-gray-600 text-sm">{selectedUser.retentionPeriod}</p>
                  </div>
                </>
              )}

              <div className="pt-4 border-t border-gray-200 space-y-2">
                {selectedUser.canWithdraw && (
                  <button 
                    onClick={() => handleConsentUpdate(selectedUser.userId, !selectedUser.consentGiven)}
                    className={`w-full px-4 py-2 rounded-lg transition-colors font-medium ${
                      selectedUser.consentGiven
                        ? 'bg-red-100 text-red-800 hover:bg-red-200'
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    {selectedUser.consentGiven ? 'Withdraw Consent' : 'Grant Consent'}
                  </button>
                )}
                
                <button
                  onClick={() => setSelectedUser(null)}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrivacyControls;