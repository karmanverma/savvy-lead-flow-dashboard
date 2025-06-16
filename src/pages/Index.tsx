
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LeadPipeline } from "@/components/LeadPipeline";
import { CallHistory } from "@/components/CallHistory";
import { Analytics } from "@/components/Analytics";
import { AddLeadDialog } from "@/components/AddLeadDialog";
import { Users, Phone, TrendingUp, Plus } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("pipeline");
  const [showAddLead, setShowAddLead] = useState(false);

  const stats = [
    {
      title: "Total Leads",
      value: "247",
      change: "+12%",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Calls Made",
      value: "89",
      change: "+23%",
      icon: Phone,
      color: "text-green-600"
    },
    {
      title: "Qualified Leads",
      value: "156",
      change: "+8%",
      icon: TrendingUp,
      color: "text-purple-600"
    },
    {
      title: "Conversion Rate",
      value: "63%",
      change: "+5%",
      icon: TrendingUp,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">RE Agents CRM</h1>
              <p className="text-gray-600 mt-1">AI-Powered Real Estate Lead Management</p>
            </div>
            <Button 
              onClick={() => setShowAddLead(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Lead
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    <Badge variant="secondary" className="mt-2 bg-green-100 text-green-800">
                      {stat.change}
                    </Badge>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white p-1 rounded-lg shadow-sm">
            <TabsTrigger value="pipeline" className="px-6 py-3">Lead Pipeline</TabsTrigger>
            <TabsTrigger value="calls" className="px-6 py-3">Call History</TabsTrigger>
            <TabsTrigger value="analytics" className="px-6 py-3">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="pipeline">
            <LeadPipeline />
          </TabsContent>

          <TabsContent value="calls">
            <CallHistory />
          </TabsContent>

          <TabsContent value="analytics">
            <Analytics />
          </TabsContent>
        </Tabs>
      </div>

      <AddLeadDialog open={showAddLead} onOpenChange={setShowAddLead} />
    </div>
  );
};

export default Index;
