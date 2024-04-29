export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      tenants: {
        Row: {
          user_id: string
          property_id: string
          created_at: Date
        }
        Insert: {
          user_id: string
          property_id: string
          created_at?: Date | null
        }
        Update: {
          property_id?: string
          user_id?: string
          created_at?: Date | null
        }
      }
      property_invites: {
        Row: {
          token: string
          full_name: string
          email: string
          property_id: string
          created_at: Date
        }
        Insert: {
          token: string
          full_name: string
          email: string
          property_id: string
          created_at?: Date | null
        }
        Upsert: {
          token: string
          full_name: string
          email: string
          property_id: string
          created_at?: Date | null
        }
        Update: {
          token?: string
          full_name?: string
          email?: string
          property_id?: string
          created_at?: Date | null
        }
      }
      property_rents: {
        Row: {
          id: string
          property_id: string
          rent_price: number
          rent_start: Date
          rent_end: Date
          months_left: number
          created_at: Date
        }
        Insert: {
          id: string
          property_id: string
          rent_price: number
          rent_start: Date
          rent_end: Date
          months_left: number
          created_at?: Date | null
        }
        Update: {
          id?: string
          property_id?: string
          rent_price?: number
          rent_start?: Date
          rent_end?: Date
          months_left?: number
          created_at?: Date | null
        }
      }
      property_security_deposits: {
        Row: {
          id: string
          property_id: string
          deposit_amount: number
          status: Database['public']['Enums']['security_deposit_status']
          created_at: Date
        }
        Insert: {
          id: string
          property_id: string
          deposit_amount: number
          status: Database['public']['Enums']['security_deposit_status']
          created_at?: Date | null
        }
        Update: {
          id?: string
          property_id?: string
          deposit_amount?: number
          status?: Database['public']['Enums']['security_deposit_status']
          created_at?: Date | null
        }
      }
      property_fees: {
        Row: {
          id: string
          property_id: string
          fee_name: string
          fee_type: 'one-time' | 'recurring'
          fee_cost: number
          months_left: number
          created_at: Date
        }
        Insert: {
          id: string
          property_id: string
          fee_name: string
          fee_type: 'one-time' | 'recurring'
          fee_cost: number
          months_left: number
          created_at?: Date | null
        }
        Update: {
          id?: string
          property_id?: string
          fee_name?: string
          fee_type?: 'one-time' | 'recurring'
          fee_cost?: number
          months_left?: number
          created_at?: Date | null
        }
        Relationships: [
          {
            foreignKeyName: 'public_property_fees_property_id_fkey'
            columns: ['property_id']
            isOneToOne: false
            referencedRelation: 'properties'
            referencedColumns: ['id']
          },
        ]
      }
      properties: {
        Row: {
          id: string
          user_id: string
          street_address: string
          city: string
          state: string
          zip: string
          apt: string | null
          country: string
          created_at: Date
        }
        Insert: {
          id?: string
          user_id: string
          street_address: string
          city: string
          state: string
          zip: string
          apt?: string | null
          country: string
          created_at?: Date | null
        }
        Update: {
          id?: string
          user_id?: string
          street_address?: string
          city?: string
          state?: string
          zip?: string
          apt?: string | null
          country?: string
          created_at?: Date | null
        }
      }
      plaid_accounts: {
        Row: {
          account_id: string
          access_token: string
          item_id: string
          user_id: string
          account_number: string
          routing_number: string
          wire_routing: string | null
          mask: string
          name: string
          time_added: Date
        }
        Insert: {
          account_id: string
          access_token?: string
          item_id?: string
          user_id: string
          account_number: string
          routing_number: string
          wire_routing?: string | null
          mask?: string | null
          name?: string | null
          time_added?: Date | null
        }
        Update: {
          account_id?: string
          access_token?: string | null
          item_id?: string | null
          user_id?: string
          account_number?: string
          routing_number?: string
          wire_routing?: string | null
          mask?: string
          name?: string
          time_added?: Date | null
        }
      }
      shadcn_tasks: {
        Row: {
          id: string
          user_id: string
          code: string
          title: string
          description: string | null
          status: string
          priority: string
          cost: number | null
          created_at: Date
          updated_at: Date
        }
        Insert: {
          id: string
          user_id: string
          code: string
          title: string
          description?: string | null
          status: string
          priority: string
          cost?: number | null
          created_at?: Date | null
          updated_at?: Date | null
        }
        Update: {
          id?: string
          user_id?: string
          code?: string
          title?: string
          description?: string | null
          status?: string
          priority?: string
          cost?: number | null
          created_at?: Date | null
          updated_at?: Date | null
        }
      }
      customers: {
        Row: {
          id: string
          stripe_customer_id: string | null
        }
        Insert: {
          id: string
          stripe_customer_id?: string | null
        }
        Update: {
          id?: string
          stripe_customer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'customers_id_fkey'
            columns: ['id']
            isOneToOne: true
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      prices: {
        Row: {
          active: boolean | null
          billing_scheme: 'per_unit' | 'tiered' | null
          currency: string | null
          id: string
          interval: Database['public']['Enums']['pricing_plan_interval'] | null
          interval_count: number | null
          product_id: string | null
          tax_behavior?: 'exclusive' | 'inclusive' | 'unspecified' | null
          tiers_mode: 'graduated' | 'volume' | null
          trial_period_days: number | null
          type: Database['public']['Enums']['pricing_type'] | null
          unit_amount: number | null
        }
        Insert: {
          active?: boolean | null
          billing_scheme: 'per_unit' | 'tiered' | null
          currency?: string | null
          id: string
          interval?: Database['public']['Enums']['pricing_plan_interval'] | null
          interval_count?: number | null
          product_id?: string | null
          tax_behavior?: 'exclusive' | 'inclusive' | 'unspecified' | null
          tiers_mode: 'graduated' | 'volume' | null
          trial_period_days?: number | null
          type?: Database['public']['Enums']['pricing_type'] | null
          unit_amount?: number | null
        }
        Update: {
          active?: boolean | null
          billing_scheme: 'per_unit' | 'tiered' | null
          currency?: string | null
          id?: string
          interval?: Database['public']['Enums']['pricing_plan_interval'] | null
          interval_count?: number | null
          product_id?: string | null
          tax_behavior?: 'exclusive' | 'inclusive' | 'unspecified'
          tiers_mode: 'graduated' | 'volume' | null
          trial_period_days?: number | null
          type?: Database['public']['Enums']['pricing_type'] | null
          unit_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'prices_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          },
        ]
      }
      products: {
        Row: {
          active: boolean | null
          description: string | null
          id: string
          image: string | null
          metadata: Json | null
          name: string | null
        }
        Insert: {
          active?: boolean | null
          description?: string | null
          id: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
        }
        Update: {
          active?: boolean | null
          description?: string | null
          id?: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at: string | null
          cancel_at_period_end: boolean | null
          canceled_at: string | null
          created: string
          current_period_end: string
          current_period_start: string
          ended_at: string | null
          id: string
          metadata: Json | null
          price_id: string | null
          quantity: number | null
          status: Database['public']['Enums']['subscription_status'] | null
          trial_end: string | null
          trial_start: string | null
          user_id: string
        }
        Insert: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created?: string
          current_period_end?: string
          current_period_start?: string
          ended_at?: string | null
          id: string
          metadata?: Json | null
          price_id?: string | null
          quantity?: number | null
          status?: Database['public']['Enums']['subscription_status'] | null
          trial_end?: string | null
          trial_start?: string | null
          user_id: string
        }
        Update: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created?: string
          current_period_end?: string
          current_period_start?: string
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          price_id?: string | null
          quantity?: number | null
          status?: Database['public']['Enums']['subscription_status'] | null
          trial_end?: string | null
          trial_start?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'subscriptions_price_id_fkey'
            columns: ['price_id']
            isOneToOne: false
            referencedRelation: 'prices'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'subscriptions_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      users: {
        Row: {
          billing_address: Json | null
          full_name: string | null
          welcome_screen: boolean | null
          id: string
          email: string
          is_sidebar_collapsed: boolean | null
          free_months: number | null
        }
        Insert: {
          billing_address?: Json | null
          full_name?: string | null
          welcome_screen?: boolean | null
          id: string
          email?: string
          is_sidebar_collapsed?: boolean | null
          free_months?: number | null
        }
        Update: {
          billing_address?: Json | null
          full_name?: string | null
          welcome_screen?: boolean | null
          id?: string
          email?: string
          is_sidebar_collapsed?: boolean | null
          free_months?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'users_id_fkey'
            columns: ['id']
            isOneToOne: true
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      pricing_plan_interval: 'day' | 'week' | 'month' | 'year'
      pricing_type: 'one_time' | 'recurring'
      fee_type: 'one_time' | 'recurring'
      security_deposit_status: 'unpaid' | 'paid' | 'returned' | 'kept_full' | 'kept_partial'
      subscription_status:
        | 'trialing'
        | 'active'
        | 'canceled'
        | 'incomplete'
        | 'incomplete_expired'
        | 'past_due'
        | 'unpaid'
        | 'paused'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database['public']['Tables'] & Database['public']['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database['public']['Tables'] &
      Database['public']['Views'])
  ? (Database['public']['Tables'] &
      Database['public']['Views'])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database['public']['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
  ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database['public']['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
  ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database['public']['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof Database['public']['Enums']
  ? Database['public']['Enums'][PublicEnumNameOrOptions]
  : never