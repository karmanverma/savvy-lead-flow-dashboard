# AI-Powered Business CRM System Architecture

## System Overview
A business-agnostic CRM system that enables any business to manage leads and configure AI agents for automated voice interactions using ElevenLabs API. The system supports dynamic context injection, OpenAI-powered call analysis, and automated follow-up scheduling.

## Core Features
- **Multi-business Support**: Configurable for any industry
- **AI Agent Management**: Create, configure, and manage ElevenLabs conversational agents
- **Dynamic Context Injection**: Real-time context building for personalized calls
- **Lead Management**: Comprehensive lead tracking with custom fields
- **Campaign System**: Lead source tracking with campaign-specific agent assignments
- **Call Queue Management**: Automated call scheduling and execution
- **OpenAI Integration**: Post-call analysis, lead scoring, and next action recommendations

## Technology Stack
- **Frontend**: React + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Backend**: Supabase (Database + Auth + Edge Functions)
- **AI Services**: ElevenLabs (Voice AI) + OpenAI (Analysis & Intelligence)
- **Real-time**: Supabase Realtime subscriptions

## Database Schema

### Core Tables
- `leads`: Lead information with custom fields support
- `ai_agents`: ElevenLabs agent configurations
- `call_queue`: Scheduled and pending calls
- `call_recordings`: Call transcripts and outcomes
- `campaigns`: Lead source and agent assignment rules
- `business_configuration`: Industry-specific settings
- `call_context_templates`: Dynamic context generation rules

### Key Relationships
- Leads → Campaigns (lead source tracking)
- Campaigns → AI Agents (default agent assignment)
- Leads → Call Queue (scheduled calls)
- Call Queue → AI Agents (call execution)
- Call Recordings → Leads (conversation history)

## File Structure

### Frontend Components
```
src/
├── components/
│   ├── ai-agents/
│   │   ├── AIAgentsManagement.tsx
│   │   ├── AIAgentConfig.tsx
│   │   ├── EnhancedAIAgentCard.tsx
│   │   └── AIAgentTester.tsx
│   ├── leads/
│   │   ├── LeadPipeline.tsx
│   │   ├── LeadProfile.tsx
│   │   └── AddLeadDialog.tsx
│   ├── campaigns/
│   │   ├── CampaignManagement.tsx
│   │   └── CampaignConfig.tsx
│   ├── calls/
│   │   ├── CallQueueMonitor.tsx
│   │   ├── CallHistory.tsx
│   │   └── AICallTrigger.tsx
│   └── analytics/
│       └── Analytics.tsx
├── hooks/
│   ├── useAIAgents.ts
│   ├── useLeads.ts
│   ├── useCallQueue.ts
│   ├── useCampaigns.ts
│   └── useSecureElevenLabsIntegration.ts
└── lib/
    ├── elevenlabs-client.ts
    └── context-builder.ts
```

### Backend Edge Functions
```
supabase/functions/
├── elevenlabs-agent-create/
├── elevenlabs-agent-update/
├── elevenlabs-agent-delete/
├── elevenlabs-call-initiate/
├── elevenlabs-webhook/
├── context-builder/
├── call-analyzer/
├── next-action-generator/
└── business-config/
```

## Implementation Plan

### Phase 1: Core Agent Management (Current)
**Objectives**: Complete CRUD operations, business-agnostic configuration
**Timeline**: 1-2 weeks

**Key Deliverables**:
1. Enhanced agent creation with proper ElevenLabs API integration
2. Agent update/delete functionality with ElevenLabs sync
3. Business configuration system (industry terminology, custom fields)
4. Campaign management with agent assignment rules
5. Global default agent system with campaign overrides

**Database Changes**:
- Add `campaigns` table for lead source management
- Add `business_configuration` table for industry settings
- Enhance `ai_agents` table with template and configuration support
- Add `lead_custom_fields` for dynamic lead data

### Phase 2: Dynamic Context System
**Objectives**: Real-time context building, enhanced call initiation
**Timeline**: 2-3 weeks

**Key Deliverables**:
1. Context aggregation service combining lead data, history, notes
2. Dynamic system prompt enhancement (append context strategy)
3. Call-specific first message generation
4. Enhanced call queue with business hours and retry logic
5. Real-time call status updates

