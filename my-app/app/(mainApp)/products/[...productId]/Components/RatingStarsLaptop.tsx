import { ADD_RATING_MUTATION } from "@/graphql/mutations";
import { GET_REVIEW_QUERY, GET_USER_REVIEW_QUERY } from "@/graphql/queries";
import { useLazyQuery, useMutation } from "@apollo/client";
import { Star } from "lucide-react";
import React, { useEffect, useState, useCallback, memo } from "react";
import { useToast } from "@/components/ui/use-toast";

interface RatingCounts {
    one: number;
    two: number;
    three: number;
    four: number;
    five: number;
}

interface RatingStarsProps {
    productId: string;
    userId: string;
    toast: any;
}

interface Review {
    rating: number;
}

const RatingStarsLaptop = memo(({ productId, userId, toast }: RatingStarsProps) => {
    const [getReviews] = useLazyQuery(GET_REVIEW_QUERY);
    const [getUserReviews] = useLazyQuery(GET_USER_REVIEW_QUERY);
    const [addRating] = useMutation(ADD_RATING_MUTATION);

    const [serverRating, setServerRating] = useState<number>(0);
    const [hover, setHover] = useState<number | null>(null);
    const [userReviews, setUserReviews] = useState<number>(0);
    const [reviews, setReviews] = useState<number>(0);
    const [ratings, setRatings] = useState<RatingCounts>({
        one: 0,
        two: 0,
        three: 0,
        four: 0,
        five: 0,
    });
    const [isRatingLoading, setIsRatingLoading] = useState<boolean>(false);

    const handleRatingSubmit = useCallback(async (currentIndex: number) => {
        if (!userId) {
            return toast({
                title: "Connectez-vous",
                description: "Vous devez être connecté pour évaluer.",
                variant: "destructive",
            });
        }

        try {
            setIsRatingLoading(true);
            await addRating({
                variables: { productId, userId, rating: currentIndex },
            });

            await Promise.all([
                getReviews({ variables: { productId } }),
                getUserReviews({ variables: { productId, userId } })
            ]);

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
                variant: "destructive",
            });
        } finally {
            setIsRatingLoading(false);
        }
    }, [addRating, getReviews, getUserReviews, productId, toast, userId]);

    const handleMouseEnter = useCallback((index: number) => {
        setHover(index);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setHover(null);
    }, []);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const { data } = await getReviews({
                    variables: { productId }
                });

                if (data?.productReview) {
                    const totalReviews = data.productReview.length;
                    setReviews(totalReviews);

                    const ratingCounts = {
                        one: data.productReview.filter((review: Review) => review.rating === 1).length,
                        two: data.productReview.filter((review: Review) => review.rating === 2).length,
                        three: data.productReview.filter((review: Review) => review.rating === 3).length,
                        four: data.productReview.filter((review: Review) => review.rating === 4).length,
                        five: data.productReview.filter((review: Review) => review.rating === 5).length,
                    };
                    setRatings(ratingCounts);
                }
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };

        const fetchUserReview = async () => {
            if (!userId) return;

            try {
                const { data } = await getUserReviews({
                    variables: { productId, userId }
                });

                if (data?.productReview?.[0]) {
                    setUserReviews(data.productReview[0].rating || 0);
                }
            } catch (error) {
                console.error("Error fetching user review:", error);
            }
        };

        fetchReviews();
        fetchUserReview();
    }, [getReviews, getUserReviews, productId, userId, serverRating]);

    // Calculate average rating
    const averageRating = (
        (ratings.one * 1 + ratings.two * 2 + ratings.three * 3 + ratings.four * 4 + ratings.five * 5) /
        (reviews || 1)
    ).toFixed(1);

    return (
        <div className="flex flex-col w-full max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-6">
            {/* Average Rating Display */}
            <div className="flex items-center justify-center mb-6">
                <div className="flex flex-col items-center">
                    <div className="text-3xl font-bold text-gray-800">{averageRating}</div>
                    <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, index) => (
                            <Star
                                key={`avg-${index}`}
                                size={16}
                                className={`${index + 1 <= Math.round(parseFloat(averageRating))
                                        ? "fill-yellow-400 stroke-yellow-400"
                                        : "stroke-gray-300"
                                    }`}
                            />
                        ))}
                    </div>
                    <span className="text-xs font-medium text-gray-500 mt-1">
                        {reviews} {reviews === 1 ? "avis" : "avis"}
                    </span>
                </div>
            </div>

            {/* Your Rating Section */}
            <div className="flex flex-col items-center mb-6 pb-6 border-b border-gray-100">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Votre évaluation</h3>
                <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, index) => {
                        const currentIndex = index + 1;
                        return (
                            <button
                                key={currentIndex}
                                onClick={() => handleRatingSubmit(currentIndex)}
                                disabled={isRatingLoading}
                                className="relative p-1.5 bg-transparent border-none cursor-pointer focus:outline-none"
                                aria-label={`Noter ${currentIndex} étoiles`}
                            >
                                <Star
                                    size={24}
                                    className={`transition-all duration-200 ${currentIndex <= (hover || userReviews)
                                            ? "fill-yellow-400 stroke-yellow-400"
                                            : "stroke-gray-300"
                                        } ${isRatingLoading ? "opacity-50" : "hover:scale-110"}`}
                                    onMouseEnter={() => handleMouseEnter(currentIndex)}
                                    onMouseLeave={handleMouseLeave}
                                />
                            </button>
                        );
                    })}
                </div>
                {!userId && (
                    <p className="text-xs text-gray-500 mt-2 italic">
                        Connectez-vous pour évaluer ce produit
                    </p>
                )}
                {isRatingLoading && (
                    <div className="text-xs text-primaryColor mt-2">
                        Enregistrement de votre évaluation...
                    </div>
                )}
            </div>

            {/* Rating Distribution */}
            <div className="w-full">
                <h3 className="text-sm font-medium text-gray-700 mb-4">Répartition des évaluations</h3>

                <div className="space-y-2.5">
                    {[5, 4, 3, 2, 1].map((rating) => {
                        const ratingKey = ["one", "two", "three", "four", "five"][5 - rating] as keyof RatingCounts;
                        const count = ratings[ratingKey];
                        const percentage = reviews > 0 ? ((count / reviews) * 100).toFixed(0) : "0";

                        return (
                            <div className="flex items-center gap-2" key={rating}>
                                <div className="flex items-center min-w-[40px]">
                                    <span className="font-medium text-gray-700">{rating}</span>
                                    <Star size={14} className="ml-1 fill-yellow-400 stroke-yellow-400" />
                                </div>

                                <div className="relative flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        style={{ width: `${percentage}%` }}
                                        className={`absolute h-full rounded-full transition-all duration-300 ${parseInt(percentage) > 0 ? "bg-yellow-400" : "bg-gray-200"
                                            }`}
                                    />
                                </div>

                                <div className="min-w-[60px] text-xs text-right">
                                    <span className="font-medium text-gray-700">{count}</span>
                                    <span className="text-gray-500 ml-1">({percentage}%)</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
});


export default RatingStarsLaptop;