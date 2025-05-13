export interface Company {
  id: number;
  name: string;
  email: string;
  mobile?: string;
  created_at: string;
  updated_at: string;
}

export interface CompanyInsert {
  name: string;
  email: string;
  mobile?: string;
}
