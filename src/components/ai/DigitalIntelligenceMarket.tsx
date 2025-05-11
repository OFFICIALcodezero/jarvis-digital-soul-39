
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';

interface MarketItem {
  id: string;
  name: string;
  type: 'tool' | 'data' | 'exploit';
  price: number;
  seller: string;
  rating: number;
  verified: boolean;
}

const DigitalIntelligenceMarket: React.FC = () => {
  const [items, setItems] = useState<MarketItem[]>([
    {
      id: 'item-1',
      name: 'Advanced Port Scanner',
      type: 'tool',
      price: 0.025,
      seller: 'ShadowTech',
      rating: 4.7,
      verified: true
    },
    {
      id: 'item-2',
      name: 'Corporate Network Map',
      type: 'data',
      price: 0.075,
      seller: 'DataHarvest',
      rating: 4.2,
      verified: true
    },
    {
      id: 'item-3',
      name: 'Zero-Day Browser Exploit',
      type: 'exploit',
      price: 0.35,
      seller: 'ZeroDay',
      rating: 4.9,
      verified: false
    }
  ]);
  
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [purchasing, setPurchasing] = useState(false);
  
  const handlePurchase = (id: string) => {
    setSelectedItem(id);
    setPurchasing(true);
    
    setTimeout(() => {
      setPurchasing(false);
      setSelectedItem(null);
      
      toast('Purchase Verified', {
        description: 'Transaction confirmed on secure blockchain.'
      });
    }, 2000);
  };
  
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'tool': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'data': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'exploit': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <Card className="p-4 bg-black/50 border-jarvis/20">
      <h3 className="text-md font-medium text-jarvis mb-4">Digital Intelligence Market</h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-black/40 p-2 rounded-lg">
            <div className="text-xs text-gray-400">Market Status</div>
            <div className="text-sm text-green-400">Active</div>
          </div>
          <div className="bg-black/40 p-2 rounded-lg">
            <div className="text-xs text-gray-400">Transaction Security</div>
            <div className="text-sm text-jarvis">Quantum-secured</div>
          </div>
          <div className="bg-black/40 p-2 rounded-lg">
            <div className="text-xs text-gray-400">Current Balance</div>
            <div className="text-sm text-jarvis">0.57 ETH</div>
          </div>
        </div>
        
        <div className="bg-black/40 p-3 rounded-lg">
          <div className="text-xs text-gray-400 mb-2">Available Assets</div>
          <div className="space-y-3">
            {items.map(item => (
              <div key={item.id} className="flex items-center justify-between">
                <div>
                  <div className="flex items-center">
                    <span className="text-sm text-white">{item.name}</span>
                    {item.verified && (
                      <span className="ml-1 text-green-400">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-xs">
                    <Badge className={getTypeColor(item.type)}>
                      {item.type}
                    </Badge>
                    <span className="text-gray-400 ml-2">{item.seller}</span>
                    <div className="flex items-center ml-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 text-yellow-400">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                      <span className="ml-1 text-gray-400">{item.rating}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-xs py-1 px-2 h-7 text-jarvis border-jarvis/30 hover:bg-jarvis/10"
                    disabled={purchasing && selectedItem === item.id}
                    onClick={() => handlePurchase(item.id)}
                  >
                    {purchasing && selectedItem === item.id ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-jarvis" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Verifying...
                      </span>
                    ) : (
                      `${item.price} ETH`
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-xs text-gray-400 text-center">
          All transactions secured via smart contracts. <br />
          Access requires authorized authentication.
        </div>
      </div>
    </Card>
  );
};

export default DigitalIntelligenceMarket;
