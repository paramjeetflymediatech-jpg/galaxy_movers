'use client';

import { useState, useEffect } from 'react';
import { Star, MessageSquare, User } from 'lucide-react';

export default function Testimonials() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [reviews, setReviews] = useState([
    {
      name: 'Sarah Johnson',
      location: 'Vancouver, BC',
      rating: 5,
      date: 'April 2026',
      content: 'Galaxy Movers made our cross-country move completely stress-free! The team was professional, punctual, and handled our belongings with extreme care. Highly recommend!'
    },
    {
      name: 'Michael Chen',
      location: 'Toronto, ON',
      rating: 5,
      date: 'March 2026',
      content: 'Best moving experience ever! They packed everything perfectly, nothing was damaged, and they even assembled our furniture at the new place. Worth every penny.'
    },
    {
      name: 'Emily Rodriguez',
      location: 'Calgary, AB',
      rating: 5,
      date: 'April 2026',
      content: 'Amazing service from start to finish. The quote was accurate, no hidden fees, and the movers were incredibly efficient. Made our office relocation seamless!'
    },
    {
      name: 'David Thompson',
      location: 'Montreal, QC',
      rating: 5,
      date: 'February 2026',
      content: 'I was worried about moving my antique furniture, but Galaxy Movers handled everything with such care. They exceeded all my expectations. Thank you!'
    },
    {
      name: 'Jessica Kim',
      location: 'Ottawa, ON',
      rating: 5,
      date: 'May 2026',
      content: 'Professional, friendly, and super efficient! They completed our move faster than expected and everything arrived in perfect condition. 10/10 would use again!'
    }
  ]);

  useEffect(() => {
    async function fetchActiveReviews() {
      try {
        const res = await fetch('/api/testimonials');
        const data = await res.json();
        if (data.success && data.reviews && data.reviews.length > 0) {
          setReviews(data.reviews);
        }
      } catch (err) {
        console.error('Error fetching dynamic reviews:', err);
      }
    }
    fetchActiveReviews();
  }, []);

  const currentReview = reviews[activeIdx] || reviews[0] || {};

  return (
    <section id="testimonials" className="bg-gray-50 py-20 lg:py-28 relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-red-600 font-extrabold text-xs uppercase tracking-widest bg-red-50 py-1.5 px-3.5 rounded-full inline-block">
            Customer Love
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Loved by Thousands Across Canada
          </h2>
          <div className="w-12 h-1 bg-red-600 mx-auto rounded-full"></div>
          <p className="text-base text-gray-500 font-medium">
            See why families and businesses trust Galaxy Movers for safe, transparent, and seamless relocations.
          </p>
        </div>

        {/* Tabbed Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
          
          {/* Review List Navigation (Left) */}
          <div className="lg:col-span-4 space-y-3">
            {reviews.map((review, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIdx(idx)}
                type="button"
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between cursor-pointer ${
                  activeIdx === idx
                    ? 'bg-white border-red-200 shadow-md shadow-red-600/5 -translate-x-1.5'
                    : 'bg-white/50 hover:bg-white border-gray-100 hover:border-gray-200'
                }`}
              >
                <div className="flex flex-col">
                  <span className="font-extrabold text-sm text-gray-900">{review.name}</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                    {review.location}
                  </span>
                </div>
                <div className="flex items-center text-amber-400">
                  <Star className="h-3.5 w-3.5 fill-amber-400" />
                  <span className="text-xs font-black ml-1 text-gray-700">5.0</span>
                </div>
              </button>
            ))}
          </div>

          {/* Active Review View (Right Card) */}
          <div className="lg:col-span-8 bg-white border border-gray-100 rounded-2xl p-8 md:p-10 shadow-lg shadow-gray-200/40 relative min-h-[300px] flex flex-col justify-between">
            {/* Top quote icon decoration */}
            <div className="absolute top-6 right-6 text-red-50/70 p-2">
              <MessageSquare className="h-12 w-12 fill-red-50/50 stroke-[1.5]" />
            </div>

            <div className="space-y-6 relative z-10">
              {/* Stars Row */}
              <div className="flex items-center space-x-1">
                {[...Array(currentReview.rating || 5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-base sm:text-lg text-gray-700 italic font-medium leading-relaxed">
                "{currentReview.content}"
              </p>
            </div>

            {/* Author Footer */}
            <div className="pt-6 mt-8 border-t border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gray-100 rounded-full border border-gray-200 overflow-hidden flex items-center justify-center shrink-0">
                  {currentReview.avatar_url ? (
                    <img src={currentReview.avatar_url} alt={currentReview.name} className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-4.5 w-4.5 text-gray-400" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-gray-900 text-base leading-snug">
                    {currentReview.name}
                  </span>
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-0.5">
                    Verified Relocation &bull; {currentReview.location}
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-red-650 bg-red-50 py-1.5 px-3.5 rounded-full border border-red-100 shrink-0">
                {currentReview.date}
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
