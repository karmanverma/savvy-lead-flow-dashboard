import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Phone, Calendar } from "lucide-react";
import { LeadProfile } from "./LeadProfile";

const mockLeads = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "(555) 123-4567",
    source: "Website",
    status: "new",
    value: "$450,000",
    lastContact: "2 hours ago",
    priority: "high"
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "m.chen@email.com",
    phone: "(555) 987-6543",
    source: "Facebook",
    status: "contacted",
    value: "$320,000",
    lastContact: "1 day ago",
    priority: "medium"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    email: "emily.r@email.com",
    phone: "(555) 456-7890",
    source: "Referral",
    status: "qualified",
    value: "$680,000",
    lastContact: "3 hours ago",
    priority: "high"
  }
];

const stages = [
  { name: "New Leads", status: "new", color: "bg-gray-100" },
  { name: "Contacted", status: "contacted", color: "bg-blue-100" },
  { name: "Qualified", status: "qualified", color: "bg-green-100" },
  { name: "Appointment", status: "appointment", color: "bg-purple-100" }
];

export const LeadPipeline = () => {
  const [selectedLeadId, setSelectedLeadId] = useState<number | null>(null);
  const [showLeadProfile, setShowLeadProfile] = useState(false);

  const handleLeadClick = (leadId: number) => {
    setSelectedLeadId(leadId);
    setShowLeadProfile(true);
  };

  const getLeadsByStatus = (status: string) => 
    mockLeads.filter(lead => lead.status === status);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case "Website": return "bg-blue-100 text-blue-800";
      case "Facebook": return "bg-indigo-100 text-indigo-800";
      case "Referral": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

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
                            {lead.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium text-sm">{lead.name}</h4>
                          <p className="text-xs text-gray-500">{lead.email}</p>
                        </div>
                      </div>
                      <Badge className={getPriorityColor(lead.priority)} variant="secondary">
                        {lead.priority}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Badge className={getSourceColor(lead.source)} variant="secondary">
                          {lead.source}
                        </Badge>
                        <span className="text-sm font-medium text-green-600">{lead.value}</span>
                      </div>
                      
                      <p className="text-xs text-gray-500">Last contact: {lead.lastContact}</p>
                      
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Phone className="w-3 h-3 mr-1" />
                          Call
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Calendar className="w-3 h-3 mr-1" />
                          Schedule
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Lead Profile Overlay */}
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
