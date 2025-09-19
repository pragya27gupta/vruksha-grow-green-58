import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Factory, 
  Thermometer, 
  Droplets, 
  FileText, 
  Plus, 
  Eye,
  Settings,
  CheckCircle,
  Clock,
  Package,
  Upload,
  FlaskConical,
  Award,
  TrendingUp
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { vrukshaChainAPI, type BatchDetails } from '@/lib/vrukshachain-api';

interface ProcessingBatch {
  id: string;
  farmerId: string;
  cropSpecies: string;
  weight: number;
  status: 'pending' | 'processing' | 'completed';
  processSteps: ProcessingStep[];
  receivedDate: string;
}

interface ProcessingStep {
  id: string;
  type: 'drying' | 'grinding' | 'storage' | 'packaging' | 'testing';
  temperature?: number;
  humidity?: number;
  duration: number;
  notes?: string;
  timestamp: string;
  certificate?: string;
}

interface LabRequest {
  id: string;
  batchId: string;
  labName: string;
  testType: string;
  status: 'pending' | 'in-progress' | 'completed';
  requestDate: string;
  results?: string;
}

const ProcessorDashboard = () => {
  const { t } = useTranslation();
  
  const [batches] = useState<ProcessingBatch[]>([
    {
      id: 'B001',
      farmerId: 'F123',
      cropSpecies: 'Turmeric',
      weight: 25.5,
      status: 'pending',
      processSteps: [],
      receivedDate: '2024-01-15T10:30:00Z'
    },
    {
      id: 'B002',
      farmerId: 'F124',
      cropSpecies: 'Ashwagandha',
      weight: 15.2,
      status: 'processing',
      processSteps: [
        {
          id: 'PS001',
          type: 'drying',
          temperature: 45,
          humidity: 30,
          duration: 24,
          timestamp: '2024-01-14T09:00:00Z',
          notes: 'Initial drying phase completed'
        }
      ],
      receivedDate: '2024-01-14T14:20:00Z'
    }
  ]);

  const [processingForm, setProcessingForm] = useState({
    batchId: '',
    stepType: '',
    temperature: '',
    humidity: '',
    duration: '',
    notes: ''
  });

  const [selectedBatch, setSelectedBatch] = useState<ProcessingBatch | null>(null);
  const [labRequests, setLabRequests] = useState<LabRequest[]>([]);
  const [showViewDetails, setShowViewDetails] = useState(false);
  const [showAddStep, setShowAddStep] = useState(false);
  const [showTagLab, setShowTagLab] = useState(false);
  const [showUploadCert, setShowUploadCert] = useState(false);
  
  const [labForm, setLabForm] = useState({
    labName: '',
    testType: '',
    priority: 'normal'
  });

  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [batchDetails, setBatchDetails] = useState<BatchDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [efficiency, setEfficiency] = useState<number>(85);

  const processTypes = [
    { value: 'drying', label: t('drying'), icon: Thermometer, emoji: '🌀' },
    { value: 'grinding', label: t('grinding'), icon: Settings, emoji: '⚙️' },
    { value: 'storage', label: t('storage'), icon: Package, emoji: '📦' },
    { value: 'packaging', label: 'Packaging', icon: Package, emoji: '📦' },
    { value: 'testing', label: 'Quality Testing', icon: CheckCircle, emoji: '🔬' }
  ];

  const handleAddProcessStep = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!processingForm.batchId || !processingForm.stepType) {
      toast({
        title: "Error",
        description: "Please select batch and process type",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await vrukshaChainAPI.addProcessStep(processingForm.batchId, {
        name: processingForm.stepType,
        timestamp: new Date().toISOString(),
        temperature: processingForm.temperature ? parseFloat(processingForm.temperature) : undefined,
        duration: processingForm.duration ? parseFloat(processingForm.duration) : undefined,
        notes: processingForm.notes
      });

      setProcessingForm({
        batchId: '',
        stepType: '',
        temperature: '',
        humidity: '',
        duration: '',
        notes: ''
      });
      setShowAddStep(false);
    } catch (error) {
      console.error('Failed to add process step:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTagLab = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedBatch || !labForm.labName || !labForm.testType) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    const newLabRequest: LabRequest = {
      id: `LR${Date.now()}`,
      batchId: selectedBatch.id,
      labName: labForm.labName,
      testType: labForm.testType,
      status: 'pending',
      requestDate: new Date().toISOString()
    };

    setLabRequests([...labRequests, newLabRequest]);
    
    toast({
      title: "Success",
      description: "Lab request submitted successfully!"
    });

    setLabForm({ labName: '', testType: '', priority: 'normal' });
    setShowTagLab(false);
  };

  const handleUploadCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!certificateFile || !selectedBatch) {
      toast({
        title: "Error",
        description: "Please select a certificate file",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Convert file to base64 for API upload
      const fileBase64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(certificateFile);
      });

      await vrukshaChainAPI.uploadCertificate(selectedBatch.id, {
        name: certificateFile.name,
        type: certificateFile.type,
        file: fileBase64,
        issuedBy: "Processor",
        validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      });

      setCertificateFile(null);
      setShowUploadCert(false);
    } catch (error) {
      console.error('Failed to upload certificate:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (batch: ProcessingBatch) => {
    setSelectedBatch(batch);
    setLoading(true);
    try {
      const details = await vrukshaChainAPI.getBatchDetails(batch.id);
      setBatchDetails(details);
    } catch (error) {
      console.error('Failed to fetch batch details:', error);
    } finally {
      setLoading(false);
    }
    setShowViewDetails(true);
  };

  const handleUpdateEfficiency = async () => {
    if (!selectedBatch) return;
    
    setLoading(true);
    try {
      await vrukshaChainAPI.updateProcessingEfficiency(selectedBatch.id, efficiency);
    } catch (error) {
      console.error('Failed to update efficiency:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStepClick = (batch: ProcessingBatch) => {
    setSelectedBatch(batch);
    setProcessingForm({ ...processingForm, batchId: batch.id });
    setShowAddStep(true);
  };

  const handleTagLabClick = (batch: ProcessingBatch) => {
    setSelectedBatch(batch);
    setShowTagLab(true);
  };

  const handleUploadCertClick = (batch: ProcessingBatch) => {
    setSelectedBatch(batch);
    setShowUploadCert(true);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800'
    };
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getProgressValue = (batch: ProcessingBatch) => {
    if (batch.status === 'completed') return 100;
    if (batch.status === 'processing') return 50;
    return 10;
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">{t('processorPortal')}</h1>
          <p className="text-muted-foreground">
            Process batches, record environmental conditions, and maintain quality standards
          </p>
        </div>

        <Tabs defaultValue="batches" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="batches" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              {t('batchesAwaiting')}
            </TabsTrigger>
            <TabsTrigger value="add-process" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {t('addProcessingStep')}
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <Factory className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="batches">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">{t('batchesAwaiting')}</h2>
                <Badge variant="outline">{batches.length} batches</Badge>
              </div>

              <div className="grid gap-4">
                {batches.map((batch) => (
                    <Card key={batch.id} className="hover:shadow-md transition-shadow duration-200">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start gap-4">
                            {/* Herb thumbnail */}
                            <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                              <span className="text-2xl">
                                {batch.cropSpecies === 'Turmeric' ? '🌱' : 
                                 batch.cropSpecies === 'Ashwagandha' ? '🌿' : '🍃'}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">Batch {batch.id}</h3>
                              <p className="text-sm text-muted-foreground">
                                {batch.cropSpecies} • {batch.weight} kg • Farmer: {batch.farmerId}
                              </p>
                            </div>
                          </div>
                          {getStatusBadge(batch.status)}
                        </div>

                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Processing Progress</span>
                          <span className="text-sm text-muted-foreground">
                            {getProgressValue(batch)}%
                          </span>
                        </div>
                        <Progress value={getProgressValue(batch)} className="h-2" />
                      </div>

                      <div className="space-y-2 mb-4">
                        <h4 className="font-medium flex items-center gap-2">
                          <Factory className="h-4 w-4" />
                          Processing Steps Completed:
                        </h4>
                        {batch.processSteps.length > 0 ? (
                          batch.processSteps.map((step) => (
                            <div key={step.id} className="flex items-center gap-2 text-sm p-2 bg-muted/50 rounded-md">
                              <span className="text-lg">
                                {step.type === 'drying' ? '🌀' : 
                                 step.type === 'grinding' ? '⚙️' : 
                                 step.type === 'storage' ? '📦' : '🔬'}
                              </span>
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="font-medium">{step.type.charAt(0).toUpperCase() + step.type.slice(1)}</span>
                              {step.temperature && (
                                <Badge variant="outline" className="text-xs">
                                  🌡️ {step.temperature}°C
                                </Badge>
                              )}
                              {step.humidity && (
                                <Badge variant="outline" className="text-xs">
                                  💧 {step.humidity}%
                                </Badge>
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">No processing steps completed yet</p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewDetails(batch)}>
                          <Eye className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleAddStepClick(batch)}>
                          <Plus className="h-3 w-3 mr-1" />
                          Add Process Step
                        </Button>
                        <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={() => handleTagLabClick(batch)}>
                          <FlaskConical className="h-3 w-3" />
                          Tag Lab
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleUploadCertClick(batch)}>
                          <Upload className="h-3 w-3 mr-1" />
                          Upload Certificate
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="add-process">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Factory className="h-5 w-5" />
                  {t('addProcessingStep')}
                </CardTitle>
                <CardDescription>
                  Record processing details and environmental conditions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddProcessStep} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="batchId">Select Batch *</Label>
                      <Select
                        value={processingForm.batchId}
                        onValueChange={(value) => setProcessingForm({ ...processingForm, batchId: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select batch to process" />
                        </SelectTrigger>
                        <SelectContent>
                          {batches.map((batch) => (
                            <SelectItem key={batch.id} value={batch.id}>
                              Batch {batch.id} - {batch.cropSpecies} ({batch.weight} kg)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="stepType">Process Type *</Label>
                      <Select
                        value={processingForm.stepType}
                        onValueChange={(value) => setProcessingForm({ ...processingForm, stepType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select process type" />
                        </SelectTrigger>
                        <SelectContent>
                          {processTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              <div className="flex items-center gap-3">
                                <span className="text-lg">{type.emoji}</span>
                                <type.icon className="h-4 w-4" />
                                <span className="font-medium">{type.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="temperature" className="flex items-center gap-2">
                        <Thermometer className="h-4 w-4" />
                        {t('temperature')} (°C)
                      </Label>
                      <Input
                        id="temperature"
                        type="number"
                        value={processingForm.temperature}
                        onChange={(e) => setProcessingForm({ ...processingForm, temperature: e.target.value })}
                        placeholder="45"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="humidity" className="flex items-center gap-2">
                        <Droplets className="h-4 w-4" />
                        {t('humidity')} (%)
                      </Label>
                      <Input
                        id="humidity"
                        type="number"
                        value={processingForm.humidity}
                        onChange={(e) => setProcessingForm({ ...processingForm, humidity: e.target.value })}
                        placeholder="30"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="duration" className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Duration (hours)
                      </Label>
                      <Input
                        id="duration"
                        type="number"
                        value={processingForm.duration}
                        onChange={(e) => setProcessingForm({ ...processingForm, duration: e.target.value })}
                        placeholder="24"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Process Notes</Label>
                    <Textarea
                      id="notes"
                      value={processingForm.notes}
                      onChange={(e) => setProcessingForm({ ...processingForm, notes: e.target.value })}
                      placeholder="Describe the processing conditions and observations..."
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add Processing Step
                    </Button>
                    <Button type="button" variant="outline" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Upload Certificate
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-blue-700">⏳ Active Batches</CardDescription>
                    <CardTitle className="text-3xl text-blue-800">12</CardTitle>
                  </CardHeader>
                </Card>
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-green-700">✅ Completed This Month</CardDescription>
                    <CardTitle className="text-3xl text-green-800">47</CardTitle>
                  </CardHeader>
                </Card>
                <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-purple-700">🏆 Quality Score</CardDescription>
                    <CardTitle className="text-3xl text-purple-800">98.5%</CardTitle>
                  </CardHeader>
                </Card>
                <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-orange-700">⚡ Processing Efficiency</CardDescription>
                    <CardTitle className="text-3xl text-orange-800">{efficiency}%</CardTitle>
                    <p className="text-xs text-orange-600 mt-1">↑ 5% from last month</p>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="space-y-2">
                      <Label className="text-xs">Update Efficiency</Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={efficiency}
                          onChange={(e) => setEfficiency(Number(e.target.value))}
                          className="h-8 text-sm"
                        />
                        <Button 
                          size="sm" 
                          onClick={handleUpdateEfficiency}
                          disabled={loading}
                          className="h-8"
                        >
                          Update
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Processing Efficiency Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span className="font-medium">This Week</span>
                        <span className="text-green-600 font-bold">94.5%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <span className="font-medium">This Month</span>
                        <span className="text-blue-600 font-bold">92.3%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                        <span className="font-medium">Quarter Goal</span>
                        <span className="text-purple-600 font-bold">95.0%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Quality Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Batch Success Rate</span>
                          <span className="font-bold">98.2%</span>
                        </div>
                        <Progress value={98.2} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Lab Test Pass Rate</span>
                          <span className="font-bold">96.7%</span>
                        </div>
                        <Progress value={96.7} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Certificate Compliance</span>
                          <span className="font-bold">100%</span>
                        </div>
                        <Progress value={100} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* View Details Dialog */}
        <Dialog open={showViewDetails} onOpenChange={setShowViewDetails}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Batch Details - {selectedBatch?.id}</DialogTitle>
              <DialogDescription>
                Complete processing information and history
              </DialogDescription>
            </DialogHeader>
            {selectedBatch && (
              <div className="space-y-6">
                {loading && (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Crop Species</Label>
                    <p className="font-medium">{selectedBatch.cropSpecies}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Weight</Label>
                    <p className="font-medium">{selectedBatch.weight} kg</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Farmer ID</Label>
                    <p className="font-medium">{selectedBatch.farmerId}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    {getStatusBadge(selectedBatch.status)}
                  </div>
                </div>
                
                {batchDetails && (
                  <>
                    <div className="space-y-3">
                      <Label>Processing History (API Data)</Label>
                      {batchDetails.processSteps.length > 0 ? (
                        batchDetails.processSteps.map((step) => (
                          <div key={step.id} className="p-3 border rounded-lg space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-medium capitalize">{step.name}</span>
                              <span className="text-sm text-muted-foreground">
                                {new Date(step.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex gap-4 text-sm">
                              {step.temperature && <span>🌡️ {step.temperature}°C</span>}
                              {step.duration && <span>⏱️ {step.duration}h</span>}
                            </div>
                            {step.notes && (
                              <p className="text-sm text-muted-foreground">{step.notes}</p>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground">No processing steps from API yet</p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Label>Certificates (API Data)</Label>
                      {batchDetails.certificates.length > 0 ? (
                        batchDetails.certificates.map((cert) => (
                          <div key={cert.id} className="p-3 border rounded-lg">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{cert.name}</span>
                              <Badge variant="outline">{cert.type}</Badge>
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              Issued by: {cert.issuedBy} • Valid until: {new Date(cert.validUntil).toLocaleDateString()}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground">No certificates from API yet</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Processing Efficiency (API Data)</Label>
                      <div className="flex items-center gap-2">
                        <Progress value={batchDetails.efficiency} className="flex-1" />
                        <span className="font-medium">{batchDetails.efficiency}%</span>
                      </div>
                    </div>
                  </>
                )}
                
                <div className="space-y-3">
                  <Label>Local Processing History</Label>
                  {selectedBatch.processSteps.length > 0 ? (
                    selectedBatch.processSteps.map((step) => (
                      <div key={step.id} className="p-3 border rounded-lg space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium capitalize">{step.type}</span>
                          <span className="text-sm text-muted-foreground">
                            {new Date(step.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex gap-4 text-sm">
                          {step.temperature && <span>🌡️ {step.temperature}°C</span>}
                          {step.humidity && <span>💧 {step.humidity}%</span>}
                          <span>⏱️ {step.duration}h</span>
                        </div>
                        {step.notes && (
                          <p className="text-sm text-muted-foreground">{step.notes}</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No local processing steps recorded yet</p>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Add Process Step Dialog */}
        <Dialog open={showAddStep} onOpenChange={setShowAddStep}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Processing Step</DialogTitle>
              <DialogDescription>
                Record new processing step for Batch {selectedBatch?.id}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddProcessStep} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Process Type</Label>
                  <Select
                    value={processingForm.stepType}
                    onValueChange={(value) => setProcessingForm({ ...processingForm, stepType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select process" />
                    </SelectTrigger>
                    <SelectContent>
                      {processTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.emoji} {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Duration (hours)</Label>
                  <Input
                    type="number"
                    value={processingForm.duration}
                    onChange={(e) => setProcessingForm({ ...processingForm, duration: e.target.value })}
                    placeholder="24"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Temperature (°C)</Label>
                  <Input
                    type="number"
                    value={processingForm.temperature}
                    onChange={(e) => setProcessingForm({ ...processingForm, temperature: e.target.value })}
                    placeholder="45"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Humidity (%)</Label>
                  <Input
                    type="number"
                    value={processingForm.humidity}
                    onChange={(e) => setProcessingForm({ ...processingForm, humidity: e.target.value })}
                    placeholder="30"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={processingForm.notes}
                  onChange={(e) => setProcessingForm({ ...processingForm, notes: e.target.value })}
                  placeholder="Describe conditions and observations..."
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowAddStep(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Adding...' : 'Add Step'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Tag Lab Dialog */}
        <Dialog open={showTagLab} onOpenChange={setShowTagLab}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tag Laboratory for Testing</DialogTitle>
              <DialogDescription>
                Send Batch {selectedBatch?.id} for quality testing
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleTagLab} className="space-y-4">
              <div className="space-y-2">
                <Label>Laboratory Name</Label>
                <Select
                  value={labForm.labName}
                  onValueChange={(value) => setLabForm({ ...labForm, labName: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select laboratory" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="central-lab">Central Quality Lab</SelectItem>
                    <SelectItem value="regional-lab">Regional Testing Lab</SelectItem>
                    <SelectItem value="certified-lab">Certified Analysis Lab</SelectItem>
                    <SelectItem value="govt-lab">Government Testing Facility</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Test Type</Label>
                <Select
                  value={labForm.testType}
                  onValueChange={(value) => setLabForm({ ...labForm, testType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select test type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="purity">Purity Analysis</SelectItem>
                    <SelectItem value="contamination">Contamination Check</SelectItem>
                    <SelectItem value="potency">Potency Testing</SelectItem>
                    <SelectItem value="heavy-metals">Heavy Metals</SelectItem>
                    <SelectItem value="pesticides">Pesticide Residue</SelectItem>
                    <SelectItem value="full-panel">Full Panel Testing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Priority Level</Label>
                <Select
                  value={labForm.priority}
                  onValueChange={(value) => setLabForm({ ...labForm, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal (5-7 days)</SelectItem>
                    <SelectItem value="high">High (2-3 days)</SelectItem>
                    <SelectItem value="urgent">Urgent (24 hours)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowTagLab(false)}>
                  Cancel
                </Button>
                <Button type="submit">Submit Lab Request</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Upload Certificate Dialog */}
        <Dialog open={showUploadCert} onOpenChange={setShowUploadCert}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Certificate</DialogTitle>
              <DialogDescription>
                Upload quality certificate for Batch {selectedBatch?.id}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUploadCertificate} className="space-y-4">
              <div className="space-y-2">
                <Label>Certificate File</Label>
                <Input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setCertificateFile(e.target.files?.[0] || null)}
                />
                <p className="text-sm text-muted-foreground">
                  Supported formats: PDF, JPG, PNG (Max 10MB)
                </p>
              </div>

              {certificateFile && (
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm font-medium">{certificateFile.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {(certificateFile.size / 1024 / 1024).toFixed(2)} MB
                    </Badge>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowUploadCert(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={!certificateFile || loading}>
                  {loading ? 'Uploading...' : 'Upload Certificate'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ProcessorDashboard;