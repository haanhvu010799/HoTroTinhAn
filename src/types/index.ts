export interface User {
  id: string;
  email: string;
  full_name: string;
  badge_number: string;
  role: 'admin' | 'officer';
  created_at: string;
}

export interface Case {
  id: string;
  suspect_name: string;
  suspect_id: string;
  officer_id: string;
  offenses: {
    id: string;
    name: string;
    time: number;
    count: number;
  }[];
  total_time: number;
  status: 'pending' | 'reviewed';
  review_score?: number;
  review_notes?: string;
  created_at: string;
}

export interface Offense {
  id: string;
  name: string;
  time: number;
  category: string;
}