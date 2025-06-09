import React, { useEffect, useState } from "react";
import { Database, Cpu, Check } from "lucide-react";
import Cookies from "js-cookie";
import { message } from "antd";
import Main from "@/components/custom/Main";

const Settings = () => {
  const [selectedDb, setSelectedDb] = useState("sanchit");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Check for dbconfig cookie on page load (simulated with localStorage)
  useEffect(() => {
    const dbConfig = Cookies.get("dbconfig");
    if (dbConfig) {
      setSelectedDb(dbConfig);
    }
  }, []);

  // Handle button click and show toast
  const handleSelectDb = (db) => {
    setSelectedDb(db);
    Cookies.set("dbconfig", db); // Using localStorage instead of cookies

    // Show toast notification
    const dbName = db === "sanchit_live" ? "sanchit_live" : "sanchit";
    message.success(`Connected to ${dbName} database`);
    window.location.reload(); // Reload the page to apply changes
  };

  return (
    <Main>
      <div className="flex flex-col items-center justify-center h-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light text-slate-800 mb-2">
            Database Configuration
          </h1>
          <p className="text-slate-500 text-lg">
            Select your preferred database environment
          </p>
        </div>

        {/* Database Selection Cards */}
        <div className="flex gap-6 mb-8">
          {/* Live Database Card */}
          <div
            onClick={() => handleSelectDb("sanchit_live")}
            className={`relative group cursor-pointer transition-all duration-300 ${
              selectedDb === "sanchit_live"
                ? "transform scale-105"
                : "hover:transform hover:scale-102"
            }`}
          >
            <div
              className={`
              relative p-8 rounded-2xl border backdrop-blur-sm transition-all duration-300
              ${
                selectedDb === "sanchit_live"
                  ? "bg-white/80 border-slate-300 shadow-xl shadow-slate-200/50"
                  : "bg-white/60 border-slate-200 shadow-lg hover:shadow-xl hover:bg-white/70"
              }
            `}
            >
              {/* Selection Indicator */}
              {selectedDb === "sanchit_live" && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-slate-800 rounded-full flex items-center justify-center">
                  <Check size={14} className="text-white" />
                </div>
              )}

              <div className="flex flex-col items-center text-center">
                <div
                  className={`
                  p-4 rounded-xl mb-4 transition-colors duration-300
                  ${
                    selectedDb === "sanchit_live"
                      ? "bg-slate-100"
                      : "bg-slate-50 group-hover:bg-slate-100"
                  }
                `}
                >
                  <Database size={32} className="text-slate-700" />
                </div>
                <h3 className="text-xl font-medium text-slate-800 mb-2">
                  Live Database
                </h3>
                <p className="text-slate-500 text-sm">Production environment</p>
              </div>
            </div>
          </div>

          {/* Demo Database Card */}
          <div
            onClick={() => handleSelectDb("sanchit")}
            className={`relative group cursor-pointer transition-all duration-300 ${
              selectedDb === "sanchit"
                ? "transform scale-105"
                : "hover:transform hover:scale-102"
            }`}
          >
            <div
              className={`
              relative p-8 rounded-2xl border backdrop-blur-sm transition-all duration-300
              ${
                selectedDb === "sanchit"
                  ? "bg-white/80 border-slate-300 shadow-xl shadow-slate-200/50"
                  : "bg-white/60 border-slate-200 shadow-lg hover:shadow-xl hover:bg-white/70"
              }
            `}
            >
              {/* Selection Indicator */}
              {selectedDb === "sanchit" && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-slate-800 rounded-full flex items-center justify-center">
                  <Check size={14} className="text-white" />
                </div>
              )}

              <div className="flex flex-col items-center text-center">
                <div
                  className={`
                  p-4 rounded-xl mb-4 transition-colors duration-300
                  ${
                    selectedDb === "sanchit"
                      ? "bg-slate-100"
                      : "bg-slate-50 group-hover:bg-slate-100"
                  }
                `}
                >
                  <Cpu size={32} className="text-slate-700" />
                </div>
                <h3 className="text-xl font-medium text-slate-800 mb-2">
                  Demo Database
                </h3>
                <p className="text-slate-500 text-sm">Development environment</p>
              </div>
            </div>
          </div>
        </div>

        {/* Current Selection Display */}
        <div className="text-center">
          <p className="text-slate-600 text-lg">
            Currently connected to:{" "}
            <span className="font-medium text-slate-800">{selectedDb}</span>
          </p>
        </div>

        {/* Toast Notification */}
        {showToast && (
          <div
            className={`
            fixed top-6 right-6 bg-white border border-slate-200 rounded-xl px-6 py-4 shadow-lg
            flex items-center gap-3 transition-all duration-300 transform
            ${
              showToast ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
            }
          `}
          >
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-slate-700 font-medium">{toastMessage}</span>
          </div>
        )}
      </div>
    </Main>
  );
};

export default Settings;
