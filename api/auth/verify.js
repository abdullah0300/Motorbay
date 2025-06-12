// api/auth/verify.js
import { setCorsHeaders } from '../../lib/supabase.js';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        error: 'No token provided' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return res.status(200).json({ 
      success: true, 
      valid: true,
      role: decoded.role 
    });
    
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      valid: false,
      error: 'Invalid or expired token' 
    });
  }
}