import { useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { GroupCount } from "@/types/insight";
import { cn } from "@/lib/utils";

interface TopicSourceChartProps {
  topicData: GroupCount[];
  sourceData: GroupCount[];
  onSelectTopic: (topic: string) => void;
  onSelectSource: (source: string) => void;
}

type View = "topic" | "source";

const PALETTE = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#0ea5e9"];

export function TopicSourceChart({ topicData, sourceData, onSelectTopic, onSelectSource }: TopicSourceChartProps) {
  const [view, setView] = useState<View>("topic");
  const data = view === "topic" ? topicData : sourceData;

  const chartData = useMemo(
    () => [...data].sort((a, b) => b.count - a.count).slice(0, 10).map((d) => ({ name: d.key, count: d.count })),
    [data]
  );

  return (
    <div>
      <div className="mb-3 flex gap-1.5">
        {(["topic", "source"] as View[]).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={cn(
              "focus-ring rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors",
              view === v
                ? "bg-brand-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            )}
          >
            Top {v}s
          </button>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 45 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-slate-200 dark:stroke-slate-800" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10 }}
            className="fill-slate-500"
            angle={-35}
            textAnchor="end"
            interval={0}
            height={70}
          />
          <YAxis tick={{ fontSize: 11 }} className="fill-slate-500" allowDecimals={false} />
          <Tooltip
            cursor={{ fill: "rgba(99,102,241,0.06)" }}
            content={({ active, payload, label }) => {
              if (!active || !payload || payload.length === 0) return null;
              return (
                <div className="rounded-lg border border-slate-200 bg-white p-2.5 text-xs shadow-lg dark:border-slate-700 dark:bg-slate-900">
                  <div className="max-w-[200px] font-semibold text-slate-800 dark:text-slate-100">{label}</div>
                  <div className="text-slate-500 dark:text-slate-400">{payload[0].value} insights</div>
                </div>
              );
            }}
          />
          <Bar
            dataKey="count"
            radius={[6, 6, 0, 0]}
            cursor="pointer"
            onClick={(entry) => {
              const name = (entry as unknown as { name: string }).name;
              view === "topic" ? onSelectTopic(name) : onSelectSource(name);
            }}
          >
            {chartData.map((_, i) => (
              <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">Click a bar to filter the dashboard by that {view}.</p>
    </div>
  );
}
