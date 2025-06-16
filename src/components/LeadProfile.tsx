
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from "@/components/ui/dialog";
import { 
  Phone, 
  Calendar, 
  Edit, 
  X, 
  Plus,
  TrendingUp,
  Clock
} from "lucide-react";

interface LeadProfileProps {
  leadId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const mockLead = {
  id: 1,
  name: "Sarah Johnson",
  email: "sarah.johnson@email.com",
  phone: "(555) 123-4567",
  source: "Website",
  status: "qualified",
  value: "$450,000",
  score: 85,
  budget: "$400,000 - $500,000",
  areas: ["Downtown", "Westside"],
  propertyType: "Single Family",
  bedrooms: 3,
  bathrooms: 2,
  timeline: "3 months",
  preApproved: true,
  situation: "First-time buyer",
  familySize: 2,
  requirements: "Close to schools and parks"
};

const mockCalls = [
  {
    id: 1,
    type: "AI Call",
    date: "2024-01-15 14:30",
    duration: "4:32",
    summary: "Lead expressed strong interest in 3BR properties in downtown area. Budget confirmed at $450k.",
    scoreChange: +15,
    outcome: "Qualified"
  },
  {
    id: 2,
    type: "Follow-up Call",
    date: "2024-01-14 10:15",
    duration: "2:45",
    summary: "Initial qualification call. Lead is pre-approved and ready to start viewing properties.",
    scoreChange: +10,
    outcome: "Scheduled Viewing"
  }
];

export const LeadProfile = ({ leadId, open, onOpenChange }: LeadProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showManualCallModal, setShowManualCallModal] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [editedLead, setEditedLead] = useState(mockLead);

  const handleSave = () => {
    setIsEditing(false);
    // Here you would save to your backend
    console.log("Saving lead:", editedLead);
  };

