import Testimonial from '@/models/Testimonial';
import TestimonialsManager from './TestimonialsManager';

export default async function AdminTestimonialsPage() {
  let initialReviews = [];

  try {
    const list = await Testimonial.findAll({
      order: [['created_at', 'DESC']]
    });
    initialReviews = list.map(t => t.toJSON());
  } catch (err) {
    console.error('Error fetching testimonials in AdminTestimonialsPage server component:', err);
  }

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">
          Testimonials & Reviews
        </h1>
        <p className="text-sm text-gray-400 font-semibold">
          Synchronize authentic Google Reviews or manage custom client testimonials shown on your frontend.
        </p>
      </div>

      {/* Testimonials Management Panel */}
      <TestimonialsManager initialReviews={initialReviews} />

    </div>
  );
}
