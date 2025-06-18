
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Phone, Calendar, Loader2, Bot } from "lucide-react";
import { LeadProfile } from "./LeadProfile";
import { AICallTrigger } from "./AICallTrigger";
import { useLeads, type Lead } from "@/hooks/useLeads";

const stages = [
  { name: "New Leads", status: "new", color: "bg-gray-100" },
  { name: "Contacted", status: "contacted", color: "bg-blue-100" },
  { name: "Qualified", status: "qualified", color: "bg-green-100" },
  { name: "Appointment", status: "appointment", color: "bg-purple-100" }
];

export const LeadPipeline = () => {
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [showLeadProfile, setShowLeadProfile] = useState(false);
  const { data: leads, isLoading, error } = useLeads();

  const handleLeadClick = (leadId: string) => {
    setSelectedLeadId(leadId);
    setShowLeadProfile(true);
  };

  const getLeadsByStatus = (status: string) => 
    leads?.filter(lead => lead.status === status) || [];

  const getPriorityColor = (score: number) => {
    if (score >= 80) return "bg-red-100 text-red-800";
    if (score >= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case "website": return "bg-blue-100 text-blue-800";
      case "facebook": return "bg-indigo-100 text-indigo-800";
      case "referral": return "bg-green-100 text-green-800";
      case "google": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatBudget = (lead: Lead) => {
    if (lead.lead_preferences?.budget_min && lead.lead_preferences?.budget_max) {
      return `$${lead.lead_preferences.budget_min.toLocaleString()} - $${lead.lead_preferences.budget_max.toLocaleString()}`;
    }
    return "Budget TBD";
  };

  const getTimeSince = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">Error loading leads. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Lead Pipeline</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Filter</Button>
          <Button variant="outline" size="sm">Sort</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {stages.map((stage) => (
          <div key={stage.status} className="space-y-4">
            <div className={`${stage.color} p-4 rounded-lg`}>
              <h3 className="font-semibold text-gray-900">{stage.name}</h3>
              <p className="text-sm text-gray-600">
                {getLeadsByStatus(stage.status).length} leads
              </p>
            </div>

            <div className="space-y-3">
              {getLeadsByStatus(stage.status).map((lead) => (
                <Card 
                  key={lead.id} 
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleLeadClick(lead.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs">
                            {lead.first_name[0]}{lead.last_name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium text-sm">{lead.first_name} {lead.last_name}</h4>
                          <p className="text-xs text-gray-500">{lead.email}</p>
                        </div>
                      </div>
                      <Badge className={getPriorityColor(lead.lead_score)} variant="secondary">
                        {lead.lead_score >= 80 ? 'high' : lead.lead_score >= 60 ? 'medium' : 'low'}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Badge className={getSourceColor(lead.lead_source)} variant="secondary">
                          {lead.lead_source}
                        </Badge>
                        <span className="text-sm font-medium text-green-600">{formatBudget(lead)}</span>
                      </div>
                      
                      <p className="text-xs text-gray-500">Added: {getTimeSince(lead.created_at)}</p>
                      
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Phone className="w-3 h-3 mr-1" />
                          Call
                        </Button>
                        <AICallTrigger
                          leadId={lead.id}
                          leadName={`${lead.first_name} ${lead.last_name}`}
                          leadPhone={lead.phone}
                          onCallStarted={() => {
                            // Refresh the call queue after initiating a call
                            console.log('AI call started for lead:', lead.id);
                          }}
                        />
                        <Button size="sm" variant="outline" className="flex-1">
                          <Calendar className="w-3 h-3 mr-1" />
                          Schedule
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {getLeadsByStatus(stage.status).length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <p className="text-sm">No leads in this stage</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lead Profile Modal */}
      {selectedLeadId && (
        <LeadProfile
          leadId={selectedLeadId}
          open={showLeadProfile}
          onOpenChange={setShowLeadProfile}
        />
      )}
    </div>
  );
};
