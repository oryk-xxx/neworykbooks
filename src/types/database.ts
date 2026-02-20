export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          display_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          role: "user" | "admin";
          created_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          role?: "user" | "admin";
          created_at?: string;
        };
        Update: {
          username?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          role?: "user" | "admin";
        };
      };
      entitlements: {
        Row: {
          user_id: string;
          active: boolean;
          created_at: string;
          updated_at: string;
          last_payment_id: string | null;
        };
        Insert: {
          user_id: string;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
          last_payment_id?: string | null;
        };
        Update: {
          active?: boolean;
          updated_at?: string;
          last_payment_id?: string | null;
        };
      };
      books: {
        Row: {
          id: string;
          title: string;
          cover_url: string | null;
          summary: string | null;
          tags: string[];
          status: "draft" | "published";
          average_rating: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          cover_url?: string | null;
          summary?: string | null;
          tags?: string[];
          status?: "draft" | "published";
          average_rating?: number | null;
          created_at?: string;
        };
        Update: {
          title?: string;
          cover_url?: string | null;
          summary?: string | null;
          tags?: string[];
          status?: "draft" | "published";
        };
      };
      pages: {
        Row: {
          id: string;
          book_id: string;
          order_index: number;
          slug: string;
          content: Json;
          estimated_read_time_minutes: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          book_id: string;
          order_index: number;
          slug: string;
          content: Json;
          estimated_read_time_minutes: number;
          created_at?: string;
        };
        Update: {
          order_index?: number;
          slug?: string;
          content?: Json;
          estimated_read_time_minutes?: number;
        };
      };
      page_versions: {
        Row: {
          id: string;
          page_id: string;
          content: Json;
          created_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          page_id: string;
          content: Json;
          created_at?: string;
          created_by?: string | null;
        };
        Update: {};
      };
      progress: {
        Row: {
          user_id: string;
          book_id: string;
          page_id: string;
          unlocked: boolean;
          attempts: number;
          score: number | null;
          last_attempt_at: string | null;
          total_read_time_seconds: number;
        };
        Insert: {
          user_id: string;
          book_id: string;
          page_id: string;
          unlocked?: boolean;
          attempts?: number;
          score?: number | null;
          last_attempt_at?: string | null;
          total_read_time_seconds?: number;
        };
        Update: {
          unlocked?: boolean;
          attempts?: number;
          score?: number | null;
          last_attempt_at?: string | null;
          total_read_time_seconds?: number;
        };
      };
      follows: {
        Row: {
          follower_id: string;
          following_id: string;
          created_at: string;
        };
        Insert: {
          follower_id: string;
          following_id: string;
          created_at?: string;
        };
        Update: {};
      };
      ratings: {
        Row: {
          id: string;
          user_id: string;
          book_id: string;
          rating: number;
          comment: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          book_id: string;
          rating: number;
          comment?: string | null;
          created_at?: string;
        };
        Update: {
          rating?: number;
          comment?: string | null;
        };
      };
      results: {
        Row: {
          id: string;
          user_id: string;
          book_id: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          book_id: string;
          content: string;
          created_at?: string;
        };
        Update: {};
      };
      logs: {
        Row: {
          id: string;
          user_id: string | null;
          action: string;
          ip: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          action: string;
          ip?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {};
      };
    };
    Views: {
      [key: string]: never;
    };
    Functions: {
      [key: string]: never;
    };
    Enums: {
      [key: string]: never;
    };
    CompositeTypes: {
      [key: string]: never;
    };
  };
}
