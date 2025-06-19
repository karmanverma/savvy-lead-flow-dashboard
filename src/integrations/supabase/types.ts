export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activities: {
        Row: {
          activity_type: Database["public"]["Enums"]["activity_type"]
          created_at: string
          description: string | null
          id: string
          lead_id: string | null
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          activity_type: Database["public"]["Enums"]["activity_type"]
          created_at?: string
          description?: string | null
          id?: string
          lead_id?: string | null
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          activity_type?: Database["public"]["Enums"]["activity_type"]
          created_at?: string
          description?: string | null
          id?: string
          lead_id?: string | null
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activities_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_dynamic_variables: {
        Row: {
          agent_id: string
          created_at: string | null
          id: string
          updated_at: string | null
          variable_name: string
          variable_value: string
        }
        Insert: {
          agent_id: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          variable_name: string
          variable_value: string
        }
        Update: {
          agent_id?: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          variable_name?: string
          variable_value?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_dynamic_variables_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "ai_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_agent_performance: {
        Row: {
          ai_agent_id: string
          appointments_scheduled: number | null
          average_duration: number | null
          created_at: string
          date: string
          id: string
          leads_qualified: number | null
          successful_calls: number | null
          total_calls: number | null
        }
        Insert: {
          ai_agent_id: string
          appointments_scheduled?: number | null
          average_duration?: number | null
          created_at?: string
          date: string
          id?: string
          leads_qualified?: number | null
          successful_calls?: number | null
          total_calls?: number | null
        }
        Update: {
          ai_agent_id?: string
          appointments_scheduled?: number | null
          average_duration?: number | null
          created_at?: string
          date?: string
          id?: string
          leads_qualified?: number | null
          successful_calls?: number | null
          total_calls?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_agent_performance_ai_agent_id_fkey"
            columns: ["ai_agent_id"]
            isOneToOne: false
            referencedRelation: "ai_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_agents: {
        Row: {
          call_objectives: string[] | null
          conversation_config: Json | null
          created_at: string
          created_by: string | null
          description: string | null
          elevenlabs_agent_id: string | null
          first_message_script: string
          id: string
          is_active: boolean
          language: string | null
          llm_config: Json | null
          max_call_duration: number | null
          name: string
          phone_number: string | null
          retry_settings: Json | null
          system_prompt: string
          updated_at: string
          voice_id: string | null
          voice_settings: Json | null
          webhook_url: string | null
        }
        Insert: {
          call_objectives?: string[] | null
          conversation_config?: Json | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          elevenlabs_agent_id?: string | null
          first_message_script: string
          id?: string
          is_active?: boolean
          language?: string | null
          llm_config?: Json | null
          max_call_duration?: number | null
          name: string
          phone_number?: string | null
          retry_settings?: Json | null
          system_prompt: string
          updated_at?: string
          voice_id?: string | null
          voice_settings?: Json | null
          webhook_url?: string | null
        }
        Update: {
          call_objectives?: string[] | null
          conversation_config?: Json | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          elevenlabs_agent_id?: string | null
          first_message_script?: string
          id?: string
          is_active?: boolean
          language?: string | null
          llm_config?: Json | null
          max_call_duration?: number | null
          name?: string
          phone_number?: string | null
          retry_settings?: Json | null
          system_prompt?: string
          updated_at?: string
          voice_id?: string | null
          voice_settings?: Json | null
          webhook_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_agents_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      call_queue: {
        Row: {
          ai_agent_id: string
          call_objective: string
          created_at: string
          created_by: string | null
          custom_context: Json | null
          elevenlabs_call_id: string | null
          executed_at: string | null
          id: string
          lead_id: string
          max_retries: number | null
          priority: number | null
          retry_count: number | null
          scheduled_time: string
          status: string
          updated_at: string
          webhook_data: Json | null
        }
        Insert: {
          ai_agent_id: string
          call_objective: string
          created_at?: string
          created_by?: string | null
          custom_context?: Json | null
          elevenlabs_call_id?: string | null
          executed_at?: string | null
          id?: string
          lead_id: string
          max_retries?: number | null
          priority?: number | null
          retry_count?: number | null
          scheduled_time: string
          status?: string
          updated_at?: string
          webhook_data?: Json | null
        }
        Update: {
          ai_agent_id?: string
          call_objective?: string
          created_at?: string
          created_by?: string | null
          custom_context?: Json | null
          elevenlabs_call_id?: string | null
          executed_at?: string | null
          id?: string
          lead_id?: string
          max_retries?: number | null
          priority?: number | null
          retry_count?: number | null
          scheduled_time?: string
          status?: string
          updated_at?: string
          webhook_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "call_queue_ai_agent_id_fkey"
            columns: ["ai_agent_id"]
            isOneToOne: false
            referencedRelation: "ai_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "call_queue_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      call_recordings: {
        Row: {
          ai_agent_id: string | null
          call_id: string | null
          call_outcome: string | null
          call_status: string
          conversation_data: Json | null
          created_at: string
          duration_seconds: number | null
          elevenlabs_call_id: string | null
          elevenlabs_conversation_id: string | null
          id: string
          lead_id: string
          lead_score_change: number | null
          next_action: string | null
          recording_url: string | null
          sentiment_score: number | null
          transcription: string | null
        }
        Insert: {
          ai_agent_id?: string | null
          call_id?: string | null
          call_outcome?: string | null
          call_status: string
          conversation_data?: Json | null
          created_at?: string
          duration_seconds?: number | null
          elevenlabs_call_id?: string | null
          elevenlabs_conversation_id?: string | null
          id?: string
          lead_id: string
          lead_score_change?: number | null
          next_action?: string | null
          recording_url?: string | null
          sentiment_score?: number | null
          transcription?: string | null
        }
        Update: {
          ai_agent_id?: string | null
          call_id?: string | null
          call_outcome?: string | null
          call_status?: string
          conversation_data?: Json | null
          created_at?: string
          duration_seconds?: number | null
          elevenlabs_call_id?: string | null
          elevenlabs_conversation_id?: string | null
          id?: string
          lead_id?: string
          lead_score_change?: number | null
          next_action?: string | null
          recording_url?: string | null
          sentiment_score?: number | null
          transcription?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "call_recordings_ai_agent_id_fkey"
            columns: ["ai_agent_id"]
            isOneToOne: false
            referencedRelation: "ai_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "call_recordings_call_id_fkey"
            columns: ["call_id"]
            isOneToOne: false
            referencedRelation: "calls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "call_recordings_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      calls: {
        Row: {
          agent_id: string | null
          ai_agent_id: string | null
          call_objective: string | null
          call_status: Database["public"]["Enums"]["call_status"]
          call_summary: string | null
          call_type: Database["public"]["Enums"]["call_type"]
          completed_at: string | null
          created_at: string
          duration_seconds: number | null
          id: string
          lead_id: string
          lead_score_change: number | null
          next_action: string | null
          recording_url: string | null
          scheduled_for: string | null
          transcript: string | null
        }
        Insert: {
          agent_id?: string | null
          ai_agent_id?: string | null
          call_objective?: string | null
          call_status: Database["public"]["Enums"]["call_status"]
          call_summary?: string | null
          call_type: Database["public"]["Enums"]["call_type"]
          completed_at?: string | null
          created_at?: string
          duration_seconds?: number | null
          id?: string
          lead_id: string
          lead_score_change?: number | null
          next_action?: string | null
          recording_url?: string | null
          scheduled_for?: string | null
          transcript?: string | null
        }
        Update: {
          agent_id?: string | null
          ai_agent_id?: string | null
          call_objective?: string | null
          call_status?: Database["public"]["Enums"]["call_status"]
          call_summary?: string | null
          call_type?: Database["public"]["Enums"]["call_type"]
          completed_at?: string | null
          created_at?: string
          duration_seconds?: number | null
          id?: string
          lead_id?: string
          lead_score_change?: number | null
          next_action?: string | null
          recording_url?: string | null
          scheduled_for?: string | null
          transcript?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calls_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calls_ai_agent_id_fkey"
            columns: ["ai_agent_id"]
            isOneToOne: false
            referencedRelation: "ai_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calls_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      integration_logs: {
        Row: {
          created_at: string
          error_message: string | null
          external_id: string | null
          id: string
          lead_id: string | null
          operation_type: string | null
          request_payload: Json | null
          response_payload: Json | null
          service_name: string
          status: Database["public"]["Enums"]["integration_status"]
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          external_id?: string | null
          id?: string
          lead_id?: string | null
          operation_type?: string | null
          request_payload?: Json | null
          response_payload?: Json | null
          service_name: string
          status: Database["public"]["Enums"]["integration_status"]
        }
        Update: {
          created_at?: string
          error_message?: string | null
          external_id?: string | null
          id?: string
          lead_id?: string | null
          operation_type?: string | null
          request_payload?: Json | null
          response_payload?: Json | null
          service_name?: string
          status?: Database["public"]["Enums"]["integration_status"]
        }
        Relationships: [
          {
            foreignKeyName: "integration_logs_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_preferences: {
        Row: {
          bathrooms_min: number | null
          bedrooms_max: number | null
          bedrooms_min: number | null
          budget_max: number | null
          budget_min: number | null
          created_at: string
          id: string
          lead_id: string
          move_timeline: string | null
          preferred_areas: string[] | null
          property_types: string[] | null
          special_requirements: string | null
          updated_at: string
        }
        Insert: {
          bathrooms_min?: number | null
          bedrooms_max?: number | null
          bedrooms_min?: number | null
          budget_max?: number | null
          budget_min?: number | null
          created_at?: string
          id?: string
          lead_id: string
          move_timeline?: string | null
          preferred_areas?: string[] | null
          property_types?: string[] | null
          special_requirements?: string | null
          updated_at?: string
        }
        Update: {
          bathrooms_min?: number | null
          bedrooms_max?: number | null
          bedrooms_min?: number | null
          budget_max?: number | null
          budget_min?: number | null
          created_at?: string
          id?: string
          lead_id?: string
          move_timeline?: string | null
          preferred_areas?: string[] | null
          property_types?: string[] | null
          special_requirements?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_preferences_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: true
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_qualification: {
        Row: {
          created_at: string
          current_situation:
            | Database["public"]["Enums"]["current_situation"]
            | null
          down_payment_amount: number | null
          family_size: number | null
          id: string
          income_range: string | null
          lead_id: string
          pre_approval_status:
            | Database["public"]["Enums"]["pre_approval_status"]
            | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_situation?:
            | Database["public"]["Enums"]["current_situation"]
            | null
          down_payment_amount?: number | null
          family_size?: number | null
          id?: string
          income_range?: string | null
          lead_id: string
          pre_approval_status?:
            | Database["public"]["Enums"]["pre_approval_status"]
            | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_situation?:
            | Database["public"]["Enums"]["current_situation"]
            | null
          down_payment_amount?: number | null
          family_size?: number | null
          id?: string
          income_range?: string | null
          lead_id?: string
          pre_approval_status?:
            | Database["public"]["Enums"]["pre_approval_status"]
            | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_qualification_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: true
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          assigned_agent_id: string | null
          created_at: string
          email: string | null
          first_name: string
          id: string
          last_name: string
          lead_score: number
          lead_source: Database["public"]["Enums"]["lead_source"]
          phone: string
          status: Database["public"]["Enums"]["lead_status"]
          updated_at: string
        }
        Insert: {
          assigned_agent_id?: string | null
          created_at?: string
          email?: string | null
          first_name: string
          id?: string
          last_name: string
          lead_score?: number
          lead_source: Database["public"]["Enums"]["lead_source"]
          phone: string
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
        }
        Update: {
          assigned_agent_id?: string | null
          created_at?: string
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string
          lead_score?: number
          lead_source?: Database["public"]["Enums"]["lead_source"]
          phone?: string
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_assigned_agent_id_fkey"
            columns: ["assigned_agent_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          author_id: string | null
          author_type: Database["public"]["Enums"]["author_type"]
          content: string
          created_at: string
          id: string
          is_private: boolean | null
          lead_id: string
          note_type: Database["public"]["Enums"]["note_type"] | null
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          author_type: Database["public"]["Enums"]["author_type"]
          content: string
          created_at?: string
          id?: string
          is_private?: boolean | null
          lead_id: string
          note_type?: Database["public"]["Enums"]["note_type"] | null
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          author_type?: Database["public"]["Enums"]["author_type"]
          content?: string
          created_at?: string
          id?: string
          is_private?: boolean | null
          lead_id?: string
          note_type?: Database["public"]["Enums"]["note_type"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notes_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      scheduled_calls: {
        Row: {
          ai_agent_id: string
          call_objective: string
          created_at: string
          created_by: string | null
          custom_context: Json | null
          id: string
          lead_id: string
          priority: Database["public"]["Enums"]["priority_level"] | null
          scheduled_time: string
          status: Database["public"]["Enums"]["call_status"] | null
          updated_at: string
        }
        Insert: {
          ai_agent_id: string
          call_objective: string
          created_at?: string
          created_by?: string | null
          custom_context?: Json | null
          id?: string
          lead_id: string
          priority?: Database["public"]["Enums"]["priority_level"] | null
          scheduled_time: string
          status?: Database["public"]["Enums"]["call_status"] | null
          updated_at?: string
        }
        Update: {
          ai_agent_id?: string
          call_objective?: string
          created_at?: string
          created_by?: string | null
          custom_context?: Json | null
          id?: string
          lead_id?: string
          priority?: Database["public"]["Enums"]["priority_level"] | null
          scheduled_time?: string
          status?: Database["public"]["Enums"]["call_status"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_calls_ai_agent_id_fkey"
            columns: ["ai_agent_id"]
            isOneToOne: false
            referencedRelation: "ai_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduled_calls_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduled_calls_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      scheduling_rules: {
        Row: {
          blackout_dates: string[] | null
          business_hours: Json
          created_at: string
          id: string
          is_default: boolean | null
          name: string
          timezone: string
          updated_at: string
        }
        Insert: {
          blackout_dates?: string[] | null
          business_hours?: Json
          created_at?: string
          id?: string
          is_default?: boolean | null
          name: string
          timezone?: string
          updated_at?: string
        }
        Update: {
          blackout_dates?: string[] | null
          business_hours?: Json
          created_at?: string
          id?: string
          is_default?: boolean | null
          name?: string
          timezone?: string
          updated_at?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string
          id: string
          is_active: boolean
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name: string
          id: string
          is_active?: boolean
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string
          id?: string
          is_active?: boolean
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      activity_type:
        | "lead_created"
        | "call_completed"
        | "status_changed"
        | "note_added"
      author_type: "agent" | "ai" | "system"
      call_status: "completed" | "failed" | "in_progress" | "scheduled"
      call_type: "ai_call" | "manual_call" | "follow_up"
      current_situation: "renting" | "selling" | "first_time_buyer" | "investor"
      integration_status: "success" | "error" | "pending"
      lead_source: "website" | "facebook" | "google" | "referral" | "walk_in"
      lead_status:
        | "new"
        | "contacted"
        | "qualified"
        | "appointment"
        | "closed_won"
        | "closed_lost"
      note_type: "general" | "call_summary" | "follow_up" | "qualification"
      pre_approval_status: "yes" | "no" | "unknown"
      priority_level: "high" | "medium" | "low"
      user_role: "admin" | "agent" | "manager"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      activity_type: [
        "lead_created",
        "call_completed",
        "status_changed",
        "note_added",
      ],
      author_type: ["agent", "ai", "system"],
      call_status: ["completed", "failed", "in_progress", "scheduled"],
      call_type: ["ai_call", "manual_call", "follow_up"],
      current_situation: ["renting", "selling", "first_time_buyer", "investor"],
      integration_status: ["success", "error", "pending"],
      lead_source: ["website", "facebook", "google", "referral", "walk_in"],
      lead_status: [
        "new",
        "contacted",
        "qualified",
        "appointment",
        "closed_won",
        "closed_lost",
      ],
      note_type: ["general", "call_summary", "follow_up", "qualification"],
      pre_approval_status: ["yes", "no", "unknown"],
      priority_level: ["high", "medium", "low"],
      user_role: ["admin", "agent", "manager"],
    },
  },
} as const
