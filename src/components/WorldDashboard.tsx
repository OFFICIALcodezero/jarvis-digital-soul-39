
import React, { useState } from 'react';
import { format } from 'date-fns';
import LocationSearch from './LocationSearch';
import WeatherCard from './WeatherCard';
import { toast } from "@/hooks/use-toast";

export interface Location {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
}

const WorldDashboard = () => {
  const [locations, setLocations] = useState<Location[]>([]);

  const handleAddLocation = (newLocation: Location) => {
    if (locations.find(loc => loc.id === newLocation.id)) {
      toast({
        title: "Location already added",
        description: `${newLocation.name} is already in your dashboard`,
        variant: "destructive",
      });
      return;
    }
    
    setLocations(prev => [...prev, newLocation]);
    toast({
      title: "Location added",
      description: `${newLocation.name} has been added to your dashboard`,
    });
  };

  const handleRemoveLocation = (locationId: string) => {
    setLocations(prev => prev.filter(loc => loc.id !== locationId));
  };

  return (
    <div className="max-w-7xl mx-auto">
      <LocationSearch onLocationSelect={handleAddLocation} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {locations.map(location => (
          <WeatherCard
            key={location.id}
            location={location}
            onRemove={() => handleRemoveLocation(location.id)}
          />
        ))}
      </div>
      
      {locations.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          Search and add locations to view their time and weather
        </div>
      )}
    </div>
  );
};

export default WorldDashboard;
