import { BiGift, BiPackage, BiTrendingDown, BiSolidTruck } from "react-icons/bi";

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
        case 'BUY_X_GET_Y_FREE': return <BiPackage size={20} />;
        case 'PERCENTAGE_OFF': return <BiTrendingDown size={20} />;
        case 'FIXED_AMOUNT_OFF': return <BiTrendingDown size={20} />;
        case 'FREE_DELIVERY': return <BiSolidTruck size={20} />;
        case 'FREE_GIFT': return <BiGift size={20} />;
        default: return <BiGift size={20} />;
    }
};

export const BundleDisplay = ({ applicableBundles, totalDiscount }: BundleDisplayProps) => {
    if (applicableBundles.length === 0) return null;

    const bundleColors = {
        'BUY_X_GET_Y_FREE': { bg: 'from-purple-50 to-pink-50', border: 'border-purple-200', icon: 'text-purple-600', badge: 'from-purple-500 to-pink-500' },
        'PERCENTAGE_OFF': { bg: 'from-orange-50 to-amber-50', border: 'border-orange-200', icon: 'text-orange-600', badge: 'from-orange-500 to-amber-500' },
        'FIXED_AMOUNT_OFF': { bg: 'from-red-50 to-rose-50', border: 'border-red-200', icon: 'text-red-600', badge: 'from-red-500 to-rose-500' },
        'FREE_DELIVERY': { bg: 'from-blue-50 to-cyan-50', border: 'border-blue-200', icon: 'text-blue-600', badge: 'from-blue-500 to-cyan-500' },
        'FREE_GIFT': { bg: 'from-green-50 to-emerald-50', border: 'border-green-200', icon: 'text-green-600', badge: 'from-green-500 to-emerald-500' },
    };

    return (
        <div className="mt-6 mb-4">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 p-[2px] shadow-2xl">
                <div className="relative rounded-2xl bg-white p-6">
                    {/* Decorative Background */}
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute inset-0" style={{
                            backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
                            backgroundSize: '24px 24px'
                        }}></div>
                    </div>

                    {/* Header */}
                    <div className="relative flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="absolute inset-0 bg-green-500 rounded-full blur-md opacity-50 animate-pulse"></div>
                                <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 text-white p-3 rounded-full shadow-lg">
                                    <BiGift size={24} className="animate-bounce" style={{ animationDuration: '2s' }} />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
                                    Offres Spéciales Activées
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {applicableBundles.length} promotion{applicableBundles.length > 1 ? 's' : ''} appliquée{applicableBundles.length > 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>

                        {totalDiscount > 0 && (
                            <div className="relative">
                                <div className="absolute inset-0 bg-amber-400 rounded-full blur-lg opacity-30 animate-pulse"></div>
                                <div className="relative bg-gradient-to-br from-amber-400 to-orange-500 text-white px-4 py-2 rounded-full shadow-lg">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-semibold">Économie</span>
                                        <span className="text-lg font-bold">{totalDiscount.toFixed(3)} TND</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Bundle Cards */}
                    <div className="relative space-y-3">
                        {applicableBundles.map((evaluation, idx) => {
                            const colors = bundleColors[evaluation.bundle.type as keyof typeof bundleColors] || bundleColors['BUY_X_GET_Y_FREE'];

                            return (
                                <div
                                    key={idx}
                                    className={`group relative bg-gradient-to-br ${colors.bg} border-2 ${colors.border} rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-default`}
                                >
                                    <div className="relative flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className={`relative flex-shrink-0`}>
                                                <div className={`absolute inset-0 ${colors.icon} opacity-20 rounded-lg blur-md animate-pulse`}></div>
                                                <div className={`relative ${colors.icon} bg-white p-3 rounded-lg shadow-sm`}>
                                                    {getBundleIcon(evaluation.bundle.type)}
                                                </div>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-gray-900 text-base mb-1 truncate">
                                                    {evaluation.bundle.name}
                                                </h4>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex items-center gap-1">
                                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                                        <span className="text-xs font-medium text-green-700 uppercase tracking-wide">
                                                            Actif
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-gray-400">•</span>
                                                    <p className="text-sm text-gray-700 font-medium">
                                                        {evaluation.message}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {evaluation.discount > 0 && (
                                            <div className="flex-shrink-0">
                                                <div className={`relative bg-gradient-to-br ${colors.badge} text-white px-4 py-2 rounded-lg shadow-lg`}>
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-xs font-semibold opacity-90">Économie</span>
                                                        <span className="text-lg font-bold leading-tight">
                                                            -{evaluation.discount.toFixed(3)}
                                                        </span>
                                                        <span className="text-xs font-semibold">TND</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-3 pt-3 border-t border-gray-200">
                                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                                            <span>Bundle appliqué avec succès</span>
                                            <span className="font-semibold text-green-600">100%</span>
                                        </div>
                                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-1000 ease-out"
                                                style={{ width: '100%' }}></div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer */}
                    <div className="relative mt-5 pt-4 border-t border-gray-200">
                        <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <div className="text-blue-600 mt-0.5">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-blue-800 font-medium">
                                    Ces promotions ont été automatiquement appliquées à votre panier.
                                    Les économies sont déjà prises en compte dans le total.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
