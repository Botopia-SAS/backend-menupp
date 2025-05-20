// src/controllers/settingsController.ts
import fetch from 'node-fetch'
import { Request, Response } from 'express'
import {
  BrandSettings,
  SocialSettings,
  SurveySettings,
} from '../interfaces/settings'

/** REST API de Supabase (PostgREST) */
const REST_URL = `${process.env.SUPABASE_URL}/rest/v1`

/** Tu anon key, necesaria en cada llamada a PostgREST */
const ANON_KEY = process.env.SUPABASE_ANON_KEY!

/**
 * GET single row from <table> filtered by user_id (aplica RLS).
 */
async function fetchSingle<T>(
  table: string,
  userId: string,
  token: string
): Promise<{ data: T | null; error: any }> {
  const url = `${REST_URL}/${table}?select=*&user_id=eq.${userId}&limit=1`
  const res = await fetch(url, {
    headers: {
      apikey: ANON_KEY,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
  const body = await res.json()
  return {
    data: Array.isArray(body) && body.length > 0 ? (body[0] as T) : null,
    error: res.ok ? null : body,
  }
}

/**
 * UPSERT into <table> by user_id, devolviendo la fila.
 */
async function fetchUpsert<T>(
  table: string,
  payload: T,
  token: string
): Promise<{ data: T; error: any }> {
  const url = `${REST_URL}/${table}`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      apikey: ANON_KEY,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=representation',
    },
    body: JSON.stringify([payload]),
  })
  const body = await res.json()
  return {
    data: Array.isArray(body) && body.length > 0 ? (body[0] as T) : ({} as T),
    error: res.ok ? null : body,
  }
}

export async function getBrand(req: Request, res: Response) {
  const userId = req.userId!
  const token = (req.headers.authorization || '').split(' ')[1]
  const { data, error } = await fetchSingle<BrandSettings>(
    'brand_settings',
    userId,
    token
  )
  if (error) return res.status(400).json({ error })
  return res.json(data || {})
}

export async function upsertBrand(req: Request, res: Response) {
  const userId = req.userId!
  const token = (req.headers.authorization || '').split(' ')[1]
  const payload: BrandSettings = { ...(req.body as BrandSettings), user_id: userId }

  const { data, error } = await fetchUpsert<BrandSettings>(
    'brand_settings',
    payload,
    token
  )
  if (error) return res.status(400).json({ error })
  return res.json(data)
}

export async function getSocial(req: Request, res: Response) {
  const userId = req.userId!
  const token = (req.headers.authorization || '').split(' ')[1]
  const { data, error } = await fetchSingle<SocialSettings>(
    'social_settings',
    userId,
    token
  )
  if (error) return res.status(400).json({ error })
  return res.json(data || {})
}

export async function upsertSocial(req: Request, res: Response) {
  const userId = req.userId!
  const token = (req.headers.authorization || '').split(' ')[1]
  const payload: SocialSettings = { ...(req.body as SocialSettings), user_id: userId }

  const { data, error } = await fetchUpsert<SocialSettings>(
    'social_settings',
    payload,
    token
  )
  if (error) return res.status(400).json({ error })
  return res.json(data)
}

export async function getSurvey(req: Request, res: Response) {
  const userId = req.userId!
  const token = (req.headers.authorization || '').split(' ')[1]
  const { data, error } = await fetchSingle<SurveySettings>(
    'survey_settings',
    userId,
    token
  )
  if (error) return res.status(400).json({ error })
  return res.json(data || {})
}

export async function upsertSurvey(req: Request, res: Response) {
  const userId = req.userId!
  const token = (req.headers.authorization || '').split(' ')[1]
  const payload: SurveySettings = { ...(req.body as SurveySettings), user_id: userId }

  const { data, error } = await fetchUpsert<SurveySettings>(
    'survey_settings',
    payload,
    token
  )
  if (error) return res.status(400).json({ error })
  return res.json(data)
}
