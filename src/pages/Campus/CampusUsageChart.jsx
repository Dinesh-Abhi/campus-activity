import React, { useState, useEffect } from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, Rectangle, LabelList, Brush
} from "recharts";
import { APP_COLORS } from "@/components/constants/Color";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

// --- Chart ---
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
                    fontSize: "clamp(13px, 2.5vw, 16px)", // responsive font
                    lineHeight: 1.4,
                    wordBreak: "break-word",
                }}
            >
                <p
                    style={{
                        margin: 0,
                        fontWeight: 600,
                        fontSize: "clamp(14px, 3vw, 18px)",
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
                                fontSize: "clamp(13px, 2vw, 15px)",
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
    eventNames,
    selectedRange,
    setSelectedRange,
    rangeOptions,
    displayCollege,
    rangeDescription,
    theme,
}) => {
    // Brush - for zoom
    const [visibleData, setVisibleData] = useState(data);

    useEffect(() => {
        setVisibleData(data);
    }, [data]);

    // Detect screen size for responsiveness
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 640);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleBrushChange = (e) => {
        if (e && typeof e.startIndex === "number" && typeof e.endIndex === "number") {
            setVisibleData(data.slice(e.startIndex, e.endIndex + 1));
        } else {
            setVisibleData(data);
        }
    };

    // Dynamic x-axis tick
    const CustomXAxisTick = ({ x, y, payload, index }) => {
        if (!visibleData || !visibleData[index]) return null;
        const { dateObj, month } = visibleData[index];
        if (!dateObj || !month) return null;

        const day = dateObj.getDate();

        let showAll = visibleData.length <= 45; // show all for ~1.5 months
        let showDays;
        if (visibleData.length > 320) {
            showDays = [1, 15];
        } else if (visibleData.length > 90) {
            showDays = [1, 7, 15, 23, 28];
        } else {
            showDays = "all";
        }
        const isTick = showAll || showDays === "all" || showDays.includes(day) || day === 1;

        // Month label logic
        const isMonthStart =
            index === 0 ||
            (visibleData[index].month &&
                visibleData[index - 1] &&
                visibleData[index].month !== visibleData[index - 1].month);

        return (
            <g>
                {isTick && (
                    <text
                        x={x}
                        y={y + (isMobile ? 10 : 12)}
                        textAnchor="middle"
                        fontSize={isMobile ? 10 : 12}
                        fill="#555"
                    >
                        {day}
                    </text>
                )}
                {isMonthStart && month && (
                    <text
                        x={x}
                        y={y + (isMobile ? 22 : 28)}
                        textAnchor="middle"
                        fontSize={isMobile ? 10 : 13}
                        fill="#F97316"
                        fontWeight="bold"
                    >
                        {month}
                    </text>
                )}
            </g>
        );
    };

    const showLabels = visibleData.length <= (isMobile ? 15 : 40);
    return (
        <Card className="border-amber-200 overflow-hidden">
            {/* CardHeader: Responsive flex direction */}
            <CardHeader className="bg-gradient-to-r from-amber-100 to-orange-100 pb-3 pt-4">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 w-full">
                    {/* Left: Title & Description */}
                    <div>
                        <CardTitle className="text-orange-800 text-lg sm:text-2xl font-bold tracking-wide">
                            {displayCollege.toUpperCase()} Campus App Usage
                        </CardTitle>
                        <CardDescription className="text-[15px] sm:text-base text-orange-600 font-medium mt-1 mb-0">
                            {rangeDescription}
                        </CardDescription>
                    </div>
                    {/* Right: Range Selector */}
                    <div className="flex gap-1 overflow-x-auto py-1 px-1 bg-white/90 rounded-xl shadow-sm border border-orange-200">
                        {rangeOptions.map(opt => (
                            <button
                                key={opt.key}
                                className={`px-3 py-1 rounded-full text-xs font-semibold transition ${selectedRange === opt.key ? "bg-orange-500 text-white" : "bg-orange-50 text-orange-700"} whitespace-nowrap`}
                                style={{ minWidth: 52 }}
                                onClick={() => setSelectedRange(opt.key)}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
            </CardHeader>

            <CardContent className={`p-1 sm:p-8 bg-gradient-to-br from-white/50 to-transparent`}>
                <div style={{ width: "100%", height: isMobile ? 300 : 480 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                        >
                            <CartesianGrid
                                strokeDasharray="2 4"
                                stroke="#e2e8f0"
                                opacity={0.6}
                            />
                            <XAxis
                                dataKey="fullDate"
                                interval={0}
                                tick={(props) => <CustomXAxisTick {...props} />}
                                height={isMobile ? 35 : 50}
                                fontSize={isMobile ? 10 : 12}
                            />
                            <YAxis
                                tick={{ fontSize: isMobile ? 10 : 12, fill: "#64748b", fontWeight: 500 }}
                                axisLine={{ stroke: "#cbd5e1", strokeWidth: 1 }}
                                tickLine={{ stroke: "#cbd5e1" }}
                            />
                            <Tooltip content={<CustomTooltip />}

                            />
                            {!isMobile && (
                                <Legend
                                    wrapperStyle={{
                                        fontSize: "12px",
                                        paddingTop: "20px",
                                        fontWeight: 500,
                                    }}
                                />
                            )}
                            {data.length >= 30 && !isMobile && (
                                <Brush
                                    key={selectedRange}
                                    dataKey="fullDate"
                                    height={28}
                                    stroke="#F97316"
                                    travellerWidth={12}
                                    fill="#FFF4E5"
                                    endIndex={data.length - 1}
                                    onChange={handleBrushChange}
                                />
                            )}
                            {eventNames.map((key) => (
                                <Bar
                                    key={key}
                                    dataKey={key}
                                    stackId="events"
                                    fill={APP_COLORS[key]}
                                    radius={[3, 3, 0, 0]}
                                    shape={(props) => <CustomBar {...props} />}
                                    activeBar={<Rectangle stroke="tomato" />}
                                >
                                    {showLabels && (
                                        <LabelList
                                            dataKey={key}
                                            position="inside"
                                            style={{
                                                fill: "white",
                                                fontWeight: 700,
                                                fontSize: isMobile ? 9 : 10,
                                                textShadow: "0 1px 4px rgba(0,0,0,0.18)",
                                                pointerEvents: "none",
                                            }}
                                            formatter={(value) => (value > 0 ? value : "")}
                                        />
                                    )}
                                </Bar>
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

export default CampusUsageChart;
