export interface BrandSettings {
  id?: string;
  user_id?: string;
  name: string;
  logo_url?: string;
  country_code: string;
  currency_code: string;
  timezone: string;
  language: string;
  created_at?: string;
  updated_at?: string;
}

export interface SocialSettings {
  id?: string;
  user_id?: string;
  instagram?: string;
  facebook?: string;
  website?: string;
  youtube?: string;
  tiktok?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SurveySettings {
  id?: string;
  user_id?: string;
  general_url?: string;
  orders_url?: string;
  reservations_url?: string;
  created_at?: string;
  updated_at?: string;
}
