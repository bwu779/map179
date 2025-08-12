import React, { useState, useRef, useEffect } from 'react';
import { Search, Send, Bot, User, Clock, MapPin, Users, AlertCircle } from 'lucide-react';

interface QueryResult {
  id: string;
  type: 'user' | 'location' | 'event' | 'analytics';
  title: string;
  description: string;
  timestamp?: Date;
  confidence: number;
  metadata?: Record<string, any>;
}

const AIQueryInterface: React.FC = () => {
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{
    type: 'user' | 'ai';
    message: string;
    timestamp: Date;
    results?: QueryResult[];
  }>>([
    {
      type: 'ai',
      message: "Welcome to the AI Query Interface! I can help you find people, analyze patterns, and monitor campus activity. Try asking me something like 'Who is in the library right now?' or 'Show me movement patterns for the last hour.'",
      timestamp: new Date(),
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const exampleQueries = [
    "Who is currently in the Science Building?",
    "Show all teachers on campus right now",
    "Find students who visited the library today",
    "Alert me when someone enters Lab 205 after hours",
    "Show movement patterns for Alice Johnson",
    "Which buildings have the most activity?",
    "List all users who haven't been seen in 2 hours",
    "Show me the heat map for the Student Center"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const simulateAIResponse = (userQuery: string): { message: string; results?: QueryResult[] } => {
    const lowerQuery = userQuery.toLowerCase();
    
    if (lowerQuery.includes('who') && lowerQuery.includes('library')) {
      return {
        message: "I found 3 people currently in the Library building:",
        results: [
          {
            id: '1',
            type: 'user',
            title: 'Alice Johnson',
            description: 'Student in Study Hall A, arrived 45 minutes ago',
            timestamp: new Date(Date.now() - 45 * 60000),
            confidence: 0.95,
            metadata: { building: 'Library', room: 'Study Hall A', role: 'student' }
          },
          {
            id: '2',
            type: 'user',
            title: 'Mike Chen',
            description: 'Student in Computer Lab, arrived 1.2 hours ago',
            timestamp: new Date(Date.now() - 72 * 60000),
            confidence: 0.92,
            metadata: { building: 'Library', room: 'Computer Lab', role: 'student' }
          },
          {
            id: '3',
            type: 'user',
            title: 'Prof. Williams',
            description: 'Teacher in Research Section, arrived 20 minutes ago',
            timestamp: new Date(Date.now() - 20 * 60000),
            confidence: 0.88,
            metadata: { building: 'Library', room: 'Research Section', role: 'teacher' }
          }
        ]
      };
    }
    
    if (lowerQuery.includes('teacher') && lowerQuery.includes('campus')) {
      return {
        message: "Currently, there are 4 teachers active on campus:",
        results: [
          {
            id: '1',
            type: 'user',
            title: 'Prof. Smith',
            description: 'In Science Building Lab 205, conducting research',
            confidence: 0.97,
            metadata: { building: 'Science Building', role: 'teacher' }
          },
          {
            id: '2',
            type: 'user',
            title: 'Dr. Brown',
            description: 'In Engineering Office 301, office hours',
            confidence: 0.93,
            metadata: { building: 'Engineering', role: 'teacher' }
          }
        ]
      };
    }
    
    if (lowerQuery.includes('movement') || lowerQuery.includes('pattern')) {
      return {
        message: "Here are the movement patterns for the requested user:",
        results: [
          {
            id: '1',
            type: 'analytics',
            title: 'Movement Analysis',
            description: 'Alice Johnson visited 4 different locations today',
            confidence: 0.91,
            metadata: { 
              locations: ['Dorm → Library → Student Center → Science Building'],
              duration: '6.5 hours active',
              mostVisited: 'Library (3.2 hours)'
            }
          }
        ]
      };
    }
    
    if (lowerQuery.includes('alert') || lowerQuery.includes('lab 205')) {
      return {
        message: "I've set up a real-time alert for Lab 205 after-hours access:",
        results: [
          {
            id: '1',
            type: 'event',
            title: 'Alert Created',
            description: 'Monitoring Lab 205 for access between 6 PM - 6 AM',
            confidence: 1.0,
            metadata: { 
              alertType: 'location-access',
              location: 'Science Building Lab 205',
              schedule: 'After hours (18:00-06:00)',
              notifications: 'Email + Dashboard'
            }
          }
        ]
      };
    }
    
    if (lowerQuery.includes('heat map') || lowerQuery.includes('activity')) {
      return {
        message: "Campus activity analysis shows high traffic areas:",
        results: [
          {
            id: '1',
            type: 'analytics',
            title: 'Student Center Activity',
            description: 'Peak hours: 12-2 PM (lunch) and 5-7 PM (dinner)',
            confidence: 0.89,
            metadata: { 
              peakOccupancy: '156 people',
              averageVisitDuration: '47 minutes',
              popularAreas: ['Cafeteria', 'Study Lounge', 'Game Room']
            }
          }
        ]
      };
    }

    // Default response
    return {
      message: "I understand your query. Here's what I found based on current campus data:",
      results: [
        {
          id: '1',
          type: 'analytics',
          title: 'Campus Overview',
          description: 'Currently tracking 127 users across 5 main buildings',
          confidence: 0.85,
          metadata: { 
            totalUsers: 127,
            buildings: 5,
            alerts: 2
          }
        }
      ]
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Add user message
    const userMessage = {
      type: 'user' as const,
      message: query,
      timestamp: new Date(),
    };
    
    setChatHistory(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    // Simulate AI processing delay
    setTimeout(() => {
      const response = simulateAIResponse(query);
      const aiMessage = {
        type: 'ai' as const,
        message: response.message,
        timestamp: new Date(),
        results: response.results,
      };
      
      setChatHistory(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);

    setQuery('');
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'user': return Users;
      case 'location': return MapPin;
      case 'event': return AlertCircle;
      case 'analytics': return Clock;
      default: return Search;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600 bg-green-50';
    if (confidence >= 0.7) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-amber-200 h-[600px] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-100 to-yellow-100 px-6 py-4 border-b border-amber-200 rounded-t-xl">
        <div className="flex items-center space-x-3">
          <Bot className="h-6 w-6 text-amber-800" />
          <div>
            <h2 className="text-xl font-bold text-amber-900">AI Query Interface</h2>
            <p className="text-amber-700 text-sm">Natural language campus intelligence</p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {chatHistory.map((message, index) => (
          <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-3xl ${message.type === 'user' ? 'order-2' : ''}`}>
              {/* Message bubble */}
              <div
                className={`px-4 py-3 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-amber-200 text-amber-900'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <div className="flex items-start space-x-2">
                  {message.type === 'ai' && <Bot className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />}
                  <p className="text-sm">{message.message}</p>
                </div>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>

              {/* Results */}
              {message.results && (
                <div className="mt-3 space-y-2">
                  {message.results.map((result) => {
                    const Icon = getResultIcon(result.type);
                    return (
                      <div key={result.id} className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <Icon className="h-5 w-5 text-amber-600 mt-0.5" />
                            <div>
                              <h4 className="font-semibold text-gray-900 text-sm">{result.title}</h4>
                              <p className="text-gray-600 text-sm">{result.description}</p>
                              {result.timestamp && (
                                <p className="text-xs text-gray-500 mt-1">
                                  <Clock className="h-3 w-3 inline mr-1" />
                                  {result.timestamp.toLocaleString()}
                                </p>
                              )}
                              {result.metadata && (
                                <div className="mt-2 text-xs text-gray-600 space-y-1">
                                  {Object.entries(result.metadata).map(([key, value]) => (
                                    <div key={key}>
                                      <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span> {value}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(result.confidence)}`}>
                            {(result.confidence * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 px-4 py-3 rounded-2xl">
              <div className="flex items-center space-x-2">
                <Bot className="h-5 w-5 text-amber-600" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Example queries */}
      <div className="px-6 py-2 border-t border-gray-100">
        <p className="text-xs text-gray-600 mb-2">Try these example queries:</p>
        <div className="flex flex-wrap gap-1">
          {exampleQueries.slice(0, 4).map((example, index) => (
            <button
              key={index}
              onClick={() => setQuery(example)}
              className="px-2 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs hover:bg-amber-100 transition-colors"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-6 border-t border-gray-200">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about locations, people, patterns, or set up alerts..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIQueryInterface;