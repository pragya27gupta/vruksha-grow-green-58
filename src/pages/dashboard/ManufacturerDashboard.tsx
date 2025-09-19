import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Factory, 
  QrCode, 
  Package, 
  Download,
  Printer,
  Plus,
  Eye,
  CheckCircle,
  Combine,
  Tags
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface VerifiedBatch {
  id: string;
  cropSpecies: string;
  farmerId: string;
  processorId: string;
  labId: string;
  weight: number;
  qualityScore: number;
  status: 'verified' | 'used' | 'available';
  certifications: string[];
  harvestDate: string;
}

interface ProductBatch {
  id: string;
  productName: string;
  qrCode: string;
  sourceBatches: string[];
  manufacturingDate: string;
  expiryDate: string;
  batchSize: number;
  status: 'manufactured' | 'packaged' | 'distributed';
}

const ManufacturerDashboard = () => {
  const { t } = useTranslation();
  
  const [verifiedBatches] = useState<VerifiedBatch[]>([
    {
      id: 'VB001',
      cropSpecies: 'Turmeric',
      farmerId: 'F123',
      processorId: 'P456',
      labId: 'L789',
      weight: 25.5,
      qualityScore: 98.5,
      status: 'available',
      certifications: ['Organic', 'Quality Tested'],
      harvestDate: '2024-01-15T10:30:00Z'
    },
    {
      id: 'VB002',
      cropSpecies: 'Ashwagandha',
      farmerId: 'F124',
      processorId: 'P457',
      labId: 'L790',
      weight: 15.2,
      qualityScore: 96.8,
      status: 'available',
      certifications: ['Organic', 'Quality Tested', 'Fair Trade'],
      harvestDate: '2024-01-14T14:20:00Z'
    }
  ]);

  const [productBatches, setProductBatches] = useState<ProductBatch[]>([
    {
      id: 'PB001',
      productName: 'Premium Turmeric Powder',
      qrCode: 'QR-TUR-001-2024',
      sourceBatches: ['VB001'],
      manufacturingDate: '2024-01-20T10:00:00Z',
      expiryDate: '2025-01-20T10:00:00Z',
      batchSize: 1000,
      status: 'packaged'
    }
  ]);

  const [productForm, setProductForm] = useState({
    productName: '',
    selectedBatches: [] as string[],
    batchSize: '',
    expiryMonths: '12'
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productForm.productName || productForm.selectedBatches.length === 0 || !productForm.batchSize) {
      toast({
        title: "Error",
        description: "Please fill in all required fields and select at least one batch",
        variant: "destructive"
      });
      return;
    }

    const newProduct: ProductBatch = {
      id: `PB${String(productBatches.length + 1).padStart(3, '0')}`,
      productName: productForm.productName,
      qrCode: `QR-${productForm.productName.substring(0, 3).toUpperCase()}-${String(productBatches.length + 1).padStart(3, '0')}-2024`,
      sourceBatches: productForm.selectedBatches,
      manufacturingDate: new Date().toISOString(),
      expiryDate: new Date(Date.now() + parseInt(productForm.expiryMonths) * 30 * 24 * 60 * 60 * 1000).toISOString(),
      batchSize: parseInt(productForm.batchSize),
      status: 'manufactured'
    };

    setProductBatches([newProduct, ...productBatches]);
    
    toast({
      title: "Success",
      description: `Product batch ${newProduct.id} created with QR code: ${newProduct.qrCode}`
    });

    setProductForm({
      productName: '',
      selectedBatches: [],
      batchSize: '',
      expiryMonths: '12'
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      available: 'bg-green-100 text-green-800',
      verified: 'bg-blue-100 text-blue-800',
      used: 'bg-gray-100 text-gray-800',
      manufactured: 'bg-orange-100 text-orange-800',
      packaged: 'bg-purple-100 text-purple-800',
      distributed: 'bg-gray-100 text-gray-800'
    };
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const handleBatchSelection = (batchId: string, isSelected: boolean) => {
    if (isSelected) {
      setProductForm({
        ...productForm,
        selectedBatches: [...productForm.selectedBatches, batchId]
      });
    } else {
      setProductForm({
        ...productForm,
        selectedBatches: productForm.selectedBatches.filter(id => id !== batchId)
      });
    }
  };

  const generateQRLabel = (product: ProductBatch) => {
    toast({
      title: "QR Label Generated",
      description: `QR label for ${product.qrCode} is ready for download/print`
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">{t('manufacturerPortal')}</h1>
          <p className="text-muted-foreground">
            Combine verified batches, create products, and generate QR codes for transparency
          </p>
        </div>

        <Tabs defaultValue="verified-batches" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="verified-batches" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              {t('verifiedBatches')}
            </TabsTrigger>
            <TabsTrigger value="create-product" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {t('createProductBatch')}
            </TabsTrigger>
            <TabsTrigger value="product-batches" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Product Batches
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <Factory className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="verified-batches">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">{t('verifiedBatches')}</h2>
                <Badge variant="outline">{verifiedBatches.length} batches available</Badge>
              </div>

              <div className="grid gap-4">
                {verifiedBatches.map((batch) => (
                  <Card key={batch.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">Batch {batch.id}</h3>
                          <p className="text-sm text-muted-foreground">
                            {batch.cropSpecies} • {batch.weight} kg • Quality: {batch.qualityScore}%
                          </p>
                        </div>
                        {getStatusBadge(batch.status)}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <span className="text-sm font-medium">Farmer ID:</span>
                          <p className="text-sm text-muted-foreground">{batch.farmerId}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Processor ID:</span>
                          <p className="text-sm text-muted-foreground">{batch.processorId}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Lab ID:</span>
                          <p className="text-sm text-muted-foreground">{batch.labId}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Harvest Date:</span>
                          <p className="text-sm text-muted-foreground">
                            {new Date(batch.harvestDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <span className="text-sm font-medium">Certifications:</span>
                        <div className="flex gap-2 mt-1">
                          {batch.certifications.map((cert) => (
                            <Badge key={cert} variant="secondary" className="text-xs">
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          View Full Traceability
                        </Button>
                        <Button variant="outline" size="sm">
                          Use in Product
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="create-product">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Combine className="h-5 w-5" />
                  {t('createProductBatch')}
                </CardTitle>
                <CardDescription>
                  Combine verified batches to create a new product with unique QR code
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateProduct} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="productName">Product Name *</Label>
                      <Input
                        id="productName"
                        value={productForm.productName}
                        onChange={(e) => setProductForm({ ...productForm, productName: e.target.value })}
                        placeholder="Premium Turmeric Powder"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="batchSize">Batch Size (units) *</Label>
                      <Input
                        id="batchSize"
                        type="number"
                        value={productForm.batchSize}
                        onChange={(e) => setProductForm({ ...productForm, batchSize: e.target.value })}
                        placeholder="1000"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="expiryMonths">Expiry (months)</Label>
                      <Select
                        value={productForm.expiryMonths}
                        onValueChange={(value) => setProductForm({ ...productForm, expiryMonths: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="6">6 months</SelectItem>
                          <SelectItem value="12">12 months</SelectItem>
                          <SelectItem value="18">18 months</SelectItem>
                          <SelectItem value="24">24 months</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Select Source Batches *</Label>
                    <div className="grid gap-3">
                      {verifiedBatches.filter(b => b.status === 'available').map((batch) => (
                        <div key={batch.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                          <input
                            type="checkbox"
                            id={batch.id}
                            checked={productForm.selectedBatches.includes(batch.id)}
                            onChange={(e) => handleBatchSelection(batch.id, e.target.checked)}
                            className="h-4 w-4"
                          />
                          <label htmlFor={batch.id} className="flex-1 cursor-pointer">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{batch.id} - {batch.cropSpecies}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">{batch.weight} kg</span>
                                <Badge variant="outline">Q: {batch.qualityScore}%</Badge>
                              </div>
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Create Product Batch
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="product-batches">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Product Batches</h2>
                <Badge variant="outline">{productBatches.length} products</Badge>
              </div>

              <div className="grid gap-4">
                {productBatches.map((product) => (
                  <Card key={product.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{product.productName}</h3>
                          <p className="text-sm text-muted-foreground">
                            Batch: {product.id} • QR: {product.qrCode}
                          </p>
                        </div>
                        {getStatusBadge(product.status)}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <span className="text-sm font-medium">Batch Size:</span>
                          <p className="text-sm text-muted-foreground">{product.batchSize} units</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Manufacturing:</span>
                          <p className="text-sm text-muted-foreground">
                            {new Date(product.manufacturingDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Expiry:</span>
                          <p className="text-sm text-muted-foreground">
                            {new Date(product.expiryDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Source Batches:</span>
                          <p className="text-sm text-muted-foreground">{product.sourceBatches.join(', ')}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => generateQRLabel(product)}
                          className="flex items-center gap-2"
                        >
                          <QrCode className="h-4 w-4" />
                          {t('generateQRCode')}
                        </Button>
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          <Download className="h-4 w-4" />
                          Download Label
                        </Button>
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          <Printer className="h-4 w-4" />
                          Print Label
                        </Button>
                        <Button variant="outline" size="sm">
                          View Traceability
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
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Product Batches</CardDescription>
                    <CardTitle className="text-3xl">24</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>QR Codes Generated</CardDescription>
                    <CardTitle className="text-3xl">24,000</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Avg Quality Score</CardDescription>
                    <CardTitle className="text-3xl">97.8%</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Consumer Scans</CardDescription>
                    <CardTitle className="text-3xl">1,847</CardTitle>
                  </CardHeader>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Production Overview</CardTitle>
                  <CardDescription>
                    Manufacturing trends and quality metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    📊 Production analytics and quality trends will be displayed here
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ManufacturerDashboard;