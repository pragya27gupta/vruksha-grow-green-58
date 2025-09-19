import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { QrCode, MapPin, Leaf, Award, Clock, User, Truck, CheckCircle, Camera, Download, Share2, ExternalLink } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { QRCameraScanner } from '@/components/QRCameraScanner';
import { ProductMapView } from '@/components/ProductMapView';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
  const [showCameraScanner, setShowCameraScanner] = useState(false);
  const [showMapView, setShowMapView] = useState(false);
  const certificateRef = React.useRef<HTMLDivElement>(null);

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
    setShowCameraScanner(true);
  };

  const handleScanResult = (result: string) => {
    setQrInput(result);
    handleQRScan();
  };

  const downloadCertificate = async () => {
    if (!scanResult || !certificateRef.current) return;

    try {
      // Create PDF certificate
      const canvas = await html2canvas(certificateRef.current, {
        backgroundColor: '#ffffff',
        scale: 2
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${scanResult.productName}_Certificate.pdf`);
      
      toast({
        title: "Certificate Downloaded",
        description: `${scanResult.productName} certificate saved successfully`
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Unable to generate certificate PDF",
        variant: "destructive"
      });
    }
  };

  const viewOnMap = () => {
    setShowMapView(true);
  };

  const shareProductStory = async () => {
    if (!scanResult) return;

    const storyText = `🌱 Product Story: ${scanResult.productName}

🚜 Farmed by: ${scanResult.farmer.name}
📍 Location: ${scanResult.farmer.location} 
📅 Harvest: ${new Date(scanResult.harvest.date).toLocaleDateString()}

🏭 Processed by: ${scanResult.processing.processor}
🔬 Lab tested by: ${scanResult.testing.lab}
🏷️ Certifications: ${scanResult.certifications.join(', ')}

✨ Traced through VrukshaChain blockchain technology for complete transparency!

#Traceability #OrganicFood #Blockchain #VrukshaChain`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${scanResult.productName} - Product Story`,
          text: storyText,
          url: window.location.href
        });
        toast({
          title: "Story Shared",
          description: "Product story shared successfully!"
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(storyText);
        toast({
          title: "Story Copied",
          description: "Product story copied to clipboard!"
        });
      } catch (error) {
        toast({
          title: "Share Failed",
          description: "Unable to share product story",
          variant: "destructive"
        });
      }
    }
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
                  <Button onClick={handleCameraQR} className="w-full flex items-center gap-2">
                    <Camera className="h-4 w-4" />
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
            <div ref={certificateRef}>
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

                <div className="flex gap-2 flex-wrap mt-6">
                  <Button 
                    onClick={downloadCertificate}
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download Certificate
                  </Button>
                  <Button 
                    onClick={viewOnMap}
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <MapPin className="h-4 w-4" />
                    View on Map
                  </Button>
                  <Button 
                    onClick={shareProductStory}
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Share2 className="h-4 w-4" />
                    Share Product Story
                  </Button>
                </div>
              </CardContent>
            </Card>
            </div>
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

        {/* Modals */}
        <QRCameraScanner
          open={showCameraScanner}
          onOpenChange={setShowCameraScanner}
          onScanResult={handleScanResult}
        />

        {scanResult && (
          <ProductMapView
            open={showMapView}
            onOpenChange={setShowMapView}
            productData={scanResult}
          />
        )}
      </div>
    </div>
  );
};

export default ConsumerDashboard;