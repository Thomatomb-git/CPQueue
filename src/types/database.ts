export type CpPlatform =
  | 'codeforces'
  | 'atcoder'
  | 'tlx'
  | 'vjudge'
  | 'luogu'
  | 'cses'
  | 'others';

export interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
  created_at: string;
}

export interface Problem {
  id: string;
  user_id: string;
  url: string;
  normalized_url: string;
  platform: CpPlatform;
  title: string;
  is_completed: boolean;
  created_at: string;
  completed_at: string | null;
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: {
          id: string;
          username: string;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          avatar_url?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      problems: {
        Row: Problem;
        Insert: {
          id?: string;
          user_id: string;
          url: string;
          normalized_url: string;
          platform: CpPlatform;
          title: string;
          is_completed?: boolean;
          created_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          url?: string;
          normalized_url?: string;
          platform?: CpPlatform;
          title?: string;
          is_completed?: boolean;
          created_at?: string;
          completed_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "problems_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      cp_platform: CpPlatform;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
