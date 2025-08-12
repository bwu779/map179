import React, { createContext, useContext, useState, useCallback } from 'react';

interface Location {
  userId: string;
  x: number;
  y: number;
  timestamp: Date;
  building: string;
  room: string;
}

interface LocationContextType {
  locations: Location[];
  addLocation: (location: Location) => void;
  getLocationHistory: (userId: string, hours?: number) => Location[];
  getCurrentLocation: (userId: string) => Location | null;
  getUsersInBuilding: (building: string) => Location[];
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locations, setLocations] = useState<Location[]>([]);

  const addLocation = useCallback((location: Location) => {
    setLocations(prev => [...prev, location].slice(-1000)); // Keep last 1000 locations
  }, []);

  const getLocationHistory = useCallback((userId: string, hours: number = 24) => {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    return locations
      .filter(loc => loc.userId === userId && loc.timestamp >= cutoff)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [locations]);

  const getCurrentLocation = useCallback((userId: string) => {
    const userLocations = locations.filter(loc => loc.userId === userId);
    if (userLocations.length === 0) return null;
    
    return userLocations.reduce((latest, current) => 
      current.timestamp > latest.timestamp ? current : latest
    );
  }, [locations]);

  const getUsersInBuilding = useCallback((building: string) => {
    const now = new Date();
    const recentCutoff = new Date(now.getTime() - 30 * 60 * 1000); // Last 30 minutes
    
    // Get most recent location for each user
    const userLatestLocations = new Map<string, Location>();
    
    locations
      .filter(loc => loc.timestamp >= recentCutoff)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .forEach(loc => {
        if (!userLatestLocations.has(loc.userId)) {
          userLatestLocations.set(loc.userId, loc);
        }
      });
    
    return Array.from(userLatestLocations.values())
      .filter(loc => loc.building === building);
  }, [locations]);

  const value: LocationContextType = {
    locations,
    addLocation,
    getLocationHistory,
    getCurrentLocation,
    getUsersInBuilding
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
};