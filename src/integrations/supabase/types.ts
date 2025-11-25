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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_config: {
        Row: {
          admin_phone: string
          created_at: string | null
          id: string
          is_active: boolean | null
          updated_at: string | null
        }
        Insert: {
          admin_phone: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
        }
        Update: {
          admin_phone?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          display_order: number | null
          id: string
          image_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          id?: string
          image_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number | null
          id?: string
          image_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      comment_likes: {
        Row: {
          comment_id: string
          created_at: string
          id: string
          user_id: string | null
        }
        Insert: {
          comment_id: string
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Update: {
          comment_id?: string
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comment_likes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "product_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      order_history: {
        Row: {
          created_at: string
          customer_email: string | null
          customer_name: string
          customer_phone: string | null
          id: string
          invoice_number: string
          order_data: Json
          original_order_date: string
          total_amount: number
          user_id: string | null
        }
        Insert: {
          created_at?: string
          customer_email?: string | null
          customer_name: string
          customer_phone?: string | null
          id?: string
          invoice_number: string
          order_data: Json
          original_order_date?: string
          total_amount?: number
          user_id?: string | null
        }
        Update: {
          created_at?: string
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string | null
          id?: string
          invoice_number?: string
          order_data?: Json
          original_order_date?: string
          total_amount?: number
          user_id?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          product_id: string
          quantity: number
          selected_attributes: Json | null
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          product_id: string
          quantity?: number
          selected_attributes?: Json | null
          total_price?: number
          unit_price?: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          selected_attributes?: Json | null
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_order_items_order"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_order_items_product"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          customer_email: string | null
          customer_name: string
          customer_phone: string | null
          id: string
          shipping_address: Json | null
          status: string
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          customer_email?: string | null
          customer_name: string
          customer_phone?: string | null
          id?: string
          shipping_address?: Json | null
          status?: string
          total_amount?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string | null
          id?: string
          shipping_address?: Json | null
          status?: string
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      product_attribute_values: {
        Row: {
          attribute_id: string
          created_at: string
          display_value: string
          id: string
          price_modifier: number | null
          value: string
        }
        Insert: {
          attribute_id: string
          created_at?: string
          display_value: string
          id?: string
          price_modifier?: number | null
          value: string
        }
        Update: {
          attribute_id?: string
          created_at?: string
          display_value?: string
          id?: string
          price_modifier?: number | null
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_attribute_values_attribute_id_fkey"
            columns: ["attribute_id"]
            isOneToOne: false
            referencedRelation: "product_attributes"
            referencedColumns: ["id"]
          },
        ]
      }
      product_attributes: {
        Row: {
          created_at: string
          display_name: string
          id: string
          is_required: boolean
          name: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name: string
          id?: string
          is_required?: boolean
          name: string
          type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string
          id?: string
          is_required?: boolean
          name?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      product_comments: {
        Row: {
          comment: string
          created_at: string
          helpful_count: number
          id: string
          is_approved: boolean
          parent_id: string | null
          product_id: string
          rating: number
          updated_at: string
          user_email: string | null
          user_name: string
        }
        Insert: {
          comment: string
          created_at?: string
          helpful_count?: number
          id?: string
          is_approved?: boolean
          parent_id?: string | null
          product_id: string
          rating: number
          updated_at?: string
          user_email?: string | null
          user_name: string
        }
        Update: {
          comment?: string
          created_at?: string
          helpful_count?: number
          id?: string
          is_approved?: boolean
          parent_id?: string | null
          product_id?: string
          rating?: number
          updated_at?: string
          user_email?: string | null
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_product_comments_product_id"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "product_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_comments_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_custom_attribute_options: {
        Row: {
          attribute_id: string
          created_at: string
          display_value: string
          id: string
          price_modifier: number
        }
        Insert: {
          attribute_id: string
          created_at?: string
          display_value: string
          id?: string
          price_modifier?: number
        }
        Update: {
          attribute_id?: string
          created_at?: string
          display_value?: string
          id?: string
          price_modifier?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_custom_attribute_options_attribute_id_fkey"
            columns: ["attribute_id"]
            isOneToOne: false
            referencedRelation: "product_custom_attributes"
            referencedColumns: ["id"]
          },
        ]
      }
      product_custom_attributes: {
        Row: {
          created_at: string
          id: string
          name: string
          product_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          product_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          product_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_custom_attributes_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variant_attributes: {
        Row: {
          attribute_id: string
          attribute_value_id: string
          created_at: string
          id: string
          variant_id: string
        }
        Insert: {
          attribute_id: string
          attribute_value_id: string
          created_at?: string
          id?: string
          variant_id: string
        }
        Update: {
          attribute_id?: string
          attribute_value_id?: string
          created_at?: string
          id?: string
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variant_attributes_attribute_id_fkey"
            columns: ["attribute_id"]
            isOneToOne: false
            referencedRelation: "product_attributes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_variant_attributes_attribute_value_id_fkey"
            columns: ["attribute_value_id"]
            isOneToOne: false
            referencedRelation: "product_attribute_values"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_variant_attributes_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          price: number
          product_id: string
          sku: string | null
          stock_quantity: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          price: number
          product_id: string
          sku?: string | null
          stock_quantity?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          price?: number
          product_id?: string
          sku?: string | null
          stock_quantity?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          availability_status: string | null
          category_id: string | null
          created_at: string
          description: string | null
          discount_percentage: number | null
          id: string
          image_url: string | null
          is_active: boolean
          is_featured: boolean | null
          price: number | null
          stock: number | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          availability_status?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          discount_percentage?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_featured?: boolean | null
          price?: number | null
          stock?: number | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          availability_status?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          discount_percentage?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_featured?: boolean | null
          price?: number | null
          stock?: number | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          is_active: boolean
          last_login: string | null
          name: string
          phone: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          is_active?: boolean
          last_login?: string | null
          name: string
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          last_login?: string | null
          name?: string
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      role_change_audit: {
        Row: {
          changed_by: string
          created_at: string
          id: string
          new_role: Database["public"]["Enums"]["app_role"]
          old_role: Database["public"]["Enums"]["app_role"] | null
          target_user: string
        }
        Insert: {
          changed_by: string
          created_at?: string
          id?: string
          new_role: Database["public"]["Enums"]["app_role"]
          old_role?: Database["public"]["Enums"]["app_role"] | null
          target_user: string
        }
        Update: {
          changed_by?: string
          created_at?: string
          id?: string
          new_role?: Database["public"]["Enums"]["app_role"]
          old_role?: Database["public"]["Enums"]["app_role"] | null
          target_user?: string
        }
        Relationships: []
      }
      support_messages: {
        Row: {
          conversation_id: string
          created_at: string
          id: string
          is_from_admin: boolean
          is_read: boolean
          message: string
          updated_at: string
          user_email: string | null
          user_id: string | null
          user_name: string
        }
        Insert: {
          conversation_id: string
          created_at?: string
          id?: string
          is_from_admin?: boolean
          is_read?: boolean
          message: string
          updated_at?: string
          user_email?: string | null
          user_id?: string | null
          user_name: string
        }
        Update: {
          conversation_id?: string
          created_at?: string
          id?: string
          is_from_admin?: boolean
          is_read?: boolean
          message?: string
          updated_at?: string
          user_email?: string | null
          user_id?: string | null
          user_name?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
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
      get_user_role: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin_phone: { Args: { phone_number: string }; Returns: boolean }
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
