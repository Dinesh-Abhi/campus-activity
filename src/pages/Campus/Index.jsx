import React, { useState, useMemo, useEffect, act } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GetCampusAppsUsageData } from "@/redux/college/actionCreator";
import MainConstants from "@/components/constants/MainConstants";
import CampusUsageChart from "./CampusUsageChart";
import ActivitiesTable from "./Activites";
import { SanchitDashboardTableData } from "@/redux/dashboard/actionCreator";

const ComingSoon = ({ label }) => (
    <div className="flex flex-col items-center justify-center h-64 sm:h-80 bg-white rounded-lg shadow-sm border mx-4 sm:mx-0">
        <div className="text-3xl sm:text-4xl mb-4">🚧</div>
        <div className="text-lg sm:text-xl font-semibold text-center px-4">{label} - Coming Soon!</div>
    </div>
);

const TABS = [
    { label: "Apps Usage", key: "apps" },
    { label: "Activities", key: "activities" },
    { label: "Faculty", key: "faculty" },
    { label: "Reports", key: "reports" },
];

const eventNames = [
    "TESSELLATOR", "BETAAL", "PRASHNAMANCH", "TOOFAAN", "TANTRIK", "TESSERACT",
];
const RANGE_OPTIONS = [
    { key: "1D", label: "Today", days: 1, color: "bg-orange-500" },
    { key: "1W", label: "1W", days: 7, color: "bg-orange-500" },
    { key: "1M", label: "1M", days: 30, color: "bg-orange-500" },
    { key: "3M", label: "3M", days: 90, color: "bg-orange-500" },
    { key: "6M", label: "6M", days: 180, color: "bg-orange-500" },
    { key: "1Y", label: "1Y", days: 365, color: "bg-orange-500" },
];

function flattenData(nested) {
    const today = new Date();
    const thisYear = today.getFullYear();
    const thisMonth = today.getMonth() + 1;

    return Object.entries(nested || {})
        .flatMap(([monthKey, daysObj]) => {
            // e.g. "december" → "December"
            const capMonth =
                monthKey.charAt(0).toUpperCase() +
                monthKey.slice(1).toLowerCase();

            // parse JS month index (0–11) then +1 → (1–12)
            const monthIndex =
                new Date(`${capMonth} 1, ${thisYear}`).getMonth() + 1;
            if (isNaN(monthIndex)) {
                console.warn(`Unrecognized month: ${monthKey}`);
                return [];
            }

            // if month comes *after* today's month, it must be last year
            const year = monthIndex > thisMonth ? thisYear - 1 : thisYear;

            return Object.entries(daysObj).map(([dayStr, counts]) => {
                const isoDate = `${year}-${String(monthIndex).padStart(2, "0")}-${dayStr}`;
                const dateObj = new Date(isoDate);
                return {
                    isoDate,
                    dateObj,
                    fullDate: `${dayStr} ${capMonth.toUpperCase()}`,
                    month: capMonth,
                    ...counts,
                };
            });
        })
        .sort((a, b) => a.dateObj - b.dateObj);
}

function getRangeData(flat, days, endDate) {
    let result = [];
    for (let i = days - 1; i >= 0; i--) {
        const d = new Date(endDate);
        d.setDate(endDate.getDate() - i);
        const isoDate = d.toISOString().slice(0, 10);
        const found = flat.find((x) => x.isoDate === isoDate);
        if (found) {
            result.push(found);
        } else {
            const dayNum = d.getDate().toString().padStart(2, "0");
            const monStr = d.toLocaleString("default", { month: "short" }).toUpperCase();
            let blankRow = {
                isoDate,
                dateObj: d,
                fullDate: `${dayNum} ${monStr}`,
                month: d.toLocaleString("default", { month: "long" }),
            };
            eventNames.forEach((ev) => (blankRow[ev] = 0));
            result.push(blankRow);
        }
    }
    return result;
}

const COLLEGE_THEMES = {
    default: {
        primary: "from-slate-900 to-slate-700",
        secondary: "from-orange-50 to-orange-100",
        accent: "bg-slate-600",
        text: "text-orange-600",
        border: "border-orange-200",
        hover: "hover:from-orange-600 hover:to-orange-500",
        glow: "shadow-orange-500/20",
        card: "bg-orange-50/70 backdrop-blur-sm border-orange-200/50",
    },
};

