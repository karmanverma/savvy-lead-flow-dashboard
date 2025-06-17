
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCallQueue, useUpdateCallStatus } from "@/hooks/useCallQueue";
import { format } from "date-fns";
import { Clock, Phone, Play, Pause, RotateCcw } from "lucide-react";

export const CallQueueDashboard: React.FC = () => {
  const { data: queuedCalls, isLoading } = useCallQueue();
  const updateCallStatus = useUpdateCallStatus();

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return 'destructive';
      case 2: return 'default';
      case 3: return 'secondary';
      case 4: return 'outline';
      default: return 'secondary';
    }
  };

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 1: return 'Urgent';
      case 2: return 'High';
      case 3: return 'Medium';
      case 4: return 'Low';
      default: return 'Medium';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'default';
      case 'in_progress': return 'secondary';
      case 'completed': return 'outline';
      case 'failed': return 'destructive';
      case 'cancelled': return 'outline';
      default: return 'secondary';
    }
  };

  const handleExecuteCall = (callId: string) => {
    updateCallStatus.mutate({
      id: callId,
      status: 'in_progress',
      executed_at: new Date().toISOString(),
    });
  };

  const handleCancelCall = (callId: string) => {
    updateCallStatus.mutate({
      id: callId,
      status: 'cancelled',
    });
  };

  if (isLoading) {
    return <div>Loading call queue...</div>;
  }

  const upcomingCalls = queuedCalls?.filter(call => 
    call.status === 'scheduled' && new Date(call.scheduled_time) > new Date()
  ) || [];

  const activeCalls = queuedCalls?.filter(call => call.status === 'in_progress') || [];
  const completedCalls = queuedCalls?.filter(call => 
    call.status === 'completed' || call.status === 'failed'
  ) || [];

  return (
    <div className="space-y-6">
      {/* Active Calls */}
      {activeCalls.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-green-600" />
              Active Calls ({activeCalls.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeCalls.map((call) => (
                <div key={call.id} className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <div>
                      <div className="font-medium">
                        {call.leads?.first_name} {call.leads?.last_name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {call.ai_agents?.name} • {call.call_objective}
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary">In Progress</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Calls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Upcoming Calls ({upcomingCalls.length})
          </CardTitle>
          <CardDescription>
            Calls scheduled for execution
          </CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingCalls.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No upcoming calls scheduled
            </p>
          ) : (
            <div className="space-y-3">
              {upcomingCalls.map((call) => (
                <div key={call.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="font-medium">
                        {call.leads?.first_name} {call.leads?.last_name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(call.scheduled_time), 'MMM d, yyyy h:mm a')}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {call.ai_agents?.name} • {call.call_objective}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getPriorityColor(call.priority)}>
                      {getPriorityLabel(call.priority)}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleExecuteCall(call.id)}
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Execute Now
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCancelCall(call.id)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Calls */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Call History</CardTitle>
        </CardHeader>
        <CardContent>
          {completedCalls.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No completed calls yet
            </p>
          ) : (
            <div className="space-y-3">
              {completedCalls.slice(0, 5).map((call) => (
                <div key={call.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="font-medium">
                        {call.leads?.first_name} {call.leads?.last_name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {call.executed_at ? format(new Date(call.executed_at), 'MMM d, yyyy h:mm a') : 'Not executed'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {call.call_objective}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusColor(call.status)}>
                      {call.status}
                    </Badge>
                    {call.status === 'failed' && call.retry_count < call.max_retries && (
                      <Button size="sm" variant="outline">
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Retry
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
