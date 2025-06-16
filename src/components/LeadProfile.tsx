
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Phone, 
  Calendar, 
  Edit, 
  Plus,
  TrendingUp,
  Clock,
  FileText,
  Save,
  X,
  Bot
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
  budget: [400000, 500000],
  areas: ["Downtown", "Westside"],
  propertyType: ["Single Family"],
  bedrooms: 3,
  bathrooms: 2,
  timeline: "2024-06-01",
  preApproved: true,
  situation: "First-time buyer",
  familySize: 2,
  requirements: "Close to schools and parks",
  incomeRange: [80000, 120000]
};

const mockCalls = [
  {
    id: 1,
    type: "AI Call",
    date: "2024-01-15 14:30",
    duration: "4:32",
    summary: "Lead expressed strong interest in 3BR properties in downtown area. Budget confirmed at $450k.",
    scoreChange: +15,
    outcome: "Qualified",
    objective: "Budget qualification"
  },
  {
    id: 2,
    type: "Follow-up Call",
    date: "2024-01-14 10:15",
    duration: "2:45",
    summary: "Initial qualification call. Lead is pre-approved and ready to start viewing properties.",
    scoreChange: +10,
    outcome: "Scheduled Viewing",
    objective: "Initial qualification"
  }
];

const mockNotes = [
  {
    id: 1,
    author: "AI Agent",
    timestamp: "2 hours ago",
    content: "Lead showed strong interest in downtown properties during AI call. Mentioned preference for schools nearby.",
    type: "ai"
  },
  {
    id: 2,
    author: "John Smith",
    timestamp: "1 day ago",
    content: "Reviewed financial documents. Pre-approval confirmed for $500k maximum.",
    type: "manual"
  }
];

const scheduledCalls = [
  {
    id: 1,
    type: "Follow-up Call",
    date: "Tomorrow at 2:00 PM",
    objective: "Schedule property viewing"
  }
];

