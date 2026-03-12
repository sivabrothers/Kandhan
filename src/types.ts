export interface User {
  id: number;
  email: string;
  role: 'user' | 'admin';
  unique_id?: string;
  payment_status?: string;
}

export interface Profile {
  user_id: number;
  name: string;
  gender: 'Bride' | 'Groom';
  dob: string;
  age: number;
  height: string;
  weight?: string;
  marital_status: string;
  mother_tongue: string;
  religion: string;
  caste: string;
  sub_caste?: string;
  gothram?: string;
  star?: string; // Nakshatra
  rasi?: string;
  manglik?: string; // Dosham status
  phone?: string;
  city?: string;
  address?: string;
  district?: string;
  state: string;
  country: string;
  education: string;
  profession: string;
  company?: string;
  income: number;
  father_name?: string;
  father_occ?: string;
  mother_name?: string;
  mother_occ?: string;
  brothers?: number;
  sisters?: number;
  food: string;
  smoking?: string;
  drinking?: string;
  bio?: string; // About Me
  partner_expectations?: string;
  photos: string; // JSON string
  horoscope_img?: string;
  id_proof?: string;
  is_approved?: boolean;
  rasi_chart?: string;
  amsam_chart?: string;
  lagnam?: string;
  dasa?: string;
  birth_place?: string;
  birth_time?: string;
  matchScore?: number;
}

export interface Interest {
  id: number;
  from_id: number;
  to_id: number;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
  name?: string;
  photos?: string;
}
