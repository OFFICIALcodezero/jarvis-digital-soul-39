
import React, { useState, useEffect } from 'react';
import { Store, Search, ShoppingCart, Download } from 'lucide-react';
import { enhancedAIService } from '@/services/enhancedAIService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';

interface MarketItem {
  name: string;
  price: number;
  rating: number;
  description?: string;
  type?: 'tool' | 'data' | 'service';
}

const DigitalIntelligenceMarket: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [items, setItems] = useState<MarketItem[]>([]);
  const [cart, setCart] = useState<MarketItem[]>([]);
  
  useEffect(() => {
    const entityState = enhancedAIService.getEntityState('black-market');
    if (entityState) {
      setIsActive(entityState.active);
    }
  }, []);
  
  const activateMarket = () => {
    const success = enhancedAIService.activateEntity('black-market');
    if (success) {
      setIsActive(true);
    }
  };
  
  const searchMarketplace = async () => {
    if (!searchTerm.trim() || isSearching) return;
    
    setIsSearching(true);
    
    try {
      const result = await enhancedAIService.searchMarketplace(searchTerm);
      
      // Add fake descriptions and types
      const enhancedItems = result.items.map(item => ({
        ...item,
        description: `Advanced ${item.name.toLowerCase()} for security research purposes.`,
        type: (['tool', 'data', 'service'] as const)[Math.floor(Math.random() * 3)]
      }));
      
      setItems(enhancedItems);
      
      toast("Search Complete", {
        description: `Found ${result.items.length} items matching "${searchTerm}"`
      });
    } catch (error) {
      toast("Search Failed", {
        description: "Unable to search marketplace",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };
  
  const addToCart = (item: MarketItem) => {
    setCart(prev => [...prev, item]);
    toast("Added to Cart", {
      description: `${item.name} added to your cart`
    });
  };
  
  const checkout = () => {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    toast("Transaction Processed", {
      description: `Purchase complete: ${cart.length} items ($${total.toFixed(2)})`
    });
    setCart([]);
  };
  
  const entityState = enhancedAIService.getEntityState('black-market');
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-jarvis">
          <Store className="h-5 w-5" />
          <span className="font-semibold">Digital Intelligence Market</span>
        </div>
        
        <div>
          {!isActive ? (
            <Button 
              size="sm" 
              onClick={activateMarket}
              className="bg-jarvis/20 hover:bg-jarvis/30 text-jarvis border-jarvis/30"
            >
              Activate
            </Button>
          ) : (
            <div className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
              Active
            </div>
          )}
        </div>
      </div>
      
      {isActive && (
        <>
          <div className="bg-black/20 p-3 rounded-md border border-jarvis/10">
            <div className="flex items-center gap-2 mb-2 text-sm">
              <Search className="h-4 w-4 text-jarvis" />
              <span>Search Marketplace</span>
            </div>
            
            <div className="flex gap-2">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for tools, data, or services..."
                className="flex-1 bg-black/20 border-jarvis/20 text-sm"
              />
              <Button
                onClick={searchMarketplace}
                disabled={!searchTerm.trim() || isSearching}
                className="bg-jarvis/20 hover:bg-jarvis/30 text-jarvis border-jarvis/30"
              >
                {isSearching ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </div>
          
          {/* Cart Status */}
          {cart.length > 0 && (
            <div className="bg-jarvis/5 p-3 rounded-md border border-jarvis/10 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-jarvis" />
                <span className="text-sm">
                  {cart.length} item{cart.length !== 1 ? 's' : ''} in cart
                </span>
              </div>
              <Button
                size="sm"
                onClick={checkout}
                className="bg-jarvis/20 hover:bg-jarvis/30 text-jarvis border-jarvis/30"
              >
                Checkout (${cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)})
              </Button>
            </div>
          )}
          
          {/* Search Results */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {isSearching ? (
              <div className="bg-black/30 p-3 rounded-md border border-jarvis/10 text-sm text-center">
                Searching marketplace...
              </div>
            ) : items.length === 0 ? (
              <div className="bg-black/30 p-3 rounded-md border border-jarvis/10 text-sm text-center text-gray-400">
                No items found. Try searching for "recon", "exploit", or "data".
              </div>
            ) : (
              items.map((item, index) => (
                <div key={index} className="bg-black/30 p-3 rounded-md border border-jarvis/10">
                  <div className="flex justify-between">
                    <div className="font-medium text-sm">{item.name}</div>
                    <div className="text-sm text-jarvis">${item.price}</div>
                  </div>
                  
                  <div className="text-xs text-gray-400 mt-1">{item.description}</div>
                  
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-1">
                      <div className={`px-2 py-0.5 text-xs rounded-full ${
                        item.type === 'tool' ? 'bg-blue-500/20 text-blue-400' :
                        item.type === 'data' ? 'bg-green-500/20 text-green-400' :
                        'bg-purple-500/20 text-purple-400'
                      }`}>
                        {item.type}
                      </div>
                      <div className="text-xs text-yellow-400 ml-2">
                        {Array(Math.floor(item.rating)).fill('★').join('')}
                        {item.rating % 1 > 0 ? '½' : ''}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => addToCart(item)}
                      disabled={cart.some(cartItem => cartItem.name === item.name)}
                      className="bg-jarvis/20 hover:bg-jarvis/30 text-jarvis border-jarvis/30"
                    >
                      {cart.some(cartItem => cartItem.name === item.name) ? (
                        <span className="flex items-center gap-1"><Download className="h-3 w-3" /> Purchased</span>
                      ) : (
                        <span className="flex items-center gap-1"><ShoppingCart className="h-3 w-3" /> Add to Cart</span>
                      )}
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="mt-3 flex items-center text-xs text-gray-400">
            <div>Version {entityState?.version}</div>
            <div className="mx-2">•</div>
            <div>Development Progress: {entityState?.progress}%</div>
            <div className="mx-2">•</div>
            <div>Enhanced Security Protocol: Active</div>
          </div>
        </>
      )}
    </div>
  );
};

export default DigitalIntelligenceMarket;
