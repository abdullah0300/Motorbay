// api/upload.js
import { getServiceSupabase, setCorsHeaders } from '../lib/supabase.js';
import jwt from 'jsonwebtoken';

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
    // Verify admin token
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { images } = req.body;
    
    if (!images || !Array.isArray(images)) {
      return res.status(400).json({ error: 'No images provided' });
    }

    const supabase = getServiceSupabase();
    const uploadedUrls = [];

    for (let i = 0; i < images.length; i++) {
      const base64Data = images[i];
      
      // Extract base64 data
      const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        continue;
      }

      const imageData = matches[2];
      const mimeType = matches[1];
      const extension = mimeType.split('/')[1] || 'jpg';
      
      // Generate unique filename
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${extension}`;
      
      // Convert base64 to buffer
      const buffer = Buffer.from(imageData, 'base64');
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('car-images')
        .upload(fileName, buffer, {
          contentType: mimeType,
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        continue;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('car-images')
        .getPublicUrl(fileName);

      uploadedUrls.push(publicUrl);
    }

    if (uploadedUrls.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Failed to upload any images' 
      });
    }

    return res.status(200).json({ 
      success: true, 
      urls: uploadedUrls 
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Upload failed',
      details: error.message 
    });
  }
}