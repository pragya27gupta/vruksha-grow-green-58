import React, { useState } from 'react';
import QRCode from 'qrcode';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Printer, Share2, Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ProductBatch {
  id: string;
  productName: string;
  qrCode: string;
  sourceBatches: string[];
  manufacturingDate: string;
  expiryDate: string;
  batchSize: number;
  status: string;
}

interface QRLabelGeneratorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductBatch;
}

export const QRLabelGenerator: React.FC<QRLabelGeneratorProps> = ({
  open,
  onOpenChange,
  product
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  React.useEffect(() => {
    if (open && product) {
      generateQRCode();
    }
  }, [open, product]);

  const generateQRCode = async () => {
    setIsGenerating(true);
    try {
      // Create traceability URL with product information
      const traceabilityData = {
        productId: product.id,
        productName: product.productName,
        qrCode: product.qrCode,
        manufacturingDate: product.manufacturingDate,
        expiryDate: product.expiryDate,
        batchSize: product.batchSize,
        sourceBatches: product.sourceBatches,
        traceabilityUrl: `https://vrukshachain.com/trace/${product.qrCode}`
      };

      const qrDataString = JSON.stringify(traceabilityData);
      
      const qrUrl = await QRCode.toDataURL(qrDataString, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      setQrCodeUrl(qrUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast({
        title: "Error",
        description: "Failed to generate QR code",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadLabel = () => {
    if (!qrCodeUrl) return;

    // Create a canvas for the complete label
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size for label (standard label size)
    canvas.width = 400;
    canvas.height = 600;

    // White background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add border
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

    // Add company logo area (placeholder)
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(20, 20, canvas.width - 40, 60);
    ctx.fillStyle = '#666666';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('VrukshaChain', canvas.width / 2, 55);

    // Add product information
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Product Name:', 30, 110);
    ctx.font = '16px Arial';
    ctx.fillText(product.productName, 30, 135);

    ctx.font = 'bold 14px Arial';
    ctx.fillText(`Batch ID: ${product.id}`, 30, 165);
    ctx.fillText(`QR Code: ${product.qrCode}`, 30, 185);
    ctx.fillText(`Mfg Date: ${new Date(product.manufacturingDate).toLocaleDateString()}`, 30, 205);
    ctx.fillText(`Exp Date: ${new Date(product.expiryDate).toLocaleDateString()}`, 30, 225);
    ctx.fillText(`Batch Size: ${product.batchSize} units`, 30, 245);

    // Add QR code
    const img = new Image();
    img.onload = () => {
      // Center the QR code
      const qrSize = 200;
      const qrX = (canvas.width - qrSize) / 2;
      const qrY = 280;
      
      ctx.drawImage(img, qrX, qrY, qrSize, qrSize);

      // Add scan instruction
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Scan for full traceability', canvas.width / 2, 510);
      ctx.fillText('Powered by VrukshaChain', canvas.width / 2, 530);

      // Download the label
      const link = document.createElement('a');
      link.download = `${product.qrCode}-label.png`;
      link.href = canvas.toDataURL();
      link.click();

      toast({
        title: "Success",
        description: "Label downloaded successfully"
      });
    };
    img.src = qrCodeUrl;
  };

  const printLabel = () => {
    if (!qrCodeUrl) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print QR Label - ${product.qrCode}</title>
          <style>
            body {
              margin: 0;
              padding: 20px;
              font-family: Arial, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
            }
            .label {
              width: 4in;
              height: 6in;
              border: 2px solid #000;
              padding: 15px;
              text-align: center;
              background: white;
            }
            .header {
              border-bottom: 1px solid #ccc;
              padding-bottom: 10px;
              margin-bottom: 15px;
            }
            .company-name {
              font-size: 20px;
              font-weight: bold;
              color: #2563eb;
            }
            .product-info {
              text-align: left;
              margin-bottom: 20px;
              line-height: 1.5;
            }
            .qr-code {
              margin: 20px 0;
            }
            .qr-code img {
              width: 150px;
              height: 150px;
            }
            .footer {
              font-size: 10px;
              color: #666;
              margin-top: 15px;
            }
            @media print {
              body { margin: 0; }
              .label { 
                width: 4in; 
                height: 6in; 
                page-break-inside: avoid; 
              }
            }
          </style>
        </head>
        <body>
          <div class="label">
            <div class="header">
              <div class="company-name">VrukshaChain</div>
            </div>
            
            <div class="product-info">
              <strong>Product:</strong> ${product.productName}<br>
              <strong>Batch ID:</strong> ${product.id}<br>
              <strong>QR Code:</strong> ${product.qrCode}<br>
              <strong>Mfg Date:</strong> ${new Date(product.manufacturingDate).toLocaleDateString()}<br>
              <strong>Exp Date:</strong> ${new Date(product.expiryDate).toLocaleDateString()}<br>
              <strong>Batch Size:</strong> ${product.batchSize} units
            </div>
            
            <div class="qr-code">
              <img src="${qrCodeUrl}" alt="QR Code" />
            </div>
            
            <div class="footer">
              Scan for full traceability<br>
              Powered by VrukshaChain
            </div>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);

    toast({
      title: "Print Ready",
      description: "Label sent to printer"
    });
  };

  const shareQR = async () => {
    if (!qrCodeUrl) return;

    if (navigator.share) {
      try {
        // Convert data URL to blob
        const response = await fetch(qrCodeUrl);
        const blob = await response.blob();
        const file = new File([blob], `${product.qrCode}-qr.png`, { type: 'image/png' });

        await navigator.share({
          title: `QR Code for ${product.productName}`,
          text: `Scan this QR code to view the full traceability of ${product.productName}`,
          files: [file]
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        const response = await fetch(qrCodeUrl);
        const blob = await response.blob();
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        toast({
          title: "Copied",
          description: "QR code copied to clipboard"
        });
      } catch (error) {
        toast({
          title: "Share",
          description: "QR code ready to share"
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code Label Generator</DialogTitle>
          <DialogDescription>
            Generate, download, and print QR code label for {product.productName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 text-center">
              {isGenerating ? (
                <div className="py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-sm text-muted-foreground mt-2">Generating QR code...</p>
                </div>
              ) : qrCodeUrl ? (
                <div className="space-y-4">
                  <img 
                    src={qrCodeUrl} 
                    alt="QR Code" 
                    className="w-48 h-48 mx-auto border rounded"
                  />
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium">{product.productName}</p>
                    <p>QR: {product.qrCode}</p>
                    <p>Batch: {product.id}</p>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-muted-foreground">
                  No QR code generated
                </div>
              )}
            </CardContent>
          </Card>

          {qrCodeUrl && (
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={downloadLabel}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
              
              <Button 
                onClick={printLabel}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Printer className="h-4 w-4" />
                Print
              </Button>
              
              <Button 
                onClick={shareQR}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>

              <Button
                onClick={() => {
                  navigator.clipboard.writeText(`https://vrukshachain.com/trace/${product.qrCode}`);
                  toast({
                    title: "Copied",
                    description: "Traceability URL copied to clipboard"
                  });
                }}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Copy URL
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};