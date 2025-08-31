import { Trophy, Sparkles, Star } from "lucide-react";
import { getTariffs } from "../api/tarifi";
import { useTranslation } from "react-i18next";

interface Tariff {
  id: number;
  bonus: string;
  prize: string;
}

export const Tariffs = () => {
  const { data, isLoading, error } = getTariffs();
  console.log("Tariffs loaded", data);
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

  const tariffs = data?.results || [];

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-8 relative">
          <div className="relative">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              {t("tariffs")}
            </h1>
            <div className="absolute -bottom-2 w-full h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transform scale-x-0 animate-scale-x group-hover:scale-x-100 transition-transform"></div>
            <Star className="w-4 h-4 text-yellow-400 absolute -top-2 -left-4 animate-pulse" />
          </div>
          <div className="relative">
            <Trophy className="w-8 h-8 text-blue-500 animate-bounce" />
            <Sparkles className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
          </div>
        </div>

        <div className="space-y-4">
          {tariffs.map((tariff: Tariff) => (
            <div
              key={tariff.id}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {/* <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                        <span className="text-blue-600 dark:text-blue-400 font-semibold">
                                            {tariff.id}
                                        </span>
                                    </div> */}
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {t("required")}
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {tariff.bonus} {t("points")}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {t("prize")}
                  </span>
                  <div className="font-bold text-blue-600 dark:text-blue-400">
                    {tariff.prize.includes("сум") ? (
                      tariff.prize
                    ) : (
                      <span className="flex items-center gap-2">
                        <Trophy className="w-4 h-4" />
                        {tariff.prize}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {/*<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">*/}
              {/*  <div*/}
              {/*    className="bg-blue-500 dark:bg-blue-600 h-2 rounded-full"*/}
              {/*    style={{*/}
              {/*      width: `${parseFloat(tariff.bonus) / 3}%`,*/}
              {/*    }}*/}
              {/*  />*/}
              {/*</div>*/}
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/50 rounded-lg">
          <p className="text-sm text-center text-blue-600 dark:text-blue-400">
            {t("accumulate")}
          </p>
        </div>
      </div>
    </div>
  );
};