  const handleAICall = async () => {
    setIsCalling(true);
    // Simulate AI call process
    setTimeout(() => {
      setIsCalling(false);
      // Add new call to history and update lead score
    }, 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "qualified": return "bg-green-100 text-green-800";
      case "contacted": return "bg-blue-100 text-blue-800";
      case "new": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden p-0">
        {/* Header */}
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="text-lg">
                  {mockLead.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-2xl">{mockLead.name}</DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={getStatusColor(mockLead.status)} variant="secondary">
                    {mockLead.status}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Score: <span className={getScoreColor(mockLead.score)}>{mockLead.score}/100</span>
                  </Badge>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit className="w-4 h-4 mr-1" />
                {isEditing ? "Cancel" : "Edit"}
              </Button>
              <Button
                onClick={handleAICall}
                disabled={isCalling}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Phone className="w-4 h-4 mr-1" />
                {isCalling ? "Calling..." : "AI Call Now"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowScheduleModal(true)}
              >
                <Calendar className="w-4 h-4 mr-1" />
                Schedule
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Main Content */}
        <div className="flex h-[calc(90vh-120px)] overflow-hidden">
          {/* Left Panel - Lead Information */}
          <div className="w-2/5 p-6 border-r overflow-y-auto">
            <div className="space-y-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Phone</Label>
                      {isEditing ? (
                        <Input 
                          value={editedLead.phone}
                          onChange={(e) => setEditedLead({...editedLead, phone: e.target.value})}
                        />
                      ) : (
                        <p className="text-sm mt-1">{mockLead.phone}</p>
                      )}
                    </div>
                    <div>
                      <Label>Email</Label>
                      {isEditing ? (
                        <Input 
                          value={editedLead.email}
                          onChange={(e) => setEditedLead({...editedLead, email: e.target.value})}
                        />
                      ) : (
                        <p className="text-sm mt-1">{mockLead.email}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label>Lead Source</Label>
                    <Badge variant="secondary" className="ml-2">
                      {mockLead.source}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Property Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Property Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Budget Range</Label>
                    <p className="text-sm mt-1">{mockLead.budget}</p>
                  </div>
                  <div>
                    <Label>Preferred Areas</Label>
                    <div className="flex gap-2 mt-1">
                      {mockLead.areas.map((area) => (
                        <Badge key={area} variant="outline">{area}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Property Type</Label>
                      <p className="text-sm mt-1">{mockLead.propertyType}</p>
                    </div>
                    <div>
                      <Label>Bedrooms</Label>
                      <p className="text-sm mt-1">{mockLead.bedrooms}</p>
                    </div>
                    <div>
                      <Label>Bathrooms</Label>
                      <p className="text-sm mt-1">{mockLead.bathrooms}</p>
                    </div>
                  </div>
                  <div>
                    <Label>Timeline</Label>
                    <p className="text-sm mt-1">{mockLead.timeline}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Qualification Data */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Qualification Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Pre-approval Status</Label>
                    <Badge className={mockLead.preApproved ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {mockLead.preApproved ? "Pre-approved" : "Not Pre-approved"}
                    </Badge>
                  </div>
                  <div>
                    <Label>Current Situation</Label>
                    <p className="text-sm mt-1">{mockLead.situation}</p>
                  </div>
                  <div>
                    <Label>Family Size</Label>
                    <p className="text-sm mt-1">{mockLead.familySize} people</p>
                  </div>
                  <div>
                    <Label>Special Requirements</Label>
                    <p className="text-sm mt-1">{mockLead.requirements}</p>
                  </div>
                </CardContent>
              </Card>

              {isEditing && (
                <div className="flex gap-2">
                  <Button onClick={handleSave} className="flex-1">
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Call History */}
          <div className="w-3/5 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Call History & Management</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowManualCallModal(true)}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Manual Call
              </Button>
            </div>

            {/* Call History Timeline */}
            <div className="space-y-4">
              {mockCalls.map((call) => (
                <Card key={call.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="secondary">{call.type}</Badge>
                          {call.scoreChange > 0 && (
                            <Badge className="bg-green-100 text-green-800">
                              +{call.scoreChange} points
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{call.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{call.duration}</p>
                        <Badge className="bg-purple-100 text-purple-800 text-xs">
                          {call.outcome}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-lg mb-3">
                      <p className="text-sm text-gray-700">{call.summary}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Phone className="w-3 h-3 mr-1" />
                        Listen Recording
                      </Button>
                      <Button variant="outline" size="sm">
                        View Notes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Scheduled Calls Section */}
            <div className="mt-8">
              <h4 className="text-lg font-semibold mb-4">Scheduled Calls</h4>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Follow-up Call</p>
                      <p className="text-sm text-gray-600">Tomorrow at 2:00 PM</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Calendar className="w-3 h-3 mr-1" />
                        Reschedule
                      </Button>
                      <Button variant="outline" size="sm">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Schedule Call Modal */}
        <Dialog open={showScheduleModal} onOpenChange={setShowScheduleModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule AI Call</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Date & Time</Label>
                <Input type="datetime-local" className="mt-1" />
              </div>
              <div>
                <Label>Call Type</Label>
                <select className="w-full mt-1 p-2 border rounded-md">
                  <option>Follow-up Call</option>
                  <option>Qualification Call</option>
                  <option>Check-in Call</option>
                </select>
              </div>
              <div>
                <Label>Priority</Label>
                <select className="w-full mt-1 p-2 border rounded-md">
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowScheduleModal(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowScheduleModal(false)}>
                Schedule Call
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Manual Call Modal */}
        <Dialog open={showManualCallModal} onOpenChange={setShowManualCallModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Manual Call</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Call Date & Time</Label>
                <Input type="datetime-local" className="mt-1" />
              </div>
              <div>
                <Label>Duration (minutes)</Label>
                <Input type="number" placeholder="5" className="mt-1" />
              </div>
              <div>
                <Label>Call Summary</Label>
                <textarea 
                  className="w-full mt-1 p-2 border rounded-md h-24"
                  placeholder="Brief summary of the call..."
                />
              </div>
              <div>
                <Label>Lead Score Change</Label>
                <select className="w-full mt-1 p-2 border rounded-md">
                  <option value="0">No Change</option>
                  <option value="5">+5 points</option>
                  <option value="10">+10 points</option>
                  <option value="-5">-5 points</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowManualCallModal(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowManualCallModal(false)}>
                Save Call
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
};
