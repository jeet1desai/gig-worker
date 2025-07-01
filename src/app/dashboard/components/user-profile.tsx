'use client';

import { Button } from '@/components/ui/button';
import { Link } from 'lucide-react';

export function UserProfile() {
  return (
    <div className="h-full rounded-2xl border border-slate-700/50 p-6 shadow-none backdrop-blur-xl">
      <div className="mb-4 flex items-center space-x-4">
        <img
          className="h-12 w-12 rounded-full ring-2 ring-blue-500/20"
          src="https://images.unsplash.com/profile-1704991443592-a7f79d25ffb1image?w=150&dpr=2&crop=faces&bg=%23fff&h=150&auto=format&fit=crop&q=60&ixlib=rb-4.1.0"
          alt="Sarah Johnson"
        />
        <div>
          <h3 className="font-semibold text-white">Sarah Johnson</h3>
          <p className="text-sm text-slate-400">Pro Account • Computer Science</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-slate-400">Overall Rating</span>
            <span className="text-md font-semibold text-[#1cbae0]">4.8/5</span>
          </div>
          <div className="h-1 w-full rounded-full bg-slate-700">
            <div className="h-1 rounded-full bg-[#1cbae0]" style={{ width: '96%' }}></div>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-slate-400">Completion Rate</span>
            <span className="text-md font-semibold text-[#1cbae0]">98%</span>
          </div>
          <div className="h-1 w-full rounded-full bg-slate-700">
            <div className="h-1 rounded-full bg-[#1cbae0]" style={{ width: '98%' }}></div>
          </div>
        </div>
      </div>

      <Button
        variant="outline"
        size="lg"
        className="bg-foreground hover:bg-background/10 text-background mt-8 w-full cursor-pointer border-slate-700/50"
      >
        <Link className="h-4 w-4" />
        View Public Profile
      </Button>
    </div>
  );
}
