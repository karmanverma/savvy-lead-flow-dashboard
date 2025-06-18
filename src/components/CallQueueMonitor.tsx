
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock, Phone, User, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useCallQueue, type QueuedCall } from "@/hooks/useCallQueue";
import { supabase } from "@/integrations/supabase/client";

export const CallQueueMonitor = () => {
  const { data: queuedCalls, isLoading } = useCallQueue();
  const [activeCalls, setActiveCalls] = useState<QueuedCall[]>([]);

  useEffect(() => {
    // Subscribe to real-time call queue updates
    const channel = supabase
      .channel('call-queue-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'call_queue'
      }, (payload) => {
        console.log('Call queue update:', payload);
        // The useCallQueue hook will automatically refetch
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (queuedCalls) {
      setActiveCalls(queuedCalls.filter(call => 
        call.status === 'in_progress' || call.status === 'scheduled'
      ));
    }
  }, [queuedCalls]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority === 1) return 'bg-red-100 text-red-800';
    if (priority === 2) return 'bg-orange-100 text-orange-800';
    return 'bg-gray-100 text-gray-800';
  };

  const formatScheduledTime = (scheduledTime: string) => {
    const date = new Date(scheduledTime);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    
    if (diffMs < 0) return 'Overdue';
    if (diffMs < 60000) return 'Now';
    if (diffMs < 3600000) return `${Math.ceil(diffMs / 60000)}m`;
    if (diffMs < 86400000) return `${Math.ceil(diffMs / 3600000)}h`;
    return date.toLocaleDateString();
  };

  const getLeadName = (call: QueuedCall) => {
    if (call.leads) {
      return `${call.leads.first_name} ${call.leads.last_name}`;
    }
    return 'Unknown Lead';
  };

  const scheduledCalls = queuedCalls?.filter(call => call.status === 'scheduled') || [];
  const inProgressCalls = queuedCalls?.filter(call => call.status === 'in_progress') || [];
  const completedToday = queuedCalls?.filter(call => 
    call.status === 'completed' && 
    new Date(call.scheduled_time).toDateString() === new Date().toDateString()
  ) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Call Queue Monitor</h2>
        <div className="flex gap-2">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {scheduledCalls.length} Scheduled
          </Badge>
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            {inProgressCalls.length} In Progress
          </Badge>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            {completedToday.length} Completed Today
          </Badge>
        </div>
      </div>

      {/* Active Calls */}
      {inProgressCalls.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-yellow-600" />
              Active Calls ({inProgressCalls.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {inProgressCalls.map((call) => (
              <div key={call.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-yellow-200">
                      {getLeadName(call).split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{getLeadName(call)}</p>
                    <p className="text-sm text-gray-600">{call.call_objective}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Scheduled Calls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Scheduled Calls ({scheduledCalls.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {scheduledCalls.length > 0 ? (
            <div className="space-y-3">
              {scheduledCalls.slice(0, 10).map((call) => (
                <div key={call.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>
                        {getLeadName(call).split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{getLeadName(call)}</p>
                      <p className="text-sm text-gray-600">{call.call_objective}</p>
                      <p className="text-xs text-gray-500">Agent: {call.ai_agents?.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(call.priority)} variant="secondary">
                      Priority {call.priority}
                    </Badge>
                    <Badge className={getStatusColor(call.status)} variant="secondary">
                      {formatScheduledTime(call.scheduled_time)}
                    </Badge>
                  </div>
                </div>
              ))}
              {scheduledCalls.length > 10 && (
                <p className="text-sm text-gray-500 text-center pt-2">
                  And {scheduledCalls.length - 10} more scheduled calls...
                </p>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No calls scheduled</p>
              <p className="text-sm text-gray-400">Scheduled calls will appear here</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
