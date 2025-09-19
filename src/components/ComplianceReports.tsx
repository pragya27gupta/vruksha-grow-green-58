import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Download, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Calendar,
  Filter,
  Search,
  Eye,
  ExternalLink
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ComplianceReport {
  id: string;
  title: string;
  type: 'violation' | 'audit' | 'certification' | 'inspection';
  status: 'pending' | 'approved' | 'rejected' | 'under-review';
  entity: string;
  date: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  inspector: string;
  documents: string[];
}

const mockReports: ComplianceReport[] = [
  {
    id: 'CR001',
    title: 'Organic Certification Audit - Farm ABC',
    type: 'audit',
    status: 'approved',
    entity: 'Green Valley Farms',
    date: '2024-01-15',
    severity: 'low',
    description: 'Annual organic certification audit completed successfully',
    inspector: 'Dr. Sarah Johnson',
    documents: ['Audit_Report_ABC_2024.pdf', 'Certification_ABC.pdf']
  },
  {
    id: 'CR002',
    title: 'Pesticide Residue Violation',
    type: 'violation',
    status: 'under-review',
    entity: 'Sunrise Processors',
    date: '2024-01-20',
    severity: 'high',
    description: 'Detected pesticide residue above permitted levels in batch SP-2024-001',
    inspector: 'Mark Thompson',
    documents: ['Lab_Report_SP001.pdf', 'Violation_Notice.pdf']
  },
  {
    id: 'CR003',
    title: 'HACCP Compliance Inspection',
    type: 'inspection',
    status: 'approved',
    entity: 'Natural Products Ltd.',
    date: '2024-01-18',
    severity: 'low',
    description: 'HACCP system implementation review and approval',
    inspector: 'Jennifer Lee',
    documents: ['HACCP_Report.pdf', 'Compliance_Certificate.pdf']
  },
  {
    id: 'CR004',
    title: 'Packaging Safety Standards',
    type: 'certification',
    status: 'pending',
    entity: 'PackSafe Industries',
    date: '2024-01-22',
    severity: 'medium',
    description: 'Food-grade packaging material certification pending',
    inspector: 'Robert Chen',
    documents: ['Material_Test_Report.pdf']
  },
  {
    id: 'CR005',
    title: 'Critical Temperature Control Failure',
    type: 'violation',
    status: 'rejected',
    entity: 'ColdChain Logistics',
    date: '2024-01-19',
    severity: 'critical',
    description: 'Temperature monitoring system failure during transport',
    inspector: 'Emily Davis',
    documents: ['Temperature_Log.pdf', 'Incident_Report.pdf', 'Corrective_Action.pdf']
  }
];

export const ComplianceReports: React.FC = () => {
  const [reports, setReports] = useState<ComplianceReport[]>(mockReports);
  const [filteredReports, setFilteredReports] = useState<ComplianceReport[]>(mockReports);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    status: '',
    severity: '',
    dateFrom: '',
    dateTo: ''
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      approved: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
      'under-review': 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {status.replace('-', ' ').toUpperCase()}
      </Badge>
    );
  };

  const getSeverityBadge = (severity: string) => {
    const variants = {
      low: 'bg-gray-100 text-gray-800 border-gray-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      critical: 'bg-red-100 text-red-800 border-red-200'
    };
    return (
      <Badge className={variants[severity as keyof typeof variants]}>
        {severity.toUpperCase()}
      </Badge>
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'violation': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'audit': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'certification': return <FileText className="h-4 w-4 text-blue-500" />;
      case 'inspection': return <Eye className="h-4 w-4 text-purple-500" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const applyFilters = () => {
    let filtered = reports;

    if (filters.search) {
      filtered = filtered.filter(report =>
        report.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        report.entity.toLowerCase().includes(filters.search.toLowerCase()) ||
        report.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.type) {
      filtered = filtered.filter(report => report.type === filters.type);
    }

    if (filters.status) {
      filtered = filtered.filter(report => report.status === filters.status);
    }

    if (filters.severity) {
      filtered = filtered.filter(report => report.severity === filters.severity);
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(report => report.date >= filters.dateFrom);
    }

    if (filters.dateTo) {
      filtered = filtered.filter(report => report.date <= filters.dateTo);
    }

    setFilteredReports(filtered);
  };

  React.useEffect(() => {
    applyFilters();
  }, [filters]);

  const downloadReport = (reportId: string, documentName: string) => {
    toast({
      title: "Download Started",
      description: `Downloading ${documentName}...`
    });
  };

  const exportAllReports = () => {
    toast({
      title: "Export Started",
      description: "Exporting compliance reports to PDF..."
    });
  };

  const generateSummaryReport = () => {
    toast({
      title: "Generating Report",
      description: "Creating compliance summary report..."
    });
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Reports</CardDescription>
            <CardTitle className="text-3xl">{reports.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Violations</CardDescription>
            <CardTitle className="text-3xl text-red-600">
              {reports.filter(r => r.type === 'violation').length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending Reviews</CardDescription>
            <CardTitle className="text-3xl text-yellow-600">
              {reports.filter(r => r.status === 'pending' || r.status === 'under-review').length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Critical Issues</CardDescription>
            <CardTitle className="text-3xl text-red-600">
              {reports.filter(r => r.severity === 'critical').length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter & Export Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search reports..."
                  className="pl-10"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  <SelectItem value="violation">Violation</SelectItem>
                  <SelectItem value="audit">Audit</SelectItem>
                  <SelectItem value="certification">Certification</SelectItem>
                  <SelectItem value="inspection">Inspection</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="under-review">Under Review</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Severity</Label>
              <Select value={filters.severity} onValueChange={(value) => setFilters({ ...filters, severity: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="All Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Severity</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>From Date</Label>
              <Input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>To Date</Label>
              <Input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={exportAllReports} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export All Reports
            </Button>
            <Button onClick={generateSummaryReport} variant="outline" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Generate Summary
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          Compliance Reports ({filteredReports.length} of {reports.length})
        </h3>
        
        {filteredReports.map((report) => (
          <Card key={report.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  {getTypeIcon(report.type)}
                  <div>
                    <h4 className="font-semibold text-lg">{report.title}</h4>
                    <p className="text-sm text-muted-foreground">{report.entity}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getSeverityBadge(report.severity)}
                  {getStatusBadge(report.status)}
                </div>
              </div>

              <p className="text-muted-foreground mb-4">{report.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                <div>
                  <span className="font-medium">Report ID:</span>
                  <p className="text-muted-foreground">{report.id}</p>
                </div>
                <div>
                  <span className="font-medium">Date:</span>
                  <p className="text-muted-foreground">{new Date(report.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="font-medium">Inspector:</span>
                  <p className="text-muted-foreground">{report.inspector}</p>
                </div>
                <div>
                  <span className="font-medium">Documents:</span>
                  <p className="text-muted-foreground">{report.documents.length} files</p>
                </div>
              </div>

              {report.documents.length > 0 && (
                <div className="space-y-2">
                  <span className="text-sm font-medium">Attachments:</span>
                  <div className="flex flex-wrap gap-2">
                    {report.documents.map((doc, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => downloadReport(report.id, doc)}
                        className="flex items-center gap-2"
                      >
                        <Download className="h-3 w-3" />
                        {doc}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Last updated: {new Date(report.date).toLocaleDateString()}
                </div>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredReports.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Reports Found</h3>
            <p className="text-muted-foreground">
              No compliance reports match your current filter criteria.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};