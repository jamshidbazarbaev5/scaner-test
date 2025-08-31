import {Loader, Button} from "@mantine/core";
import {useIntersection} from "@mantine/hooks";
import {useEffect, useRef, useState} from "react";
import {Coins, Calendar, X} from "lucide-react";
import {useBonusHistory} from "../api/scan";
import {useTranslation} from "react-i18next";

interface BonusesProps {
    onUpdatePoints: (points: number) => void;
}

export const Bonuses = ({onUpdatePoints}: BonusesProps) => {
    const [search, setSearch] = useState("");
    const [fromDate, setFromDate] = useState<Date | null>(null);
    const [toDate, setToDate] = useState<Date | null>(null);

    const {t} = useTranslation();
    const isValidDateRange = () => {
        if (fromDate && toDate) {
            return toDate >= fromDate;
        }
        return true;
    };

    const {
        data: bonusHistory,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useBonusHistory({
        search,
        from_date: fromDate?.toISOString().split("T")[0],
        to_date: toDate?.toISOString().split("T")[0],
    });

    const containerRef = useRef<HTMLDivElement>(null);
    const {ref, entry} = useIntersection({
        root: containerRef.current,
        threshold: 1,
    });

    useEffect(() => {
        if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [entry?.isIntersecting, fetchNextPage, hasNextPage, isFetchingNextPage]);

    useEffect(() => {
        if (!bonusHistory?.pages[0]) return;

        const totalBonuses =
            !fromDate && !toDate
                ? bonusHistory.pages[0]?.total_bonuses
                : bonusHistory.pages[0]?.filtered_total ??
                bonusHistory.pages[0]?.total_bonuses;

        if (typeof totalBonuses === "number") {
            onUpdatePoints(totalBonuses);
        }
    }, [bonusHistory?.pages, onUpdatePoints, fromDate, toDate]);

    const handleReset = () => {
        setSearch("");
        setFromDate(null);
        setToDate(null);
    };

    const allBonuses = bonusHistory?.pages.flatMap((page) => page.results) ?? [];
    const filteredBonuses = allBonuses;
    const displayTotalBonuses =
        !fromDate && !toDate
            ? bonusHistory?.pages[0]?.total_bonuses ?? 0
            : bonusHistory?.pages[0]?.filtered_total ??
            bonusHistory?.pages[0]?.total_bonuses ??
            0;

    return (
        <div className="max-w-md mx-auto p-4 space-y-4">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    {t("myBonuses")}
                </h1>
                <div className="text-base font-semibold text-blue-500 dark:text-blue-400">
                    {t("total")}: {displayTotalBonuses} {t("ball")}
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex gap-2">
                    <div className="flex-1 relative">
                        <input
                            type="date"
                            className="w-full h-[36px] px-3 py-1 pl-9 bg-gray-50 border border-gray-300
                            text-gray-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 
                            dark:bg-gray-700 dark:border-gray-600 dark:text-white 
                            dark:focus:ring-emerald-500 dark:focus:border-emerald-500
                            [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute
                            [&::-webkit-calendar-picker-indicator]:left-0 [&::-webkit-calendar-picker-indicator]:right-0
                            [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                            value={fromDate ? fromDate.toISOString().split("T")[0] : ""}
                            onChange={(e) => {
                                const newDate = e.target.value
                                    ? new Date(e.target.value)
                                    : null;
                                setFromDate(newDate);
                                if (newDate && toDate && toDate < newDate) {
                                    setToDate(null);
                                }
                            }}
                            max={toDate ? toDate.toISOString().split("T")[0] : undefined}
                        />
                        <Calendar
                            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400 pointer-events-none"/>
                    </div>
                    <div className="flex-1 relative">
                        <input
                            type="date"
                            className="w-full h-[36px] px-3 py-1 pl-9 bg-gray-50 border border-gray-300
                            text-gray-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 
                            dark:bg-gray-700 dark:border-gray-600 dark:text-white 
                            dark:focus:ring-emerald-500 dark:focus:border-emerald-500
                            [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute
                            [&::-webkit-calendar-picker-indicator]:left-0 [&::-webkit-calendar-picker-indicator]:right-0
                            [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                            value={toDate ? toDate.toISOString().split("T")[0] : ""}
                            onChange={(e) =>
                                setToDate(e.target.value ? new Date(e.target.value) : null)
                            }
                            min={fromDate ? fromDate.toISOString().split("T")[0] : undefined}
                        />
                        <Calendar
                            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400 pointer-events-none"/>
                    </div>
                </div>
                {(search || fromDate || toDate) && (
                    <Button
                        variant="subtle"
                        leftSection={<X size={16}/>}
                        onClick={handleReset}
                    >
                        {t("reset")}
                    </Button>
                )}
            </div>

            {filteredBonuses.map((bonus, index) => (
                <div
                    key={bonus.barcode_data + index}
                    className="flex items-start gap-3"
                >
                    <div
                        className="flex-shrink-0 w-10 h-10 bg-white-700 dark:bg-white-900/50 rounded-full flex items-center justify-center">
                        <Coins className="w-5 h-5 text-blue-500 dark:text-blue-400"/>
                    </div>
                    <div className="flex-grow min-w-0">
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <h3 className="font-medium text-gray-900 dark:text-gray-100 text-base">
                                    {t("bonus_code")}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {bonus.barcode_data}
                                </p>
                                <p className="text-sm text-gray-400 dark:text-gray-500">
                                    {new Date(bonus.created_at).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                <span className="font-medium whitespace-nowrap text-gray-900 dark:text-gray-100">
                  {Number(bonus.bonus)} {t("ball")}
                </span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {(isLoading || isFetchingNextPage) && (
                <div className="flex justify-center py-4">
                    <Loader size="sm"/>
                </div>
            )}

            <div ref={ref} className="h-4"/>

            {filteredBonuses.length === 0 && !isLoading && (
                <div className="text-center text-gray-500 dark:text-gray-400 py-6 text-sm">
                    {fromDate && toDate
                        ? !isValidDateRange()
                            ? t("invalidDateRange")
                            : t("noBonusesFound")
                        : t("loading")}
                </div>
            )}
        </div>
    );
};
