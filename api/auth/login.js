// api/auth/login.js
import { setCorsHeaders } from '../../lib/supabase.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    // For simplicity, we're using environment variables for admin credentials
    // In production, you should store hashed passwords in the database
    const adminPassword = process.env.ADMIN_PASSWORD || 'motorbay2025';
    
    // Simple password check (in production, use bcrypt to compare hashes)
    if (password !== adminPassword) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid password' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        role: 'admin',
        timestamp: Date.now()
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({ 
      success: true, 
      token,
      message: 'Authentication successful' 
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Authentication failed' 
    });
  }
}