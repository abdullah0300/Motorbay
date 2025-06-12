// api/cars/list.js
import { getServiceSupabase, setCorsHeaders } from '../../lib/supabase.js';

export default async function handler(req, res) {
  // Set CORS headers
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabase = getServiceSupabase();
    
    // Get query parameters for filtering
    const { make, model, body, fuel, sort } = req.query;
    
    // Build query
    let query = supabase
      .from('cars')
      .select('*');
    
    // Apply filters if provided
    if (make) query = query.eq('make', make);
    if (model) query = query.eq('model', model);
    if (body) query = query.eq('body', body);
    if (fuel) query = query.eq('fuel', fuel);
    
    // Apply sorting
    switch (sort) {
      case 'price-low':
        query = query.order('price', { ascending: true });
        break;
      case 'price-high':
        query = query.order('price', { ascending: false });
        break;
      case 'newest':
        query = query.order('year', { ascending: false });
        break;
      default:
        query = query.order('created_at', { ascending: false });
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // Transform data to match frontend expectations
    const cars = data.map(car => ({
      id: car.id,
      make: car.make,
      model: car.model,
      year: car.year,
      price: car.price,
      body: car.body,
      fuel: car.fuel,
      mileage: car.mileage,
      transmission: car.transmission,
      description: car.description,
      image: car.images?.[0] || 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800',
      images: car.images?.join(',') || ''
    }));
    
    return res.status(200).json({ 
      success: true, 
      data: cars,
      count: cars.length 
    });
    
  } catch (error) {
    console.error('Error fetching cars:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch cars' 
    });
  }
}