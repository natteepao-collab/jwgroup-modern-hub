export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      awards: {
        Row: {
          award_year: number | null
          awarding_organization: string | null
          category: string | null
          created_at: string
          description_cn: string | null
          description_en: string | null
          description_th: string | null
          id: string
          image_url: string | null
          is_published: boolean | null
          position_order: number | null
          title_cn: string | null
          title_en: string | null
          title_th: string
          updated_at: string
        }
        Insert: {
          award_year?: number | null
          awarding_organization?: string | null
          category?: string | null
          created_at?: string
          description_cn?: string | null
          description_en?: string | null
          description_th?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          position_order?: number | null
          title_cn?: string | null
          title_en?: string | null
          title_th: string
          updated_at?: string
        }
        Update: {
          award_year?: number | null
          awarding_organization?: string | null
          category?: string | null
          created_at?: string
          description_cn?: string | null
          description_en?: string | null
          description_th?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          position_order?: number | null
          title_cn?: string | null
          title_en?: string | null
          title_th?: string
          updated_at?: string
        }
        Relationships: []
      }
      executives: {
        Row: {
          created_at: string
          department: string | null
          description: string | null
          id: string
          image_url: string | null
          is_chairman: boolean
          level: string | null
          name: string
          position_order: number
          quote: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          department?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_chairman?: boolean
          level?: string | null
          name: string
          position_order?: number
          quote?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          department?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_chairman?: boolean
          level?: string | null
          name?: string
          position_order?: number
          quote?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      news: {
        Row: {
          category: string
          content_cn: string | null
          content_en: string | null
          content_th: string | null
          created_at: string
          created_by: string | null
          excerpt_cn: string | null
          excerpt_en: string | null
          excerpt_th: string | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          is_published: boolean | null
          published_at: string | null
          title_cn: string | null
          title_en: string | null
          title_th: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          category?: string
          content_cn?: string | null
          content_en?: string | null
          content_th?: string | null
          created_at?: string
          created_by?: string | null
          excerpt_cn?: string | null
          excerpt_en?: string | null
          excerpt_th?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          is_published?: boolean | null
          published_at?: string | null
          title_cn?: string | null
          title_en?: string | null
          title_th: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          category?: string
          content_cn?: string | null
          content_en?: string | null
          content_th?: string | null
          created_at?: string
          created_by?: string | null
          excerpt_cn?: string | null
          excerpt_en?: string | null
          excerpt_th?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          is_published?: boolean | null
          published_at?: string | null
          title_cn?: string | null
          title_en?: string | null
          title_th?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          email: string
          id: string
          is_active: boolean | null
          name: string | null
          source: string | null
          subscribed_at: string
        }
        Insert: {
          email: string
          id?: string
          is_active?: boolean | null
          name?: string | null
          source?: string | null
          subscribed_at?: string
        }
        Update: {
          email?: string
          id?: string
          is_active?: boolean | null
          name?: string | null
          source?: string | null
          subscribed_at?: string
        }
        Relationships: []
      }
      org_departments: {
        Row: {
          color: string | null
          created_at: string
          description_en: string | null
          description_th: string | null
          id: string
          is_published: boolean | null
          level: string
          name_en: string | null
          name_th: string
          parent_level: string | null
          position_order: number | null
          sub_items: Json | null
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description_en?: string | null
          description_th?: string | null
          id?: string
          is_published?: boolean | null
          level?: string
          name_en?: string | null
          name_th: string
          parent_level?: string | null
          position_order?: number | null
          sub_items?: Json | null
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description_en?: string | null
          description_th?: string | null
          id?: string
          is_published?: boolean | null
          level?: string
          name_en?: string | null
          name_th?: string
          parent_level?: string | null
          position_order?: number | null
          sub_items?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          business_type: string
          created_at: string
          description_cn: string | null
          description_en: string | null
          description_th: string | null
          gallery_images: string[] | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          is_published: boolean | null
          location_en: string | null
          location_th: string | null
          name_cn: string | null
          name_en: string | null
          name_th: string
          position_order: number | null
          updated_at: string
          year_completed: string | null
        }
        Insert: {
          business_type: string
          created_at?: string
          description_cn?: string | null
          description_en?: string | null
          description_th?: string | null
          gallery_images?: string[] | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          is_published?: boolean | null
          location_en?: string | null
          location_th?: string | null
          name_cn?: string | null
          name_en?: string | null
          name_th: string
          position_order?: number | null
          updated_at?: string
          year_completed?: string | null
        }
        Update: {
          business_type?: string
          created_at?: string
          description_cn?: string | null
          description_en?: string | null
          description_th?: string | null
          gallery_images?: string[] | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          is_published?: boolean | null
          location_en?: string | null
          location_th?: string | null
          name_cn?: string | null
          name_en?: string | null
          name_th?: string
          position_order?: number | null
          updated_at?: string
          year_completed?: string | null
        }
        Relationships: []
      }
      site_content: {
        Row: {
          content_cn: string | null
          content_en: string | null
          content_th: string | null
          id: string
          metadata: Json | null
          section_key: string
          title_cn: string | null
          title_en: string | null
          title_th: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          content_cn?: string | null
          content_en?: string | null
          content_th?: string | null
          id?: string
          metadata?: Json | null
          section_key: string
          title_cn?: string | null
          title_en?: string | null
          title_th?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          content_cn?: string | null
          content_en?: string | null
          content_th?: string | null
          id?: string
          metadata?: Json | null
          section_key?: string
          title_cn?: string | null
          title_en?: string | null
          title_th?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      site_images: {
        Row: {
          alt_text: string | null
          id: string
          image_url: string
          section_key: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          alt_text?: string | null
          id?: string
          image_url: string
          section_key: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          alt_text?: string | null
          id?: string
          image_url?: string
          section_key?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          client_company: string | null
          client_image_url: string | null
          client_name: string
          client_title: string | null
          content_cn: string | null
          content_en: string | null
          content_th: string
          created_at: string
          id: string
          is_featured: boolean | null
          is_published: boolean | null
          position_order: number | null
          rating: number | null
          updated_at: string
        }
        Insert: {
          client_company?: string | null
          client_image_url?: string | null
          client_name: string
          client_title?: string | null
          content_cn?: string | null
          content_en?: string | null
          content_th: string
          created_at?: string
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          position_order?: number | null
          rating?: number | null
          updated_at?: string
        }
        Update: {
          client_company?: string | null
          client_image_url?: string | null
          client_name?: string
          client_title?: string | null
          content_cn?: string | null
          content_en?: string | null
          content_th?: string
          created_at?: string
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          position_order?: number | null
          rating?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      timeline_events: {
        Row: {
          created_at: string
          description_cn: string | null
          description_en: string | null
          description_th: string | null
          icon_name: string | null
          id: string
          image_url: string | null
          is_highlight: boolean | null
          is_published: boolean | null
          position_order: number | null
          title_cn: string | null
          title_en: string | null
          title_th: string
          updated_at: string
          year: string
        }
        Insert: {
          created_at?: string
          description_cn?: string | null
          description_en?: string | null
          description_th?: string | null
          icon_name?: string | null
          id?: string
          image_url?: string | null
          is_highlight?: boolean | null
          is_published?: boolean | null
          position_order?: number | null
          title_cn?: string | null
          title_en?: string | null
          title_th: string
          updated_at?: string
          year: string
        }
        Update: {
          created_at?: string
          description_cn?: string | null
          description_en?: string | null
          description_th?: string | null
          icon_name?: string | null
          id?: string
          image_url?: string | null
          is_highlight?: boolean | null
          is_published?: boolean | null
          position_order?: number | null
          title_cn?: string | null
          title_en?: string | null
          title_th?: string
          updated_at?: string
          year?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
