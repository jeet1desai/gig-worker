'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';

const data = [
  { name: 'Jan', earnings: 1200, gigs: 8 },
  { name: 'Feb', earnings: 1890, gigs: 12 },
  { name: 'Mar', earnings: 2240, gigs: 15 },
  { name: 'Apr', earnings: 1960, gigs: 13 },
  { name: 'May', earnings: 2680, gigs: 18 },
  { name: 'Jun', earnings: 2847, gigs: 19 }
];

export function AnalyticsChart() {
  return (
    <div className="rounded-2xl border border-slate-700/50 p-6 shadow-none backdrop-blur-xl">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Earnings Overview</h3>
          <p className="text-sm text-slate-400">Monthly earnings and completed gigs</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select>
            <SelectTrigger className="border-slate-700/50 text-white">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent className="bg-foreground border-slate-700/50 text-white hover:text-white">
              <SelectItem value="option1" className="hover:bg-slate-700/50">
                Option 1
              </SelectItem>
              <SelectItem value="option2" className="hover:bg-slate-700/50">
                Option 2
              </SelectItem>
              <SelectItem value="option3" className="hover:bg-slate-700/50">
                Option 3
              </SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="border-slate-700/50 text-white">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent className="bg-foreground border-slate-700/50 text-white hover:text-white">
              <SelectItem value="option1" className="hover:bg-slate-700/50">
                Option 1
              </SelectItem>
              <SelectItem value="option2" className="hover:bg-slate-700/50">
                Option 2
              </SelectItem>
              <SelectItem value="option3" className="hover:bg-slate-700/50">
                Option 3
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#94a3b8' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#94a3b8' }}
            />
            <Line
              type="monotone"
              dataKey="earnings"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
