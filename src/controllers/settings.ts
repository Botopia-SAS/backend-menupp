import type { RequestHandler } from 'express';
import { supabase } from '../config/supabase';
import type { AuthRequest } from '../middleware/auth';

//  GET /settings/brand
export const getBrandSettings: RequestHandler = async (req, res, next) => {
  const { userId } = req as AuthRequest;
   try {
    const { data, error } = await supabase
      .from('brand_settings')
      .select('*')
      .eq('company_id', userId)
      .single();
    if (error) throw error;
    res.json({ settings: data });
  } catch (err: any) {
    next(err);
  }
};

//  POST /settings/brand
export const upsertBrandSettings: RequestHandler = async (req, res, next) => {
  const { userId } = req as AuthRequest;
  const payload = { company_id: userId, ...req.body };
  try {
    const { data, error } = await supabase
      .from('brand_settings')
      .upsert(payload, { onConflict: 'company_id' })
      .select()
      .single();
    if (error) throw error;
    res.json({ settings: data });
  } catch (err: any) {
    next(err);
  }
};

//  GET /settings/social
export const getSocialLinks: RequestHandler = async (req, res, next) => {
  const { userId } = req as AuthRequest;
  try {
    const { data, error } = await supabase
      .from('social_links')
      .select('*')
      .eq('company_id', userId)
      .single();
    if (error) throw error;
    res.json({ settings: data });
  } catch (err: any) {
    next(err);
  }
};

//  POST /settings/social
export const upsertSocialLinks: RequestHandler = async (req, res, next) => {
  const { userId } = req as AuthRequest;
  const payload = { company_id: userId, ...req.body };
  try {
    const { data, error } = await supabase
      .from('social_links')
      .upsert(payload, { onConflict: 'company_id' })
      .select()
      .single();
    if (error) throw error;
    res.json({ settings: data });
  } catch (err: any) {
    next(err);
  }
};

//  GET /settings/surveys
export const getSurveys: RequestHandler = async (req, res, next) => {
  const { userId } = req as AuthRequest;
  try {
    const { data, error } = await supabase
      .from('surveys')
      .select('*')
      .eq('company_id', userId)
      .single();
    if (error) throw error;
    res.json({ settings: data });
  } catch (err: any) {
    next(err);
  }
};

//  POST /settings/surveys
export const upsertSurveys: RequestHandler = async (req, res, next) => {
  const { userId } = req as AuthRequest;
  const payload = { company_id: userId, ...req.body };
  try {
    const { data, error } = await supabase
      .from('surveys')
      .upsert(payload, { onConflict: 'company_id' })
      .select()
      .single();
    if (error) throw error;
    res.json({ settings: data });
  } catch (err: any) {
    next(err);
  }
};
