import React from "react";
import { Hourglass } from "lucide-react"; // optional icon

const Reports = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white border border-dashed border-orange-300 rounded-lg p-8 text-center shadow-sm max-w-md w-full">
        <Hourglass className="mx-auto mb-4 text-orange-500 animate-pulse" size={40} />
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Reports Coming Soon</h2>
        <p className="text-gray-600">
          We’re working hard to bring you insightful campus reports. Stay tuned!
        </p>
      </div>
    </div>
  );
};

export default Reports;
