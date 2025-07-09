'use client'

import { useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { StarIcon, PencilIcon, UserIcon, BriefcaseIcon } from "lucide-react";
import { inter } from "@/lib/fonts";
import DashboardLayout from "@/components/dashboard/layout";
import EditProfileModal from "./components/EditProfileModal";
import EditProfileTagsModal from "./components/EditProfileTagModal";
import EditEducationModal from "./components/EditEducationModal";
import EditProfilePhotoModal from "./components/EditProfilePhotoModal";
import { BulbSvg, HammerSvg, DartSvg } from "@/components/icons";

export default function UserProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");
  const skills = ["UI Design", "Wireframe", "User Research", "Figma", "Prototyping"];
  const extracurricular = ["Public Speaking", "Team Leadership", "Hackathons", "Public Speaking", "Team Leadership", "Hackathons"];
  const interests = ["Photography", "Traveling", "Gaming"];
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleBannerClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      
    }
  };

  return (
    <DashboardLayout>
      <main className={`min-h-screen w-full overflow-x-hidden bg-[#111111] font-sans text-white ${inter.className}`}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 px-4 py-6 md:px-8 lg:px-16">
          <div className="lg:col-span-1 bg-gradient-to-br from-[#1f2937] via-[#111827] to-[#0f172a] rounded-xl shadow-lg">
            <div className="relative h-32 bg-gradient-to-r from-[#6366f1] via-[#ec4899] to-[#0ea5e9] rounded-lg rounded-b-none mb-4 shadow-md">
              <div className="absolute top-2 right-2">
                <PencilIcon className="w-4 h-4 text-white hover:text-gray-300 cursor-pointer" onClick={handleBannerClick} />
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            </div>

            <div className="-mt-20 flex flex-col items-center gap-2 px-4">
              <EditProfilePhotoModal avatarSrc="" name="John Doe" />
              <h1 className="text-lg font-semibold mt-1">Name</h1>
              <p className="text-xs text-gray-400">DK Member Since 2019</p>

              <div className="flex gap-4 mt-4">
                <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-1 text-sm rounded-md shadow">Message</button>
              </div>
            </div>

            <div className="mt-6 space-y-2 px-4">
              <button
                className={`w-full flex items-center gap-3 text-left px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === "profile" ? "bg-gray-700 text-white" : "bg-gray-900 text-gray-400 hover:bg-gray-800"
                  }`}
                onClick={() => setActiveTab("profile")}
              >
                <UserIcon className="w-4 h-4" /> Profile
              </button>
              <button
                className={`w-full flex items-center gap-3 text-left px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === "opportunities" ? "bg-gray-700 text-white" : "bg-gray-900 text-gray-400 hover:bg-gray-800"
                  }`}
                onClick={() => setActiveTab("opportunities")}
              >
                <BriefcaseIcon className="w-4 h-4" /> Opportunities
              </button>
            </div>

            <Card className="bg-[#1f2937] mt-6 border-none mx-4 mb-4">
              <CardContent className="pt-0 space-y-4 text-sm">
                <div>
                  <h3 className="font-semibold text-white mb-2">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {['English', 'Hindi', 'French'].map((lang) => (
                      <Badge key={lang} className="bg-gray-700 text-white px-2 py-1 text-xs">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 px-4 mb-4">
              <div className="border border-gray-600 rounded-lg border-r-none rounded-r-none px-6 py-4 text-center">
                <h3 className="text-sm font-semibold mb-1">Jobs Posted</h3>
                <p className="text-lg font-semibold text-yellow-100">2046</p>
              </div>
              <div className="border border-gray-600 rounded-lg border-l-none rounded-l-none px-6 py-4 text-center">
                <h3 className="text-sm font-semibold mb-1">Ratings</h3>
                <span className="inline-flex items-center bg-green-500 text-white text-sm font-semibold px-2 py-1 rounded-md">
                  4.5 <StarIcon className="ml-1 w-4 h-4 fill-white" />
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            {activeTab === "profile" && (
              <Card className="bg-[#111]">
                <CardContent className="pt-6 space-y-6 px-6 pb-8">
                  <div className="bg-black rounded-xl px-4 py-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-300 mb-2">About</h3>
                      <EditProfileModal />
                    </div>
                    <p className="text-sm text-white">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labpr.
                    </p>
                  </div>

                  <div className="bg-black rounded-xl px-4 py-5 space-y-6">
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-1.5"><HammerSvg/> Skills</h3>
                        <EditProfileTagsModal />
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {skills.map((item, idx) => (
                          <span
                            key={idx}
                            className="bg-[#1b1b1b] text-white text-sm px-3 py-1 mt-1 rounded-full"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-1.5"><DartSvg/> Extracurricular</h3>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm mt-2 underline text-white">
                        {extracurricular.map((item, index) => (
                          <span key={index} className="hover:text-blue-400">{item}</span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-1.5"><BulbSvg/> Interests</h3>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {interests.map((item, idx) => (
                          <span
                            key={idx}
                            className="bg-[#1a1a1a] text-white text-sm px-3 py-1 mt-1 rounded-full"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-black rounded-xl px-4 py-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-5">
                        <h3 className="text-sm font-semibold text-gray-300">Ratings</h3>
                        <div className="inline-flex items-center gap-2 bg-green-500 text-white px-2 py-0.5 rounded text-sm w-fit">
                          4.5 <StarIcon className="w-4 h-4 fill-white" />
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">236 Reviews</span>
                    </div>

                    {[1, 2].map((_, i) => (
                      <div key={i} className="border-t border-gray-800 pt-4">
                        <p className="text-sm text-gray-300 mb-2">
                          Efficient to work with Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labpr...
                        </p>
                        <div className="flex items-center gap-2">
                          <img src="/avatar.jpg" alt="Anil" className="w-6 h-6 rounded-full" />
                          <span className="text-xs text-gray-500">Anil Mishra (Senior UI/UX Designer)</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-black rounded-xl px-4 py-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-300">Education</h3>
                      <EditEducationModal />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white">UI/UX Design Essentials</span>
                      <span className="text-gray-400">2019 - 2023</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-white">Wireframing and Prototyping</span>
                      <span className="text-gray-400">2023 - 2024</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "opportunities" && (
              <div className="h-full min-h-[400px] bg-[#111] border border-dashed border-gray-700 rounded-md flex items-center justify-center text-gray-500">
                <span className="text-sm">[ Opportunities content placeholder ]</span>
              </div>
            )}
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}
