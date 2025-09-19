import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Truck, 
  Factory, 
  FlaskConical, 
  User,
  Navigation,
  ExternalLink,
  Route
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ProductMapViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productData: any;
}

interface SupplyChainLocation {
  id: string;
  type: 'farm' | 'processor' | 'laboratory' | 'manufacturer' | 'distributor';
  name: string;
  location: string;
  coordinates: [number, number];
  date: string;
  icon: React.ComponentType<any>;
  color: string;
}

export const ProductMapView: React.FC<ProductMapViewProps> = ({
  open,
  onOpenChange,
  productData
}) => {
  const supplyChainLocations: SupplyChainLocation[] = [
    {
      id: '1',
      type: 'farm',
      name: 'Green Valley Farms - Rajesh Kumar',
      location: 'Wayanad, Kerala',
      coordinates: [76.0856, 11.6054],
      date: '2024-01-15',
      icon: User,
      color: 'bg-green-100 text-green-700 border-green-200'
    },
    {
      id: '2',
      type: 'processor',
      name: 'SpiceMax Processing Unit',
      location: 'Cochin, Kerala',
      coordinates: [76.2673, 9.9312],
      date: '2024-01-17',
      icon: Factory,
      color: 'bg-blue-100 text-blue-700 border-blue-200'
    },
    {
      id: '3',
      type: 'laboratory',
      name: 'BioTest Analytics Lab',
      location: 'Bangalore, Karnataka',
      coordinates: [77.5946, 12.9716],
      date: '2024-01-18',
      icon: FlaskConical,
      color: 'bg-purple-100 text-purple-700 border-purple-200'
    },
    {
      id: '4',
      type: 'manufacturer',
      name: 'VrukshaChain Manufacturing',
      location: 'Mumbai, Maharashtra',
      coordinates: [72.8777, 19.0760],
      date: '2024-01-20',
      icon: Factory,
      color: 'bg-orange-100 text-orange-700 border-orange-200'
    },
    {
      id: '5',
      type: 'distributor',
      name: 'National Distribution Hub',
      location: 'Delhi, India',
      coordinates: [77.1025, 28.7041],
      date: '2024-01-22',
      icon: Truck,
      color: 'bg-gray-100 text-gray-700 border-gray-200'
    }
  ];

  const openInMaps = (coordinates: [number, number], name: string) => {
    const [lng, lat] = coordinates;
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${encodeURIComponent(name)}`;
    window.open(url, '_blank');
    
    toast({
      title: "Opening Maps",
      description: `Opening ${name} location in Google Maps`
    });
  };

  const getDirections = () => {
    const locations = supplyChainLocations.map(loc => 
      `${loc.coordinates[1]},${loc.coordinates[0]}`
    ).join('/');
    
    const url = `https://www.google.com/maps/dir/${locations}`;
    window.open(url, '_blank');
    
    toast({
      title: "Getting Directions",
      description: "Opening supply chain route in Google Maps"
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Product Journey Map
          </DialogTitle>
          <DialogDescription>
            Track your product's journey through the supply chain
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Interactive Map Placeholder */}
          <Card>
            <CardContent className="p-6">
              <div className="relative bg-gradient-to-br from-green-50 to-blue-50 rounded-lg h-80 flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center space-y-4">
                  <MapPin className="h-16 w-16 mx-auto text-muted-foreground" />
                  <div>
                    <h3 className="text-lg font-semibold">Interactive Map View</h3>
                    <p className="text-muted-foreground">
                      Interactive map showing supply chain locations would be displayed here
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Integration with Google Maps, Mapbox, or OpenStreetMap
                    </p>
                  </div>
                  <div className="flex justify-center gap-2">
                    <Button onClick={getDirections} variant="outline" className="flex items-center gap-2">
                      <Route className="h-4 w-4" />
                      View Route
                    </Button>
                    <Button 
                      onClick={() => openInMaps([77.5946, 12.9716], 'Supply Chain Route')}
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Open in Maps
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Supply Chain Locations List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Supply Chain Journey</h3>
            
            {supplyChainLocations.map((location, index) => {
              const Icon = location.icon;
              return (
                <Card key={location.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Step indicator */}
                      <div className="flex flex-col items-center">
                        <div className={`p-2 rounded-full border-2 ${location.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        {index < supplyChainLocations.length - 1 && (
                          <div className="w-0.5 h-12 bg-border mt-2" />
                        )}
                      </div>

                      {/* Location details */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold">{location.name}</h4>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {location.location}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              Step {index + 1}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {new Date(location.date).toLocaleDateString()}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            Coordinates: {location.coordinates[1]?.toFixed(4)}, {location.coordinates[0]?.toFixed(4)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openInMaps(location.coordinates, location.name)}
                            className="text-xs h-6 px-2"
                          >
                            <Navigation className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        </div>

                        {/* Additional details based on location type */}
                        <div className="text-xs text-muted-foreground">
                          {location.type === 'farm' && '🌱 Organic farming practices, harvest date recorded'}
                          {location.type === 'processor' && '⚙️ Steam distillation, quality processing completed'}
                          {location.type === 'laboratory' && '🔬 Quality testing, safety verification completed'}
                          {location.type === 'manufacturer' && '🏭 Product manufacturing, packaging completed'}
                          {location.type === 'distributor' && '🚛 Distribution hub, ready for retail'}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Journey Statistics */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Journey Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">5</div>
                  <div className="text-xs text-muted-foreground">Locations</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">~2,100</div>
                  <div className="text-xs text-muted-foreground">Total KM</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">7</div>
                  <div className="text-xs text-muted-foreground">Days</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">3</div>
                  <div className="text-xs text-muted-foreground">States</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Map Provider Info */}
          <div className="text-xs text-muted-foreground text-center space-y-1">
            <p>🗺️ Maps powered by Google Maps Platform</p>
            <p>📍 Location data verified through GPS tracking and blockchain records</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};