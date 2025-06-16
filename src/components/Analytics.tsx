
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const conversionData = [
  { month: 'Jan', leads: 45, qualified: 28, appointments: 18, sales: 12 },
  { month: 'Feb', leads: 52, qualified: 35, appointments: 22, sales: 15 },
  { month: 'Mar', leads: 48, qualified: 31, appointments: 19, sales: 13 },
  { month: 'Apr', leads: 61, qualified: 42, appointments: 28, sales: 19 },
  { month: 'May', leads: 55, qualified: 38, appointments: 25, sales: 17 },
  { month: 'Jun', leads: 67, qualified: 45, appointments: 31, sales: 22 }
];

const sourceData = [
  { name: 'Website', value: 35, color: '#3B82F6' },
  { name: 'Facebook', value: 25, color: '#8B5CF6' },
  { name: 'Referrals', value: 20, color: '#10B981' },
  { name: 'Google Ads', value: 15, color: '#F59E0B' },
  { name: 'Other', value: 5, color: '#6B7280' }
];

const performanceData = [
  { day: 'Mon', calls: 12, qualified: 8, appointments: 5 },
  { day: 'Tue', calls: 15, qualified: 11, appointments: 7 },
  { day: 'Wed', calls: 18, qualified: 13, appointments: 9 },
  { day: 'Thu', calls: 14, qualified: 10, appointments: 6 },
  { day: 'Fri', calls: 20, qualified: 15, appointments: 11 },
  { day: 'Sat', calls: 8, qualified: 6, appointments: 4 },
  { day: 'Sun', calls: 5, qualified: 3, appointments: 2 }
];

export const Analytics = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <div className="flex gap-2">
          <Badge variant="outline">Last 30 days</Badge>
          <Badge variant="outline">All Agents</Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">68.5%</div>
            <p className="text-xs text-gray-500">+5.2% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">2.3m</div>
            <p className="text-xs text-gray-500">-45s from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">AI Call Success</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">89%</div>
            <p className="text-xs text-gray-500">+3.1% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Revenue Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">$2.4M</div>
            <p className="text-xs text-gray-500">+12.5% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Funnel */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Conversion Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={conversionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="leads" fill="#E5E7EB" name="Leads" />
                <Bar dataKey="qualified" fill="#3B82F6" name="Qualified" />
                <Bar dataKey="appointments" fill="#8B5CF6" name="Appointments" />
                <Bar dataKey="sales" fill="#10B981" name="Sales" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Lead Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Lead Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-4">
              {sourceData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600">{item.name}: {item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Performance Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="calls" 
                stroke="#3B82F6" 
                strokeWidth={2}
                name="Calls Made"
              />
              <Line 
                type="monotone" 
                dataKey="qualified" 
                stroke="#10B981" 
                strokeWidth={2}
                name="Qualified Leads"
              />
              <Line 
                type="monotone" 
                dataKey="appointments" 
                stroke="#8B5CF6" 
                strokeWidth={2}
                name="Appointments Set"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
