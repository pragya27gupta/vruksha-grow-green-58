import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, AlertTriangle, CheckCircle, BarChart3, Download } from 'lucide-react';
import { ComplianceReports } from '@/components/ComplianceReports';
import { RegulatoryAnalytics } from '@/components/RegulatoryAnalytics';

const RegulatorDashboard = () => {
  const { t } = useTranslation();

  console.log('RegulatorDashboard component rendered');

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">{t('regulatorPortal')}</h1>
          <p className="text-muted-foreground">
            Monitor compliance, review violations, and ensure regulatory standards
          </p>
        </div>

        <Tabs defaultValue="compliance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="compliance" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              {t('complianceDashboard')}
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              {t('complianceReports')}
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="compliance">
            <div className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card><CardHeader className="pb-2"><CardDescription>Active Violations</CardDescription><CardTitle className="text-3xl text-red-600">3</CardTitle></CardHeader></Card>
                <Card><CardHeader className="pb-2"><CardDescription>Compliance Rate</CardDescription><CardTitle className="text-3xl text-green-600">96.8%</CardTitle></CardHeader></Card>
                <Card><CardHeader className="pb-2"><CardDescription>Pending Reviews</CardDescription><CardTitle className="text-3xl">12</CardTitle></CardHeader></Card>
                <Card><CardHeader className="pb-2"><CardDescription>Total Audits</CardDescription><CardTitle className="text-3xl">847</CardTitle></CardHeader></Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reports">
            <div className="p-4 border rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Compliance Reports Test</h3>
              <ComplianceReports />
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="p-4 border rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Analytics Test</h3>
              <RegulatoryAnalytics />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RegulatorDashboard;