export const LeadProfile = ({ leadId, open, onOpenChange }: LeadProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showManualCallModal, setShowManualCallModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showAICallModal, setShowAICallModal] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [editedLead, setEditedLead] = useState(mockLead);
  const [noteFilter, setNoteFilter] = useState("all");
  const [newNote, setNewNote] = useState("");

  const handleSave = () => {
    setIsEditing(false);
    console.log("Saving lead:", editedLead);
  };

  const handleAICall = async () => {
    setIsCalling(true);
    setShowAICallModal(false);
    setTimeout(() => {
      setIsCalling(false);
    }, 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "qualified": return "bg-green-100 text-green-800";
      case "contacted": return "bg-blue-100 text-blue-800";
      case "new": return "bg-gray-100 text-gray-800";
      case "appointment": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const addNote = () => {
    if (newNote.trim()) {
      // Add note logic here
      setNewNote("");
      console.log("Adding note:", newNote);
    }
  };

  const filteredNotes = mockNotes.filter(note => {
    if (noteFilter === "all") return true;
    if (noteFilter === "ai") return note.type === "ai";
    if (noteFilter === "manual") return note.type === "manual";
    return true;
  });

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
                onClick={() => setShowAICallModal(true)}
                disabled={isCalling}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Bot className="w-4 h-4 mr-1" />
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

        <div className="flex h-[calc(90vh-120px)] overflow-hidden">
          {/* Left Panel - Lead Information */}
          <div className="w-2/5 p-6 border-r overflow-y-auto">
            <div className="space-y-6">
              {/* Contact Information */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Name</Label>
                      {isEditing ? (
                        <Input 
                          value={editedLead.name}
                          onChange={(e) => setEditedLead({...editedLead, name: e.target.value})}
                        />
                      ) : (
                        <p className="text-sm mt-1">{mockLead.name}</p>
                      )}
                    </div>
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
                          type="email"
                          value={editedLead.email}
                          onChange={(e) => setEditedLead({...editedLead, email: e.target.value})}
                        />
                      ) : (
                        <p className="text-sm mt-1">{mockLead.email}</p>
                      )}
                    </div>
                    <div>
                      <Label>Lead Source</Label>
                      {isEditing ? (
                        <select 
                          className="w-full mt-1 p-2 border rounded-md"
                          value={editedLead.source}
                          onChange={(e) => setEditedLead({...editedLead, source: e.target.value})}
                        >
                          <option value="Website">Website</option>
                          <option value="Facebook">Facebook</option>
                          <option value="Google">Google</option>
                          <option value="Referral">Referral</option>
                        </select>
                      ) : (
                        <Badge variant="secondary" className="ml-0 mt-1">
                          {mockLead.source}
                        </Badge>
                      )}
                    </div>
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
                    {isEditing ? (
                      <div className="mt-2">
                        <Slider
                          value={editedLead.budget}
                          onValueChange={(value) => setEditedLead({...editedLead, budget: value})}
                          max={1000000}
                          min={100000}
                          step={10000}
                          className="mb-2"
                        />
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>${editedLead.budget[0].toLocaleString()}</span>
                          <span>${editedLead.budget[1].toLocaleString()}</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm mt-1">${mockLead.budget[0].toLocaleString()} - ${mockLead.budget[1].toLocaleString()}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label>Preferred Areas</Label>
                    {isEditing ? (
                      <div className="flex gap-2 mt-1 flex-wrap">
                        {["Downtown", "Westside", "Eastside", "Suburbs"].map((area) => (
                          <div key={area} className="flex items-center space-x-2">
                            <Checkbox 
                              id={area}
                              checked={editedLead.areas.includes(area)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setEditedLead({...editedLead, areas: [...editedLead.areas, area]});
                                } else {
                                  setEditedLead({...editedLead, areas: editedLead.areas.filter(a => a !== area)});
                                }
                              }}
                            />
                            <Label htmlFor={area} className="text-sm">{area}</Label>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex gap-2 mt-1">
                        {mockLead.areas.map((area) => (
                          <Badge key={area} variant="outline">{area}</Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Property Type</Label>
                      {isEditing ? (
                        <select className="w-full mt-1 p-2 border rounded-md text-sm">
                          <option>Single Family</option>
                          <option>Condo</option>
                          <option>Townhome</option>
                        </select>
                      ) : (
                        <p className="text-sm mt-1">{mockLead.propertyType[0]}</p>
                      )}
                    </div>
                    <div>
                      <Label>Bedrooms</Label>
                      {isEditing ? (
                        <select className="w-full mt-1 p-2 border rounded-md text-sm">
                          <option>1</option>
                          <option>2</option>
                          <option>3</option>
                          <option>4+</option>
                        </select>
                      ) : (
                        <p className="text-sm mt-1">{mockLead.bedrooms}</p>
                      )}
                    </div>
                    <div>
                      <Label>Bathrooms</Label>
                      {isEditing ? (
                        <select className="w-full mt-1 p-2 border rounded-md text-sm">
                          <option>1</option>
                          <option>2</option>
                          <option>3</option>
                          <option>4+</option>
                        </select>
                      ) : (
                        <p className="text-sm mt-1">{mockLead.bathrooms}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <Label>Move Timeline</Label>
                    {isEditing ? (
                      <Input 
                        type="date" 
                        value={editedLead.timeline}
                        onChange={(e) => setEditedLead({...editedLead, timeline: e.target.value})}
                        className="mt-1"
                      />
                    ) : (
                      <p className="text-sm mt-1">{new Date(mockLead.timeline).toLocaleDateString()}</p>
                    )}
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
                    {isEditing ? (
                      <Switch 
                        checked={editedLead.preApproved}
                        onCheckedChange={(checked) => setEditedLead({...editedLead, preApproved: checked})}
                      />
                    ) : (
                      <Badge className={mockLead.preApproved ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                        {mockLead.preApproved ? "Pre-approved" : "Not Pre-approved"}
                      </Badge>
                    )}
                  </div>
                  
                  <div>
                    <Label>Current Situation</Label>
                    {isEditing ? (
                      <select className="w-full mt-1 p-2 border rounded-md">
                        <option>First-time buyer</option>
                        <option>Selling current home</option>
                        <option>Renting currently</option>
                        <option>Investor</option>
                      </select>
                    ) : (
                      <p className="text-sm mt-1">{mockLead.situation}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label>Family Size</Label>
                    {isEditing ? (
                      <Input 
                        type="number" 
                        value={editedLead.familySize}
                        onChange={(e) => setEditedLead({...editedLead, familySize: parseInt(e.target.value)})}
                        className="mt-1"
                      />
                    ) : (
                      <p className="text-sm mt-1">{mockLead.familySize} people</p>
                    )}
                  </div>
                  
                  <div>
                    <Label>Special Requirements</Label>
                    {isEditing ? (
                      <Textarea 
                        value={editedLead.requirements}
                        onChange={(e) => setEditedLead({...editedLead, requirements: e.target.value})}
                        className="mt-1"
                        rows={3}
                      />
                    ) : (
                      <p className="text-sm mt-1">{mockLead.requirements}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {isEditing && (
                <div className="flex gap-2">
                  <Button onClick={handleSave} className="flex-1">
                    <Save className="w-4 h-4 mr-1" />
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
                    <X className="w-4 h-4 mr-1" />
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
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNotesModal(true)}
                >
                  <FileText className="w-4 h-4 mr-1" />
                  Manage Notes ({mockNotes.length})
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowManualCallModal(true)}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Manual Call
                </Button>
              </div>
            </div>

            {/* Call History Timeline */}
            <div className="space-y-4 mb-8">
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
                        <p className="text-xs text-gray-500">Objective: {call.objective}</p>
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
            <div>
              <h4 className="text-lg font-semibold mb-4">Scheduled Calls</h4>
              {scheduledCalls.map((call) => (
                <Card key={call.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{call.type}</p>
                        <p className="text-sm text-gray-600">{call.date}</p>
                        <p className="text-xs text-gray-500">Objective: {call.objective}</p>
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
              ))}
            </div>
          </div>
        </div>

        {/* AI Call Now Modal */}
        <Dialog open={showAICallModal} onOpenChange={setShowAICallModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                Initiate AI Call - {mockLead.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Lead Context Summary</h4>
                <p className="text-sm text-gray-700">
                  {mockLead.status} lead interested in {mockLead.propertyType[0]} properties in {mockLead.areas.join(", ")}. 
                  Budget: ${mockLead.budget[0].toLocaleString()} - ${mockLead.budget[1].toLocaleString()}. 
                  Current score: {mockLead.score}/100.
                </p>
              </div>
              <div>
                <Label>Call Objective</Label>
                <select className="w-full mt-1 p-2 border rounded-md">
                  <option>Follow-up on property interest</option>
                  <option>Budget qualification</option>
                  <option>Schedule property viewing</option>
                  <option>Check mortgage pre-approval status</option>
                  <option>Custom</option>
                </select>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Estimated Duration: 3-5 minutes</span>
                <span>Current Lead Score: {mockLead.score}/100</span>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAICallModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleAICall} className="bg-blue-600 hover:bg-blue-700">
                <Bot className="w-4 h-4 mr-1" />
                Start AI Call
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

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
                <Label>Call Objective</Label>
                <select className="w-full mt-1 p-2 border rounded-md">
                  <option>Follow-up on property interest</option>
                  <option>Budget qualification</option>
                  <option>Schedule property viewing</option>
                  <option>Check mortgage pre-approval status</option>
                  <option>Custom</option>
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
                <Textarea 
                  className="mt-1 h-24"
                  placeholder="Brief summary of the call..."
                />
              </div>
              <div>
                <Label>Call Objective</Label>
                <select className="w-full mt-1 p-2 border rounded-md">
                  <option>Follow-up on property interest</option>
                  <option>Budget qualification</option>
                  <option>Schedule property viewing</option>
                  <option>Check mortgage pre-approval status</option>
                  <option>Custom</option>
                </select>
              </div>
              <div>
                <Label>Update Lead Status</Label>
                <select className="w-full mt-1 p-2 border rounded-md">
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="appointment">Appointment</option>
                  <option value="closed-won">Closed Won</option>
                  <option value="closed-lost">Closed Lost</option>
                </select>
              </div>
              <div>
                <Label>Lead Score Change</Label>
                <select className="w-full mt-1 p-2 border rounded-md">
                  <option value="0">No Change</option>
                  <option value="5">+5 points</option>
                  <option value="10">+10 points</option>
                  <option value="15">+15 points</option>
                  <option value="-5">-5 points</option>
                  <option value="-10">-10 points</option>
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

        {/* Notes Management Modal */}
        <Dialog open={showNotesModal} onOpenChange={setShowNotesModal}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>Lead Notes - {mockLead.name}</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col h-[60vh]">
              {/* Filter Buttons */}
              <div className="flex gap-2 mb-4">
                <Button 
                  variant={noteFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setNoteFilter("all")}
                >
                  All Notes
                </Button>
                <Button 
                  variant={noteFilter === "ai" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setNoteFilter("ai")}
                >
                  AI Notes
                </Button>
                <Button 
                  variant={noteFilter === "manual" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setNoteFilter("manual")}
                >
                  Agent Notes
                </Button>
              </div>

              {/* Notes List */}
              <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                {filteredNotes.map((note) => (
                  <Card key={note.id}>
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant={note.type === "ai" ? "secondary" : "outline"}>
                            {note.author}
                          </Badge>
                          <span className="text-xs text-gray-500">{note.timestamp}</span>
                        </div>
                        {note.type === "manual" && (
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">Edit</Button>
                            <Button variant="ghost" size="sm">Delete</Button>
                          </div>
                        )}
                      </div>
                      <p className="text-sm">{note.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Add Note Section */}
              <div className="border-t pt-4">
                <Label>Add New Note</Label>
                <Textarea 
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Enter your note here..."
                  className="mt-1 mb-2"
                  rows={3}
                />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">{newNote.length}/500</span>
                  <Button onClick={addNote} disabled={!newNote.trim()}>
                    Add Note
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
};
