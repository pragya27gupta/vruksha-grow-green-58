import { toast } from "sonner";

const EDGE_FUNCTION_URL = "/functions/v1/vrukshachain-api";

export interface ProcessStep {
  id: string;
  name: string;
  timestamp: string;
  temperature?: number;
  duration?: number;
  notes?: string;
}

export interface Certificate {
  id: string;
  name: string;
  type: string;
  file: string;
  issuedBy: string;
  validUntil: string;
}

export interface BatchDetails {
  id: string;
  name: string;
  status: string;
  processSteps: ProcessStep[];
  certificates: Certificate[];
  efficiency: number;
}

class VrukshaChainAPI {
  private async makeRequest(action: string, data: any) {
    try {
      const response = await fetch(EDGE_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, data }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('VrukshaChain API Error:', error);
      toast.error('API request failed. Please try again.');
      throw error;
    }
  }

  async addProcessStep(batchId: string, step: Omit<ProcessStep, 'id'>): Promise<ProcessStep> {
    const result = await this.makeRequest('addProcessStep', {
      batchId,
      ...step,
    });
    toast.success('Process step added successfully');
    return result;
  }

  async uploadCertificate(batchId: string, certificate: Omit<Certificate, 'id'>): Promise<Certificate> {
    const result = await this.makeRequest('uploadCertificate', {
      batchId,
      ...certificate,
    });
    toast.success('Certificate uploaded successfully');
    return result;
  }

  async updateProcessingEfficiency(batchId: string, efficiency: number): Promise<void> {
    await this.makeRequest('updateEfficiency', {
      batchId,
      efficiency,
    });
    toast.success('Processing efficiency updated');
  }

  async getBatchDetails(batchId: string): Promise<BatchDetails> {
    return await this.makeRequest('getBatchDetails', { batchId });
  }
}

export const vrukshaChainAPI = new VrukshaChainAPI();