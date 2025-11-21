import { Button } from "@/components/ui/button";
import { ADD_REVIEWS_MUTATION } from "@/graphql/mutations";
import { GET_REVIEW_QUERY, GET_USER_REVIEW_QUERY } from "@/graphql/queries";
import { useLazyQuery, useMutation } from "@apollo/client";
import { Star, ChevronDown, ChevronUp } from "lucide-react";
import { memo, useCallback, useEffect, useState } from "react";
import { MdOutlineStar } from "react-icons/md";

interface RatingCounts {
    one: number;
    two: number;
    three: number;
    four: number;
    five: number;
}

interface RatingStarsProps {
    productId: string;
    userId?: string;
    toast: any;
}

interface Review {
    id: string;
    rating: number;
    comment?: string;
    userId?: string;
    userName?: string;
    createdAt?: string;
}

const RatingStars = memo(({ productId, userId, toast }: RatingStarsProps) => {
    const [getReviews] = useLazyQuery(GET_REVIEW_QUERY);
    const [getUserReviews] = useLazyQuery(GET_USER_REVIEW_QUERY);
    const [addRating] = useMutation(ADD_REVIEWS_MUTATION);

    const [serverRating, setServerRating] = useState<number>(0);
    const [hover, setHover] = useState<number | null>(null);
    const [reviews, setReviews] = useState<number>(0);
    const [ratings, setRatings] = useState<RatingCounts>({
        one: 0,
        two: 0,
        three: 0,
        four: 0,
        five: 0,
    });
    const [isRatingLoading, setIsRatingLoading] = useState<boolean>(false);
    const [comment, setComment] = useState<string>("");
    const [selectedRating, setSelectedRating] = useState<number | null>(null);
    const [showCommentForm, setShowCommentForm] = useState<boolean>(false);
    const [reviewsWithComments, setReviewsWithComments] = useState<Review[]>([]);

    // New state for pagination
    const [showAllComments, setShowAllComments] = useState<boolean>(false);
    const INITIAL_COMMENTS_COUNT = 2;

    const handleRatingSubmit = useCallback(async () => {
        if (!selectedRating) {
            return toast({
                title: "Sélectionnez une note",
                description: "Veuillez sélectionner une note avant de soumettre.",
                variant: "destructive",
            });
        }

        try {
            setIsRatingLoading(true);

            // Only logged in users can submit ratings with comments
            if (userId) {
                await addRating({
                    variables: {
                        productId,
                        userId,
                        rating: selectedRating,
                        comment: comment || undefined
                    },
                });
            } else {
                // Non-logged in users can only rate without comments
                await addRating({
                    variables: {
                        productId,
                        rating: selectedRating
                    },
                });
            }

            await getReviews({ variables: { productId } });
            if (userId) {
                await getUserReviews({ variables: { productId, userId } });
            }

            setServerRating(selectedRating);
            setComment("");
            setShowCommentForm(false);

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
    }, [addRating, getReviews, getUserReviews, productId, toast, userId, selectedRating, comment]);

    const handleMouseEnter = useCallback((index: number) => {
        setHover(index);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setHover(null);
    }, []);

    const toggleCommentForm = useCallback(() => {
        if (!userId) {
            toast({
                title: "Connexion requise",
                description: "Veuillez vous connecter pour laisser un commentaire.",
                className: "text-white bg-red-500",
            });
            return;
        }
        setShowCommentForm(prev => !prev);
    }, [userId, toast]);

    // New function to toggle show all comments
    const toggleShowAllComments = useCallback(() => {
        setShowAllComments(prev => !prev);
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

                    // Store reviews with comments
                    setReviewsWithComments(data.productReview);

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
            } catch (error) {
                console.error("Error fetching user review:", error);
            }
        };

        fetchReviews();
        fetchUserReview();
    }, [getReviews, getUserReviews, productId, userId, serverRating]);

    // Calculate average rating
    const averageRating = reviews === 0
        ? "0.0"
        : ((ratings.one * 1 + ratings.two * 2 + ratings.three * 3 + ratings.four * 4 + ratings.five * 5) /
            (reviews || 1)
        ).toFixed(1);

    // Filter reviews with comments and determine which ones to show
    const reviewsWithCommentsFiltered = reviewsWithComments.filter(review => review.comment);
    const displayedReviews = showAllComments
        ? reviewsWithCommentsFiltered
        : reviewsWithCommentsFiltered.slice(0, INITIAL_COMMENTS_COUNT);
    const hasMoreComments = reviewsWithCommentsFiltered.length > INITIAL_COMMENTS_COUNT;

    return (
        <div className="avis pt-2">

            {/* Header */}
            <div className="flex items-center">
                <MdOutlineStar size={18} className="text-yellow-500 mr-2" />
                <h2 className="text-xl font-semibold">Avis des clients</h2>
            </div>

            {/* Main rating display */}
            <div className="flex flex-col md:flex-row justify-etween items-start md:items-center px-5 mb-6 space-y-4 md:space-y-0 md:space-x-6 border-b pb-6">
                <div className="w-full flex flex-col sm:flex-row space-x-7">
                    {/* Left side - Average rating */}
                    <div className="flex flex-col justify-center items-center sm:border-r px-5 mb-4 sm:mb-0">
                        {reviews === 0 ? (
                            <>
                                <div className="text-xl font-medium text-gray-600">Nouveau produit</div>
                                <div className="flex mt-2">
                                    {[...Array(5)].map((_, index) => (
                                        <Star
                                            key={`avg-${index}`}
                                            size={24}
                                            className="stroke-gray-300"
                                        />
                                    ))}
                                </div>
                                <div className="text-sm text-gray-600 mt-1">En attente d'avis</div>
                            </>
                        ) : (
                            <>
                                <div className="text-4xl font-bold">{averageRating}</div>
                                <div className="flex mt-2">
                                    {[...Array(5)].map((_, index) => {
                                        const starValue = index + 1;
                                        return (
                                            <Star
                                                key={`avg-${index}`}
                                                size={24}
                                                className={`${starValue <= Math.floor(parseFloat(averageRating))
                                                    ? "fill-yellow-400 stroke-yellow-400"
                                                    : starValue <= parseFloat(averageRating)
                                                        ? "fill-yellow-400/50 stroke-yellow-400"
                                                        : "stroke-gray-300"
                                                    }`}
                                            />
                                        );
                                    })}
                                </div>
                                <div className="text-sm text-gray-600 mt-1">{reviews} avis</div>
                            </>
                        )}
                    </div>

                    {/* Right side - Rating distribution */}
                    <div className="flex-1 max-w-full sm:max-w-96 px-2 sm:px-0">
                        {reviews === 0 ? (
                            <div className="flex flex-col justify-center h-full">
                                <p className="text-gray-600 text-sm mb-2">Soyez le premier à évaluer ce produit</p>
                                <p className="text-gray-500 text-xs">Votre avis aide les autres clients à prendre des décisions d'achat éclairées.</p>
                            </div>
                        ) : (
                            [...Array(5)].map((_, i) => {
                                const rating = 5 - i;
                                const ratingKey = ["one", "two", "three", "four", "five"][rating - 1] as keyof RatingCounts;
                                const count = ratings[ratingKey];
                                const percentage = reviews > 0 ? ((count / reviews) * 100) : 0;

                                return (
                                    <div className="flex items-center gap-2 mb-2" key={rating}>
                                        <div className="flex items-center min-w-[60px]">
                                            <span className="text-sm">{rating} étoiles</span>
                                        </div>
                                        <div className="relative flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                style={{ width: `${percentage}%` }}
                                                className="absolute h-full bg-yellow-400 rounded-full"
                                            />
                                        </div>
                                        <div className="min-w-[20px] text-sm text-right">
                                            {count}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
                <div className="mr-10">
                    {/* Write review button */}
                    <Button
                        onClick={toggleCommentForm}
                        className="rounded-full border w-full sm:w-auto border-gray-300 bg-white text-black hover:bg-gray-100 ml-auto "
                    >
                        {reviews === 0 ? "Soyez le premier à évaluer" : "Écrire un commentaire"}
                    </Button>
                </div>
            </div>

            {/* Comment form */}
            {showCommentForm && (
                <div className="mb-8 p-6 border border-gray-200 rounded-lg">
                    <h3 className="text-lg font-medium mb-4">Votre avis</h3>

                    <div className="flex items-center mb-4">
                        <div className="mr-2 text-sm">Noter :</div>
                        <div className="flex">
                            {[...Array(5)].map((_, index) => {
                                const currentIndex = index + 1;
                                return (
                                    <button
                                        key={currentIndex}
                                        onClick={() => setSelectedRating(currentIndex)}
                                        disabled={isRatingLoading}
                                        className="relative p-1 bg-transparent border-none cursor-pointer focus:outline-none"
                                        aria-label={`Noter ${currentIndex} étoiles`}
                                    >
                                        <Star
                                            size={24}
                                            className={`transition-all duration-200 ${currentIndex <= (selectedRating || hover || 0)
                                                ? "fill-yellow-400 stroke-yellow-400"
                                                : "stroke-gray-300"
                                                }`}
                                            onMouseEnter={() => handleMouseEnter(currentIndex)}
                                            onMouseLeave={handleMouseLeave}
                                        />
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <textarea
                        placeholder="Partagez votre expérience avec ce produit..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full resize-none min-h-[100px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryColor focus:border-transparent mb-4"
                        disabled={isRatingLoading}
                    />

                    <div className="flex justify-end space-x-2">
                        <Button
                            onClick={() => setShowCommentForm(false)}
                            variant="outline"
                            disabled={isRatingLoading}
                        >
                            Annuler
                        </Button>
                        <Button
                            onClick={handleRatingSubmit}
                            disabled={isRatingLoading || !selectedRating}
                            className="bg-primaryColor hover:bg-primaryColor/90 text-white"
                        >
                            {isRatingLoading ? "Envoi en cours..." : "Publier"}
                        </Button>
                    </div>
                </div>
            )}

            {/* Reviews Section */}
            <div className="space-y-6">
                {displayedReviews.length > 0 ? (
                    <>
                        {displayedReviews.map(review => (
                            <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 mr-4">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                                            {review.userName ? review.userName.charAt(0).toUpperCase() : "U"}
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex space-x-3">
                                            <div className="flex justify-between flex-col border-r-2 pr-3">
                                                <div>
                                                    <span className="font-semibold">
                                                        {review.userName
                                                            ? `${review.userName.charAt(0)}${'*'.repeat(Math.max(0, review.userName.length - 2))}${review.userName.charAt(review.userName.length - 1)}`
                                                            : "Anonyme"}
                                                    </span>
                                                </div>
                                                <span className="-ml-2 text-xs font-light text-gray-500">
                                                    {new Date(review.createdAt || Date.now()).toLocaleDateString('fr-FR')}
                                                </span>
                                            </div>
                                            <div className="flex flex-col">
                                                <div className="flex items-center mt-1">
                                                    {[...Array(5)].map((_, index) => {
                                                        const starValue = index + 1;
                                                        return (
                                                            <Star
                                                                key={index}
                                                                size={16}
                                                                className={`${starValue <= review.rating
                                                                    ? "fill-yellow-400 stroke-yellow-400"
                                                                    : "stroke-gray-300"
                                                                    }`}
                                                            />
                                                        );
                                                    })}
                                                </div>
                                                <p className="text-gray-700 mt-2">{review.comment}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Show More/Less Button */}
                        {hasMoreComments && (
                            <div className="flex justify-center pt-4">
                                <Button
                                    onClick={toggleShowAllComments}
                                    variant="outline"
                                    className="flex items-center gap-2 border-gray-300 hover:bg-gray-50"
                                >
                                    {showAllComments ? (
                                        <>
                                            <ChevronUp size={16} />
                                            Voir moins
                                        </>
                                    ) : (
                                        <>
                                            <ChevronDown size={16} />
                                            Voir plus ({reviewsWithCommentsFiltered.length - INITIAL_COMMENTS_COUNT} autres avis)
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}
                    </>
                ) : (
                    <p className="text-gray-500 italic text-center py-8">
                        Aucun avis avec commentaire pour ce produit. Soyez le premier à partager votre expérience !
                    </p>
                )}
            </div>
        </div>
    );
});

export default RatingStars;