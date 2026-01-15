
import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Loader2, User, Sparkles } from 'lucide-react';
import { Review } from '../types';
import { foodAIService } from '../services/gemini';

interface ReviewSystemProps {
  reviews: Review[];
  onAddReview: (review: Omit<Review, 'id' | 'date'>) => void;
}

const ReviewSystem: React.FC<ReviewSystemProps> = ({ reviews, onAddReview }) => {
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [summary, setSummary] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  useEffect(() => {
    const fetchSummary = async () => {
      if (reviews.length > 0) {
        setLoadingSummary(true);
        const result = await foodAIService.getReviewSummary(reviews);
        setSummary(result);
        setLoadingSummary(false);
      }
    };
    fetchSummary();
  }, [reviews]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddReview({ userName: 'Guest User', rating: newRating, comment: newComment });
    setNewComment('');
    setNewRating(5);
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '0';

  return (
    <div className="space-y-8 pb-12">
      {/* AI Summary Section */}
      <div className="bg-orange-50 border border-orange-100 rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Sparkles className="w-12 h-12 text-orange-500" />
        </div>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-orange-500" />
          <h4 className="text-sm font-bold text-orange-800 uppercase tracking-wider">AI Sentiment Summary</h4>
        </div>
        {loadingSummary ? (
          <div className="flex items-center gap-2 text-orange-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Analyzing community feedback...</span>
          </div>
        ) : (
          <p className="text-orange-900 leading-relaxed text-sm italic">
            "{summary}"
          </p>
        )}
      </div>

      {/* Ratings Overview */}
      <div className="flex flex-col md:flex-row gap-8 items-center bg-gray-50 rounded-3xl p-8 border border-gray-100">
        <div className="text-center">
          <div className="text-5xl font-extrabold text-gray-900 mb-2">{averageRating}</div>
          <div className="flex justify-center mb-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className={`w-5 h-5 ${s <= Math.round(Number(averageRating)) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
            ))}
          </div>
          <p className="text-sm text-gray-500 font-medium">{reviews.length} total reviews</p>
        </div>
        
        <div className="flex-1 w-full space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = reviews.filter(r => r.rating === rating).length;
            const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            return (
              <div key={rating} className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-600 w-3">{rating}</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${percentage}%` }} />
                </div>
                <span className="text-xs text-gray-400 w-8">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review Form */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
        <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-orange-500" />
          Write a Review
        </h4>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-gray-500 mr-2">Your rating:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setNewRating(star)}
                className="transition-all active:scale-90"
              >
                <Star 
                  className={`w-7 h-7 ${(hoverRating || newRating) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} 
                />
              </button>
            ))}
          </div>
          <textarea 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Tell us about your experience..."
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 min-h-[100px] text-sm text-black"
          />
          <button 
            type="submit"
            className="bg-orange-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-orange-600 transition-all shadow-md active:scale-95"
          >
            Submit Review
          </button>
        </form>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="p-6 bg-white border border-gray-100 rounded-2xl hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                  {review.userName.charAt(0)}
                </div>
                <div>
                  <h5 className="font-bold text-gray-900 text-sm">{review.userName}</h5>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`w-3 h-3 ${s <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                    ))}
                    <span className="text-[10px] text-gray-400 ml-2">{review.date}</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              {review.comment}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSystem;
