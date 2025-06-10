import React, { useState, useEffect } from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, Rectangle, LabelList, Brush
} from "recharts";
import { APP_COLORS } from "@/components/constants/Color";
import Main from "@/components/custom/Main";

const Card = ({ children, className }) => (
    <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}>
        {children}
    </div>
);

const CardHeader = ({ children, className }) => (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>
);

const CardTitle = ({ children, className }) => (
    <h3 className={`text-base sm:text-md md:text-sm lg:text-xl xl:text-xl font-semibold leading-none tracking-tight ${className}`}>{children}</h3>
);

const CardDescription = ({ children, className }) => (
    <p className={`text-xs sm:text-sm md:text-sm text-muted-foreground ${className}`}>{children}</p>
);

const CardContent = ({ children, className }) => (
    <div className={`p-6 pt-0 ${className}`}>{children}</div>
);

// Skeleton Components
const SkeletonPulse = ({ className, style }) => (
    <div
        className={`bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse ${className}`}
        style={{
            ...style,
            animation: 'pulse 1.5s ease-in-out infinite alternate'
        }}
    />
);

const ChartSkeleton = ({ isMobile, isTablet, isLargeScreen, dimensions }) => {
    const getChartHeight = () => isMobile ? Math.max(250, dimensions.height * 0.4) : isTablet ? Math.max(350, dimensions.height * 0.45) : isLargeScreen ? Math.max(600, dimensions.height * 0.6) : 480;

    return (
        <div className="w-full" style={{ height: getChartHeight() }}>
            <div className={`${isMobile ? 'overflow-x-auto overflow-y-hidden' : ''} w-full h-full`}>
                <div style={{ width: isMobile ? '600px' : "100%", height: "100%", minWidth: isMobile ? '600px' : 'auto' }}>
                    {/* Simple Chart Box Skeleton */}
                    <SkeletonPulse
                        className="w-full h-full rounded-lg border border-gray-100"
                        style={{
                            animationDelay: '0.2s'
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

// --- Chart Components ---
const CustomBar = (props) => {
    const { x, y, width, height, value, fill, onClick } = props;
    return (
        <g onClick={() => onClick && onClick(value)}>
            <rect x={x} y={y} width={width} height={height} fill={fill} />
            {value === 0 && <circle cx={x + width / 2} cy={y - 5} r={4} fill="red" />}
        </g>
    );
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div
                style={{
                    background: "#FFFFc0",
                    border: ".5px solid darkorange",
                    padding: "0.5em 1em",
                    borderRadius: "0.75em",
                    minWidth: "120px",
                    maxWidth: "240px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                    fontSize: "clamp(11px, 2.5vw, 14px)",
                    lineHeight: 1.4,
                    wordBreak: "break-word",
                }}
            >
                <p
                    style={{
                        margin: 0,
                        fontWeight: 600,
                        fontSize: "clamp(12px, 3vw, 16px)",
                        color: "#ea580c",
                        paddingBottom: "2px",
                    }}
                >
                    {label}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {payload.map((entry) => (
                        <span
                            key={entry.dataKey}
                            style={{
                                margin: 0,
                                fontWeight: 500,
                                fontSize: "clamp(10px, 2vw, 13px)",
                                color: entry.fill,
                                whiteSpace: "pre-line",
                                overflowWrap: "break-word",
                            }}
                        >
                            {entry.name}: <b>{entry.value}</b>
                        </span>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};

const CampusUsageChart = ({
    data,
    loading,
    eventNames,
    selectedRange,
    setSelectedRange,
    rangeOptions,
    displayCollege,
    rangeDescription,
    theme,
}) => {
    const [visibleData, setVisibleData] = useState(data);
    useEffect(() => {
        setVisibleData(data);
    }, [data]);

    const [screenSize, setScreenSize] = useState('lg');
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setDimensions({ width, height: window.innerHeight });
            if (width < 640) setScreenSize('sm');
            else if (width < 768) setScreenSize('md');
            else if (width < 1024) setScreenSize('lg');
            else if (width < 1280) setScreenSize('xl');
            else if (width < 1536) setScreenSize('2xl');
            else setScreenSize('3xl');
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const isMobile = screenSize === 'sm';
    const isTablet = screenSize === 'md';
    const isLargeScreen = ['2xl', '3xl'].includes(screenSize);
    // inside CampusUsageChart:
    const [brushStart, setBrushStart] = useState(0);
    const [brushEnd, setBrushEnd] = useState(data.length - 1);

    // reset both handles whenever the range (and thus `data`) changes:
    useEffect(() => {
        setBrushStart(0);
        setBrushEnd(data.length - 1);
        setVisibleData(data);           // also reset visible window if you want
    }, [data /* or [selectedRange, data] if you prefer]*/]);

    const handleBrushChange = (e) => {
        if (e && typeof e.startIndex === "number" && typeof e.endIndex === "number") {
            setVisibleData(data.slice(e.startIndex, e.endIndex + 1));
        } else { setVisibleData(data); }
    };

    const CustomXAxisTick = ({ x, y, payload, index }) => {
        if (!visibleData || !visibleData[index]) return null;
        const { dateObj, month } = visibleData[index];
        if (!dateObj || !month) return null;
        const day = dateObj.getDate();
        let showAll = visibleData.length <= (isMobile ? 15 : isTablet ? 25 : 45);
        let showDays;
        if (isMobile) {
            if (visibleData.length > 30) showDays = [1, 15];
            else if (visibleData.length > 15) showDays = [1, 8, 15, 23];
            else showDays = "all";
        } else if (isTablet) {
            if (visibleData.length > 60) showDays = [1, 15];
            else if (visibleData.length > 30) showDays = [1, 7, 15, 23, 28];
            else showDays = "all";
        } else {
            if (visibleData.length > 320) showDays = [1, 15];
            else if (visibleData.length > 90) showDays = [1, 7, 15, 23, 28];
            else showDays = "all";
        }
        const isTick = showAll || showDays === "all" || showDays.includes(day) || day === 1;
        const isMonthStart = index === 0 || (visibleData[index].month && visibleData[index - 1] && visibleData[index].month !== visibleData[index - 1].month);
        const fontSize = isMobile ? 8 : isTablet ? 10 : isLargeScreen ? 12 : 12;
        const monthFontSize = isMobile ? 9 : isTablet ? 11 : isLargeScreen ? 13 : 13;
        return (
            <g>
                {isTick && <text x={x} y={y + (isMobile ? 8 : isTablet ? 10 : 12)} textAnchor="middle" fontSize={fontSize} fill="#555">{day}</text>}
                {isMonthStart && month && <text x={x} y={y + (isMobile ? 18 : isTablet ? 22 : 28)} textAnchor="middle" fontSize={monthFontSize} fill="#F97316" fontWeight="bold">{month}</text>}
            </g>
        );
    };

    const getChartHeight = () => isMobile ? Math.max(250, dimensions.height * 0.4) : isTablet ? Math.max(350, dimensions.height * 0.45) : isLargeScreen ? Math.max(600, dimensions.height * 0.6) : 480;
    const getMargins = () => isMobile ? { top: 15, right: 15, left: 15, bottom: 50 } : isTablet ? { top: 20, right: 20, left: 20, bottom: 60 } : isLargeScreen ? { top: 30, right: 40, left: 30, bottom: 80 } : { top: 20, right: 30, left: 20, bottom: 70 };
    const showLabels = visibleData.length <= (isMobile ? 10 : isTablet ? 20 : isLargeScreen ? 60 : 40);
    const showBrush = data.length >= 30 && !isMobile;
    const showLegend = !isMobile;

    return (
        <Card className="border-amber-200 overflow-hidden w-full max-w-full">
            <CardHeader className="bg-gradient-to-r from-amber-100 to-orange-100 pb-3 pt-4">
                {/* Mobile Layout - Stacked */}
                <div className="flex flex-col gap-4 sm:hidden">
                    <div className="space-y-2">
                        {loading ? (
                            <>
                                <SkeletonPulse
                                    className="rounded-lg"
                                    style={{ width: '85%', height: '28px' }}
                                />
                                <SkeletonPulse
                                    className="rounded-md"
                                    style={{ width: '70%', height: '18px' }}
                                />
                            </>
                        ) : (
                            <>
                                <CardTitle className="text-orange-900 text-xl font-bold tracking-tight">
                                    {displayCollege.toUpperCase()} Campus App Usage
                                </CardTitle>
                                <CardDescription className="text-orange-700 text-sm font-medium">
                                    {rangeDescription}
                                </CardDescription>
                            </>
                        )}
                    </div>

                    {/* <div className="flex justify-start">
                        {loading ? (
                            <div className="flex gap-2">
                                {Array.from({ length: 3 }, (_, i) => (
                                    <SkeletonPulse
                                        key={i}
                                        className="rounded-full"
                                        style={{
                                            width: '45px',
                                            height: '36px',
                                            animationDelay: `${i * 0.1}s`
                                        }}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="inline-flex bg-orange-100/50 rounded-xl p-1 border border-orange-200">
                                {rangeOptions.map(opt => (
                                    <button
                                        key={opt.key}
                                        className={`
                                px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-out
                                ${selectedRange === opt.key
                                                ? "bg-orange-500 text-white shadow-sm border border-orange-500 scale-[0.98]"
                                                : "text-orange-700 hover:text-orange-900 hover:bg-orange-200/50"
                                            }
                            `}
                                        onClick={() => setSelectedRange(opt.key)}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div> */}
                </div>

                {/* Desktop Layout - Side by Side */}
                <div className="hidden sm:flex sm:items-center sm:justify-between">
                    <div className="space-y-2">
                        {loading ? (
                            <>
                                <SkeletonPulse
                                    className="rounded-lg"
                                    style={{ width: '60%', height: '32px' }}
                                />
                                <SkeletonPulse
                                    className="rounded-md"
                                    style={{ width: '50%', height: '18px' }}
                                />
                            </>
                        ) : (
                            <>
                                <CardTitle className="text-orange-900 text-2xl font-bold tracking-tight">
                                    {displayCollege.toUpperCase()} Campus App Usage
                                </CardTitle>
                                <CardDescription className="text-orange-700 text-base font-medium">
                                    {rangeDescription}
                                </CardDescription>
                            </>
                        )}
                    </div>


                </div>
            </CardHeader>
            <CardContent className="p-2 sm:p-4 md:p-6 lg:p-6 bg-gradient-to-br from-white/50 to-transparent">
                {/* Single source of truth for range-selector */}
                <div className="flex justify-end pt-1.5">
                    {loading ? (
                        <div className="flex gap-2">
                            {Array.from({ length: 4 }, (_, i) => (
                                <SkeletonPulse
                                    key={i}
                                    className="rounded-full"
                                    style={{
                                        width: '55px',
                                        height: '36px',
                                        animationDelay: `${i * 0.1}s`
                                    }}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-row gap-2 overflow-x-auto scrollbar-hide rounded-xl border border-orange-200 bg-white/80 p-1 shadow-sm backdrop-blur-sm">
                            {rangeOptions.map(opt => (
                                <button
                                    key={opt.key}
                                    className={`
                px-3 py-1.5 rounded-full text-xs font-semibold transition
                duration-200 ease-in-out focus:outline-none focus:ring-2
                focus:ring-orange-400
                ${selectedRange === opt.key
                                            ? "bg-orange-500 text-white shadow-md scale-105"
                                            : "bg-orange-50 text-orange-700 hover:bg-orange-200"}
              `}
                                    onClick={() => setSelectedRange(opt.key)}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                {loading ? (
                    <ChartSkeleton
                        isMobile={isMobile}
                        isTablet={isTablet}
                        isLargeScreen={isLargeScreen}
                        dimensions={dimensions}
                    />
                ) : (
                    <div className="w-full overflow-hidden" style={{ height: getChartHeight() }}>
                        <div className={`${isMobile ? 'overflow-x-auto overflow-y-hidden' : ''} w-full h-full`}>
                            <div style={{ width: isMobile ? `${Math.max(100, data.length * 25)}%` : "100%", height: "100%", minWidth: isMobile ? '600px' : 'auto' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data} margin={getMargins()}>
                                        <CartesianGrid strokeDasharray="2 4" stroke="#e2e8f0" opacity={0.6} />
                                        <XAxis dataKey="fullDate" interval={0} tick={(props) => (<CustomXAxisTick {...props} />)} height={50} />
                                        <YAxis tick={{ fontSize: isMobile ? 8 : isTablet ? 10 : isLargeScreen ? 12 : 12, fill: "#64748b", fontWeight: 500 }} axisLine={{ stroke: "#cbd5e1", strokeWidth: 1 }} tickLine={{ stroke: "#cbd5e1" }} width={isMobile ? 30 : isTablet ? 40 : 60} />
                                        <Tooltip content={<CustomTooltip />} />
                                        {showLegend && (<Legend wrapperStyle={{ fontSize: isLargeScreen ? "12px" : "12px", paddingTop: isLargeScreen ? "20px" : "20px", fontWeight: 500 }} />)}
                                        {showBrush && (<Brush data={data} dataKey="fullDate" startIndex={brushStart} endIndex={brushEnd} updateOnDrag height={isLargeScreen ? 35 : 28} travellerWidth={isLargeScreen ? 15 : 12} stroke="#F97316" fill="#FFF4E5" onChange={({ startIndex, endIndex }) => { setBrushStart(startIndex); setBrushEnd(endIndex); setVisibleData(data.slice(startIndex, endIndex + 1)); }} />)}
                                        {eventNames.map((key) => (
                                            <Bar key={key} dataKey={key} stackId="events" fill={APP_COLORS[key] || "#8B5CF6"} radius={[3, 3, 0, 0]} shape={(props) => <CustomBar {...props} />} activeBar={<Rectangle stroke="tomato" />}>
                                                {showLabels && (<LabelList dataKey={key} position="inside" style={{ fill: "white", fontWeight: 700, fontSize: isMobile ? 7 : isTablet ? 8 : isLargeScreen ? 10 : 10, textShadow: "0 1px 4px rgba(0,0,0,0.18)", pointerEvents: "none" }} formatter={(value) => (value > 0 ? value : "")} />)}
                                            </Bar>
                                        ))}
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}
                {loading && isMobile && (
                    <div className="mt-4 flex flex-wrap gap-2 justify-center">
                        {Array.from({ length: 4 }, (_, i) => (
                            <div key={i} className="flex items-center gap-1">
                                <SkeletonPulse
                                    className="rounded-sm"
                                    style={{
                                        width: '12px',
                                        height: '12px',
                                        animationDelay: `${i * 0.1}s`
                                    }}
                                />
                                <SkeletonPulse
                                    className="rounded"
                                    style={{
                                        width: '40px',
                                        height: '10px',
                                        animationDelay: `${i * 0.1 + 0.1}s`
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                )}
                {!loading && isMobile && (<div className="mt-4 flex flex-wrap gap-2 justify-center">{eventNames.map((key) => (<div key={key} className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm" style={{ backgroundColor: APP_COLORS[key] || "#8B5CF6" }}></div><span className="text-xs text-gray-600">{key}</span></div>))}</div>)}
            </CardContent>
            {!loading && isMobile && data.length > 7 && (<div className="px-4 pb-3"><p className="text-xs text-center text-gray-500 flex items-center justify-center gap-1"><span>←</span> Scroll chart horizontally to see more data <span>→</span></p></div>)}
            {loading && isMobile && (
                <div className="px-4 pb-3">
                    <SkeletonPulse
                        className="rounded mx-auto"
                        style={{
                            width: '70%',
                            height: '12px'
                        }}
                    />
                </div>
            )}
        </Card>
    );
};

export default CampusUsageChart;