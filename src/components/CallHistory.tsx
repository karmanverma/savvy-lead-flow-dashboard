
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Phone, Clock, TrendingUp, Loader2 } from "lucide-react";
import { useCalls, type Call } from "@/hooks/useCalls";

export const CallHistory = () => {
  const { data: calls, isLoading, error } = useCalls();

  const getOutcomeColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "failed": return "bg-red-100 text-red-800";
      case "in_progress": return "bg-yellow-100 text-yellow-800";
      case "scheduled": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    return type === "ai_call" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800";
  };

  const getScoreColor = (score: number | undefined) => {
    if (!score) return "text-gray-600";
    if (score >= 10) return "text-green-600";
    if (score >= 0) return "text-yellow-600";
    return "text-red-600";
  };

  const formatDuration = (seconds: number | undefined) => {
    if (!seconds) return "N/A";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getLeadName = (call: Call) => {
    if (call.leads) {
      return `${call.leads.first_name} ${call.leads.last_name}`;
    }
    return "Unknown Lead";
  };

  const completedCalls = calls?.filter(call => call.call_status === 'completed') || [];
  const totalDuration = completedCalls.reduce((sum, call) => sum + (call.duration_seconds || 0), 0);
  const avgDuration = completedCalls.length > 0 ? totalDuration / completedCalls.length : 0;
  const successRate = calls && calls.length > 0 
    ? Math.round((completedCalls.length / calls.length) * 100) 
    : 0;

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
        <p className="text-red-600">Error loading call history. Please try again.</p>
      </div>
    );
  }

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
                <p className="text-sm text-gray-600">Total Calls</p>
                <p className="text-2xl font-bold">{calls?.length || 0}</p>
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
                <p className="text-2xl font-bold">{formatDuration(Math.round(avgDuration))}</p>
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
                <p className="text-2xl font-bold">{successRate}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Call History List */}
      <div className="space-y-4">
        {calls && calls.length > 0 ? (
          calls.map((call) => (
            <Card key={call.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>
                        {getLeadName(call).split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900">{getLeadName(call)}</h3>
                      <p className="text-sm text-gray-500">{call.leads?.phone}</p>
                      <p className="text-xs text-gray-400">{formatDate(call.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getTypeColor(call.call_type)} variant="secondary">
                      {call.call_type.replace('_', ' ')}
                    </Badge>
                    <Badge className={getOutcomeColor(call.call_status)} variant="secondary">
                      {call.call_status}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-medium">{formatDuration(call.duration_seconds)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Score Change</p>
                    <p className={`font-medium ${getScoreColor(call.lead_score_change)}`}>
                      {call.lead_score_change ? `${call.lead_score_change > 0 ? '+' : ''}${call.lead_score_change}` : 'No change'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Agent/AI</p>
                    <p className="font-medium">{call.ai_agents?.name || 'Manual Call'}</p>
                  </div>
                </div>

                {call.call_summary && (
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <p className="text-sm text-gray-600 mb-1">Call Summary</p>
                    <p className="text-sm text-gray-900">{call.call_summary}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  {call.recording_url && (
                    <Button variant="outline" size="sm">
                      <Phone className="w-4 h-4 mr-2" />
                      Listen Recording
                    </Button>
                  )}
                  {call.transcript && (
                    <Button variant="outline" size="sm">
                      View Transcript
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No call history available yet.</p>
            <p className="text-sm text-gray-400 mt-2">Start making calls to see them here.</p>
          </div>
        )}
      </div>
    </div>
  );
};
