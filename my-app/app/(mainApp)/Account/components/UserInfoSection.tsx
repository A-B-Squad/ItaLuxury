import { formatDate } from "@/app/Helpers/_formatDate";
import { FiUser, FiMail, FiPhone, FiCalendar, FiEdit2 } from "react-icons/fi";

interface UserInfoSectionProps {
    user: any;
}

const UserInfoSection = ({ user }: UserInfoSectionProps) => {
    const userInfo = [
        {
            icon: FiUser,
            label: "Nom complet",
            value: user?.fullName || "Non renseigné",
            editable: true,
        },
        {
            icon: FiMail,
            label: "Email",
            value: user?.email || "Non renseigné",
            editable: true,
        },
        {
            icon: FiPhone,
            label: "Téléphone",
            value: user?.number || "Non renseigné",
            editable: true,
        },
        {
            icon: FiCalendar,
            label: "Date d'inscription",
            value: user?.createdAt ? formatDate(user.createdAt) : "Non disponible",
            editable: false,
        },
    ];

    return (
        <div className="space-y-3">
            {userInfo.map((item, index) => {
                const Icon = item.icon;
                return (
                    <div
                        key={index}
                        className="group flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-100/50 transition-all duration-200"
                    >
                        <div className="flex items-center gap-4 flex-1">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-gray-600 border border-gray-200 group-hover:border-primaryColor/30 group-hover:text-primaryColor transition-all duration-200">
                                <Icon className="text-lg" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-gray-500 mb-1">
                                    {item.label}
                                </p>
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {item.value}
                                </p>
                            </div>
                        </div>

                    </div>
                );
            })}
        </div>
    );
};

export default UserInfoSection;