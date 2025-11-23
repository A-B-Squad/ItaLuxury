import { FiShoppingBag, FiTrendingUp } from "react-icons/fi";
import PointsErrorState from "./PointsErrorState";
import SmallLoadingSpinner from "./SmallLoadingSpinner";

interface ProgressCardContentProps {
    pointsLoading: boolean;
    pointsError: any;
    pointSettingsData: any;
    userPoints: number;
}

const ProgressCardContent = ({
    pointsLoading,
    pointsError,
    pointSettingsData,
    userPoints,
}: ProgressCardContentProps) => {
    if (pointsLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <SmallLoadingSpinner />
            </div>
        );
    }

    if (pointsError) {
        return <PointsErrorState />;
    }

    const settings = pointSettingsData?.getPointSettings;
    if (!settings) {
        return null;
    }

    const progress = Math.min((userPoints / settings.minimumPointsToUse) * 100, 100);
    const remainingPoints = Math.max(settings.minimumPointsToUse - userPoints, 0);
    const conversionRate = settings.conversionRate
        ? (settings.conversionRate * 100).toFixed(1)
        : "X";

    return (
        <div className="space-y-6">
            {/* Progress Section */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primaryColor/10 rounded-full flex items-center justify-center">
                            <FiTrendingUp className="text-primaryColor text-sm" />
                        </div>
                        <span className="font-medium text-gray-900">Progression</span>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">{userPoints}</p>
                        <p className="text-xs text-gray-500">points gagnés</p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-primaryColor to-primaryColor/80 h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">
                            {progress >= 100 ? (
                                <span className="text-green-600 font-medium">✓ Objectif atteint!</span>
                            ) : (
                                <span>Plus que <span className="font-semibold text-primaryColor">{remainingPoints}</span> points</span>
                            )}
                        </span>
                        <span className="font-medium text-gray-700">
                            {settings.minimumPointsToUse} points
                        </span>
                    </div>
                </div>
            </div>

            {/* Info Card */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:border-primaryColor/30 transition-all duration-200">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primaryColor to-primaryColor/80 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-sm">
                        <FiShoppingBag className="text-xl" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1.5">
                            Achats en ligne
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Gagnez <span className="font-semibold text-primaryColor">{conversionRate}%</span> en points sur chaque achat effectué sur notre site.
                        </p>
                    </div>
                </div>
            </div>

            {/* Additional Info */}
            {progress >= 100 && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <p className="text-sm text-green-800 font-medium">
                        🎉 Félicitations! Vous pouvez maintenant utiliser vos points pour obtenir un bon d'achat.
                    </p>
                </div>
            )}
        </div>
    );
};

export default ProgressCardContent;