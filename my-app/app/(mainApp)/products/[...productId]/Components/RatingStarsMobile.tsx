import { ADD_RATING_MUTATION } from "@/graphql/mutations";
import { GET_REVIEW_QUERY, GET_USER_REVIEW_QUERY } from "@/graphql/queries";
import { useLazyQuery, useMutation } from "@apollo/client";
import { Star } from "lucide-react";
import React, { useEffect, useState, useCallback, memo } from "react";
import { CiStar } from "react-icons/ci";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
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

const RatingStarsMobile = memo(({ productId, userId, toast }: RatingStarsProps) => {
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
    const [showRatingSection, setShowRatingSection] = useState<boolean>(false);

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

    const toggleRatingSection = useCallback(() => {
        setShowRatingSection(prev => !prev);
    }, []);

    useEffect(() => {
        getReviews({
            variables: { productId },
            onCompleted: (data) => {
                if (data?.productReview) {
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
                }
            },
        });

        if (userId) {
            getUserReviews({
                variables: { productId, userId },
                onCompleted: (data) => {
                    if (data?.productReview?.[0]) {
                        setUserReviews(data.productReview[0]?.rating || 0);
                    }
                },
            });
        }
    }, [getReviews, getUserReviews, productId, userId, serverRating]);

    // Calculate average rating
    const averageRating = reviews > 0
        ? ((ratings.one * 1 + ratings.two * 2 + ratings.three * 3 + ratings.four * 4 + ratings.five * 5) / reviews).toFixed(1)
        : "0.0";

    return (
        <div className="block lg:hidden mt-4 mb-6">
            <button
                className="flex items-center justify-between w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors duration-200 border border-gray-200"
                onClick={toggleRatingSection}
                aria-expanded={showRatingSection}
                aria-controls="rating-section"
            >
                <div className="flex items-center gap-2">
                    <CiStar size={20} className="text-primaryColor" />
                    <span className="font-medium text-gray-700">
                        {showRatingSection ? "Fermer les avis" : "Voir les avis"}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex items-center">
                        <span className="text-sm font-semibold text-gray-800 mr-1">{averageRating}</span>
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={14}
                                    className={i < Math.round(parseFloat(averageRating))
                                        ? "fill-yellow-400 stroke-yellow-400"
                                        : "stroke-gray-300"}
                                />
                            ))}
                        </div>
                    </div>
                    {showRatingSection ? <IoChevronUp size={18} /> : <IoChevronDown size={18} />}
                </div>
            </button>

            {showRatingSection && (
                <div
                    id="rating-section"
                    className="mt-3 p-4 bg-white rounded-md border border-gray-200 shadow-sm transition-all duration-300 animate-in fade-in-50"
                >
                    <div className="flex flex-col items-center mb-5">
                        <div className="text-2xl font-bold text-gray-800">{averageRating}</div>
                        <div className="flex items-center mt-1">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={16}
                                    className={i < Math.round(parseFloat(averageRating))
                                        ? "fill-yellow-400 stroke-yellow-400"
                                        : "stroke-gray-300"}
                                />
                            ))}
                        </div>
                        <span className="text-xs text-gray-500 mt-1">
                            {reviews} {reviews === 1 ? "avis" : "avis"}
                        </span>
                    </div>

                    <div className="border-t border-gray-100 pt-4 mb-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Votre évaluation</h3>
                        <div className="flex justify-center space-x-2">
                            {[...Array(5)].map((_, index) => {
                                const currentIndex = index + 1;
                                return (
                                    <button
                                        key={currentIndex}
                                        onClick={() => handleRatingSubmit(currentIndex)}
                                        disabled={isRatingLoading}
                                        className="relative p-1 bg-transparent border-none cursor-pointer focus:outline-none"
                                        aria-label={`Noter ${currentIndex} étoiles`}
                                    >
                                        <Star
                                            size={24}
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
                        {!userId && (
                            <p className="text-xs text-center text-gray-500 mt-2 italic">
                                Connectez-vous pour évaluer ce produit
                            </p>
                        )}
                        {isRatingLoading && (
                            <div className="text-xs text-center text-primaryColor mt-2">
                                Enregistrement de votre évaluation...
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
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
            )}
        </div>
    );
});


export default RatingStarsMobile;