import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Download, FileText, X } from "lucide-react";

const DashboardControls = ({
  selectedDate,
  onDateChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  selectedCampus,
  onCampusChange,
  selectedApp,
  onAppChange,
  onExport,
  isLoading,
  datePresets,
  onDatePresetClick,
  campuses,
  apps,
  onClose,
}) => (
  <div className="fixed inset-y-0 left-0 w-80 bg-gray-900 text-gray-200 shadow-lg z-50 flex flex-col">
    {/* Header */}
    <div className="flex items-center justify-between p-4 border-b border-gray-700">
      <h2 className="text-lg font-semibold">Filters</h2>
      <Button
        variant="ghost"
        size="sm"
        onClick={onClose}
        className="text-gray-400 hover:text-gray-100"
        aria-label="Close filters"
      >
        <X className="h-6 w-6" />
      </Button>
    </div>

    <div className="overflow-y-auto flex-1 p-4 space-y-6">
      {/* Date Presets */}
      <div>
        <label className="block text-sm font-medium mb-2">Quick Date Selection</label>
        <div className="flex flex-wrap gap-2">
          {datePresets.map((preset) => (
            <Button
              key={preset.value}
              variant="outline"
              size="sm"
              onClick={() => onDatePresetClick(preset.value)}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Selected Date</label>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 bg-gray-800 text-gray-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Start Date (Export)</label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 bg-gray-800 text-gray-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">End Date (Export)</label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 bg-gray-800 text-gray-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Campus Filter</label>
          <Select value={selectedCampus} onValueChange={onCampusChange}>
            <SelectTrigger className="border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 bg-gray-800 text-gray-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 text-gray-200">
              <SelectItem value="all">All Campuses</SelectItem>
              {campuses.map((campus) => (
                <SelectItem key={campus} value={campus}>
                  Campus {campus}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">App Filter</label>
          <Select value={selectedApp} onValueChange={onAppChange}>
            <SelectTrigger className="border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 bg-gray-800 text-gray-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 text-gray-200">
              <SelectItem value="all">All Apps</SelectItem>
              {apps.map((app) => (
                <SelectItem key={app} value={app}>
                  {app}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Export Data</label>
          <div className="flex space-x-2">
            <Button
              onClick={() => onExport("csv")}
              size="sm"
              disabled={!startDate || !endDate || isLoading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white flex-1"
            >
              <Download className="h-4 w-4 mr-1" />
              CSV
            </Button>
            <Button
              onClick={() => onExport("pdf")}
              size="sm"
              disabled={!startDate || !endDate || isLoading}
              className="bg-purple-600 hover:bg-purple-700 text-white flex-1"
            >
              <FileText className="h-4 w-4 mr-1" />
              PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default DashboardControls;
