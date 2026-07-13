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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      bookmarks: {
        Row: {
          created_at: string
          id: string
          note: string | null
          surah_number: number
          user_id: string
          verse_number: number
        }
        Insert: {
          created_at?: string
          id?: string
          note?: string | null
          surah_number: number
          user_id: string
          verse_number: number
        }
        Update: {
          created_at?: string
          id?: string
          note?: string | null
          surah_number?: number
          user_id?: string
          verse_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_surah_number_fkey"
            columns: ["surah_number"]
            isOneToOne: false
            referencedRelation: "surahs"
            referencedColumns: ["number"]
          },
        ]
      }
      narrations: {
        Row: {
          audio_url: string
          created_at: string
          id: string
          language: string
          verse_id: string
          voice_id: string | null
        }
        Insert: {
          audio_url: string
          created_at?: string
          id?: string
          language: string
          verse_id: string
          voice_id?: string | null
        }
        Update: {
          audio_url?: string
          created_at?: string
          id?: string
          language?: string
          verse_id?: string
          voice_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "narrations_verse_id_fkey"
            columns: ["verse_id"]
            isOneToOne: false
            referencedRelation: "verses"
            referencedColumns: ["id"]
          },
        ]
      }
      reading_progress: {
        Row: {
          created_at: string
          current_surah: number
          current_verse: number
          show_streak: boolean
          start_surah: number
          start_verse: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_surah?: number
          current_verse?: number
          show_streak?: boolean
          start_surah?: number
          start_verse?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_surah?: number
          current_verse?: number
          show_streak?: boolean
          start_surah?: number
          start_verse?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reading_sessions: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          pages_read: number
          session_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          pages_read?: number
          session_date: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          pages_read?: number
          session_date?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reading_streak: {
        Row: {
          created_at: string
          current_streak: number
          last_completed_date: string | null
          longest_streak: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_streak?: number
          last_completed_date?: string | null
          longest_streak?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_streak?: number
          last_completed_date?: string | null
          longest_streak?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      scenes: {
        Row: {
          created_at: string
          error: string | null
          id: string
          image_prompt: string | null
          image_url: string | null
          status: string
          updated_at: string
          verse_id: string
        }
        Insert: {
          created_at?: string
          error?: string | null
          id?: string
          image_prompt?: string | null
          image_url?: string | null
          status?: string
          updated_at?: string
          verse_id: string
        }
        Update: {
          created_at?: string
          error?: string | null
          id?: string
          image_prompt?: string | null
          image_url?: string | null
          status?: string
          updated_at?: string
          verse_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scenes_verse_id_fkey"
            columns: ["verse_id"]
            isOneToOne: true
            referencedRelation: "verses"
            referencedColumns: ["id"]
          },
        ]
      }
      surahs: {
        Row: {
          created_at: string
          is_animated: boolean
          name_ar: string
          name_en: string
          name_translit: string
          number: number
          revelation_place: string
          verse_count: number
        }
        Insert: {
          created_at?: string
          is_animated?: boolean
          name_ar: string
          name_en: string
          name_translit: string
          number: number
          revelation_place: string
          verse_count: number
        }
        Update: {
          created_at?: string
          is_animated?: boolean
          name_ar?: string
          name_en?: string
          name_translit?: string
          number?: number
          revelation_place?: string
          verse_count?: number
        }
        Relationships: []
      }
      translations: {
        Row: {
          created_at: string
          id: string
          language: string
          source: string | null
          text: string
          verse_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          language: string
          source?: string | null
          text: string
          verse_id: string
        }
        Update: {
          created_at?: string
          id?: string
          language?: string
          source?: string | null
          text?: string
          verse_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "translations_verse_id_fkey"
            columns: ["verse_id"]
            isOneToOne: false
            referencedRelation: "verses"
            referencedColumns: ["id"]
          },
        ]
      }
      tts_usage: {
        Row: {
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
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
      user_settings: {
        Row: {
          autoplay: boolean
          reciter: string
          translation_language: string
          updated_at: string
          user_id: string
        }
        Insert: {
          autoplay?: boolean
          reciter?: string
          translation_language?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          autoplay?: boolean
          reciter?: string
          translation_language?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      verses: {
        Row: {
          created_at: string
          id: string
          juz: number | null
          mentions_prophet_muhammad: boolean
          page: number | null
          surah_number: number
          text_ar: string
          verse_number: number
        }
        Insert: {
          created_at?: string
          id?: string
          juz?: number | null
          mentions_prophet_muhammad?: boolean
          page?: number | null
          surah_number: number
          text_ar: string
          verse_number: number
        }
        Update: {
          created_at?: string
          id?: string
          juz?: number | null
          mentions_prophet_muhammad?: boolean
          page?: number | null
          surah_number?: number
          text_ar?: string
          verse_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "verses_surah_number_fkey"
            columns: ["surah_number"]
            isOneToOne: false
            referencedRelation: "surahs"
            referencedColumns: ["number"]
          },
        ]
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
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
