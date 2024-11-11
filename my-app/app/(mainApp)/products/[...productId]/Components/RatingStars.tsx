import { ADD_RATING_MUTATION } from "@/graphql/mutations";
import { GET_REVIEW_QUERY, GET_USER_REVIEW_QUERY } from "@/graphql/queries";
import { useLazyQuery, useMutation } from "@apollo/client";
import { Star } from "lucide-react";
import React, { useEffect, useState } from "react";

const RatingStars = ({ productId, userId, toast }: { productId: string; userId: string | undefined; toast: any }) => {
    const [getReviews] = useLazyQuery(GET_REVIEW_QUERY);
    const [getUserReviews] = useLazyQuery(GET_USER_REVIEW_QUERY);
    const [addRating] = useMutation(ADD_RATING_MUTATION);
    const [serverRating, setServerRating] = useState<number>(0);

    const [hover, setHover] = useState<number | null>(null);
    const [userReviews, setUserReviews] = useState<number>(0);
    const [reviews, setReviews] = useState<number>(0);
    const [ratings, setRatings] = useState({
        one: 0,
        two: 0,
        three: 0,
        four: 0,
        five: 0,
    });
    const [isRatingLoading, setIsRatingLoading] = useState<boolean>(false);

    const handleRatingSubmit = async (currentIndex: number) => {
        if (!userId) {
            return toast({
                title: "Connectez-vous",
                description: "Vous devez être connecté pour évaluer.",
                className: "bg-red-600 text-white",
            });
        }

        try {
            setIsRatingLoading(true);
            await addRating({
                variables: { productId, userId, rating: currentIndex },
            });
            await Promise.all([getReviews({ variables: { productId } }), getUserReviews({ variables: { productId, userId } })]);
            setServerRating(currentIndex);
            toast({
                title: "Évaluation ajoutée",
                description: "Merci pour votre évaluation.",
                className: "bg-primaryColor text-white",
            });
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Une erreur est survenue lors de l'évaluation.",
                className: "bg-red-600 text-white",
            });
        } finally {
            setIsRatingLoading(false);
        }
    };

    useEffect(() => {
        getReviews({
            variables: { productId },
            onCompleted: (data) => {
                const totalReviews = data.productReview.length;
                setReviews(totalReviews);
                const ratingCounts = {
                    one: data.productReview.filter((review: { rating: number }) => review.rating === 1).length,
                    two: data.productReview.filter((review: { rating: number }) => review.rating === 2).length,
                    three: data.productReview.filter((review: { rating: number }) => review.rating === 3).length,
                    four: data.productReview.filter((review: { rating: number }) => review.rating === 4).length,
                    five: data.productReview.filter((review: { rating: number }) => review.rating === 5).length,
                };
                setRatings(ratingCounts);
            },
        });
        getUserReviews({
            variables: { productId, userId },
            onCompleted: (data) => {
                setUserReviews(data.productReview[0]?.rating || 0);
            },
        });
    }, [serverRating]);

    return (
        <div className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow-md p-3 mt-6">
            <div className="flex flex-col items-center space-y-4">
                {/* Star Rating Section */}
                <div className="flex items-center space-x-2">
                    {[...Array(5)].map((_, index) => {
                        const currentIndex = index + 1;
                        return (
                            <button
                                key={currentIndex}
                                onClick={() => handleRatingSubmit(currentIndex)}
                                disabled={isRatingLoading}
                                className="relative p-1 bg-transparent border-none cursor-pointer"
                            >
                                <Star
                                    size={20} // Reduced size
                                    className={`transition-all duration-200 ${currentIndex <= (hover || userReviews)
                                            ? "fill-yellow-400 stroke-yellow-400"
                                            : "stroke-gray-300"
                                        } ${isRatingLoading ? "opacity-50" : "hover:scale-110"}`}
                                    onMouseEnter={() => setHover(currentIndex)}
                                    onMouseLeave={() => setHover(null)}
                                />
                            </button>
                        );
                    })}
                </div>
                <span className="text-xs font-medium text-gray-600">{reviews} avis</span>

                {/* Rating Distribution */}
                <div className="w-full pt-1 border-t border-gray-100">
                    <h3 className="text-sm font-medium text-gray-800 text-center mb-4">Répartition des évaluations</h3>

                    <div className="space-y-3">
                        {[5, 4, 3, 2, 1].map((rating) => {
                            const ratingKey =
                                rating === 5
                                    ? "five"
                                    : rating === 4
                                        ? "four"
                                        : rating === 3
                                            ? "three"
                                            : rating === 2
                                                ? "two"
                                                : "one";
                            const percentage =
                                reviews > 0 ? ((ratings[ratingKey] / reviews) * 100).toFixed(1) : 0;

                            return (
                                <div className="flex items-center gap-2" key={rating}>
                                    <div className="flex items-center min-w-[50px]">
                                        <span className="font-medium text-gray-700">{rating}</span>
                                        <Star size={14} className="ml-1 fill-yellow-400 stroke-yellow-400" />
                                    </div>

                                    <div className="relative flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            style={{ width: `${percentage}%` }}
                                            className="absolute h-full bg-yellow-400 rounded-full transition-all duration-300"
                                        />
                                    </div>

                                    <div className="min-w-[50px] text-xs text-right text-gray-600">{percentage}%</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RatingStars;
