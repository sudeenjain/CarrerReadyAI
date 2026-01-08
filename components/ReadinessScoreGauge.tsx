
import React from 'react';

type ReadinessScoreGaugeProps = {
  score: number;
};

export const ReadinessScoreGauge: React.FC<ReadinessScoreGaugeProps> = ({ score }) => {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = () => {
    if (score >= 85) return 'stroke-indigo-500';
    if (score >= 65) return 'stroke-green-500';
    if (score >= 40) return 'stroke-amber-500';
    return 'stroke-red-500';
  };

  const getStatus = () => {
    if (score >= 85) return 'Highly Competitive';
    if (score >= 65) return 'Job Ready';
    if (score >= 40) return 'Almost Ready';
    return 'Learning';
  };

  return (
    <div className="relative flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          className="text-slate-100 dark:text-slate-800"
          strokeWidth="12"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="50%"
          cy="50%"
        />
        <circle
          className={`${getColor()} transition-all duration-1000 ease-out`}
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="50%"
          cy="50%"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-black text-slate-800 dark:text-slate-100">{score}%</span>
        <span className={`text-[10px] font-black uppercase tracking-widest mt-1 text-center max-w-[100px] leading-tight opacity-70 dark:text-slate-400`}>
          {getStatus()}
        </span>
      </div>
    </div>
  );
};
