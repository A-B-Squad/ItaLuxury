import { BiGift, BiPackage, BiTrendingDown, BiSolidTruck } from "react-icons/bi";
import { BsCheckCircleFill, BsInfoCircleFill } from "react-icons/bs";

interface BundleEvaluation {
    bundle: {
        type: string;
        name: string;
    };
    message: string;
    discount: number;
}

interface BundleDisplayProps {
    applicableBundles: BundleEvaluation[];
    totalDiscount: number;
}

const getBundleIcon = (type: string) => {
    switch (type) {
        case 'BUY_X_GET_Y_FREE': return <BiPackage size={24} className="md:w-6 md:h-6" />;
        case 'PERCENTAGE_OFF': return <BiTrendingDown size={24} className="md:w-6 md:h-6" />;
        case 'FIXED_AMOUNT_OFF': return <BiTrendingDown size={24} className="md:w-6 md:h-6" />;
        case 'FREE_DELIVERY': return <BiSolidTruck size={24} className="md:w-6 md:h-6" />;
        case 'FREE_GIFT': return <BiGift size={24} className="md:w-6 md:h-6" />;
        default: return <BiGift size={24} className="md:w-6 md:h-6" />;
    }
};

export const BundleDisplay = ({ applicableBundles, totalDiscount }: BundleDisplayProps) => {
    if (applicableBundles.length === 0) return null;

    const bundleColors = {
        'BUY_X_GET_Y_FREE': { 
            bg: 'from-purple-50 to-pink-50', 
            border: 'border-purple-200', 
            icon: 'text-purple-600', 
            badge: 'from-purple-500 to-pink-500',
            iconBg: 'bg-purple-100'
        },
        'PERCENTAGE_OFF': { 
            bg: 'from-orange-50 to-amber-50', 
            border: 'border-orange-200', 
            icon: 'text-orange-600', 
            badge: 'from-orange-500 to-amber-500',
            iconBg: 'bg-orange-100'
        },
        'FIXED_AMOUNT_OFF': { 
            bg: 'from-red-50 to-rose-50', 
            border: 'border-red-200', 
            icon: 'text-red-600', 
            badge: 'from-red-500 to-rose-500',
            iconBg: 'bg-red-100'
        },
        'FREE_DELIVERY': { 
            bg: 'from-blue-50 to-cyan-50', 
            border: 'border-blue-200', 
            icon: 'text-blue-600', 
            badge: 'from-blue-500 to-cyan-500',
            iconBg: 'bg-blue-100'
        },
        'FREE_GIFT': { 
            bg: 'from-green-50 to-emerald-50', 
            border: 'border-green-200', 
            icon: 'text-green-600', 
            badge: 'from-green-500 to-emerald-500',
            iconBg: 'bg-green-100'
        },
    };

    return (
        <div className="mt-4 md:mt-6 mb-3 md:mb-4">
            {/* Main Container with Gradient Border */}
            <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 p-[2px] shadow-lg md:shadow-2xl">
                <div className="relative rounded-xl md:rounded-2xl bg-white p-4 md:p-6">
                    {/* Decorative Background Pattern */}
                    <div className="absolute inset-0 opacity-5 pointer-events-none">
                        <div className="absolute inset-0" style={{
                            backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
                            backgroundSize: '24px 24px'
                        }}></div>
                    </div>

                    {/* Header Section */}
                    <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4 mb-4 md:mb-5">
                        <div className="flex items-center gap-2 md:gap-3">
                            {/* Animated Icon */}
                            <div className="relative flex-shrink-0">
                                <div className="absolute inset-0 bg-green-500 rounded-full blur-md opacity-50 animate-pulse"></div>
                                <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 text-white p-2 md:p-3 rounded-full shadow-lg">
                                    <BiGift size={20} className="md:w-6 md:h-6 animate-bounce" style={{ animationDuration: '2s' }} />
                                </div>
                            </div>
                            
                            {/* Title and Count */}
                            <div className="min-w-0">
                                <h3 className="text-base md:text-xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent leading-tight">
                                    Offres Activées
                                </h3>
                                <p className="text-xs md:text-sm text-gray-600 mt-0.5">
                                    {applicableBundles.length} promotion{applicableBundles.length > 1 ? 's' : ''} appliquée{applicableBundles.length > 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>

                        {/* Total Discount Badge */}
                        {totalDiscount > 0 && (
                            <div className="relative flex-shrink-0 w-full sm:w-auto">
                                <div className="absolute inset-0 bg-amber-400 rounded-full blur-lg opacity-30 animate-pulse"></div>
                                <div className="relative bg-gradient-to-br from-amber-400 to-orange-500 text-white px-3 md:px-4 py-2 rounded-full md:rounded-xl shadow-lg">
                                    <div className="flex items-center justify-center sm:justify-start gap-2">
                                        <span className="text-xs font-semibold">Économie totale:</span>
                                        <span className="text-lg md:text-xl font-bold">{totalDiscount.toFixed(3)} TND</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Bundle Cards Grid */}
                    <div className="relative space-y-2 md:space-y-3">
                        {applicableBundles.map((evaluation, idx) => {
                            const colors = bundleColors[evaluation.bundle.type as keyof typeof bundleColors] || bundleColors['BUY_X_GET_Y_FREE'];

                            return (
                                <div
                                    key={idx}
                                    className={`group relative bg-gradient-to-br ${colors.bg} border-2 ${colors.border} rounded-lg md:rounded-xl p-3 md:p-4 transition-all duration-300 hover:shadow-md md:hover:shadow-lg hover:scale-[1.01] md:hover:scale-[1.02]`}
                                >
                                    {/* Main Content */}
                                    <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4">
                                        {/* Icon and Content */}
                                        <div className="flex items-start gap-3 md:gap-4 flex-1 min-w-0 w-full sm:w-auto">
                                            {/* Bundle Icon */}
                                            <div className="relative flex-shrink-0">
                                                <div className={`absolute inset-0 ${colors.icon} opacity-20 rounded-lg blur-md animate-pulse`}></div>
                                                <div className={`relative ${colors.icon} ${colors.iconBg} p-2 md:p-3 rounded-lg shadow-sm`}>
                                                    {getBundleIcon(evaluation.bundle.type)}
                                                </div>
                                            </div>

                                            {/* Bundle Info */}
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-gray-900 text-sm md:text-base mb-1 line-clamp-2">
                                                    {evaluation.bundle.name}
                                                </h4>
                                                
                                                {/* Status and Message */}
                                                <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
                                                    <div className="flex items-center gap-1">
                                                        <BsCheckCircleFill className="w-3 h-3 text-green-500" />
                                                        <span className="text-[10px] md:text-xs font-semibold text-green-700 uppercase tracking-wide">
                                                            Actif
                                                        </span>
                                                    </div>
                                                    <span className="text-gray-300 hidden sm:inline">•</span>
                                                    <p className="text-xs md:text-sm text-gray-700 font-medium line-clamp-2 w-full sm:w-auto">
                                                        {evaluation.message}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Discount Badge */}
                                        {evaluation.discount > 0 && (
                                            <div className="flex-shrink-0 w-full sm:w-auto">
                                                <div className={`relative bg-gradient-to-br ${colors.badge} text-white px-3 md:px-4 py-2 rounded-lg shadow-md`}>
                                                    <div className="flex sm:flex-col items-center sm:items-center justify-between sm:justify-center gap-2 sm:gap-0">
                                                        <span className="text-xs font-semibold opacity-90">Économie</span>
                                                        <div className="flex items-baseline gap-1">
                                                            <span className="text-base md:text-lg font-bold">
                                                                -{evaluation.discount.toFixed(3)}
                                                            </span>
                                                            <span className="text-xs font-semibold">TND</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="mt-3 pt-3 border-t border-gray-200/50">
                                        <div className="flex items-center justify-between text-[10px] md:text-xs text-gray-600 mb-1.5">
                                            <span className="font-medium">Promotion appliquée</span>
                                            <span className="font-bold text-green-600">100%</span>
                                        </div>
                                        <div className="h-1.5 md:h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-1000 ease-out"
                                                style={{ width: '100%' }}
                                            >
                                                <div className="h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer Info */}
                    <div className="relative mt-4 md:mt-5 pt-3 md:pt-4 border-t border-gray-200">
                        <div className="flex items-start gap-2 md:gap-3 bg-blue-50 border border-blue-200 rounded-lg p-2.5 md:p-3">
                            <div className="text-blue-600 mt-0.5 flex-shrink-0">
                                <BsInfoCircleFill className="w-4 h-4 md:w-5 md:h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] md:text-xs text-blue-800 font-medium leading-relaxed">
                                    Ces promotions ont été automatiquement appliquées à votre panier.
                                    Les économies sont déjà incluses dans le total de votre commande.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
            `}</style>
        </div>
    );
};