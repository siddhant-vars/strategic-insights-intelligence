import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { GroupCount } from "@/types/insight";
import { cn } from "@/lib/utils";

interface SectorChartProps {
  data: GroupCount[];
  onSelectSector: (sector: string) => void;
}

type Metric = "count" | "avgIntensity" | "avgRelevance";

const METRIC_LABELS: Record<Metric, string> = {
  count: "Insight Count",
  avgIntensity: "Avg Intensity",
  avgRelevance: "Avg Relevance",
};

export function SectorChart({ data, onSelectSector }: SectorChartProps) {
  const [metric, setMetric] = useState<Metric>("count");

  const chartData = useMemo(
    () =>
      [...data]
        .sort((a, b) => (b[metric] ?? 0) - (a[metric] ?? 0))
        .slice(0, 12)
        .map((d) => ({ name: d.key, value: d[metric] ?? 0, count: d.count })),
    [data, metric]
  );

  return (
    <div>
      <div className="mb-3 flex gap-1.5">
        {(Object.keys(METRIC_LABELS) as Metric[]).map((m) => (
          <button
            key={m}
            onClick={() => setMetric(m)}
            className={cn(
              "focus-ring rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
              metric === m
                ? "bg-brand-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            )}
          >
            {METRIC_LABELS[m]}
          </button>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={340}>
        <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-slate-200 dark:stroke-slate-800" />
          <XAxis type="number" tick={{ fontSize: 11 }} className="fill-slate-500" allowDecimals={metric !== "count"} />
          <YAxis
            type="category"
            dataKey="name"
            width={140}
            tick={{ fontSize: 11 }}
            className="fill-slate-500"
          />
          <Tooltip
            cursor={{ fill: "rgba(99,102,241,0.06)" }}
            content={({ active, payload, label }) => {
              if (!active || !payload || payload.length === 0) return null;
              return (
                <div className="rounded-lg border border-slate-200 bg-white p-2.5 text-xs shadow-lg dark:border-slate-700 dark:bg-slate-900">
                  <div className="font-semibold text-slate-800 dark:text-slate-100">{label}</div>
                  <div className="text-slate-500 dark:text-slate-400">
                    {METRIC_LABELS[metric]}: {payload[0].value}
                  </div>
                </div>
              );
            }}
          />
          <Bar
            dataKey="value"
            radius={[0, 6, 6, 0]}
            cursor="pointer"
            onClick={(entry) => onSelectSector((entry as unknown as { name: string }).name)}
          >
            {chartData.map((_, i) => (
              <Cell key={i} fill="#6366f1" fillOpacity={1 - i * 0.045} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">Click a bar to filter the dashboard by that sector.</p>
    </div>
  );
}
