
import React, { useState } from 'react';
import { Location } from './WorldDashboard';

interface Props {
  onLocationSelect: (location: Location) => void;
}

const LocationSearch: React.FC<Props> = ({ onLocationSelect }) => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchLocations = async (query: string) => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=8d10b4b3bb1052ef47d0b24df9748937`
      );
      const data = await response.json();
      
      const formatted: Location[] = data.map((item: any) => ({
        id: `${item.lat}-${item.lon}`,
        name: item.name,
        country: item.country,
        lat: item.lat,
        lon: item.lon
      }));
      
      setResults(formatted);
    } catch (error) {
      console.error('Error searching locations:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          searchLocations(e.target.value);
        }}
        placeholder="Search for a city..."
        className="w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      
      {isLoading && (
        <div className="absolute right-3 top-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {results.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200">
          {results.map(location => (
            <button
              key={location.id}
              onClick={() => {
                onLocationSelect(location);
                setSearch('');
                setResults([]);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
            >
              {location.name}, {location.country}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationSearch;
