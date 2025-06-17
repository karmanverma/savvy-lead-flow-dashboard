
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LeadPipeline } from "@/components/LeadPipeline";
import { CallHistory } from "@/components/CallHistory";
import { Analytics } from "@/components/Analytics";
import { AIAgentsManagement } from "@/components/AIAgentsManagement";
import { AddLeadDialog } from "@/components/AddLeadDialog";
import { useAuth } from "@/contexts/AuthContext";
import { useLeads } from "@/hooks/useLeads";
import { useCalls } from "@/hooks/useCalls";
import { useAIAgents } from "@/hooks/useAIAgents";
import { Users, Phone, TrendingUp, Plus, Bot, LogOut, User, Loader2 } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("pipeline");
  const [showAddLead, setShowAddLead] = useState(false);
  const { user, signOut } = useAuth();
  
  // Fetch real data
  const { data: leads, isLoading: leadsLoading } = useLeads();
  const { data: calls, isLoading: callsLoading } = useCalls();
  const { data: aiAgents } = useAIAgents();

  // Calculate real stats
  const totalLeads = leads?.length || 0;
  const totalCalls = calls?.length || 0;
  const qualifiedLeads = leads?.filter(lead => lead.status === 'qualified' || lead.status === 'appointment').length || 0;
  const conversionRate = totalLeads > 0 ? Math.round((qualifiedLeads / totalLeads) * 100) : 0;
  const activeAIAgents = aiAgents?.filter(agent => agent.is_active).length || 0;

  const stats = [
    {
      title: "Total Leads",
      value: leadsLoading ? "..." : totalLeads.toString(),
      change: "+12%",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Calls Made",
      value: callsLoading ? "..." : totalCalls.toString(),
      change: "+23%",
      icon: Phone,
      color: "text-green-600"
    },
    {
      title: "Qualified Leads",
      value: leadsLoading ? "..." : qualifiedLeads.toString(),
      change: "+8%",
      icon: TrendingUp,
      color: "text-purple-600"
    },
    {
      title: "Conversion Rate",
      value: leadsLoading ? "..." : `${conversionRate}%`,
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
            <div className="flex items-center space-x-4">
              <img 
                src="https://torontodigital.ca/wp-content/uploads/2025/05/todigi-icon-w-border@500x.webp" 
                alt="Toronto Digital" 
                className="h-10 w-auto"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Toronto Digital</h1>
                <p className="text-gray-600 text-sm">AI-Powered Lead Management</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>Welcome, {user?.user_metadata?.full_name || user?.email}</span>
              </div>
              <Button 
                onClick={() => setShowAddLead(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Lead
              </Button>
              <Button 
                variant="outline"
                onClick={signOut}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
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
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {stat.value === "..." ? (
                        <Loader2 className="w-8 h-8 animate-spin" />
                      ) : (
                        stat.value
                      )}
                    </p>
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
            <TabsTrigger value="agents" className="px-6 py-3 flex items-center gap-2">
              <Bot className="w-4 h-4" />
              AI Agents
              <Badge variant="secondary" className="ml-1">{activeAIAgents}</Badge>
            </TabsTrigger>
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

          <TabsContent value="agents">
            <AIAgentsManagement />
          </TabsContent>
        </Tabs>
      </div>

      <AddLeadDialog open={showAddLead} onOpenChange={setShowAddLead} />
    </div>
  );
};

export default Index;
