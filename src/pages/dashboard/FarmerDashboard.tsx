import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Camera, 
  MapPin, 
  Clock, 
  Mic, 
  Upload, 
  Plus, 
  Eye,
  Calendar,
  Weight,
  Package
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface HarvestRecord {
  id: string;
  cropSpecies: string;
  weight: number;
  quantity: number;
  location: string;
  timestamp: string;
  photo?: string;
  notes?: string;
  status: 'recorded' | 'verified' | 'processed';
}

const FarmerDashboard = () => {
  const { t } = useTranslation();
  const [harvestForm, setHarvestForm] = useState({
    cropSpecies: '',
    weight: '',
    quantity: '',
    location: '',
    notes: '',
    photo: null as File | null
  });
  
  const [isListening, setIsListening] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [harvests, setHarvests] = useState<HarvestRecord[]>([
    {
      id: '1',
      cropSpecies: 'Turmeric',
      weight: 25.5,
      quantity: 100,
      location: 'Field A, Village Xyz',
      timestamp: '2024-01-15T10:30:00Z',
      status: 'verified',
      notes: 'High quality organic turmeric'
    },
    {
      id: '2',
      cropSpecies: 'Ashwagandha',
      weight: 15.2,
      quantity: 75,
      location: 'Field B, Village Xyz',
      timestamp: '2024-01-14T14:20:00Z',
      status: 'processed',
      notes: 'Premium grade roots'
    }
  ]);

  const cropOptions = [
    { value: 'Turmeric', icon: '🌱', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'Ashwagandha', icon: '🌿', color: 'bg-green-100 text-green-800' },
    { value: 'Tulsi', icon: '🍃', color: 'bg-emerald-100 text-emerald-800' },
    { value: 'Neem', icon: '🌱', color: 'bg-lime-100 text-lime-800' },
    { value: 'Aloe Vera', icon: '🌿', color: 'bg-teal-100 text-teal-800' },
    { value: 'Ginger', icon: '🫚', color: 'bg-orange-100 text-orange-800' },
    { value: 'Cardamom', icon: '🌱', color: 'bg-green-100 text-green-800' },
    { value: 'Black Pepper', icon: '⚫', color: 'bg-gray-100 text-gray-800' },
    { value: 'Cinnamon', icon: '🟤', color: 'bg-amber-100 text-amber-800' },
    { value: 'Clove', icon: '🌰', color: 'bg-brown-100 text-brown-800' },
    { value: 'Fenugreek', icon: '🌱', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'Cumin', icon: '🌾', color: 'bg-orange-100 text-orange-800' },
    { value: 'Coriander', icon: '🌿', color: 'bg-green-100 text-green-800' },
    { value: 'Fennel', icon: '🌱', color: 'bg-lime-100 text-lime-800' },
    { value: 'Mustard', icon: '🌼', color: 'bg-yellow-100 text-yellow-800' }
  ];

  const handleSubmitHarvest = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!harvestForm.cropSpecies || !harvestForm.weight || !harvestForm.quantity) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newHarvest: HarvestRecord = {
      id: Date.now().toString(),
      cropSpecies: harvestForm.cropSpecies,
      weight: parseFloat(harvestForm.weight),
      quantity: parseInt(harvestForm.quantity),
      location: harvestForm.location || 'Auto-detected location',
      timestamp: new Date().toISOString(),
      status: 'recorded',
      notes: harvestForm.notes
    };

    setHarvests([newHarvest, ...harvests]);
    setHarvestForm({
      cropSpecies: '',
      weight: '',
      quantity: '',
      location: '',
      notes: '',
      photo: null
    });

    toast({
      title: "Success",
      description: "Harvest record created successfully!"
    });
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setHarvestForm({
            ...harvestForm,
            location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
          });
          toast({
            title: "Location captured",
            description: "GPS coordinates have been auto-filled"
          });
        },
        (error) => {
          toast({
            title: "Location error",
            description: "Unable to get current location",
            variant: "destructive"
          });
        }
      );
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setHarvestForm({ ...harvestForm, photo: file });
      toast({
        title: "Photo selected",
        description: `Selected: ${file.name}`
      });
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setShowCamera(true);
      toast({
        title: "Camera started",
        description: "Position your camera to take the photo"
      });
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Unable to access camera",
        variant: "destructive"
      });
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `harvest-${Date.now()}.jpg`, { type: 'image/jpeg' });
            setHarvestForm({ ...harvestForm, photo: file });
            toast({
              title: "Photo captured!",
              description: "Photo has been captured successfully"
            });
            stopCamera();
          }
        }, 'image/jpeg', 0.8);
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Not Supported",
        description: "Voice input not supported in this browser",
        variant: "destructive"
      });
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      toast({
        title: "Listening...",
        description: "Speak your notes clearly"
      });
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setHarvestForm({ 
        ...harvestForm, 
        notes: harvestForm.notes + (harvestForm.notes ? ' ' : '') + transcript 
      });
      toast({
        title: "Voice captured",
        description: `Added: "${transcript}"`
      });
    };

    recognition.onerror = (event) => {
      toast({
        title: "Voice Error",
        description: "Could not capture voice input",
        variant: "destructive"
      });
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const generateCertificate = async (harvest: HarvestRecord) => {
    const pdf = new jsPDF();
    
    // Header
    pdf.setFontSize(20);
    pdf.setTextColor(40, 120, 40);
    pdf.text('VrukshaChain Certificate', 20, 30);
    
    pdf.setFontSize(16);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Harvest Authenticity Certificate', 20, 45);
    
    // Certificate content
    pdf.setFontSize(12);
    pdf.text(`Certificate ID: VC-${harvest.id}`, 20, 65);
    pdf.text(`Issue Date: ${new Date().toLocaleDateString()}`, 20, 75);
    
    pdf.text('HARVEST DETAILS:', 20, 95);
    pdf.text(`Crop Species: ${harvest.cropSpecies}`, 30, 105);
    pdf.text(`Weight: ${harvest.weight} kg`, 30, 115);
    pdf.text(`Quantity: ${harvest.quantity} units`, 30, 125);
    pdf.text(`Location: ${harvest.location}`, 30, 135);
    pdf.text(`Harvest Date: ${new Date(harvest.timestamp).toLocaleDateString()}`, 30, 145);
    pdf.text(`Status: ${harvest.status.toUpperCase()}`, 30, 155);
    
    if (harvest.notes) {
      pdf.text('Notes:', 30, 170);
      const splitNotes = pdf.splitTextToSize(harvest.notes, 150);
      pdf.text(splitNotes, 30, 180);
    }
    
    // Footer
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text('This certificate is digitally generated and verifies the authenticity', 20, 250);
    pdf.text('of the harvest record in the VrukshaChain traceability system.', 20, 260);
    
    // QR Code placeholder
    pdf.rect(150, 200, 40, 40);
    pdf.text('QR Code', 165, 225);
    
    // Save the PDF
    pdf.save(`VrukshaChain-Certificate-${harvest.id}.pdf`);
    
    toast({
      title: "Certificate Downloaded",
      description: `Certificate for ${harvest.cropSpecies} has been downloaded`
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      recorded: 'bg-blue-100 text-blue-800',
      verified: 'bg-green-100 text-green-800',
      processed: 'bg-purple-100 text-purple-800'
    };
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">{t('farmerPortal')}</h1>
          <p className="text-muted-foreground">
            Record your harvests, track quality, and build credibility in the supply chain
          </p>
        </div>

        <Tabs defaultValue="new-harvest" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="new-harvest" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {t('newHarvest')}
            </TabsTrigger>
            <TabsTrigger value="past-harvests" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              {t('pastHarvests')}
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="new-harvest">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  {t('recordHarvest')}
                </CardTitle>
                <CardDescription>
                  Capture harvest details with auto GPS and timestamp
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitHarvest} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="cropSpecies">{t('cropSpecies')} *</Label>
                      <Select
                        value={harvestForm.cropSpecies}
                        onValueChange={(value) => setHarvestForm({ ...harvestForm, cropSpecies: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select crop/species" />
                        </SelectTrigger>
                        <SelectContent>
                          {cropOptions.map((crop) => (
                            <SelectItem key={crop.value} value={crop.value}>
                              <div className="flex items-center gap-3 py-1">
                                <span className="text-lg">{crop.icon}</span>
                                <span className="font-medium">{crop.value}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="weight" className="flex items-center gap-2">
                        <Weight className="h-4 w-4 text-muted-foreground" />
                        {t('weight')} (kg) *
                      </Label>
                      <Input
                        id="weight"
                        type="number"
                        step="0.1"
                        value={harvestForm.weight}
                        onChange={(e) => setHarvestForm({ ...harvestForm, weight: e.target.value })}
                        placeholder="25.5"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="quantity" className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        {t('quantity')} (units) *
                      </Label>
                      <Input
                        id="quantity"
                        type="number"
                        value={harvestForm.quantity}
                        onChange={(e) => setHarvestForm({ ...harvestForm, quantity: e.target.value })}
                        placeholder="100"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location" className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {t('location')}
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="location"
                          value={harvestForm.location}
                          onChange={(e) => setHarvestForm({ ...harvestForm, location: e.target.value })}
                          placeholder="Will auto-fill with GPS"
                        />
                        <Button type="button" variant="outline" size="icon" onClick={getCurrentLocation} className="shrink-0">
                          <MapPin className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="photo" className="flex items-center gap-2">
                      <Camera className="h-4 w-4 text-muted-foreground" />
                      {t('photoUpload')}
                    </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        id="photo"
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={startCamera}
                        className="flex items-center gap-2"
                      >
                        <Camera className="h-4 w-4" />
                        📸 Take Photo
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const fileInput = document.createElement('input');
                          fileInput.type = 'file';
                          fileInput.accept = 'image/*';
                          fileInput.onchange = (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (file) handlePhotoUpload({ target: { files: [file] } } as any);
                          };
                          fileInput.click();
                        }}
                        className="flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        📁 Upload Photo
                      </Button>
                      {harvestForm.photo && (
                        <div className="col-span-2 text-sm text-muted-foreground p-2 bg-muted rounded-md">
                          ✅ {harvestForm.photo.name}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={harvestForm.notes}
                      onChange={(e) => setHarvestForm({ ...harvestForm, notes: e.target.value })}
                      placeholder="Additional notes about the harvest..."
                      rows={3}
                    />
                  </div>

                  <Separator />

                  <div className="flex gap-4">
                    <Button type="submit" className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      {t('recordHarvest')}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      className={`flex items-center gap-2 ${isListening ? 'bg-red-50 border-red-300' : ''}`}
                      onClick={startVoiceInput}
                      disabled={isListening}
                    >
                      <Mic className={`h-4 w-4 ${isListening ? 'text-red-500 animate-pulse' : ''}`} />
                      {isListening ? 'Listening...' : t('voiceInput')}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="past-harvests">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">{t('pastHarvests')}</h2>
                <Badge variant="outline">{harvests.length} records</Badge>
              </div>

              <div className="grid gap-4">
                {harvests.map((harvest) => (
                  <Card key={harvest.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{harvest.cropSpecies}</h3>
                          <p className="text-sm text-muted-foreground">
                            ID: {harvest.id}
                          </p>
                        </div>
                        {getStatusBadge(harvest.status)}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Weight className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{harvest.weight} kg</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{harvest.quantity} units</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm truncate">{harvest.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {new Date(harvest.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {harvest.notes && (
                        <p className="text-sm text-muted-foreground italic">
                          "{harvest.notes}"
                        </p>
                      )}

                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" onClick={() => {
                          toast({ title: "Details", description: `Viewing details for harvest ${harvest.id}` });
                        }}>
                          View Details
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => generateCertificate(harvest)}>
                          Download Certificate
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-green-700">🌾 Total Harvests</CardDescription>
                    <CardTitle className="text-3xl text-green-800">24</CardTitle>
                  </CardHeader>
                </Card>
                <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-blue-700">⚖️ Total Weight (kg)</CardDescription>
                    <CardTitle className="text-3xl text-blue-800">485.7</CardTitle>
                  </CardHeader>
                </Card>
                <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-purple-700">✅ Verified Records</CardDescription>
                    <CardTitle className="text-3xl text-purple-800">18</CardTitle>
                  </CardHeader>
                </Card>
                <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-orange-700">💰 Estimated Earnings</CardDescription>
                    <CardTitle className="text-3xl text-orange-800">₹48,570</CardTitle>
                  </CardHeader>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      📈 This Month's Progress
                    </CardTitle>
                    <CardDescription>
                      You have supplied 120 kg Tulsi this month
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Tulsi</span>
                        <span className="text-sm text-muted-foreground">120 kg</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Turmeric</span>
                        <span className="text-sm text-muted-foreground">85 kg</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '56%' }}></div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Ashwagandha</span>
                        <span className="text-sm text-muted-foreground">45 kg</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: '30%' }}></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      🏆 Quality Score
                    </CardTitle>
                    <CardDescription>
                      Your average quality rating from processors
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-600 mb-2">96.8%</div>
                      <p className="text-sm text-muted-foreground mb-4">Excellent quality maintained!</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="p-3 bg-green-50 rounded-lg">
                          <div className="font-medium text-green-800">Organic Certified</div>
                          <div className="text-green-600">18 batches</div>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <div className="font-medium text-blue-800">Premium Grade</div>
                          <div className="text-blue-600">22 batches</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Camera Modal */}
        {showCamera && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Take Photo</h3>
                <Button variant="outline" size="sm" onClick={stopCamera}>
                  Close
                </Button>
              </div>
              
              <div className="relative mb-4">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-64 bg-gray-100 rounded-lg object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={capturePhoto} className="flex-1">
                  <Camera className="h-4 w-4 mr-2" />
                  Capture Photo
                </Button>
                <Button variant="outline" onClick={stopCamera}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerDashboard;