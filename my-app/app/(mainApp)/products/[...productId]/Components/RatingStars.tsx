import { ADD_RATING_MUTATION } from '@/graphql/mutations';
import { GET_REVIEW_QUERY, GET_USER_REVIEW_QUERY } from '@/graphql/queries';
import { useLazyQuery, useMutation } from '@apollo/client';
import React, { useEffect, useState } from 'react'
import { FaStar } from 'react-icons/fa';

const RatingStars = ({ productId, userId, toast }: { productId: string, userId: string | undefined, toast: any }) => {

    const [getReviews] = useLazyQuery(GET_REVIEW_QUERY);
    const [getUserReviews] = useLazyQuery(GET_USER_REVIEW_QUERY);
    const [addRating] = useMutation(ADD_RATING_MUTATION);

    const [localRating, setLocalRating] = useState<number>(0);
    const [serverRating, setServerRating] = useState<number>(0);


    const [hover, setHover] = useState<any>(null);
    const [userReviews, setUserReviews] = useState<number>(0);
    const [reviews, setReviews] = useState<number>(0);
    const [oneStar, setOneStar] = useState<number>(0);
    const [twoStar, setTwoStar] = useState<number>(0);
    const [threeStar, setThreeStar] = useState<number>(0);
    const [fourStar, setFourStar] = useState<number>(0);
    const [fiveStar, setFiveStar] = useState<number>(0);

    // Add loading state for rating
    const [isRatingLoading, setIsRatingLoading] = useState(false);
    const handleRatingSubmit = async (currentIndex: number) => {


        setIsRatingLoading(true);
        setLocalRating(currentIndex);

        try {
            await addRating({
                variables: {
                    productId: productId,
                    userId: userId,
                    rating: currentIndex,
                },
            });
            // Refetch reviews after rating submission
            await getReviews({
                variables: { productId: productId }
            });
            await getUserReviews({
                variables: {
                    productId: productId,
                    userId: userId
                }
            });
            setServerRating(currentIndex);
            toast({
                title: "Notification d'ajout d'évaluation",
                description: `Merci d'avoir ajouté une évaluation.`,
                className: "bg-primaryColor text-white",
            });
        } catch (error) {
            console.error("Error submitting rating:", error);
            setLocalRating(serverRating); 

            toast({
                title: "Erreur",
                description: "Une erreur s'est produite lors de l'ajout de l'évaluation.",
                className: "bg-red-600 text-white",
            });
        } finally {
            setIsRatingLoading(false);
        }
    };

    useEffect(() => {
        getReviews({
            variables: { productId: productId },
            onCompleted: (data) => {
                setReviews(data.productReview.length);
                setOneStar(
                    data.productReview.filter(
                        (review: { rating: number }) => review?.rating === 1,
                    ).length,
                );
                setTwoStar(
                    data.productReview.filter(
                        (review: { rating: number }) => review?.rating === 2,
                    ).length,
                );
                setThreeStar(
                    data.productReview.filter(
                        (review: { rating: number }) => review?.rating === 3,
                    ).length,
                );
                setFourStar(
                    data.productReview.filter(
                        (review: { rating: number }) => review?.rating === 4,
                    ).length,
                );
                setFiveStar(
                    data.productReview.filter(
                        (review: { rating: number }) => review?.rating === 5,
                    ).length,
                );
            },
        });
        getUserReviews({
            variables: { productId: productId, userId: userId },
            onCompleted: (data) => {
                setUserReviews(data.productReview[0]?.rating);
            },
        });
    }, [localRating, serverRating]);



    return (
        <>

            <div className="Rating_stars flex space-x-2 mt-4 items-center">
                {[...Array(5)].map((_, index) => {
                    const currentIndex = index + 1;
                    return (
                        <label key={currentIndex}>
                            <input
                                className="hidden"
                                type="radio"
                                name="rating"
                                value={currentIndex}
                                onClick={() => handleRatingSubmit(currentIndex)}
                                disabled={isRatingLoading}
                            />
                            <FaStar
                                size={18}
                                className={`cursor-pointer ${isRatingLoading ? 'opacity-50' : ''}`}
                                color={
                                    currentIndex <= (hover || localRating || userReviews)
                                        ? "#f17e7e"
                                        : "grey"
                                }
                                onMouseEnter={() => setHover(currentIndex)}
                                onMouseLeave={() => setHover(null)}
                            />
                        </label>
                    );
                })}
                <h4 className="text-primaryColor text-sm">
                    {reviews} Commentaires
                </h4>
            </div>







            <div className="Rating mt-8 lg:w-4/5 w-full">
                <div >
                    <h3 className="text-lg font-bold text-primaryColor">
                        Note globale ({reviews})               </h3>
                    <div className="space-y-4 mt-6  md:w-full">
                        {[
                            { rating: 5, value: fiveStar },
                            { rating: 4, value: fourStar },
                            { rating: 3, value: threeStar },
                            { rating: 2, value: twoStar },
                            { rating: 1, value: oneStar },
                        ].map(({ rating, value }) => (
                            <div className="flex items-center gap-3" key={rating}>
                                <div className="flex items-center ">
                                    <p className="text-sm font-bold">{rating}.0</p>
                                    <FaStar
                                        size={20}
                                        className="text-primaryColor ml-1"
                                    />
                                </div>
                                <div className="relative bg-gray-400 rounded-md w-full h-2 ml-3">
                                    <div
                                        style={{
                                            width: `${(value / reviews) * 100 || 0}%`,
                                        }}
                                        className="h-full rounded bg-primaryColor"
                                    ></div>
                                </div>
                                <p className="text-sm font-bold ">
                                    {(value / reviews) * 100 || 0}%
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </>
    )
}

export default RatingStars


