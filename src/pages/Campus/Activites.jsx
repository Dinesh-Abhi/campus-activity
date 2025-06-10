import React, { useState, useMemo } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Helper: return days diff between today and date string
const daysDiff = (dateStr) => {
    const now = new Date();
    const d = new Date(dateStr);
    return Math.floor((now - d) / (1000 * 60 * 60 * 24));
};

const RANGE_OPTIONS = [
    { key: "today", label: "Today", filter: (date) => daysDiff(date) === 0 },
    { key: "last7", label: "Last 7 Days", filter: (date) => daysDiff(date) <= 6 },
    { key: "last30", label: "Last 30 Days", filter: (date) => daysDiff(date) <= 29 },
];

const ActivitiesTable = ({ data = [], loading, campus }) => {
    const [search, setSearch] = useState("");
    const [range, setRange] = useState("today");

    // Get range filter function
    const rangeFilterFn = useMemo(() => {
        const opt = RANGE_OPTIONS.find((r) => r.key === range);
        return opt ? opt.filter : () => true;
    }, [range]);

    // Apply range and search filter
    const filtered = useMemo(() => {
        return data
            .filter((row) => rangeFilterFn(row.date))
            .filter(
                (row) =>
                    row.app.toLowerCase().includes(search.toLowerCase()) ||
                    (row.teacher && row.teacher.toLowerCase().includes(search.toLowerCase())) ||
                    (row.course && row.course.toLowerCase().includes(search.toLowerCase()))
            );
    }, [data, rangeFilterFn, search]);

    return (
        <Card className="rounded-3xl border shadow-2xl overflow-hidden backdrop-blur-md">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-orange-50 to-orange-100 border-b border-gray-100/50">
                <div>
                    <CardTitle className="text-2xl font-bold text-gray-800">
                        {campus} Activities
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-500">
                        {filtered.length} activities found
                    </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                    {/* Range buttons */}
                    {RANGE_OPTIONS.map((r) => (
                        <Button
                            key={r.key}
                            variant={range === r.key ? "default" : "outline"}
                            size="sm"
                            className={range === r.key ? "bg-orange-500 text-white" : ""}
                            onClick={() => setRange(r.key)}
                        >
                            {r.label}
                        </Button>
                    ))}
                    <Input
                        className="w-64"
                        placeholder="Search app, teacher, course..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left">Date</th>
                                <th className="px-4 py-3 text-left">App</th>
                                <th className="px-4 py-3 text-left">Course</th>
                                <th className="px-4 py-3 text-left">Teacher(s)</th>
                                <th className="px-4 py-3 text-center">Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                                        Loading...
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                                        No activities found.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((row) => (
                                    <tr key={row.id} className="hover:bg-orange-50">
                                        <td className="px-4 py-2">{row.date}</td>
                                        <td className="px-4 py-2 font-medium">
                                            <Badge variant="secondary">{row.app}</Badge>
                                        </td>
                                        <td className="px-4 py-2">{row.course}</td>
                                        <td className="px-4 py-2">{row.teacher}</td>
                                        <td className="px-4 py-2 text-center font-bold">{row.count}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
};

export default ActivitiesTable;
