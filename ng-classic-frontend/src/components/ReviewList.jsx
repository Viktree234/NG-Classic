'use client';
import { useState } from 'react';
import useSWR from 'swr';
import { createReview, listReviews } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

function Stars({ rating, interactive = false, onRate }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type={interactive ? 'button' : undefined}
          onClick={interactive ? () => onRate(n) : undefined}
          className={`text-lg leading-none ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'} ${n <= rating ? 'text-amber-400' : 'text-gray-200'}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function ReviewList({ productId }) {
  const { user } = useAuthStore();
  const { data, mutate } = useSWR(
    ['reviews', productId],
    ([, currentProductId]) => listReviews(currentProductId)
  );
  const reviews = data ?? [];

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmitting(true);
    try {
      await createReview({
        product_id: productId,
        username: user.username,
        rating,
        comment,
      });
      setComment('');
      setRating(5);
      setSubmitted(true);
      mutate();
    } catch (error) {
      alert(error.message || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h2 className="font-playfair text-2xl text-rose-900 mb-6">Reviews ({reviews.length})</h2>

      {reviews.length === 0 ? (
        <p className="text-gray-400 text-sm mb-8">No reviews yet. Be the first!</p>
      ) : (
        <div className="space-y-5 mb-10">
          {reviews.map(review => {
            const username = review.username ?? 'Customer';
            return (
              <div key={review.id} className="border border-gray-100 rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm text-gray-800">{username}</span>
                  <Stars rating={review.rating} />
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
              </div>
            );
          })}
        </div>
      )}

      {user && !submitted && (
        <div className="border border-rose-100 rounded-2xl p-6 bg-rose-50">
          <h3 className="font-medium text-rose-900 mb-4">Leave a Review</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Rating</label>
              <Stars rating={rating} interactive onRate={setRating} />
            </div>
            <textarea
              className="input-field resize-none"
              rows={3}
              placeholder="Share your experience..."
              value={comment}
              onChange={e => setComment(e.target.value)}
              required
            />
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      )}

      {submitted && (
        <p className="text-green-600 text-sm bg-green-50 border border-green-200 rounded-lg p-3">
          ✓ Thank you for your review!
        </p>
      )}

      {!user && (
        <p className="text-sm text-gray-400">
          <a href="/login" className="text-rose-600 hover:underline">Sign in</a> to leave a review.
        </p>
      )}
    </div>
  );
}
