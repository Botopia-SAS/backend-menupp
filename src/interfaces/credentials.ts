export interface Credential {
  company_id: number;
  password_hash: string;
  reset_token?: string;
  reset_expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CredentialInsert {
  company_id: number;
  password_hash: string;
}
