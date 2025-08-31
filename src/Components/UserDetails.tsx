import { User, Phone, Award, Coins } from "lucide-react";
import { useBonusHistory } from "../api/scan";
import { useTranslation } from "react-i18next";

import { User as UserType } from '../context/AuthContext';

const UserDetails = ({
  user,
  totalPoints,
}: {
  user: UserType | null;
  totalPoints: number | undefined;
}) => {
  const { t } = useTranslation();
  const {
    data: bonusHistory,
    isLoading: bonusHistoryLoading,
    error,
  } = useBonusHistory();

  // Debug log to see what user data we're getting
  console.log('UserDetails - User Data:', user);
  
  // Extract user data from nested structure if needed
  const userData = user?.user || user;

  // Show loading state while bonus history is loading
  if (bonusHistoryLoading) {
    return (
      <div className="pt-4 space-y-4">
        <div className="flex items-center space-x-3 border-b border-gray-200 dark:border-gray-700 pb-3 text-gray-600 dark:text-gray-400">
          <div className="rounded-full p-1">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-gray-600 dark:text-gray-400">
              {userData?.first_name || t("no_name")}{" "}
              {userData?.last_name || t("no_last_name")}
            </h3>
          </div>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
          <span className="text-sm text-gray-500">{t("loading")}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return null;
  }

  if (!userData) {
    return (
      <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-600 dark:text-gray-400 text-sm">
            {t("guest")}
          </span>
          <div className="flex items-center space-x-1">
            <Award className="w-4 h-4 text-blue-500" />
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              {totalPoints} {t("bonus")}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-4 space-y-4">
      <div className="flex items-center space-x-3 border-b border-gray-200 dark:border-gray-700 pb-3  text-gray-600 dark:text-gray-400">
        <div className=" rounded-full p-1">
          <User className="w-4 h-4" />
        </div>
        <div>
          <h3 className=" text-gray-600 dark:text-gray-400">
            {user.first_name || t("no_name")}{" "}
            {user.last_name || t("no_last_name")}
          </h3>
        </div>
      </div>

      <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
        <Phone className="w-4 h-4" />
        <span className="text-sm">{user.phone || t("no_phone")}</span>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
          <Coins className="w-4 h-4" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {t("totalPoints")}
          </span>
        </div>
        <span className="font-semibold text-blue-500 dark:text-blue-400">
          {bonusHistory?.pages[0]?.total_bonuses || 0} {t("")}
        </span>
      </div>
    </div>
  );
};

export default UserDetails;
