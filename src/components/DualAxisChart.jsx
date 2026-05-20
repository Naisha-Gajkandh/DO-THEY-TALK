import React, { useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useTheme } from '../contexts/ThemeContext';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const DualAxisChart = memo(function DualAxisChart({ result, datasetA, datasetB }) {
  const { isDark } = useTheme();
  if (!result || !result.valid) return null;

  const graphA = isDark ? '#638cff' : '#3b6cef';
  const graphB = isDark ? '#22d3ee' : '#0e8aa0';
  const gridColor = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(59,108,239,0.08)';
  const tickColor = isDark ? '#6b7280' : '#9ca3af';
  const bgDot = isDark ? '#06060b' : '#ffffff';
  const tooltipBg = isDark ? 'rgba(6,6,11,0.95)' : 'rgba(255,255,255,0.97)';
  const tooltipBorder = isDark ? 'rgba(99,140,255,0.3)' : 'rgba(59,108,239,0.2)';
  const tooltipTitle = isDark ? '#f0f0f5' : '#1a1d2e';
  const tooltipBody = isDark ? '#9ca3af' : '#5b6075';

  const chartData = useMemo(() => ({
    labels: result.years.map(String),
    datasets: [
      {
        label: datasetA?.name || 'A',
        data: result.valuesA,
        borderColor: graphA,
        backgroundColor: isDark ? 'rgba(99,140,255,0.06)' : 'rgba(59,108,239,0.05)',
        borderWidth: 3, pointRadius: 4, pointHoverRadius: 7,
        pointBackgroundColor: graphA, pointBorderColor: bgDot, pointBorderWidth: 2,
        tension: 0.4, fill: true, yAxisID: 'yA',
      },
      {
        label: datasetB?.name || 'B',
        data: result.valuesB,
        borderColor: graphB,
        backgroundColor: isDark ? 'rgba(34,211,238,0.04)' : 'rgba(14,138,160,0.04)',
        borderWidth: 3, pointRadius: 4, pointHoverRadius: 7,
        pointBackgroundColor: graphB, pointBorderColor: bgDot, pointBorderWidth: 2,
        tension: 0.4, fill: true, yAxisID: 'yB',
      },
    ],
  }), [result, datasetA, datasetB, isDark]);

  const chartOptions = useMemo(() => ({
    responsive: true, maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: tooltipBg, borderColor: tooltipBorder, borderWidth: 1,
        cornerRadius: 12, padding: 14, usePointStyle: true,
        titleFont: { family: "'Space Grotesk'", size: 13, weight: '600' },
        titleColor: tooltipTitle,
        bodyFont: { family: "'JetBrains Mono'", size: 12 },
        bodyColor: tooltipBody,
        bodySpacing: 6, titleMarginBottom: 10,
        callbacks: {
          label(ctx) {
            const u = ctx.datasetIndex === 0 ? (datasetA?.unit || '') : (datasetB?.unit || '');
            return ` ${ctx.dataset.label}: ${ctx.parsed.y?.toLocaleString()} ${u}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { color: gridColor },
        ticks: { font: { family: "'JetBrains Mono'", size: 11 }, color: tickColor },
      },
      yA: {
        type: 'linear', position: 'left',
        grid: { color: isDark ? 'rgba(99,140,255,0.06)' : 'rgba(59,108,239,0.06)' },
        ticks: { font: { family: "'JetBrains Mono'", size: 11 }, color: graphA },
        title: { display: true, text: datasetA?.unit || '', color: graphA,
          font: { family: "'Inter'", size: 11, weight: '500' } },
      },
      yB: {
        type: 'linear', position: 'right',
        grid: { drawOnChartArea: false },
        ticks: { font: { family: "'JetBrains Mono'", size: 11 }, color: graphB },
        title: { display: true, text: datasetB?.unit || '', color: graphB,
          font: { family: "'Inter'", size: 11, weight: '500' } },
      },
    },
    animation: { duration: 800, easing: 'easeInOutQuart' },
  }), [datasetA, datasetB, isDark]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }} className="card p-6 mb-5 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 right-0 h-[1px]"
        style={{ background: 'linear-gradient(90deg, transparent, var(--accent), var(--accent2), transparent)' }} />
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-3">
        <h3 className="font-display text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          Dual-Axis Comparison
        </h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: graphA, boxShadow: `0 0 8px ${graphA}40` }} />
            {datasetA?.name}
          </div>
          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: graphB, boxShadow: `0 0 8px ${graphB}40` }} />
            {datasetB?.name}
          </div>
        </div>
      </div>
      <div className="relative w-full h-[320px] md:h-[380px]">
        <Line key={`${datasetA?.id}-${datasetB?.id}-${isDark}`} data={chartData} options={chartOptions} />
      </div>
    </motion.div>
  );
}
);

export default DualAxisChart;
