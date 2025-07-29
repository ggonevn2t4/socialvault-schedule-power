export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          team_id: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          team_id: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          team_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      automation_settings: {
        Row: {
          auto_cross_post: boolean | null
          auto_hashtag_enabled: boolean | null
          auto_post_enabled: boolean | null
          content_approval_required: boolean | null
          created_at: string
          created_by: string
          id: string
          notification_settings: Json | null
          platform_settings: Json | null
          posting_schedule: Json | null
          team_id: string
          updated_at: string
          webhook_urls: Json | null
        }
        Insert: {
          auto_cross_post?: boolean | null
          auto_hashtag_enabled?: boolean | null
          auto_post_enabled?: boolean | null
          content_approval_required?: boolean | null
          created_at?: string
          created_by: string
          id?: string
          notification_settings?: Json | null
          platform_settings?: Json | null
          posting_schedule?: Json | null
          team_id: string
          updated_at?: string
          webhook_urls?: Json | null
        }
        Update: {
          auto_cross_post?: boolean | null
          auto_hashtag_enabled?: boolean | null
          auto_post_enabled?: boolean | null
          content_approval_required?: boolean | null
          created_at?: string
          created_by?: string
          id?: string
          notification_settings?: Json | null
          platform_settings?: Json | null
          posting_schedule?: Json | null
          team_id?: string
          updated_at?: string
          webhook_urls?: Json | null
        }
        Relationships: []
      }
      brand_guidelines: {
        Row: {
          accent_color: string | null
          approved_phrases: Json | null
          brand_name: string
          brand_voice: string | null
          content_style: Json | null
          created_at: string
          created_by: string
          forbidden_words: Json | null
          hashtag_sets: Json | null
          id: string
          logo_url: string | null
          primary_color: string | null
          primary_font: string | null
          secondary_color: string | null
          secondary_font: string | null
          team_id: string
          tone_of_voice: string | null
          updated_at: string
        }
        Insert: {
          accent_color?: string | null
          approved_phrases?: Json | null
          brand_name: string
          brand_voice?: string | null
          content_style?: Json | null
          created_at?: string
          created_by: string
          forbidden_words?: Json | null
          hashtag_sets?: Json | null
          id?: string
          logo_url?: string | null
          primary_color?: string | null
          primary_font?: string | null
          secondary_color?: string | null
          secondary_font?: string | null
          team_id: string
          tone_of_voice?: string | null
          updated_at?: string
        }
        Update: {
          accent_color?: string | null
          approved_phrases?: Json | null
          brand_name?: string
          brand_voice?: string | null
          content_style?: Json | null
          created_at?: string
          created_by?: string
          forbidden_words?: Json | null
          hashtag_sets?: Json | null
          id?: string
          logo_url?: string | null
          primary_color?: string | null
          primary_font?: string | null
          secondary_color?: string | null
          secondary_font?: string | null
          team_id?: string
          tone_of_voice?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      competitive_reports: {
        Row: {
          charts_data: Json | null
          competitors: string[] | null
          created_at: string
          created_by: string
          id: string
          insights: Json | null
          is_shared: boolean | null
          metrics: Json | null
          report_name: string
          report_type: string
          team_id: string
          time_period: Json
          updated_at: string
        }
        Insert: {
          charts_data?: Json | null
          competitors?: string[] | null
          created_at?: string
          created_by: string
          id?: string
          insights?: Json | null
          is_shared?: boolean | null
          metrics?: Json | null
          report_name: string
          report_type: string
          team_id: string
          time_period: Json
          updated_at?: string
        }
        Update: {
          charts_data?: Json | null
          competitors?: string[] | null
          created_at?: string
          created_by?: string
          id?: string
          insights?: Json | null
          is_shared?: boolean | null
          metrics?: Json | null
          report_name?: string
          report_type?: string
          team_id?: string
          time_period?: Json
          updated_at?: string
        }
        Relationships: []
      }
      competitor_content: {
        Row: {
          collected_at: string
          content_text: string | null
          content_type: string
          engagement_metrics: Json | null
          hashtags: string[] | null
          id: string
          media_urls: string[] | null
          mentions: string[] | null
          monitoring_id: string
          platform: string
          post_url: string | null
          published_at: string | null
          sentiment_score: number | null
          team_id: string
        }
        Insert: {
          collected_at?: string
          content_text?: string | null
          content_type: string
          engagement_metrics?: Json | null
          hashtags?: string[] | null
          id?: string
          media_urls?: string[] | null
          mentions?: string[] | null
          monitoring_id: string
          platform: string
          post_url?: string | null
          published_at?: string | null
          sentiment_score?: number | null
          team_id: string
        }
        Update: {
          collected_at?: string
          content_text?: string | null
          content_type?: string
          engagement_metrics?: Json | null
          hashtags?: string[] | null
          id?: string
          media_urls?: string[] | null
          mentions?: string[] | null
          monitoring_id?: string
          platform?: string
          post_url?: string | null
          published_at?: string | null
          sentiment_score?: number | null
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "competitor_content_monitoring_id_fkey"
            columns: ["monitoring_id"]
            isOneToOne: false
            referencedRelation: "competitor_monitoring"
            referencedColumns: ["id"]
          },
        ]
      }
      competitor_monitoring: {
        Row: {
          account_handle: string
          competitor_id: string
          created_at: string
          id: string
          is_active: boolean | null
          last_checked: string | null
          monitoring_frequency: string | null
          platform: string
          team_id: string
          updated_at: string
        }
        Insert: {
          account_handle: string
          competitor_id: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_checked?: string | null
          monitoring_frequency?: string | null
          platform: string
          team_id: string
          updated_at?: string
        }
        Update: {
          account_handle?: string
          competitor_id?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_checked?: string | null
          monitoring_frequency?: string | null
          platform?: string
          team_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "competitor_monitoring_competitor_id_fkey"
            columns: ["competitor_id"]
            isOneToOne: false
            referencedRelation: "competitors"
            referencedColumns: ["id"]
          },
        ]
      }
      competitors: {
        Row: {
          company_size: string | null
          created_at: string
          created_by: string
          description: string | null
          id: string
          industry: string | null
          is_active: boolean | null
          location: string | null
          logo_url: string | null
          name: string
          social_handles: Json | null
          tags: string[] | null
          team_id: string
          updated_at: string
          website_url: string | null
        }
        Insert: {
          company_size?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          industry?: string | null
          is_active?: boolean | null
          location?: string | null
          logo_url?: string | null
          name: string
          social_handles?: Json | null
          tags?: string[] | null
          team_id: string
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          company_size?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          industry?: string | null
          is_active?: boolean | null
          location?: string | null
          logo_url?: string | null
          name?: string
          social_handles?: Json | null
          tags?: string[] | null
          team_id?: string
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      content_templates: {
        Row: {
          content_template: string
          created_at: string
          created_by: string
          hashtags: Json | null
          id: string
          is_public: boolean | null
          name: string
          platforms: Json | null
          team_id: string
          template_type: string
          updated_at: string
          usage_count: number | null
        }
        Insert: {
          content_template: string
          created_at?: string
          created_by: string
          hashtags?: Json | null
          id?: string
          is_public?: boolean | null
          name: string
          platforms?: Json | null
          team_id: string
          template_type: string
          updated_at?: string
          usage_count?: number | null
        }
        Update: {
          content_template?: string
          created_at?: string
          created_by?: string
          hashtags?: Json | null
          id?: string
          is_public?: boolean | null
          name?: string
          platforms?: Json | null
          team_id?: string
          template_type?: string
          updated_at?: string
          usage_count?: number | null
        }
        Relationships: []
      }
      market_insights: {
        Row: {
          category: string
          confidence_score: number | null
          created_at: string
          created_by: string
          data_points: Json | null
          description: string | null
          id: string
          impact_level: string | null
          insight_type: string
          is_archived: boolean | null
          sources: string[] | null
          team_id: string
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          confidence_score?: number | null
          created_at?: string
          created_by: string
          data_points?: Json | null
          description?: string | null
          id?: string
          impact_level?: string | null
          insight_type: string
          is_archived?: boolean | null
          sources?: string[] | null
          team_id: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          confidence_score?: number | null
          created_at?: string
          created_by?: string
          data_points?: Json | null
          description?: string | null
          id?: string
          impact_level?: string | null
          insight_type?: string
          is_archived?: boolean | null
          sources?: string[] | null
          team_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      permissions: {
        Row: {
          category: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          category: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          content: string | null
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          id: string
          permission_id: string | null
          role: Database["public"]["Enums"]["app_role"]
          team_id: string | null
        }
        Insert: {
          id?: string
          permission_id?: string | null
          role: Database["public"]["Enums"]["app_role"]
          team_id?: string | null
        }
        Update: {
          id?: string
          permission_id?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assignee_id: string | null
          completed_at: string | null
          created_at: string
          created_by: string
          description: string | null
          due_date: string | null
          id: string
          priority: string
          progress: number | null
          status: string
          team_id: string
          title: string
          updated_at: string
        }
        Insert: {
          assignee_id?: string | null
          completed_at?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          progress?: number | null
          status?: string
          team_id: string
          title: string
          updated_at?: string
        }
        Update: {
          assignee_id?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          progress?: number | null
          status?: string
          team_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          id: string
          joined_at: string
          last_active: string | null
          role: Database["public"]["Enums"]["app_role"]
          status: Database["public"]["Enums"]["user_status"]
          team_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          last_active?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          status?: Database["public"]["Enums"]["user_status"]
          team_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          last_active?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          status?: Database["public"]["Enums"]["user_status"]
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          avatar_url: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          analytics_tracking: boolean | null
          created_at: string
          data_sharing: boolean | null
          date_format: string | null
          email_notifications: boolean | null
          id: string
          in_app_notifications: boolean | null
          language: string | null
          marketing_emails: boolean | null
          profile_visibility: string | null
          push_notifications: boolean | null
          security_alerts: boolean | null
          theme: string | null
          time_format: string | null
          timezone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          analytics_tracking?: boolean | null
          created_at?: string
          data_sharing?: boolean | null
          date_format?: string | null
          email_notifications?: boolean | null
          id?: string
          in_app_notifications?: boolean | null
          language?: string | null
          marketing_emails?: boolean | null
          profile_visibility?: string | null
          push_notifications?: boolean | null
          security_alerts?: boolean | null
          theme?: string | null
          time_format?: string | null
          timezone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          analytics_tracking?: boolean | null
          created_at?: string
          data_sharing?: boolean | null
          date_format?: string | null
          email_notifications?: boolean | null
          id?: string
          in_app_notifications?: boolean | null
          language?: string | null
          marketing_emails?: boolean | null
          profile_visibility?: string | null
          push_notifications?: boolean | null
          security_alerts?: boolean | null
          theme?: string | null
          time_format?: string | null
          timezone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          created_at: string
          device_info: Json | null
          id: string
          ip_address: unknown | null
          last_active: string | null
          location: string | null
          session_token: string
          user_id: string
        }
        Insert: {
          created_at?: string
          device_info?: Json | null
          id?: string
          ip_address?: unknown | null
          last_active?: string | null
          location?: string | null
          session_token: string
          user_id: string
        }
        Update: {
          created_at?: string
          device_info?: Json | null
          id?: string
          ip_address?: unknown | null
          last_active?: string | null
          location?: string | null
          session_token?: string
          user_id?: string
        }
        Relationships: []
      }
      workflow_approvals: {
        Row: {
          approved_at: string | null
          approver_id: string
          comments: string | null
          created_at: string
          id: string
          status: string
          step_index: number
          workflow_instance_id: string
        }
        Insert: {
          approved_at?: string | null
          approver_id: string
          comments?: string | null
          created_at?: string
          id?: string
          status?: string
          step_index: number
          workflow_instance_id: string
        }
        Update: {
          approved_at?: string | null
          approver_id?: string
          comments?: string | null
          created_at?: string
          id?: string
          status?: string
          step_index?: number
          workflow_instance_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_approvals_workflow_instance_id_fkey"
            columns: ["workflow_instance_id"]
            isOneToOne: false
            referencedRelation: "workflow_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_instances: {
        Row: {
          created_at: string
          created_by: string
          current_step: number | null
          data: Json | null
          id: string
          status: string
          task_id: string | null
          team_id: string
          updated_at: string
          workflow_id: string
        }
        Insert: {
          created_at?: string
          created_by: string
          current_step?: number | null
          data?: Json | null
          id?: string
          status?: string
          task_id?: string | null
          team_id: string
          updated_at?: string
          workflow_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          current_step?: number | null
          data?: Json | null
          id?: string
          status?: string
          task_id?: string | null
          team_id?: string
          updated_at?: string
          workflow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_instances_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_instances_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      workflows: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          steps: Json
          team_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          steps?: Json
          team_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          steps?: Json
          team_id?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string; _team_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      is_team_member: {
        Args: { _user_id: string; _team_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "editor" | "viewer" | "content_creator" | "analyst"
      user_status: "online" | "offline" | "away" | "busy"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "editor", "viewer", "content_creator", "analyst"],
      user_status: ["online", "offline", "away", "busy"],
    },
  },
} as const