const EventUsageChartIndex = () => {
    const { college } = useParams();
    const dispatch = useDispatch();

    const COLLEGES_MAP = useMemo(() =>
        Object.values(MainConstants.COLLEGES).reduce((map, c) => {
            map[c.toLowerCase().replace(/\s/g, "")] = c;
            return map;
        }, {}), []);

    const displayCollege = COLLEGES_MAP[college] || college?.toUpperCase() || "College";

    const currentTheme = COLLEGE_THEMES[college?.toLowerCase()] || COLLEGE_THEMES.default;

    useEffect(() => {
        dispatch(GetCampusAppsUsageData(college));
    }, [college]);

    const [tableRange, setTableRange] = useState("today");

    useEffect(() => {
        dispatch(SanchitDashboardTableData(tableRange));
    }, [dispatch, tableRange]);

    const {
        getCampusAppUsageReducerData,
        getCampusAppUsageReducerLoading,
        tableSanchitData,
        tableSanchitDataLoading,
    } = useSelector((state) => ({
        getCampusAppUsageReducerData: state.getCampusAppUsageReducerRes.data,
        getCampusAppUsageReducerLoading: state.getCampusAppUsageReducerRes.loading,
        tableSanchitData: state.getSanchitTableReducerRes.data,
        tableSanchitDataLoading: state.getSanchitTableReducerRes.loading,
    }));

    // flatten and range logic here
    const flatData = useMemo(
        () => flattenData(getCampusAppUsageReducerData),
        [getCampusAppUsageReducerData]
    );

    const lastDate =
        flatData.length > 0 ? flatData[flatData.length - 1].dateObj : new Date();

    // Range control state
    const [selectedRange, setSelectedRange] = useState("1D");

    const dataForRange = useMemo(() => {
        const rangeObj = RANGE_OPTIONS.find((r) => r.key === selectedRange);
        if (!rangeObj) return [];
        return getRangeData(flatData, rangeObj.days, lastDate);
    }, [selectedRange, flatData, lastDate]);
    const [activeTab, setActiveTab] = useState("apps");

    // Range description helper
    const getRangeDescription = (key) => {
        switch (key) {
            case "1D": return "Today's campus analytics";
            case "1W": return "1 week campus analytics";
            case "1M": return "1 month campus analytics";
            case "3M": return "3 months campus analytics";
            case "6M": return "6 months campus analytics";
            case "1Y": return "1 year campus analytics";
            default: return "Campus analytics";
        }
    };

    const ChartSkeleton = () => (
        <div className="p-4 sm:p-8 bg-white/50 rounded-2xl sm:rounded-3xl shadow animate-pulse min-h-[320px] sm:min-h-[480px] mx-4 sm:mx-0">
            <div className="h-6 sm:h-8 bg-orange-200 rounded w-1/2 sm:w-1/3 mb-4"></div>
            <div className="space-y-3">
                <div className="h-4 sm:h-6 bg-orange-100 rounded w-full"></div>
                <div className="h-4 sm:h-6 bg-orange-100 rounded w-5/6"></div>
                <div className="h-4 sm:h-6 bg-orange-100 rounded w-2/3"></div>
                <div className="h-4 sm:h-6 bg-orange-100 rounded w-4/5"></div>
                <div className="h-4 sm:h-6 bg-orange-100 rounded w-full"></div>
            </div>
        </div>
    );

    // Filter activities for the current campus
    const activitiesForCurrentCampus = useMemo(() => {
        if (!tableSanchitData || !college) return [];
        return tableSanchitData.filter(
            (item) => (item.campus || "").toLowerCase().replace(/\s/g, "") === college.toLowerCase().replace(/\s/g, "")
        );
    }, [tableSanchitData, college]);

    const filteredByCampus = useMemo(() => {
        if (!tableSanchitData || !college) return [];
        return tableSanchitData.filter(
            (a) =>
                (a.campus || "").toLowerCase().replace(/\s/g, "") ===
                (college || "").toLowerCase().replace(/\s/g, "")
        );
    }, [tableSanchitData, college]);

    return (
        <div className={`min-h-screen bg-gradient-to-br ${currentTheme.secondary} relative overflow-hidden`}>
            <div className="relative z-10 max-w-8xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-2">
                {/* Mobile-friendly Tabs */}
                <div className="mb-6 sm:mb-8">
                    {/* Mobile: Horizontal scrollable tabs */}
                    <div className="sm:hidden border-b border-gray-200">
                        <nav className="-mb-px flex space-x-2 overflow-x-auto scrollbar-hide px-2">
                            {TABS.map((tab) => (
                                <button
                                    key={tab.key}
                                    className={`flex-shrink-0 px-3 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.key
                                        ? "border-orange-500 text-orange-600"
                                        : "border-transparent text-gray-500 hover:text-orange-600"
                                        }`}
                                    onClick={() => setActiveTab(tab.key)}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Desktop: Regular tabs */}
                    <div className="hidden sm:block border-b border-gray-200">
                        <nav className="-mb-px flex space-x-4">
                            {TABS.map((tab) => (
                                <button
                                    key={tab.key}
                                    className={`px-4 py-2 text-base font-medium border-b-2 transition-colors ${activeTab === tab.key
                                        ? "border-orange-500 text-orange-600"
                                        : "border-transparent text-gray-500 hover:text-orange-600"
                                        }`}
                                    onClick={() => setActiveTab(tab.key)}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Tab Content with mobile-friendly padding */}
                <div className="px-1 sm:px-0">
                    {activeTab === "apps" && (
                        <div className="mx-2 sm:mx-0">
                            <CampusUsageChart
                                loading={getCampusAppUsageReducerLoading}
                                data={dataForRange}
                                eventNames={eventNames}
                                selectedRange={selectedRange}
                                setSelectedRange={setSelectedRange}
                                rangeOptions={RANGE_OPTIONS}
                                displayCollege={displayCollege}
                                rangeDescription={getRangeDescription(selectedRange)}
                                theme={currentTheme}
                            />
                        </div>
                    )}

                    {activeTab === "activities" && (
                        <div className="px-2 sm:px-0">
                            <ComingSoon label="Activities" />
                        </div>
                    )}

                    {activeTab === "faculty" && (
                        <div className="px-2 sm:px-0">
                            <ComingSoon label="Faculty" />
                        </div>
                    )}

                    {activeTab === "reports" && (
                        <div className="px-2 sm:px-0">
                            <ComingSoon label="Reports" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventUsageChartIndex;