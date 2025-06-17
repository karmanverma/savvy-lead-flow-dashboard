
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAIAgents } from "@/hooks/useAIAgents";
import { VoiceSelector } from "@/components/VoiceSelector";
import { CallQueueDashboard } from "@/components/CallQueueDashboard";
import { Bot, Plus, Settings, BarChart3, Calendar } from "lucide-react";

export const EnhancedAIAgentsManagement: React.FC = () => {
  const { data: agents, isLoading } = useAIAgents();
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [showCreateAgent, setShowCreateAgent] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">AI Agent Management</h2>
          <p className="text-muted-foreground">
            Manage your AI calling agents with ElevenLabs voice integration
          </p>
        </div>
        <Button onClick={() => setShowCreateAgent(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Agent
        </Button>
      </div>

      <Tabs defaultValue="agents" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="agents" className="flex items-center gap-2">
            <Bot className="w-4 h-4" />
            Agents
          </TabsTrigger>
          <TabsTrigger value="queue" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Call Queue
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="agents">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <div>Loading agents...</div>
            ) : (
              agents?.map((agent) => (
                <Card key={agent.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{agent.name}</CardTitle>
                      <Badge variant={agent.is_active ? "default" : "secondary"}>
                        {agent.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <CardDescription>{agent.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Voice:</span>
                        <span>{agent.voice_id ? "Configured" : "Not set"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Objectives:</span>
                        <span>{agent.call_objectives?.length || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Max Duration:</span>
                        <span>{agent.max_call_duration}s</span>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        Test
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="queue">
          <CallQueueDashboard />
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Agent Performance Analytics</CardTitle>
              <CardDescription>
                Track success rates, call volumes, and conversion metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Performance analytics will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>ElevenLabs Configuration</CardTitle>
                <CardDescription>
                  Manage your ElevenLabs API settings and voice library
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>API Status</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Connected</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    Test Connection
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Scheduling Rules</CardTitle>
                <CardDescription>
                  Configure business hours and calling restrictions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>Business Hours</Label>
                    <div className="text-sm text-muted-foreground mt-1">
                      Monday - Friday: 9:00 AM - 5:00 PM
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    Edit Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Agent Modal would go here */}
      {showCreateAgent && (
        <Card className="fixed inset-0 z-50 bg-white m-4 overflow-auto">
          <CardHeader>
            <CardTitle>Create New AI Agent</CardTitle>
            <Button 
              variant="ghost" 
              className="absolute top-4 right-4"
              onClick={() => setShowCreateAgent(false)}
            >
              ×
            </Button>
          </CardHeader>
          <CardContent>
            <VoiceSelector onVoiceSelect={(voiceId) => console.log('Selected voice:', voiceId)} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};
