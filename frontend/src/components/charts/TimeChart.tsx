import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { YearPoint } from "@/types/insight";

interface TimeChartProps {
  data: YearPoint[];
  missingCount: number;
  totalCount: number;
}

export function TimeChart({ data, missingCount, totalCount }: TimeChartProps) {
  const sorted = [...data].sort((a, b) => a.year - b.year);

  return (
    <div>
      <ResponsiveContainer width="100%" height={320}>
        <ComposedChart data={sorted} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
          <XAxis dataKey="year" tick={{ fontSize: 11 }} className="fill-slate-500" />
          <YAxis yAxisId="left" tick={{ fontSize: 11 }} className="fill-slate-500" label={{ value: "Avg score", angle: -90, position: "insideLeft", fontSize: 10, fill: "#94a3b8" }} />
          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} className="fill-slate-500" label={{ value: "Insights", angle: 90, position: "insideRight", fontSize: 10, fill: "#94a3b8" }} />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload || payload.length === 0) return null;
              return (
                <div className="rounded-lg border border-slate-200 bg-white p-2.5 text-xs shadow-lg dark:border-slate-700 dark:bg-slate-900">
                  <div className="mb-1 font-semibold text-slate-800 dark:text-slate-100">End Year {label}</div>
                  {payload.map((p) => (
                    <div key={p.dataKey as string} className="text-slate-500 dark:text-slate-400">
                      {p.name}: {p.value}
                    </div>
                  ))}
                </div>
              );
            }}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar yAxisId="right" dataKey="count" name="Insight Count" fill="#c7d2fe" radius={[4, 4, 0, 0]} />
          <Line yAxisId="left" type="monotone" dataKey="avgIntensity" name="Avg Intensity" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} />
          <Line yAxisId="left" type="monotone" dataKey="avgLikelihood" name="Avg Likelihood" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 3 }} />
        </ComposedChart>
      </ResponsiveContainer>
      {totalCount > 0 && (
        <p className="mt-2 text-[11px] text-slate-400 dark:text-slate-500">
          {missingCount} of {totalCount} insights in the current selection have no <code>end_year</code> and are
          excluded from this trend rather than being counted as year zero.
        </p>
      )}
    </div>
  );
}
