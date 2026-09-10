import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex h-[60vh] flex-col items-center justify-center gap-3 text-center">
      <Compass size={40} className="text-slate-300 dark:text-slate-700" strokeWidth={1.5} />
      <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Page not found</h1>
      <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">
        The page you're looking for doesn't exist. Head back to the overview to keep exploring.
      </p>
      <Link
        to="/"
        className="focus-ring rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
      >
        Back to Overview
      </Link>
    </div>
  );
}
