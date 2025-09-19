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
  Package, 
  Award, 
  Users, 
  DollarSign,
  Clock,
  CheckCircle
} from 'lucide-react';

// Mock data for analytics
const productionTrends = [
  { month: 'Jan', batches: 18, quality: 96.5, efficiency: 88 },
  { month: 'Feb', batches: 22, quality: 97.2, efficiency: 91 },
  { month: 'Mar', batches: 19, quality: 96.8, efficiency: 89 },
  { month: 'Apr', batches: 25, quality: 98.1, efficiency: 94 },
  { month: 'May', batches: 28, quality: 97.9, efficiency: 96 },
  { month: 'Jun', batches: 24, quality: 97.8, efficiency: 93 },
];

const qualityMetrics = [
  { month: 'Jan', curcumin: 6.2, purity: 98.1, moisture: 12.8 },
  { month: 'Feb', curcumin: 6.5, purity: 98.3, moisture: 12.1 },
  { month: 'Mar', curcumin: 6.3, purity: 98.0, moisture: 12.5 },
  { month: 'Apr', curcumin: 6.8, purity: 98.7, moisture: 11.9 },
  { month: 'May', curcumin: 6.9, purity: 98.8, moisture: 11.7 },
  { month: 'Jun', curcumin: 6.7, purity: 98.5, moisture: 12.0 },
];

const productDistribution = [
  { name: 'Turmeric Powder', value: 45, color: '#0088FE' },
  { name: 'Ashwagandha Extract', value: 25, color: '#00C49F' },
  { name: 'Herbal Mix', value: 20, color: '#FFBB28' },
  { name: 'Others', value: 10, color: '#FF8042' },
];

const batchEfficiency = [
  { week: 'Week 1', processed: 85, rejected: 5, rework: 10 },
  { week: 'Week 2', processed: 92, rejected: 3, rework: 5 },
  { week: 'Week 3', processed: 88, rejected: 4, rework: 8 },
  { week: 'Week 4', processed: 94, rejected: 2, rework: 4 },
];

const consumerEngagement = [
  { month: 'Jan', scans: 1245, feedback: 4.2 },
  { month: 'Feb', scans: 1387, feedback: 4.3 },
  { month: 'Mar', scans: 1456, feedback: 4.1 },
  { month: 'Apr', scans: 1623, feedback: 4.4 },
  { month: 'May', scans: 1789, feedback: 4.5 },
  { month: 'Jun', scans: 1847, feedback: 4.6 },
];

export const ProductionAnalytics: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Batches</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">136</div>
            <p className="text-xs text-muted-foreground">
              <span className="inline-flex items-center text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12%
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Quality Score</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">97.8%</div>
            <p className="text-xs text-muted-foreground">
              <span className="inline-flex items-center text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                +0.3%
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Production Efficiency</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">93.2%</div>
            <p className="text-xs text-muted-foreground">
              <span className="inline-flex items-center text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                +2.1%
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consumer Scans</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,847</div>
            <p className="text-xs text-muted-foreground">
              <span className="inline-flex items-center text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                +18.2%
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Production Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Production Trends</CardTitle>
            <CardDescription>
              Monthly batch production and quality metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={productionTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="batches" 
                  stackId="1"
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quality Metrics Trend</CardTitle>
            <CardDescription>
              Key quality parameters over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={qualityMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="curcumin" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  name="Curcumin %" 
                />
                <Line 
                  type="monotone" 
                  dataKey="purity" 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                  name="Purity %" 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Product Distribution and Batch Efficiency */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Product Distribution</CardTitle>
            <CardDescription>
              Breakdown of manufactured products
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={productDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {productDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Batch Processing Efficiency</CardTitle>
            <CardDescription>
              Weekly processing outcomes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={batchEfficiency}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="processed" stackId="a" fill="#22c55e" name="Processed" />
                <Bar dataKey="rework" stackId="a" fill="#f59e0b" name="Rework" />
                <Bar dataKey="rejected" stackId="a" fill="#ef4444" name="Rejected" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Consumer Engagement */}
      <Card>
        <CardHeader>
          <CardTitle>Consumer Engagement</CardTitle>
          <CardDescription>
            QR code scans and customer feedback trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={consumerEngagement}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="scans" orientation="left" />
              <YAxis yAxisId="feedback" orientation="right" domain={[3.5, 5]} />
              <Tooltip />
              <Area
                yAxisId="scans"
                type="monotone"
                dataKey="scans"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
                name="QR Scans"
              />
              <Line
                yAxisId="feedback"
                type="monotone"
                dataKey="feedback"
                stroke="#ff7300"
                strokeWidth={3}
                name="Avg Rating"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
          <CardDescription>
            Key insights and recommendations based on production data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-900">Quality Improvement</h4>
                <p className="text-sm text-green-700">
                  Average quality score improved by 0.3% this month. The new processing parameters 
                  are showing positive results.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
              <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Production Efficiency</h4>
                <p className="text-sm text-blue-700">
                  Processing efficiency reached 93.2%. Consider optimizing Week 1 and Week 3 
                  workflows to maintain consistency.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-orange-50 rounded-lg">
              <Users className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-orange-900">Consumer Engagement</h4>
                <p className="text-sm text-orange-700">
                  QR code scans increased by 18.2%. High consumer interest in traceability. 
                  Consider adding more interactive features.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};