interface Review {
  rating: number;
  userId: string;
}
// Helper function to format rating
export const formatRating = (reviews: Review[]) => {
    const validReviews = reviews.filter(
      (review) => review.rating !== null && review.rating >= 0
    );
  
    if (validReviews.length === 0) {
      return null;
    }
  
    const sum = validReviews.reduce((total, review) => total + review.rating, 0);
    const average = (sum / validReviews.length).toFixed(1);
    const ratings = {
      5: validReviews.filter(r => r.rating === 5).length,
      4: validReviews.filter(r => r.rating === 4).length,
      3: validReviews.filter(r => r.rating === 3).length,
      2: validReviews.filter(r => r.rating === 2).length,
      1: validReviews.filter(r => r.rating === 1).length,
    };
  
    return {
      average: Number.parseFloat(average),
      best: 5,
      worst: 1,
      count: validReviews.length,
      distribution: ratings,
    };
  };