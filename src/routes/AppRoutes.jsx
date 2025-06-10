import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Loader } from "lucide-react";
import MainConstants from "@/components/constants/MainConstants";
import MainLayout from "@/layout/MainLayout";

const Index = lazy(() => import("../pages/Index"));
const Dashboard = lazy(() => import("../pages/Dashboard/index"));
const NotFound = lazy(() => import("../pages/NotFound"));
const Report = lazy(() => import("../pages/Reports/Reports"));
const Monthly = lazy(() => import("../pages/Dashboard/week/Monthly"));
const Campus = lazy(() => import("../pages/Campus/Index"));
const Settings = lazy(() => import("../pages/Settings"));

const campusRouteNames = Object.values(MainConstants.COLLEGES).map((c) =>
  c.toLowerCase().replace(/\s/g, "")
);

export default function AppRoutes() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen w-full">
          <Loader className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      }
    >
      <Routes>
        {/* Routes without sidebar */}
        <Route path="/old" element={<Index />} />
        {/* Routes with layout */}
        <Route path="/" element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="reports" element={<Report />} />
          <Route path="monthly" element={<Monthly />} />
          <Route path="dbconfig" element={<Settings />} />
          {/* Dynamic campus routes */}
          <Route path="campus/:college" element={<Campus />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
