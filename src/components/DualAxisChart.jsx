import React, { useMemo, useState, memo } from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ScatterController,
} from 'chart.js';
import { Line, Scatter } from 'react-chartjs-2';
import { useTheme } from '../contexts/ThemeContext';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, ScatterController);

function regressionLine(xs, ys) {
  const n = xs.length;
  if (n < 2) return [];
  const meanX = xs.reduce((sum, value) => sum + value, 0) / n;
  const meanY = ys.reduce((sum, value) => sum + value, 0) / n;
  const numerator = xs.reduce((sum, x, index) => sum + (x - meanX) * (ys[index] - meanY), 0);
  const denominator = xs.reduce((sum, x) => sum + (x - meanX) ** 2, 0) || 1;
  const slope = numerator / denominator;
  const intercept = meanY - slope * meanX;
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  return [
    { x: minX, y: slope * minX + intercept },
    { x: maxX, y: slope * maxX + intercept },
  ];
}

const DualAxisChart = memo(function DualAxisChart({ result, datasetA, datasetB }) {
  const { isDark } = useTheme();
  const [mode, setMode] = useState('trend');

  const graphA = isDark ? '#f97316' : '#3b6cef';
  const graphB = isDark ? '#38bdf8' : '#0e8aa0';
  const gridColor = isDark ? 'rgba(255,255,255,0.055)' : 'rgba(15,23,42,0.08)';
  const tickColor = isDark ? '#94a3b8' : '#64748b';
  const bgDot = isDark ? '#050509' : '#ffffff';
  const tooltipBg = isDark ? 'rgba(5,5,9,0.96)' : 'rgba(255,255,255,0.98)';
  const tooltipBorder = isDark ? 'rgba(249,115,22,0.32)' : 'rgba(59,108,239,0.22)';

  const chartData = useMemo(() => {
    if (!result?.valid) return { labels: [], datasets: [] };

    return {
      labels: result.years.map(String),
      datasets: [
        {
          label: datasetA?.name || 'A',
          data: result.valuesA,
          borderColor: graphA,
          backgroundColor: isDark ? 'rgba(249,115,22,0.10)' : 'rgba(59,108,239,0.08)',
          borderWidth: 3,
          pointRadius: 4,
          pointHoverRadius: 8,
          pointBackgroundColor: graphA,
          pointBorderColor: bgDot,
          pointBorderWidth: 2,
          tension: 0.42,
          fill: true,
          yAxisID: 'yA',
        },
        {
          label: datasetB?.name || 'B',
          data: result.valuesB,
          borderColor: graphB,
          backgroundColor: isDark ? 'rgba(56,189,248,0.08)' : 'rgba(14,138,160,0.07)',
          borderWidth: 3,
          pointRadius: 4,
          pointHoverRadius: 8,
          pointBackgroundColor: graphB,
          pointBorderColor: bgDot,
          pointBorderWidth: 2,
          tension: 0.42,
          fill: true,
          yAxisID: 'yB',
        },
      ],
    };
  }, [result, datasetA, datasetB, isDark, graphA, graphB, bgDot]);

  const scatterData = useMemo(() => {
    if (!result?.valid) return { datasets: [] };
    const points = result.valuesA.map((x, index) => ({
      x,
      y: result.valuesB[index],
      year: result.years[index],
    }));
    const trend = regressionLine(result.valuesA, result.valuesB);

    return {
      datasets: [
        {
          label: 'Annual observations',
          data: points,
          backgroundColor: graphA,
          borderColor: graphB,
          pointRadius: 5,
          pointHoverRadius: 9,
          pointBorderWidth: 2,
          pointBorderColor: bgDot,
        },
        {
          label: 'Regression trend',
          data: trend,
          type: 'line',
          showLine: true,
          borderColor: graphB,
          backgroundColor: 'transparent',
          borderWidth: 2.5,
          pointRadius: 0,
          tension: 0,
        },
      ],
    };
  }, [result, graphA, graphB, bgDot]);

  const basePlugins = useMemo(() => ({
    legend: { display: false },
    tooltip: {
      backgroundColor: tooltipBg,
      borderColor: tooltipBorder,
      borderWidth: 1,
      cornerRadius: 12,
      padding: 14,
      usePointStyle: true,
      titleFont: { family: "'Space Grotesk'", size: 13, weight: '600' },
      titleColor: isDark ? '#f8fafc' : '#0f172a',
      bodyFont: { family: "'JetBrains Mono'", size: 12 },
      bodyColor: isDark ? '#cbd5e1' : '#475569',
      bodySpacing: 6,
      titleMarginBottom: 10,
    },
  }), [tooltipBg, tooltipBorder, isDark]);

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      ...basePlugins,
      tooltip: {
        ...basePlugins.tooltip,
        callbacks: {
          label(ctx) {
            const unit = ctx.datasetIndex === 0 ? (datasetA?.unit || '') : (datasetB?.unit || '');
            return ` ${ctx.dataset.label}: ${ctx.parsed.y?.toLocaleString()} ${unit}`;
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
        type: 'linear',
        position: 'left',
        grid: { color: isDark ? 'rgba(249,115,22,0.07)' : 'rgba(59,108,239,0.07)' },
        ticks: { font: { family: "'JetBrains Mono'", size: 11 }, color: graphA },
        title: { display: true, text: datasetA?.unit || '', color: graphA, font: { family: "'Plus Jakarta Sans'", size: 11, weight: '600' } },
      },
      yB: {
        type: 'linear',
        position: 'right',
        grid: { drawOnChartArea: false },
        ticks: { font: { family: "'JetBrains Mono'", size: 11 }, color: graphB },
        title: { display: true, text: datasetB?.unit || '', color: graphB, font: { family: "'Plus Jakarta Sans'", size: 11, weight: '600' } },
      },
    },
    animation: { duration: 900, easing: 'easeInOutQuart' },
  }), [basePlugins, datasetA, datasetB, graphA, graphB, gridColor, isDark, tickColor]);

  const scatterOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'nearest', intersect: false },
    plugins: {
      ...basePlugins,
      tooltip: {
        ...basePlugins.tooltip,
        callbacks: {
          title(items) {
            return items[0]?.raw?.year ? `Year ${items[0].raw.year}` : 'Trend';
          },
          label(ctx) {
            if (ctx.datasetIndex === 1) return ' Regression trend';
            return ` ${datasetA?.name}: ${ctx.parsed.x?.toLocaleString()} / ${datasetB?.name}: ${ctx.parsed.y?.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        type: 'linear',
        grid: { color: gridColor },
        ticks: { font: { family: "'JetBrains Mono'", size: 11 }, color: graphA },
        title: { display: true, text: datasetA?.name || 'Dataset A', color: graphA, font: { family: "'Plus Jakarta Sans'", size: 11, weight: '600' } },
      },
      y: {
        type: 'linear',
        grid: { color: gridColor },
        ticks: { font: { family: "'JetBrains Mono'", size: 11 }, color: graphB },
        title: { display: true, text: datasetB?.name || 'Dataset B', color: graphB, font: { family: "'Plus Jakarta Sans'", size: 11, weight: '600' } },
      },
    },
    animation: { duration: 850, easing: 'easeOutQuart' },
  }), [basePlugins, datasetA, datasetB, graphA, graphB, gridColor]);

  if (!result || !result.valid) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.08 }}
      className="chart-lab"
    >
      <div className="chart-toolbar">
        <div className="chart-legend">
          <span><i style={{ background: graphA }} />{datasetA?.name}</span>
          <span><i style={{ background: graphB }} />{datasetB?.name}</span>
        </div>
        <div className="segmented-control" role="tablist" aria-label="Chart mode">
          <button className={mode === 'trend' ? 'active' : ''} onClick={() => setMode('trend')}>Trend</button>
          <button className={mode === 'scatter' ? 'active' : ''} onClick={() => setMode('scatter')}>Scatter</button>
        </div>
      </div>

      <div className="relative w-full h-[340px] md:h-[430px]">
        {mode === 'trend' ? (
          <Line key={`${datasetA?.id}-${datasetB?.id}-${isDark}-trend`} data={chartData} options={chartOptions} />
        ) : (
          <Scatter key={`${datasetA?.id}-${datasetB?.id}-${isDark}-scatter`} data={scatterData} options={scatterOptions} />
        )}
      </div>
    </motion.div>
  );
});

export default DualAxisChart;
