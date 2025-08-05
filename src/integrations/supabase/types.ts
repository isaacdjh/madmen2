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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_date: string
          appointment_time: string
          barber: string
          client_id: string | null
          created_at: string
          customer_email: string | null
          customer_name: string | null
          customer_phone: string | null
          id: string
          location: string
          price: number | null
          service: string
          status: string
          updated_at: string
        }
        Insert: {
          appointment_date: string
          appointment_time: string
          barber: string
          client_id?: string | null
          created_at?: string
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          location: string
          price?: number | null
          service: string
          status?: string
          updated_at?: string
        }
        Update: {
          appointment_date?: string
          appointment_time?: string
          barber?: string
          client_id?: string | null
          created_at?: string
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          location?: string
          price?: number | null
          service?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_complete_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      barber_schedules: {
        Row: {
          barber_id: string
          break_end: string | null
          break_start: string | null
          created_at: string
          day_of_week: string
          end_time: string | null
          id: string
          is_working: boolean
          start_time: string | null
          updated_at: string
        }
        Insert: {
          barber_id: string
          break_end?: string | null
          break_start?: string | null
          created_at?: string
          day_of_week: string
          end_time?: string | null
          id?: string
          is_working?: boolean
          start_time?: string | null
          updated_at?: string
        }
        Update: {
          barber_id?: string
          break_end?: string | null
          break_start?: string | null
          created_at?: string
          day_of_week?: string
          end_time?: string | null
          id?: string
          is_working?: boolean
          start_time?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "barber_schedules_barber_id_fkey"
            columns: ["barber_id"]
            isOneToOne: false
            referencedRelation: "barbers"
            referencedColumns: ["id"]
          },
        ]
      }
      barbers: {
        Row: {
          created_at: string
          email: string | null
          id: string
          location: string | null
          name: string
          phone: string | null
          photo_url: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          location?: string | null
          name: string
          phone?: string | null
          photo_url?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          location?: string | null
          name?: string
          phone?: string | null
          photo_url?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      blocked_slots: {
        Row: {
          barber_id: string
          blocked_date: string
          blocked_time: string
          created_at: string
          id: string
          reason: string | null
        }
        Insert: {
          barber_id: string
          blocked_date: string
          blocked_time: string
          created_at?: string
          id?: string
          reason?: string | null
        }
        Update: {
          barber_id?: string
          blocked_date?: string
          blocked_time?: string
          created_at?: string
          id?: string
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blocked_slots_barber_id_fkey"
            columns: ["barber_id"]
            isOneToOne: false
            referencedRelation: "barbers"
            referencedColumns: ["id"]
          },
        ]
      }
      bonus_packages: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          id: string
          name: string
          price: number
          services_included: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          name: string
          price: number
          services_included: number
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          price?: number
          services_included?: number
        }
        Relationships: []
      }
      bonus_redemptions: {
        Row: {
          appointment_id: string | null
          client_bonus_id: string | null
          id: string
          redeemed_by_barber: string
          redemption_date: string
          service_name: string
        }
        Insert: {
          appointment_id?: string | null
          client_bonus_id?: string | null
          id?: string
          redeemed_by_barber: string
          redemption_date?: string
          service_name: string
        }
        Update: {
          appointment_id?: string | null
          client_bonus_id?: string | null
          id?: string
          redeemed_by_barber?: string
          redemption_date?: string
          service_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "bonus_redemptions_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bonus_redemptions_client_bonus_id_fkey"
            columns: ["client_bonus_id"]
            isOneToOne: false
            referencedRelation: "client_bonuses"
            referencedColumns: ["id"]
          },
        ]
      }
      cash_register_entries: {
        Row: {
          amount: number
          appointment_id: string | null
          barber_name: string | null
          created_at: string
          created_by: string | null
          description: string | null
          entry_type: string
          id: string
          location: string
          payment_id: string | null
        }
        Insert: {
          amount: number
          appointment_id?: string | null
          barber_name?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          entry_type: string
          id?: string
          location?: string
          payment_id?: string | null
        }
        Update: {
          amount?: number
          appointment_id?: string | null
          barber_name?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          entry_type?: string
          id?: string
          location?: string
          payment_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cash_register_entries_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cash_register_entries_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      cash_register_state: {
        Row: {
          denomination_id: string
          id: string
          location: string
          quantity: number
          updated_at: string
        }
        Insert: {
          denomination_id: string
          id?: string
          location?: string
          quantity?: number
          updated_at?: string
        }
        Update: {
          denomination_id?: string
          id?: string
          location?: string
          quantity?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cash_register_state_denomination_id_fkey"
            columns: ["denomination_id"]
            isOneToOne: false
            referencedRelation: "denominations"
            referencedColumns: ["id"]
          },
        ]
      }
      change_given: {
        Row: {
          cash_register_entry_id: string
          created_at: string
          denomination_id: string
          id: string
          quantity: number
        }
        Insert: {
          cash_register_entry_id: string
          created_at?: string
          denomination_id: string
          id?: string
          quantity: number
        }
        Update: {
          cash_register_entry_id?: string
          created_at?: string
          denomination_id?: string
          id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "change_given_cash_register_entry_id_fkey"
            columns: ["cash_register_entry_id"]
            isOneToOne: false
            referencedRelation: "cash_register_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "change_given_denomination_id_fkey"
            columns: ["denomination_id"]
            isOneToOne: false
            referencedRelation: "denominations"
            referencedColumns: ["id"]
          },
        ]
      }
      client_bonuses: {
        Row: {
          bonus_package_id: string | null
          client_id: string | null
          id: string
          purchase_date: string
          services_remaining: number
          sold_by_barber: string
          status: string
        }
        Insert: {
          bonus_package_id?: string | null
          client_id?: string | null
          id?: string
          purchase_date?: string
          services_remaining: number
          sold_by_barber: string
          status?: string
        }
        Update: {
          bonus_package_id?: string | null
          client_id?: string | null
          id?: string
          purchase_date?: string
          services_remaining?: number
          sold_by_barber?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_bonuses_bonus_package_id_fkey"
            columns: ["bonus_package_id"]
            isOneToOne: false
            referencedRelation: "bonus_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_bonuses_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_complete_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_bonuses_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_client_bonuses_bonus_package_id"
            columns: ["bonus_package_id"]
            isOneToOne: false
            referencedRelation: "bonus_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_client_bonuses_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_complete_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_client_bonuses_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          created_at: string
          email: string
          id: string
          last_name: string | null
          name: string
          phone: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          last_name?: string | null
          name: string
          phone: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          last_name?: string | null
          name?: string
          phone?: string
          updated_at?: string
        }
        Relationships: []
      }
      denominations: {
        Row: {
          active: boolean
          created_at: string
          currency: string
          id: string
          type: string
          value: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          currency?: string
          id?: string
          type: string
          value: number
        }
        Update: {
          active?: boolean
          created_at?: string
          currency?: string
          id?: string
          type?: string
          value?: number
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          appointment_id: string | null
          client_id: string | null
          created_at: string
          id: string
          payment_method: string
          payment_status: string
        }
        Insert: {
          amount: number
          appointment_id?: string | null
          client_id?: string | null
          created_at?: string
          id?: string
          payment_method: string
          payment_status?: string
        }
        Update: {
          amount?: number
          appointment_id?: string | null
          client_id?: string | null
          created_at?: string
          id?: string
          payment_method?: string
          payment_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_complete_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean
          category: string
          created_at: string
          description: string | null
          id: string
          name: string
          price: number
          stock: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          category: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          price: number
          stock?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          price?: number
          stock?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          location: string | null
          phone: string | null
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          location?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          location?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      service_history: {
        Row: {
          appointment_id: string | null
          barber_name: string
          client_id: string | null
          created_at: string
          id: string
          payment_method: string | null
          service_date: string
          service_name: string
          service_price: number
          used_bonus: boolean | null
        }
        Insert: {
          appointment_id?: string | null
          barber_name: string
          client_id?: string | null
          created_at?: string
          id?: string
          payment_method?: string | null
          service_date: string
          service_name: string
          service_price: number
          used_bonus?: boolean | null
        }
        Update: {
          appointment_id?: string | null
          barber_name?: string
          client_id?: string | null
          created_at?: string
          id?: string
          payment_method?: string | null
          service_date?: string
          service_name?: string
          service_price?: number
          used_bonus?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "service_history_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_history_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_complete_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_history_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          active: boolean
          category: string
          created_at: string
          description: string | null
          duration: number
          id: string
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          category: string
          created_at?: string
          description?: string | null
          duration: number
          id?: string
          name: string
          price: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          category?: string
          created_at?: string
          description?: string | null
          duration?: number
          id?: string
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      client_complete_summary: {
        Row: {
          active_bonus_services: number | null
          client_since: string | null
          completed_appointments: number | null
          email: string | null
          id: string | null
          last_name: string | null
          last_visit_date: string | null
          name: string | null
          phone: string | null
          total_appointments: number | null
          total_bonuses_purchased: number | null
          total_spent: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      find_or_create_client: {
        Args: {
          p_name: string
          p_phone: string
          p_email: string
          p_last_name?: string
        }
        Returns: string
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      process_sale_transaction: {
        Args: {
          p_appointment_id: string
          p_amount: number
          p_payment_received: number
          p_change_given: Json
          p_location?: string
          p_barber_name?: string
        }
        Returns: string
      }
    }
    Enums: {
      app_role: "admin" | "barber" | "user"
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
      app_role: ["admin", "barber", "user"],
    },
  },
} as const
