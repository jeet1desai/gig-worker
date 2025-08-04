import DashboardLayout from '@/components/layouts/layout';

import { MetricsCards } from './components/matrics-card';
import { AnalyticsChart } from './components/analytics-chart';
import { UserProfile } from './components/user-profile';
import { WeeklySummary } from './components/weekly-summary';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { getUserDetails } from '@/lib/server/user';
import { UserProfileDetails } from '@/types/shared/user';

const Dashboard = async () => {
  const session = await getServerSession(authOptions);
  const loggedInUserId = session?.user?.id;
  const subscriptionType = session?.user?.subscription;
  const user = await getUserDetails(loggedInUserId);
  return (
    <>
      <DashboardLayout>
        <main className="space-y-4 p-3 pl-5 sm:space-y-6 sm:p-4 md:p-6">
          <div className="animate-fade-in">
            <MetricsCards />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:gap-4 md:gap-6 lg:grid-cols-3">
            <div className="animate-fade-in lg:col-span-2" style={{ animationDelay: '0.1s' }}>
              <AnalyticsChart />
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="space-y-3 sm:space-y-4">
                <UserProfile user={user as UserProfileDetails} scubscriptionType={subscriptionType} />
              </div>
            </div>
          </div>

          <div className="animate-fade-in pb-4 sm:pb-6" style={{ animationDelay: '0.3s' }}>
            <WeeklySummary />
          </div>
        </main>
      </DashboardLayout>
    </>
  );
};

export default Dashboard;
