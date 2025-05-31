import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Loader, Loader2, LoaderCircle } from "lucide-react";
import MainLayout from "../layout/MainLayout";

const Index = lazy(() => import("../pages/Index"));
const Dashboard = lazy(() => import("../pages/Dashboard/index"));
const NotFound = lazy(() => import("../pages/NotFound"));
const Report = lazy(() => import("../pages/Reports/Reports"));
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
        {/* <Route path="/" element={<Index />} /> */}
        {/* Routes with layout */}
        <Route path="/" element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="reports" element={<Report />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
