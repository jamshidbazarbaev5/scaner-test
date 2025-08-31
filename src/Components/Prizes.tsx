import { Trophy, Sparkles, Star, Calendar, Gift, Award } from "lucide-react";
import { useTranslation } from "react-i18next";
import { usePrizes } from "../api/prizes.ts";

interface Prize {
  exchanged_bonus: string;
  prize: string;
  created_at: string;
}

export const Prizes = () => {
  const { data, isLoading, error } = usePrizes();
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">{t("loading")}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">
          {t("error")}: {(error as Error).message}
        </div>
      </div>
    );
  }

  const prizes = data?.results || [];
  const totalExchanged = data?.total_exchanged_bonus || 0;

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-md mx-auto">
        {/* Animated Header Section */}
        <div className="relative mb-12 pt-8">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <Star className="w-4 h-4 text-yellow-400 absolute top-2 left-8 animate-ping" />
            <Sparkles className="w-5 h-5 text-blue-400 absolute bottom-4 left-16 animate-pulse" />
            <Trophy className="w-6 h-6 text-purple-400 absolute top-2 right-8 animate-bounce" />
          </div>

          <div className="text-center relative z-10">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient-x">
              {t("myPrizes")}
            </h1>
            <div className="mt-2 flex items-center justify-center gap-2">
              <Trophy className="w-5 h-5 text-blue-500" />
              <span className="text-gray-600 dark:text-gray-400">
                {totalExchanged} {t("points")}
              </span>
            </div>
          </div>
        </div>

        {/* Prize Cards */}
        <div className="space-y-4">
          {prizes.map((prize: Prize, index: number) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm
                     border border-gray-200 dark:border-gray-700"
            >
              {/* Top Section */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Gift className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t("exchangedPoints")}
                    </p>
                    <p className="font-bold text-gray-900 dark:text-white">
                      {prize.exchanged_bonus} {t("points")}
                    </p>
                  </div>
                </div>
                <Award className="w-8 h-8 text-purple-500 dark:text-purple-400" />
              </div>

              {/* Bottom Section */}
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <div
                  className="font-semibold text-blue-600 dark:text-blue-400
                              flex items-center space-x-2"
                >
                  <Trophy className="w-5 h-5" />
                  <span>{prize.prize}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(prize.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Footer Message */}
        <div
          className="mt-8 p-4 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50
                              dark:from-blue-900/30 dark:via-purple-900/30 dark:to-pink-900/30
                              rounded-lg text-center relative overflow-hidden"
        >
          <Sparkles className="w-5 h-5 text-yellow-400 absolute top-2 left-4 animate-pulse" />
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
            {t("accumulate")}
          </p>
          <Sparkles className="w-5 h-5 text-yellow-400 absolute bottom-2 right-4 animate-pulse" />
        </div>
      </div>
    </div>
  );
};
