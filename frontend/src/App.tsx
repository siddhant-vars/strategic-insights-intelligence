import { useState, lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { FilterDrawer } from "@/components/filters/FilterDrawer";
import { useTheme } from "@/hooks/useTheme";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";

const Overview = lazy(() => import("@/pages/Overview"));
const SectorIntelligence = lazy(() => import("@/pages/SectorIntelligence"));
const GeographicIntelligence = lazy(() => import("@/pages/GeographicIntelligence"));
const RiskMatrixPage = lazy(() => import("@/pages/RiskMatrixPage"));
const DataExplorer = lazy(() => import("@/pages/DataExplorer"));
const AboutDataset = lazy(() => import("@/pages/AboutDataset"));
const NotFound = lazy(() => import("@/pages/NotFound"));

export default function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex h-screen overflow-hidden bg-canvas dark:bg-canvas-dark">
      <Sidebar collapsed={collapsed} mobileOpen={mobileSidebarOpen} onMobileClose={() => setMobileSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar
          collapsed={collapsed}
          onToggleCollapsed={() => setCollapsed((c) => !c)}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onOpenMobileFilters={() => setMobileFiltersOpen(true)}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          <Suspense fallback={<LoadingSkeleton height={400} />}>
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="/sectors" element={<SectorIntelligence />} />
              <Route path="/geography" element={<GeographicIntelligence />} />
              <Route path="/risk-matrix" element={<RiskMatrixPage />} />
              <Route path="/explorer" element={<DataExplorer />} />
              <Route path="/about" element={<AboutDataset />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
      </div>

      <FilterDrawer open={mobileFiltersOpen} onClose={() => setMobileFiltersOpen(false)} />
    </div>
  );
}
