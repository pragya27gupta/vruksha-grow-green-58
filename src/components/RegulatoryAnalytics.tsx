import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  FileText,
  Users,
  Building,
  Clock
} from 'lucide-react';

// Mock data for regulatory analytics
const complianceTrends = [
  { month: 'Jan', compliance: 94.2, violations: 12, audits: 45 },
  { month: 'Feb', compliance: 95.8, violations: 8, audits: 52 },
  { month: 'Mar', compliance: 93.1, violations: 15, audits: 48 },
  { month: 'Apr', compliance: 96.7, violations: 6, audits: 61 },
  { month: 'May', compliance: 97.3, violations: 4, audits: 58 },
  { month: 'Jun', compliance: 96.8, violations: 5, audits: 63 },
];

const violationTypes = [
  { name: 'Pesticide Residue', value: 35, color: '#ef4444' },
  { name: 'Temperature Control', value: 25, color: '#f97316' },
  { name: 'Documentation', value: 20, color: '#eab308' },
  { name: 'Packaging Safety', value: 12, color: '#06b6d4' },
  { name: 'Others', value: 8, color: '#8b5cf6' },
];

const entityCompliance = [
  { entity: 'Farmers', total: 1247, compliant: 1198, rate: 96.1 },
  { entity: 'Processors', total: 156, compliant: 149, rate: 95.5 },
  { entity: 'Manufacturers', total: 89, compliant: 87, rate: 97.8 },
  { entity: 'Distributors', total: 234, compliant: 225, rate: 96.2 },
  { entity: 'Retailers', total: 567, compliant: 541, rate: 95.4 },
];

const inspectionEfficiency = [
  { week: 'Week 1', scheduled: 25, completed: 23, efficiency: 92 },
  { week: 'Week 2', scheduled: 28, completed: 27, efficiency: 96.4 },
  { week: 'Week 3', scheduled: 22, completed: 20, efficiency: 90.9 },
  { week: 'Week 4', scheduled: 30, completed: 29, efficiency: 96.7 },
];

const severityTrends = [
  { month: 'Jan', low: 8, medium: 3, high: 1, critical: 0 },
  { month: 'Feb', low: 6, medium: 1, high: 1, critical: 0 },
  { month: 'Mar', low: 10, medium: 4, high: 1, critical: 0 },
  { month: 'Apr', low: 4, medium: 2, high: 0, critical: 0 },
  { month: 'May', low: 3, medium: 1, high: 0, critical: 0 },
  { month: 'Jun', low: 4, medium: 1, high: 0, critical: 0 },
];

export const RegulatoryAnalytics: React.FC = () => {
  console.log('RegulatoryAnalytics component rendered');
  
  return (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Compliance Rate</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">96.8%</div>
            <p className="text-xs text-muted-foreground">
              <span className="inline-flex items-center text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                +1.2%
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Violations</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">5</div>
            <p className="text-xs text-muted-foreground">
              <span className="inline-flex items-center text-red-600">
                <TrendingDown className="h-3 w-3 mr-1" />
                -16.7%
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inspections Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99</div>
            <p className="text-xs text-muted-foreground">
              <span className="inline-flex items-center text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                +8.8%
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3 days</div>
            <p className="text-xs text-muted-foreground">
              <span className="inline-flex items-center text-green-600">
                <TrendingDown className="h-3 w-3 mr-1" />
                -0.5 days
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Trends and Violation Types */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Compliance Trends</CardTitle>
            <CardDescription>
              Monthly compliance rates and violation counts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={complianceTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="compliance" 
                  stackId="1"
                  stroke="#22c55e" 
                  fill="#22c55e" 
                  fillOpacity={0.6}
                  name="Compliance %"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Violation Types Distribution</CardTitle>
            <CardDescription>
              Breakdown of violation categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={violationTypes}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {violationTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Entity Compliance and Inspection Efficiency */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Compliance by Entity Type</CardTitle>
            <CardDescription>
              Compliance rates across different supply chain entities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {entityCompliance.map((entity) => (
                <div key={entity.entity} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{entity.entity}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {entity.compliant}/{entity.total}
                      </span>
                      <Badge variant="outline">
                        {entity.rate}%
                      </Badge>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${entity.rate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inspection Efficiency</CardTitle>
            <CardDescription>
              Weekly inspection completion rates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={inspectionEfficiency}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="scheduled" fill="#e5e7eb" name="Scheduled" />
                <Bar dataKey="completed" fill="#22c55e" name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Violation Severity Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Violation Severity Trends</CardTitle>
          <CardDescription>
            Monthly breakdown of violations by severity level
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={severityTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="low" stackId="a" fill="#6b7280" name="Low" />
              <Bar dataKey="medium" stackId="a" fill="#f59e0b" name="Medium" />
              <Bar dataKey="high" stackId="a" fill="#f97316" name="High" />
              <Bar dataKey="critical" stackId="a" fill="#ef4444" name="Critical" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Regulatory Insights</CardTitle>
          <CardDescription>
            Key insights and recommendations based on compliance data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-900">Compliance Improvement</h4>
                <p className="text-sm text-green-700">
                  Overall compliance rate improved by 1.2% this month. Manufacturers show the highest 
                  compliance rate at 97.8%, setting a good example for other entities.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-900">Focus Area: Pesticide Residue</h4>
                <p className="text-sm text-yellow-700">
                  Pesticide residue violations account for 35% of all violations. Recommend increased 
                  farmer education and more frequent testing protocols.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Inspection Efficiency</h4>
                <p className="text-sm text-blue-700">
                  Inspection completion rate is maintaining above 90%. Consider optimizing Week 3 
                  scheduling to improve consistency across all weeks.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-purple-50 rounded-lg">
              <Users className="h-5 w-5 text-purple-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-purple-900">Entity Performance</h4>
                <p className="text-sm text-purple-700">
                  Retailers show lowest compliance at 95.4%. Recommend targeted training programs 
                  and enhanced monitoring for retail operations.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};