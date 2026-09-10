import { useMemo } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { RiskPoint } from "@/types/insight";
import { pestleColor } from "@/lib/utils";

interface RiskMatrixChartProps {
  points: RiskPoint[];
  onSelect: (id: string) => void;
}

function quadrantLabel(likelihood: number, intensity: number, midL: number, midI: number): string {
  if (likelihood >= midL && intensity >= midI) return "Critical";
  if (likelihood >= midL && intensity < midI) return "Significant";
  if (likelihood < midL && intensity >= midI) return "Emerging";
  return "Monitor";
}

export function RiskMatrixChart({ points, onSelect }: RiskMatrixChartProps) {
  const { data, midL, midI, maxRelevance } = useMemo(() => {
    if (points.length === 0) return { data: [], midL: 2.5, midI: 50, maxRelevance: 1 };
    const likelihoods = points.map((p) => p.likelihood);
    const intensities = points.map((p) => p.intensity);
    const midL = (Math.min(...likelihoods) + Math.max(...likelihoods)) / 2;
    const midI = (Math.min(...intensities) + Math.max(...intensities)) / 2;
    const maxRelevance = Math.max(...points.map((p) => p.relevance), 1);
    return { data: points, midL, midI, maxRelevance };
  }, [points]);

  const byPestle = useMemo(() => {
    const groups = new Map<string, RiskPoint[]>();
    data.forEach((p) => {
      const key = p.pestle ?? "Unclassified";
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(p);
    });
    return Array.from(groups.entries());
  }, [data]);

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height={380}>
        <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
          <XAxis
            type="number"
            dataKey="likelihood"
            name="Likelihood"
            domain={["dataMin - 0.3", "dataMax + 0.3"]}
            tick={{ fontSize: 11 }}
            className="fill-slate-500"
            label={{ value: "Likelihood →", position: "insideBottom", offset: -10, fontSize: 11, fill: "#94a3b8" }}
          />
          <YAxis
            type="number"
            dataKey="intensity"
            name="Intensity"
            tick={{ fontSize: 11 }}
            className="fill-slate-500"
            label={{ value: "Intensity →", angle: -90, position: "insideLeft", fontSize: 11, fill: "#94a3b8" }}
          />
          <ZAxis type="number" dataKey="relevance" range={[60, 500]} name="Relevance" />
          <ReferenceLine x={midL} stroke="#cbd5e1" strokeDasharray="4 4" />
          <ReferenceLine y={midI} stroke="#cbd5e1" strokeDasharray="4 4" />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            content={({ active, payload }) => {
              if (!active || !payload || payload.length === 0) return null;
              const p = payload[0].payload as RiskPoint;
              return (
                <div className="rounded-lg border border-slate-200 bg-white p-3 text-xs shadow-lg dark:border-slate-700 dark:bg-slate-900">
                  <div className="mb-1.5 max-w-[220px] font-semibold text-slate-800 dark:text-slate-100">{p.title}</div>
                  <div className="space-y-0.5 text-slate-500 dark:text-slate-400">
                    {p.sector && <div>Sector: {p.sector}</div>}
                    {p.topic && <div>Topic: {p.topic}</div>}
                    {p.country && <div>Country: {p.country}</div>}
                    <div>Intensity: {p.intensity} · Likelihood: {p.likelihood} · Relevance: {p.relevance}</div>
                  </div>
                  <div className="mt-1.5 text-[10px] font-medium text-brand-600 dark:text-brand-400">
                    {quadrantLabel(p.likelihood, p.intensity, midL, midI)} · click for details
                  </div>
                </div>
              );
            }}
          />
          {byPestle.map(([pestle, pts]) => (
            <Scatter
              key={pestle}
              name={pestle}
              data={pts}
              fill={pestleColor(pestle)}
              fillOpacity={0.7}
              onClick={(entry) => onSelect((entry as unknown as RiskPoint).id)}
              cursor="pointer"
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>

      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5">
        {byPestle.map(([pestle]) => (
          <div key={pestle} className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: pestleColor(pestle) }} />
            {pestle}
          </div>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-slate-400 dark:text-slate-500 sm:grid-cols-4">
        <div><span className="font-medium text-slate-500 dark:text-slate-400">Monitor:</span> low likelihood, low intensity</div>
        <div><span className="font-medium text-slate-500 dark:text-slate-400">Emerging:</span> low likelihood, high intensity</div>
        <div><span className="font-medium text-slate-500 dark:text-slate-400">Significant:</span> high likelihood, low intensity</div>
        <div><span className="font-medium text-slate-500 dark:text-slate-400">Critical:</span> high likelihood, high intensity</div>
      </div>
    </div>
  );
}
