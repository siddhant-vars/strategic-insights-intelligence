import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { GroupCount } from "@/types/insight";
import { pestleColor } from "@/lib/utils";

interface PestleChartProps {
  data: GroupCount[];
  onSelect: (pestle: string) => void;
}

export function PestleChart({ data, onSelect }: PestleChartProps) {
  const total = data.reduce((sum, d) => sum + d.count, 0);
  const chartData = [...data].sort((a, b) => b.count - a.count);

  return (
    <div>
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="count"
            nameKey="key"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={2}
            cursor="pointer"
            onClick={(entry) => onSelect((entry as unknown as GroupCount).key)}
            label={({ percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {chartData.map((d) => (
              <Cell key={d.key} fill={pestleColor(d.key)} stroke="var(--tw-surface, white)" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload || payload.length === 0) return null;
              const p = payload[0].payload as GroupCount;
              return (
                <div className="rounded-lg border border-slate-200 bg-white p-2.5 text-xs shadow-lg dark:border-slate-700 dark:bg-slate-900">
                  <div className="font-semibold text-slate-800 dark:text-slate-100">{p.key}</div>
                  <div className="text-slate-500 dark:text-slate-400">
                    {p.count} insights ({total > 0 ? Math.round((p.count / total) * 100) : 0}%)
                  </div>
                </div>
              );
            }}
          />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            wrapperStyle={{ fontSize: 11 }}
            formatter={(value) => <span className="text-slate-600 dark:text-slate-300">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
      <p className="text-center text-[11px] text-slate-400 dark:text-slate-500">
        {total} categorized insights · click a segment to filter by PESTLE category
      </p>
    </div>
  );
}
