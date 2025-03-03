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
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'user' | 'expert'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role: 'user' | 'expert'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'user' | 'expert'
          created_at?: string
          updated_at?: string
        }
      }
      expert_profiles: {
        Row: {
          id: string
          title: string
          company: string | null
          expertise: string[]
          hourly_rate: number
          bio: string | null
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          title: string
          company?: string | null
          expertise: string[]
          hourly_rate: number
          bio?: string | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          company?: string | null
          expertise?: string[]
          hourly_rate?: number
          bio?: string | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      availability: {
        Row: {
          id: string
          expert_id: string
          start_time: string
          end_time: string
          is_booked: boolean
          created_at: string
        }
        Insert: {
          id?: string
          expert_id: string
          start_time: string
          end_time: string
          is_booked?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          expert_id?: string
          start_time?: string
          end_time?: string
          is_booked?: boolean
          created_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          user_id: string
          expert_id: string
          availability_id: string
          status: 'scheduled' | 'completed' | 'cancelled'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          expert_id: string
          availability_id: string
          status: 'scheduled' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          expert_id?: string
          availability_id?: string
          status?: 'scheduled' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
      }
    }
    Functions: {
      book_appointment: {
        Args: {
          p_availability_id: string
          p_user_id: string
        }
        Returns: string
      }
    }
  }
}