// api/cars/create.js
import { getServiceSupabase, setCorsHeaders } from '../../lib/supabase.js';
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

    const supabase = getServiceSupabase();
    const carData = req.body;
    
    // Transform images string to array
    const images = carData.images ? carData.images.split(',').filter(img => img) : [];
    
    // Insert car into database
    const { data, error } = await supabase
      .from('cars')
      .insert([{
        make: carData.make,
        model: carData.model,
        year: parseInt(carData.year),
        price: parseInt(carData.price),
        body: carData.body,
        fuel: carData.fuel,
        mileage: parseInt(carData.mileage) || 0,
        transmission: carData.transmission || 'Automatic',
        description: carData.description || 'No description available.',
        images: images
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    return res.status(201).json({ 
      success: true, 
      data: data,
      message: 'Car added successfully' 
    });
    
  } catch (error) {
    console.error('Error creating car:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to create car',
      details: error.message 
    });
  }
}