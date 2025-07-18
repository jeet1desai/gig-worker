import { inter } from '@/lib/fonts';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { StarIcon } from 'lucide-react';
import { BulbSvg, DartSvg, HammerSvg } from '@/components/icons';
import TabSidebar from './_components/ProfileTabs';
import Header from '@/components/Header';
import EditProfilePhotoModal from '../../profile/components/EditProfilePhotoModal';

type Props = {
  searchParams: { tab?: string };
};

export default async function ProfilePage({ searchParams }: Props) {
  const activeTab = searchParams.tab || 'profile';

  const mode: 'user' | 'provider' = 'provider';

  const skills = [
    'UI Design',
    'Wireframe',
    'User Research',
    'Figma',
    'Prototyping'
  ];

  const extracurricular = [
    'Public Speaking',
    'Team Leadership',
    'Hackathons',
    'Public Speaking',
    'Team Leadership'
  ];

  const interests = ['Photography', 'Traveling', 'Gaming'];

  return (
    <div className="bg-foreground min-h-screen w-full">
      <Header />
      <main
        className={`w-full overflow-x-hidden overflow-y-auto bg-[#111111] font-sans text-white ${inter.className}`}
      >
        <div className="grid grid-cols-1 gap-6 px-4 py-6 md:px-8 lg:grid-cols-4 lg:px-16">
          <div className="rounded-xl bg-gradient-to-br from-[#1f2937] via-[#111827] to-[#0f172a] shadow-lg lg:col-span-1">
            <div className="relative mb-4 h-32 rounded-lg rounded-b-none bg-gradient-to-r from-[#6366f1] via-[#ec4899] to-[#0ea5e9] shadow-md"></div>

            <div className="-mt-20 flex flex-col items-center gap-2 px-4">
              <EditProfilePhotoModal avatarSrc="" name="John Doe" />
              <h1 className="mt-1 text-lg font-semibold">Name</h1>
              <p className="text-xs text-gray-400">DK Member Since 2019</p>

              <div className="mt-4 flex gap-4">
                <button className="rounded-md bg-gray-700 px-4 py-1 text-sm text-white shadow hover:bg-gray-600">
                  Message
                </button>
              </div>
            </div>

            <TabSidebar role={mode} />

            <Card className="mx-4 mt-6 mb-4 border-none bg-[#1f2937]">
              <CardContent className="space-y-4 pt-0 text-sm">
                <div>
                  <h3 className="mb-2 font-semibold text-white">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {['English', 'Hindi', 'French'].map((lang) => (
                      <Badge
                        key={lang}
                        className="bg-gray-700 px-2 py-1 text-xs text-white"
                      >
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mb-4 grid grid-cols-2 px-4">
              <div className="border-r-none rounded-lg rounded-r-none border border-gray-600 px-6 py-4 text-center">
                <h3 className="mb-1 text-sm font-semibold">Jobs Posted</h3>
                <p className="text-lg font-semibold text-yellow-100">2046</p>
              </div>
              <div className="border-l-none rounded-lg rounded-l-none border border-gray-600 px-6 py-4 text-center">
                <h3 className="mb-1 text-sm font-semibold">Ratings</h3>
                <span className="inline-flex items-center rounded-md bg-green-500 px-2 py-1 text-sm font-semibold text-white">
                  4.5 <StarIcon className="ml-1 h-4 w-4 fill-white" />
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <Card className="overflow-y-auto bg-[#111]">
                <CardContent className="space-y-6 px-6">
                  <div className="rounded-xl bg-black px-4 py-4">
                    <div className="flex items-center justify-between">
                      <h3 className="mb-2 text-sm font-semibold text-gray-300">
                        About
                      </h3>
                    </div>
                    <p className="text-sm text-white">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labpr.
                    </p>
                  </div>

                  <div className="space-y-6 rounded-xl bg-black px-4 py-5">
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="flex items-center gap-1.5 text-sm font-semibold text-gray-300">
                          <HammerSvg /> Skills
                        </h3>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {skills.map((item, idx) => (
                          <span
                            key={idx}
                            className="mt-1 rounded-full bg-[#1b1b1b] px-3 py-1 text-sm text-white"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="flex items-center gap-1.5 text-sm font-semibold text-gray-300">
                          <DartSvg /> Extracurricular
                        </h3>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-4 text-sm text-white underline">
                        {extracurricular.map((item, index) => (
                          <span key={index} className="hover:text-blue-400">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="flex items-center gap-1.5 text-sm font-semibold text-gray-300">
                          <BulbSvg /> Interests
                        </h3>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {interests.map((item, idx) => (
                          <span
                            key={idx}
                            className="mt-1 rounded-full bg-[#1a1a1a] px-3 py-1 text-sm text-white"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 rounded-xl bg-black px-4 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-5">
                        <h3 className="text-sm font-semibold text-gray-300">
                          Ratings
                        </h3>
                        <div className="inline-flex w-fit items-center gap-2 rounded bg-green-500 px-2 py-0.5 text-sm text-white">
                          4.5 <StarIcon className="h-4 w-4 fill-white" />
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">236 Reviews</span>
                    </div>

                    {[1, 2].map((_, i) => (
                      <div key={i} className="border-t border-gray-800 pt-4">
                        <p className="mb-2 text-sm text-gray-300">
                          Efficient to work with Lorem ipsum dolor sit amet,
                          consectetur adipiscing elit, sed do eiusmod tempor
                          incididunt ut labpr...
                        </p>
                        <div className="flex items-center gap-2">
                          <img
                            src="/avatar.jpg"
                            alt="Anil"
                            className="h-6 w-6 rounded-full"
                          />
                          <span className="text-xs text-gray-500">
                            Anil Mishra (Senior UI/UX Designer)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 rounded-xl bg-black px-4 py-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-300">
                        Education
                      </h3>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white">
                        UI/UX Design Essentials
                      </span>
                      <span className="text-gray-400">2019 - 2023</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-white">
                        Wireframing and Prototyping
                      </span>
                      <span className="text-gray-400">2023 - 2024</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'open-gigs' && (
              <div className="flex h-full min-h-[400px] items-center justify-center rounded-md border border-dashed border-gray-700 bg-[#111] text-gray-500">
                <span className="text-sm">Open gigs placeholder</span>
              </div>
            )}

            {activeTab === 'portfolio' && (
              <div className="flex h-full min-h-[400px] items-center justify-center rounded-md border border-dashed border-gray-700 bg-[#111] text-gray-500">
                <span className="text-sm">Gig portfolio placeholder</span>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
