// api/cars/delete.js
import { getServiceSupabase, setCorsHeaders } from '../../lib/supabase.js';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'DELETE') {
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

    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: 'No car ID provided' });
    }

    const supabase = getServiceSupabase();
    
    // First get the car to find its images
    const { data: car, error: fetchError } = await supabase
      .from('cars')
      .select('images')
      .eq('id', id)
      .single();
    
    if (fetchError) {
      return res.status(404).json({ error: 'Car not found' });
    }
    
    // Delete associated images from storage
    if (car.images && car.images.length > 0) {
      for (const imageUrl of car.images) {
        // Extract file path from URL
        const match = imageUrl.match(/car-images\/(.+)$/);
        if (match) {
          const filePath = match[1];
          await supabase.storage
            .from('car-images')
            .remove([filePath]);
        }
      }
    }
    
    // Delete the car record
    const { error: deleteError } = await supabase
      .from('cars')
      .delete()
      .eq('id', id);
    
    if (deleteError) throw deleteError;
    
    return res.status(200).json({ 
      success: true, 
      message: 'Car deleted successfully' 
    });
    
  } catch (error) {
    console.error('Error deleting car:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to delete car' 
    });
  }
}