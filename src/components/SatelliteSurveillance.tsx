
import React, { useState, useEffect } from 'react';
import { format, subDays } from 'date-fns';
import { Calendar as CalendarIcon, Satellite } from 'lucide-react';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from '@/lib/utils';

// DO NOT import Leaflet CSS here, we'll import it dynamically

const SatelliteSurveillance: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [formattedDate, setFormattedDate] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [mapCenter] = useState<[number, number]>([20.5937, 78.9629]); // Center of India
  const [mapZoom] = useState<number>(5);
  const [MapContainer, setMapContainer] = useState<any>(null);
  const [TileLayer, setTileLayer] = useState<any>(null);
  const [ZoomControl, setZoomControl] = useState<any>(null);
  const [LayersControl, setLayersControl] = useState<any>(null);

  useEffect(() => {
    // Update formatted date whenever date changes
    if (date) {
      setFormattedDate(format(date, 'yyyy-MM-dd'));
    }
    
    // Simulate loading
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [date]);

  // Load Leaflet and React-Leaflet components only in browser
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Dynamically import Leaflet CSS
      import('leaflet/dist/leaflet.css')
        .then(() => console.log('Leaflet CSS loaded'))
        .catch(err => console.error('Failed to load Leaflet CSS:', err));
      
      // Dynamically import React Leaflet components
      Promise.all([
        import('react-leaflet').then(module => {
          setMapContainer(module.MapContainer);
          setTileLayer(module.TileLayer);
          setZoomControl(module.ZoomControl);
          setLayersControl(module.LayersControl);
          console.log('React Leaflet modules loaded successfully');
        })
      ]).catch(err => {
        console.error('Error loading React Leaflet modules:', err);
      });
    }
  }, []);

  // NASA GIBS requires dates in "YYYY/MM/DD" format for their WMTS service
  const getGIBSDate = (date: Date): string => {
    return format(date, 'yyyy/MM/dd');
  };

  // Disable future dates for the date picker
  const disabledDays = (day: Date): boolean => {
    // MODIS data is typically available with a 1-day delay
    return day > subDays(new Date(), 1);
  };

  // Render the map only when all required components are loaded
  const renderMap = () => {
    if (!MapContainer || !TileLayer || !ZoomControl || !LayersControl) {
      return (
        <div className="h-full w-full flex items-center justify-center">
          <span className="text-[#33c3f0]">Loading map components...</span>
        </div>
      );
    }

    // Extract LayersControl.BaseLayer and LayersControl.Overlay
    const { BaseLayer, Overlay } = LayersControl;
    
    return (
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <ZoomControl position="bottomright" />
        <LayersControl position="topright">
          <BaseLayer checked name="OpenStreetMap">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </BaseLayer>
          <Overlay checked name="MODIS Terra True Color">
            <TileLayer
              url={`https://gibs-{s}.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/${
                date ? getGIBSDate(date) : getGIBSDate(new Date())
              }/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`}
              attribution="&copy; NASA Earth Observations"
              subdomains={['a', 'b', 'c']}
              maxNativeZoom={9}
              maxZoom={12}
            />
          </Overlay>
        </LayersControl>
      </MapContainer>
    );
  };

  return (
    <Card className={`rounded-lg border border-[#33c3f0]/20 overflow-hidden bg-black/40`}>
      <CardHeader className="px-4 py-2 bg-black/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Satellite className="h-5 w-5 text-[#33c3f0]" />
            <CardTitle className="text-lg text-white">Satellite Surveillance</CardTitle>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="bg-black/50 border-[#33c3f0]/30 hover:bg-black/70 hover:border-[#33c3f0]/50 text-white"
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-[#33c3f0]" />
                {date ? format(date, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-black/80 border-[#33c3f0]/30" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={disabledDays}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        <CardDescription className="text-gray-300">
          MODIS Terra - {formattedDate || 'Loading...'}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 relative">
        {loading ? (
          <div className="h-[500px] md:h-[600px] flex items-center justify-center bg-black/70">
            <div className="text-[#33c3f0] flex flex-col items-center">
              <svg className="animate-spin h-8 w-8 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading satellite imagery...
            </div>
          </div>
        ) : (
          <div className="h-[500px] md:h-[600px]">
            {typeof window !== 'undefined' && renderMap()}
          </div>
        )}
      </CardContent>
      <CardFooter className="px-4 py-2 bg-black/60 text-xs text-gray-400">
        Source: NASA Global Imagery Browse Services (GIBS) - MODIS Terra
      </CardFooter>
    </Card>
  );
};

export default SatelliteSurveillance;
