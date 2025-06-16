
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Phone, Clock, TrendingUp } from "lucide-react";

const mockCalls = [
  {
    id: 1,
    leadName: "Sarah Johnson",
    phone: "(555) 123-4567",
    type: "AI Call",
    duration: "4:32",
    outcome: "Qualified",
    timestamp: "2024-01-15 14:30",
    summary: "Interest in 3BR house, budget $400-500k, looking to move in 3 months",
    score: 85
  },
  {
    id: 2,
    leadName: "Michael Chen",
    phone: "(555) 987-6543",
    type: "Manual Call",
    duration: "2:15",
    outcome: "Follow-up",
    timestamp: "2024-01-15 11:15",
    summary: "Needs more time to discuss with spouse, schedule follow-up next week",
    score: 65
  },
  {
    id: 3,
    leadName: "Emily Rodriguez",
    phone: "(555) 456-7890",
    type: "AI Call",
    duration: "6:45",
    outcome: "Appointment",
    timestamp: "2024-01-15 09:22",
    summary: "Ready to view properties, scheduled for Saturday 2 PM",
    score: 95
  },
  {
    id: 4,
    leadName: "David Kim",
    phone: "(555) 321-9876",
    type: "AI Call",
    duration: "1:30",
    outcome: "Not Interested",
    timestamp: "2024-01-14 16:45",
    summary: "Not in the market currently, removed from active list",
    score: 20
  }
];

export const CallHistory = () => {
  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case "Qualified": return "bg-green-100 text-green-800";
      case "Appointment": return "bg-purple-100 text-purple-800";
      case "Follow-up": return "bg-yellow-100 text-yellow-800";
      case "Not Interested": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    return type === "AI Call" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800";
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Call History</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Export</Button>
          <Button variant="outline" size="sm">Filter</Button>
        </div>
      </div>

      {/* Call Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Calls Today</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <Phone className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Call Duration</p>
                <p className="text-2xl font-bold">3:45</p>
              </div>
              <Clock className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold">68%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Call History List */}
      <div className="space-y-4">
        {mockCalls.map((call) => (
          <Card key={call.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback>
                      {call.leadName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-900">{call.leadName}</h3>
                    <p className="text-sm text-gray-500">{call.phone}</p>
                    <p className="text-xs text-gray-400">{call.timestamp}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getTypeColor(call.type)} variant="secondary">
                    {call.type}
                  </Badge>
                  <Badge className={getOutcomeColor(call.outcome)} variant="secondary">
                    {call.outcome}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-medium">{call.duration}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Lead Score</p>
                  <p className={`font-medium ${getScoreColor(call.score)}`}>{call.score}/100</p>
                </div>
                <div className="md:col-span-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <Phone className="w-4 h-4 mr-2" />
                    Listen Recording
                  </Button>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Call Summary</p>
                <p className="text-sm text-gray-900">{call.summary}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
