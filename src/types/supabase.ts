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
      users: {
        Row: {
          id: string;
          email: string;
          created_at: string;
          updated_at: string;
          role: "student" | "teacher";
          name: string | null;
          timezone: string | null;
          available_times: Json | null;
          preferred_languages: string[] | null;
        };
        Insert: {
          id?: string;
          email: string;
          created_at?: string;
          updated_at?: string;
          role: "student" | "teacher";
          name?: string | null;
          timezone?: string | null;
          available_times?: Json | null;
          preferred_languages?: string[] | null;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
          updated_at?: string;
          role?: "student" | "teacher";
          name?: string | null;
          timezone?: string | null;
          available_times?: Json | null;
          preferred_languages?: string[] | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
