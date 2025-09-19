import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { QrCode, MapPin, Leaf, Award, Clock, User, Truck, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface TraceabilityData {
  id: string;
  productName: string;
  farmer: {
    name: string;
    location: string;
    coordinates: [number, number];
  };
  harvest: {
    date: string;
    weight: number;
    species: string;
  };
  processing: {
    steps: string[];
    date: string;
    processor: string;
  };
  testing: {
    results: string[];
    lab: string;
    date: string;
  };
  manufacturing: {
    batchId: string;
    date: string;
    manufacturer: string;
  };
  certifications: string[];
}

const ConsumerDashboard = () => {
  const { t } = useTranslation();
  const [qrInput, setQrInput] = useState('');
  const [scanResult, setScanResult] = useState<TraceabilityData | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  // Sample traceability data
  const sampleData: TraceabilityData = {
    id: 'VRC001',
    productName: 'Organic Turmeric Powder',
    farmer: {
      name: 'Ramesh Kumar',
      location: 'Village Xyz, Karnataka',
      coordinates: [77.5946, 12.9716]
    },
    harvest: {
      date: '2024-01-15',
      weight: 25.5,
      species: 'Curcuma longa'
    },
    processing: {
      steps: ['Drying', 'Grinding', 'Sieving', 'Packaging'],
      date: '2024-01-20',
      processor: 'Karnataka Spice Co.'
    },
    testing: {
      results: ['Moisture: 8.2%', 'Curcumin: 6.8%', 'No pesticides detected'],
      lab: 'AgriTest Labs',
      date: '2024-01-18'
    },
    manufacturing: {
      batchId: 'TUR-2024-001',
      date: '2024-01-25',
      manufacturer: 'Natural Products Ltd.'
    },
    certifications: ['Organic', 'Fair Trade', 'FSSAI Approved']
  };

  const handleQRScan = () => {
    setIsScanning(true);
    
    // Simulate QR scanning
    setTimeout(() => {
      if (qrInput === 'VRC001' || qrInput === 'demo') {
        setScanResult(sampleData);
        toast({
          title: "Product Found!",
          description: "Traceability data loaded successfully"
        });
      } else {
        toast({
          title: "Product Not Found",
          description: "Invalid QR code. Try 'VRC001' or 'demo'",
          variant: "destructive"
        });
      }
      setIsScanning(false);
    }, 1500);
  };

  const handleCameraQR = () => {
    toast({
      title: "Camera QR Scanner",
      description: "Camera QR scanning feature would be implemented here using a QR library"
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">{t('consumerPortal')}</h1>
          <p className="text-muted-foreground">
            Scan QR codes to trace your product's journey from farm to shelf
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                {t('scanQRCode')}
              </CardTitle>
              <CardDescription>
                Scan the QR code on your product or enter the product ID manually
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center py-8">
                  <QrCode className="h-24 w-24 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">Point your camera at the QR code</p>
                  <Button onClick={handleCameraQR} className="w-full">
                    Start Camera Scanner
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Or enter product ID manually:</p>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Enter product ID (try 'VRC001' or 'demo')"
                        value={qrInput}
                        onChange={(e) => setQrInput(e.target.value)}
                      />
                      <Button 
                        onClick={handleQRScan} 
                        disabled={isScanning || !qrInput}
                      >
                        {isScanning ? 'Scanning...' : 'Scan'}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground">
                      Demo IDs: VRC001, demo
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {scanResult && (
            <Card className="border-green-200 bg-green-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="h-5 w-5" />
                  Product Traceability: {scanResult.productName}
                </CardTitle>
                <CardDescription>Product ID: {scanResult.id}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Certifications */}
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Certifications & Quality
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {scanResult.certifications.map((cert) => (
                      <Badge key={cert} variant="secondary" className="bg-green-100 text-green-800">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Farm Origin */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {t('farmOfOrigin')}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Farmer:</p>
                      <p className="text-muted-foreground">{scanResult.farmer.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Location:</p>
                      <p className="text-muted-foreground">{scanResult.farmer.location}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Harvest Date:</p>
                      <p className="text-muted-foreground">{scanResult.harvest.date}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Harvest Weight:</p>
                      <p className="text-muted-foreground">{scanResult.harvest.weight} kg</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Processing Journey */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    Processing Journey
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Processor:</p>
                        <p className="text-muted-foreground">{scanResult.processing.processor}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Processing Date:</p>
                        <p className="text-muted-foreground">{scanResult.processing.date}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Processing Steps:</p>
                      <div className="flex flex-wrap gap-2">
                        {scanResult.processing.steps.map((step, index) => (
                          <Badge key={index} variant="outline">
                            {index + 1}. {step}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Lab Testing */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Quality Testing
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Laboratory:</p>
                      <p className="text-muted-foreground">{scanResult.testing.lab}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Test Date:</p>
                      <p className="text-muted-foreground">{scanResult.testing.date}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm font-medium mb-2">Test Results:</p>
                    <div className="space-y-1">
                      {scanResult.testing.results.map((result, index) => (
                        <p key={index} className="text-sm text-muted-foreground">
                          ✓ {result}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Manufacturing */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Manufacturing
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium">Manufacturer:</p>
                      <p className="text-muted-foreground">{scanResult.manufacturing.manufacturer}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Batch ID:</p>
                      <p className="text-muted-foreground">{scanResult.manufacturing.batchId}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Manufacturing Date:</p>
                      <p className="text-muted-foreground">{scanResult.manufacturing.date}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-6">
                  <Button variant="outline" size="sm">
                    Download Certificate
                  </Button>
                  <Button variant="outline" size="sm">
                    View on Map
                  </Button>
                  <Button variant="outline" size="sm">
                    Share Product Story
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {!scanResult && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    {t('farmOfOrigin')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Track the exact farm and farmer who grew your product</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Leaf className="h-5 w-5" />
                    {t('sustainabilityBadges')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">View organic, fair-trade, and eco-friendly certifications</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Quality Assurance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Access lab test results and quality certificates</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsumerDashboard;