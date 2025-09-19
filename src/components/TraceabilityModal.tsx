import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  User, 
  Factory, 
  FlaskConical, 
  Package, 
  Calendar,
  Thermometer,
  Clock,
  Award,
  FileCheck
} from 'lucide-react';

interface TraceabilityStep {
  id: string;
  type: 'farmer' | 'processor' | 'laboratory' | 'manufacturer';
  name: string;
  location: string;
  timestamp: string;
  details: Record<string, any>;
  certifications?: string[];
  qualityMetrics?: Record<string, string | number>;
}

interface TraceabilityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  batchId: string;
  productName?: string;
}

const mockTraceabilityData: Record<string, TraceabilityStep[]> = {
  'VB001': [
    {
      id: 'step1',
      type: 'farmer',
      name: 'Green Valley Farm - Rajesh Kumar',
      location: 'Wayanad, Kerala',
      timestamp: '2024-01-15T10:30:00Z',
      details: {
        soilType: 'Red Laterite',
        organicCertified: true,
        seedVariety: 'Salem Turmeric',
        irrigationType: 'Drip Irrigation'
      },
      certifications: ['Organic India', 'Fair Trade'],
      qualityMetrics: {
        curcuminContent: 6.8,
        moistureContent: 12.5
      }
    },
    {
      id: 'step2',
      type: 'processor',
      name: 'SpiceMax Processing Unit',
      location: 'Cochin, Kerala',
      timestamp: '2024-01-17T14:20:00Z',
      details: {
        processMethod: 'Steam Distillation',
        temperature: 85,
        duration: 240,
        batchWeight: 500
      },
      certifications: ['FSSAI', 'ISO 22000'],
      qualityMetrics: {
        purity: 99.2,
        volatileOilContent: 4.5
      }
    },
    {
      id: 'step3',
      type: 'laboratory',
      name: 'BioTest Analytics Lab',
      location: 'Bangalore, Karnataka',
      timestamp: '2024-01-18T09:15:00Z',
      details: {
        testMethod: 'HPLC Analysis',
        sampleSize: '100g',
        testingStandard: 'AGMARK'
      },
      certifications: ['NABL Accredited'],
      qualityMetrics: {
        curcuminContent: 6.85,
        heavyMetals: 0.001,
        microbiological: 'Pass',
        aflatoxin: 0.002
      }
    }
  ],
  'PB001': [
    {
      id: 'step1',
      type: 'farmer',
      name: 'Green Valley Farm - Rajesh Kumar',
      location: 'Wayanad, Kerala',
      timestamp: '2024-01-15T10:30:00Z',
      details: {
        soilType: 'Red Laterite',
        organicCertified: true,
        seedVariety: 'Salem Turmeric'
      },
      certifications: ['Organic India', 'Fair Trade']
    },
    {
      id: 'step2',
      type: 'processor',
      name: 'SpiceMax Processing Unit',
      location: 'Cochin, Kerala',
      timestamp: '2024-01-17T14:20:00Z',
      details: {
        processMethod: 'Steam Distillation',
        temperature: 85,
        duration: 240
      },
      certifications: ['FSSAI', 'ISO 22000']
    },
    {
      id: 'step3',
      type: 'laboratory',
      name: 'BioTest Analytics Lab',
      location: 'Bangalore, Karnataka',
      timestamp: '2024-01-18T09:15:00Z',
      details: {
        testMethod: 'HPLC Analysis',
        qualityScore: 98.5
      },
      certifications: ['NABL Accredited']
    },
    {
      id: 'step4',
      type: 'manufacturer',
      name: 'VrukshaChain Manufacturing',
      location: 'Mumbai, Maharashtra',
      timestamp: '2024-01-20T10:00:00Z',
      details: {
        productType: 'Premium Turmeric Powder',
        batchSize: 1000,
        packaging: 'Food Grade Containers'
      },
      certifications: ['GMP', 'HACCP']
    }
  ]
};

const getStepIcon = (type: string) => {
  switch (type) {
    case 'farmer': return <User className="h-5 w-5" />;
    case 'processor': return <Factory className="h-5 w-5" />;
    case 'laboratory': return <FlaskConical className="h-5 w-5" />;
    case 'manufacturer': return <Package className="h-5 w-5" />;
    default: return <MapPin className="h-5 w-5" />;
  }
};

const getStepColor = (type: string) => {
  switch (type) {
    case 'farmer': return 'bg-green-100 text-green-700 border-green-200';
    case 'processor': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'laboratory': return 'bg-purple-100 text-purple-700 border-purple-200';
    case 'manufacturer': return 'bg-orange-100 text-orange-700 border-orange-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

export const TraceabilityModal: React.FC<TraceabilityModalProps> = ({
  open,
  onOpenChange,
  batchId,
  productName
}) => {
  const traceabilityData = mockTraceabilityData[batchId] || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Full Traceability - {productName ? productName : `Batch ${batchId}`}
          </DialogTitle>
          <DialogDescription>
            Complete supply chain journey from farm to final product
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {traceabilityData.map((step, index) => (
            <div key={step.id} className="relative">
              {index < traceabilityData.length - 1 && (
                <div className="absolute left-8 top-16 w-0.5 h-full bg-border" />
              )}
              
              <Card className={`border-2 ${getStepColor(step.type)}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${getStepColor(step.type)}`}>
                      {getStepIcon(step.type)}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg capitalize">
                        {step.type} - {step.name}
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {step.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(step.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-background">
                      Step {index + 1}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Process Details */}
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <FileCheck className="h-4 w-4" />
                      Process Details
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {Object.entries(step.details).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-muted-foreground capitalize">
                            {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                          </span>
                          <span className="font-medium">
                            {typeof value === 'number' ? value.toLocaleString() : String(value)}
                            {key.includes('temperature') || key.includes('Temperature') ? '°C' : ''}
                            {key.includes('duration') || key.includes('Duration') ? ' min' : ''}
                            {key.includes('weight') || key.includes('Weight') ? ' kg' : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quality Metrics */}
                  {step.qualityMetrics && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <Thermometer className="h-4 w-4" />
                          Quality Metrics
                        </h4>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          {Object.entries(step.qualityMetrics).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-muted-foreground capitalize">
                                {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                              </span>
                              <span className="font-medium text-green-600">
                                {typeof value === 'number' ? value.toLocaleString() : String(value)}
                                {key.includes('Content') || key.includes('content') ? '%' : ''}
                                {key.includes('ppm') ? ' ppm' : ''}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Certifications */}
                  {step.certifications && step.certifications.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <Award className="h-4 w-4" />
                          Certifications
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {step.certifications.map((cert) => (
                            <Badge key={cert} variant="secondary" className="text-xs">
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};