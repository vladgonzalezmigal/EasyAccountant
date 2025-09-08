'use client';

import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const ProfitGraph = ({ graphData }) => {
  if (Object.keys(graphData).length === 0) {
    return <p className="text-[#2F2F2F] text-[16px]">No data available</p>;
  }

  const sortedKeys = Object.keys(graphData).sort();
  const labels = sortedKeys.map((key) => {
    const [year, month] = key.split('-');
    return `${month}-${year}`;
  });

  const salesData = sortedKeys.map((key) => graphData[key].sales);
  const expensesData = sortedKeys.map((key) => graphData[key].expenses);
  const payrollData = sortedKeys.map((key) => graphData[key].payroll);

  const title = `Profits from ${labels[0]} to ${labels[labels.length - 1]}`;

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Sales',
        data: salesData,
        backgroundColor: '#2A7D7B',
        stack: 'stackGroup',
      },
      {
        label: 'Expenses',
        data: expensesData,
        backgroundColor: '#ef4444',
        stack: 'stackGroup',
      },
      {
        label: 'Payroll',
        data: payrollData,
        backgroundColor: '#8ABBFD',
        stack: 'stackGroup',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: 'Amount ($)',
          color: '#2F2F2F',
          font: {
            size: 14,
          },
        },
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#2F2F2F',
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: title,
        color: '#2F2F2F',
        font: {
          size: 18,
          weight: 'bold',
        },
        padding: {
          top: 10,
          bottom: 30,
        },
      },
      datalabels: {
        anchor: 'end',
        align: 'top',
        offset: 4,
        color: '#2F2F2F',
        font: {
          size: 12,
          weight: 'bold',
        },
        rotation: 0,
        formatter: (_, context) => {
          if (context.datasetIndex !== 2) return null;
          const index = context.dataIndex;
          const s = salesData[index];
          const e = expensesData[index];
          const p = payrollData[index];
          const profit = s - e - p;
          return [
            'Profit:',
            `$${profit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
          ];
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: $${Number(context.raw).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
          },
        },
      },
    },
  };

  return (
    <div className="min-w-[1000px] w-full min-h-[450px] flex flex-col items-center">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default ProfitGraph;
