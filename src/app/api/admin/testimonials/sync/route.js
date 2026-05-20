import { NextResponse } from 'next/server';
import Testimonial from '@/models/Testimonial';

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    
    // Read from request parameters first (UX improvement), then fallback to environment variables
    const apiKey = body.apiKey || process.env.GOOGLE_PLACES_API_KEY;
    const placeId = body.placeId || process.env.GOOGLE_PLACE_ID;
    const isDemo = body.isDemo || false;

    // Support Demo Sync to simulate Google Reviews mapping
    if (isDemo) {
      const demoReviews = [
        {
          author_name: 'Robert Patterson',
          rating: 5,
          relative_time_description: '3 days ago',
          text: 'Absolutely fantastic moving service! The crew arrived right on time in Toronto, wrapped all our breakables meticulously, and got everything into our new place without a scratch. Price was exactly as quoted.',
          profile_photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
        },
        {
          author_name: 'Sophia Martinez',
          rating: 5,
          relative_time_description: '1 week ago',
          text: 'Highly recommend Galaxy Movers for long-distance relocations! They transported our entire household from Vancouver to Calgary in record time. Very communicative throughout the journey.',
          profile_photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
        },
        {
          author_name: 'William Vance',
          rating: 5,
          relative_time_description: '2 weeks ago',
          text: 'Super efficient office relocation team. We had over 30 workstations and delicate IT equipment. The packing and labeling system was perfect, and we were fully functional by Monday morning.',
          profile_photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop'
        }
      ];

      let syncedCount = 0;
      for (const review of demoReviews) {
        const google_review_id = `google_demo_${review.author_name.toLowerCase().replace(/\s+/g, '_')}`;
        await Testimonial.upsert({
          google_review_id,
          name: review.author_name,
          location: 'Google Review',
          content: review.text,
          avatar_url: review.profile_photo_url,
          rating: review.rating,
          date: review.relative_time_description,
          is_active: true
        });
        syncedCount++;
      }

      return NextResponse.json({
        success: true,
        message: `Successfully synchronized ${syncedCount} demo Google Reviews.`,
        rating: 5.0,
        total_reviews: 124
      });
    }

    if (!apiKey || !placeId || apiKey === 'your_google_api_key_here') {
      return NextResponse.json({ 
        success: false, 
        message: 'Google Places API configuration missing. Provide an API key and Place ID, or run in Demo Mode.' 
      }, { status: 400 });
    }

    // Call Google Places Details API
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
      return NextResponse.json({ 
        success: false, 
        message: `Google API Error: ${data.status}`,
        details: data.error_message
      }, { status: 400 });
    }

    const reviews = data.result.reviews || [];
    let syncedCount = 0;

    for (const review of reviews) {
      const google_review_id = `${review.author_name}_${review.time}`;
      
      await Testimonial.upsert({
        google_review_id,
        name: review.author_name,
        location: 'Google Review',
        content: review.text,
        avatar_url: review.profile_photo_url || null,
        rating: review.rating,
        date: review.relative_time_description || 'Recently',
        is_active: true
      });
      syncedCount++;
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully synchronized ${syncedCount} Google Reviews.`,
      rating: data.result.rating,
      total_reviews: data.result.user_ratings_total
    });

  } catch (error) {
    console.error('Google Reviews Sync Error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error during Google reviews synchronization.',
      error: error.message 
    }, { status: 500 });
  }
}
