// Hand-written types matching Phase 2 schema migrations.
// Keep in sync with supabase/migrations/*.sql
// Regenerate with: supabase gen types --local > src/types/database.ts

export type BookingMode = "instant" | "request" | "unavailable";
export type PriceMode = "fixed" | "from" | "quote";
export type BookingStatus =
  | "pending"
  | "confirmed"
  | "declined"
  | "rescheduled"
  | "cancelled"
  | "completed"
  | "no_show";
export type BookingSource =
  | "website"
  | "admin"
  | "phone"
  | "instagram"
  | "facebook"
  | "other";
export type BlockReason = "private" | "closed" | "maintenance" | "other";
export type JobStatus =
  | "planned"
  | "arrived"
  | "inspection"
  | "in_progress"
  | "final_check"
  | "done"
  | "archived";
export type PublishPermission = "unknown" | "granted" | "denied";
export type UserRole = "owner" | "admin" | "editor";
export type UserStatus = "active" | "inactive";

// ─── Row shapes ─────────────────────────────────────────────────────────────
// Use `type` (not `interface`) so these satisfy Record<string, unknown> —
// required for Database["public"] to extend Supabase's GenericSchema.

export type StudioUserRow = {
  id: string;
  email: string;
  display_name: string | null;
  role: UserRole;
  status: UserStatus;
  created_at: string;
  last_login_at: string | null;
};

export type ServiceRow = {
  id: string;
  slug: string;
  name: string;
  short_description: string | null;
  long_description: string | null;
  booking_mode: BookingMode;
  duration_minutes: number;
  cleanup_buffer_minutes: number;
  price_mode: PriceMode;
  price_amount_minor: number | null;
  currency: string;
  active: boolean;
  sort_order: number;
  booking_constraints: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};

export type CustomerRow = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  contact_preference: string;
  consent_marketing: boolean;
  created_at: string;
};

export type VehicleRow = {
  id: string;
  make: string;
  model: string;
  year: number | null;
  color: string | null;
  registration: string | null;
  notes: string | null;
  created_at: string;
};

export type AvailabilityWindowRow = {
  id: string;
  starts_at: string;
  ends_at: string;
  source: string;
  recurrence_rule: string | null;
  enabled: boolean;
  note: string | null;
  created_at: string;
  updated_at: string;
};

export type AvailabilityBlockRow = {
  id: string;
  starts_at: string;
  ends_at: string;
  reason: BlockReason;
  note: string | null;
  created_at: string;
};

export type BookingRow = {
  id: string;
  public_reference: string;
  customer_id: string;
  vehicle_id: string;
  service_id: string;
  starts_at: string | null;
  ends_at: string | null;
  time_range: string | null;
  status: BookingStatus;
  source: BookingSource;
  customer_note: string | null;
  internal_note: string | null;
  created_at: string;
  confirmed_at: string | null;
};

export type JobRow = {
  id: string;
  booking_id: string | null;
  vehicle_id: string;
  status: JobStatus;
  started_at: string | null;
  completed_at: string | null;
  internal_notes: string | null;
  public_summary: string | null;
  publish_permission: PublishPermission;
  created_at: string;
  updated_at: string;
};

export type JobServiceRow = {
  job_id: string;
  service_id: string;
  quoted_price_minor: number | null;
  final_price_minor: number | null;
  duration_minutes: number | null;
};

export type WaitlistEntryRow = {
  id: string;
  service_id: string;
  name: string;
  phone: string;
  note: string | null;
  notified_at: string | null;
  created_at: string;
};

// ─── Database schema ─────────────────────────────────────────────────────────

