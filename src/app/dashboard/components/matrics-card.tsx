'use client';

import { DollarSign, TrendingUp, Star, Users } from 'lucide-react';

const metrics = [
  {
    title: '$2,847',
    subtitle: 'Total Earnings (This Month)',
    icon: DollarSign,
    iconBg: 'from-green-500 to-emerald-600',
    change: '+18.2%',
    positive: true
  },
  {
    title: '4.8',
    subtitle: 'Average Rating',
    icon: Star,
    iconBg: 'from-yellow-500 to-orange-600',
    change: '+0.3',
    positive: true
  },
  {
    title: '156',
    subtitle: 'Gigs Completed',
    icon: Users,
    iconBg: 'from-blue-500 to-cyan-600',
    change: '+12',
    positive: true
  }
];

export function MetricsCards() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-700/50 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-purple-900/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

          <div className="relative">
            <div className="mb-4 flex items-center justify-between">
              <div className={`rounded-2xl bg-gradient-to-br p-3 ${metric.iconBg} shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                <metric.icon className="h-6 w-6 text-white" />
              </div>
              <div
                className={`flex items-center space-x-1 rounded-full px-3 py-1 text-sm font-medium ${
                  metric.positive
                    ? 'border border-green-700/50 bg-green-900/50 text-green-400'
                    : 'border border-red-700/50 bg-red-900/50 text-red-400'
                }`}
              >
                <TrendingUp className="h-3 w-3" />
                <span>{metric.change}</span>
              </div>
            </div>

            <div>
              <p className="mb-1 text-3xl font-bold text-white transition-colors group-hover:text-blue-400">{metric.title}</p>
              <p className="text-sm text-slate-400 transition-colors group-hover:text-slate-300">{metric.subtitle}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