### Phase 3: Intelligence Layer (OpenAI Integration)
**Objectives**: Post-call analysis, automated follow-ups, lead scoring
**Timeline**: 2-3 weeks

**Key Deliverables**:
1. Transcript analysis with next action recommendations
2. Dynamic lead scoring based on conversation content
3. Automated follow-up call scheduling
4. Sentiment analysis and conversation insights
5. Personalized message generation (ready for future email/SMS)

### Phase 4: Advanced Features
**Objectives**: Analytics, performance tracking, advanced integrations
**Timeline**: 3-4 weeks

**Key Deliverables**:
1. Agent performance analytics and A/B testing
2. Advanced reporting and ROI tracking
3. API endpoints for external integrations
4. Enhanced business configuration options
5. Compliance framework preparation

## API Integration Details

### ElevenLabs Integration
**Base URL**: `https://api.elevenlabs.io/v1/`
**Authentication**: `Xi-Api-Key` header
**Key Endpoints**:
- `POST /convai/agents/create` - Create agent
- `GET /convai/agents/{id}` - Get agent details
- `PATCH /convai/agents/{id}` - Update agent
- `DELETE /convai/agents/{id}` - Delete agent
- `POST /convai/outbound-calls` - Initiate call
- `GET /convai/conversations/{id}` - Get conversation details

### OpenAI Integration
**Base URL**: `https://api.openai.com/v1/`
**Authentication**: `Authorization: Bearer {api_key}`
**Key Endpoints**:
- `POST /chat/completions` - GPT analysis
- `POST /embeddings` - Text embeddings for similarity

## Context Building Strategy

### Dynamic System Prompt Structure
```
[Base Agent Prompt]

LEAD CONTEXT:
- Name: {lead.firstName} {lead.lastName}
- Source: {lead.source}
- Score: {lead.score}
- Status: {lead.status}

CALL CONTEXT:
- Objective: {call.objective}
- Priority: {call.priority}
- Previous Attempts: {call.retryCount}

CONVERSATION HISTORY:
{previousCalls.summary}

LEAD PREFERENCES:
{lead.preferences}

NOTES AND INTERACTIONS:
{lead.notes}

CALL INSTRUCTIONS:
{callSpecificInstructions}
```

### Business Configuration Format
```json
{
  "industry": "real-estate",
  "terminology": {
    "lead": "prospect",
    "appointment": "showing",
    "qualification": "pre-approval"
  },
  "customFields": [
    {
      "name": "budget_range",
      "type": "select",
      "options": ["Under 500K", "500K-1M", "Over 1M"],
      "required": true
    }
  ],
  "callObjectives": [
    "Initial Qualification",
    "Schedule Showing",
    "Follow-up After Showing",
    "Closing Discussion"
  ]
}
```

## Security Considerations
- API keys stored in Supabase secrets
- Row Level Security (RLS) on all tables
- Webhook signature verification
- Rate limiting on API endpoints
- Audit logging for sensitive operations

## Performance Optimization
- Database indexing on frequently queried fields
- Connection pooling for external API calls
- Caching for business configuration data
- Background task processing for non-critical operations
- Real-time subscriptions for live updates

## Monitoring and Logging
- Comprehensive logging in Edge Functions
- API call success/failure tracking
- Call duration and outcome metrics
- Lead conversion tracking
- System performance monitoring

## Future Enhancements
- Multi-tenant architecture for white-label deployment
- Advanced analytics and reporting
- CRM integrations (HubSpot, Salesforce)
- Email/SMS automation
- Compliance frameworks (TCPA, CASL)
- Mobile app for field agents
- Advanced AI features (voice cloning, sentiment analysis)

## Development Guidelines
- Follow TypeScript best practices
- Use shadcn/ui components with design system tokens
- Implement proper error handling and user feedback
- Write comprehensive tests for critical functions
- Document all API endpoints and database schema changes
- Use semantic versioning for releases

## Getting Started
1. Set up ElevenLabs API key in Supabase secrets
2. Configure OpenAI API key for analysis features
3. Run database migrations for new schema
4. Deploy Edge Functions
5. Configure business settings in admin panel
6. Create first AI agent and test with widget
7. Add leads and configure campaigns
8. Monitor call queue and analytics

## Support and Maintenance
- Regular API dependency updates
- Performance monitoring and optimization
- Security audits and compliance checks
- Feature requests and bug tracking
- Documentation updates and training materials