export interface Database {
  public: {
    Tables: {
      studio_users: {
        Row: StudioUserRow;
        Insert: {
          id: string;
          email: string;
          display_name?: string | null;
          role: UserRole;
          status?: UserStatus;
          created_at?: string;
          last_login_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          display_name?: string | null;
          role?: UserRole;
          status?: UserStatus;
          created_at?: string;
          last_login_at?: string | null;
        };
        Relationships: [];
      };
      services: {
        Row: ServiceRow;
        Insert: {
          id?: string;
          slug: string;
          name: string;
          short_description?: string | null;
          long_description?: string | null;
          booking_mode?: BookingMode;
          duration_minutes: number;
          cleanup_buffer_minutes?: number;
          price_mode?: PriceMode;
          price_amount_minor?: number | null;
          currency?: string;
          active?: boolean;
          sort_order?: number;
          booking_constraints?: Record<string, unknown> | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          short_description?: string | null;
          long_description?: string | null;
          booking_mode?: BookingMode;
          duration_minutes?: number;
          cleanup_buffer_minutes?: number;
          price_mode?: PriceMode;
          price_amount_minor?: number | null;
          currency?: string;
          active?: boolean;
          sort_order?: number;
          booking_constraints?: Record<string, unknown> | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      customers: {
        Row: CustomerRow;
        Insert: {
          id?: string;
          name: string;
          phone: string;
          email?: string | null;
          contact_preference?: string;
          consent_marketing?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          phone?: string;
          email?: string | null;
          contact_preference?: string;
          consent_marketing?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      vehicles: {
        Row: VehicleRow;
        Insert: {
          id?: string;
          make: string;
          model: string;
          year?: number | null;
          color?: string | null;
          registration?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          make?: string;
          model?: string;
          year?: number | null;
          color?: string | null;
          registration?: string | null;
          notes?: string | null;
        };
        Relationships: [];
      };
      availability_windows: {
        Row: AvailabilityWindowRow;
        Insert: {
          id?: string;
          starts_at: string;
          ends_at: string;
          source?: string;
          recurrence_rule?: string | null;
          enabled?: boolean;
          note?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          starts_at?: string;
          ends_at?: string;
          source?: string;
          recurrence_rule?: string | null;
          enabled?: boolean;
          note?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      availability_blocks: {
        Row: AvailabilityBlockRow;
        Insert: {
          id?: string;
          starts_at: string;
          ends_at: string;
          reason?: BlockReason;
          note?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          starts_at?: string;
          ends_at?: string;
          reason?: BlockReason;
          note?: string | null;
        };
        Relationships: [];
      };
      bookings: {
        Row: BookingRow;
        Insert: {
          id?: string;
          public_reference?: string;
          customer_id: string;
          vehicle_id: string;
          service_id: string;
          starts_at?: string | null;
          ends_at?: string | null;
          status?: BookingStatus;
          source?: BookingSource;
          customer_note?: string | null;
          internal_note?: string | null;
          created_at?: string;
          confirmed_at?: string | null;
        };
        Update: {
          id?: string;
          public_reference?: string;
          customer_id?: string;
          vehicle_id?: string;
          service_id?: string;
          starts_at?: string | null;
          ends_at?: string | null;
          status?: BookingStatus;
          source?: BookingSource;
          customer_note?: string | null;
          internal_note?: string | null;
          confirmed_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "bookings_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "customers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookings_vehicle_id_fkey";
            columns: ["vehicle_id"];
            isOneToOne: false;
            referencedRelation: "vehicles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookings_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "services";
            referencedColumns: ["id"];
          },
        ];
      };
      jobs: {
        Row: JobRow;
        Insert: {
          id?: string;
          booking_id?: string | null;
          vehicle_id: string;
          status?: JobStatus;
          started_at?: string | null;
          completed_at?: string | null;
          internal_notes?: string | null;
          public_summary?: string | null;
          publish_permission?: PublishPermission;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          booking_id?: string | null;
          vehicle_id?: string;
          status?: JobStatus;
          started_at?: string | null;
          completed_at?: string | null;
          internal_notes?: string | null;
          public_summary?: string | null;
          publish_permission?: PublishPermission;
          updated_at?: string;
        };
        Relationships: [];
      };
      job_services: {
        Row: JobServiceRow;
        Insert: {
          job_id: string;
          service_id: string;
          quoted_price_minor?: number | null;
          final_price_minor?: number | null;
          duration_minutes?: number | null;
        };
        Update: {
          job_id?: string;
          service_id?: string;
          quoted_price_minor?: number | null;
          final_price_minor?: number | null;
          duration_minutes?: number | null;
        };
        Relationships: [];
      };
      waitlist_entries: {
        Row: WaitlistEntryRow;
        Insert: {
          id?: string;
          service_id: string;
          name: string;
          phone: string;
          note?: string | null;
          notified_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          service_id?: string;
          name?: string;
          phone?: string;
          note?: string | null;
          notified_at?: string | null;
        };
        Relationships: [];
      };
    };
    // No views in Phase 2. Using empty object (not Record<string, never>) so that
    // `keyof Views = never`, preventing the Views overload on `db.from()` from
    // matching table names and resolving to `never`.
    Views: Record<never, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: {
      booking_mode: "instant" | "request" | "unavailable";
      price_mode: "fixed" | "from" | "quote";
      booking_status: "pending" | "confirmed" | "declined" | "rescheduled" | "cancelled" | "completed" | "no_show";
      booking_source: "website" | "admin" | "phone" | "instagram" | "facebook" | "other";
      block_reason: "private" | "closed" | "maintenance" | "other";
      job_status: "planned" | "arrived" | "inspection" | "in_progress" | "final_check" | "done" | "archived";
    };
    CompositeTypes: Record<never, never>;
  };
}
