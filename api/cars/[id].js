// api/cars/[id].js
import { getServiceSupabase, setCorsHeaders } from '../../lib/supabase.js';

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
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({ error: 'No car ID provided' });
    }

    const supabase = getServiceSupabase();
    
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Car not found' });
      }
      throw error;
    }
    
    // Transform data
    const car = {
      id: data.id,
      make: data.make,
      model: data.model,
      year: data.year,
      price: data.price,
      body: data.body,
      fuel: data.fuel,
      mileage: data.mileage,
      transmission: data.transmission,
      description: data.description,
      image: data.images?.[0] || 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800',
      images: data.images?.join(',') || ''
    };
    
    return res.status(200).json({ 
      success: true, 
      data: car 
    });
    
  } catch (error) {
    console.error('Error fetching car:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch car' 
    });
  }
}