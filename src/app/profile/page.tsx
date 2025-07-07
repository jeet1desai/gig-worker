import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StarIcon, PencilIcon } from "lucide-react";

export default function UserProfilePage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 px-4 md:px-8 lg:px-16">
        {/* LEFT SIDEBAR */}
        <Card className="bg-[#111] rounded-2xl overflow-hidden border border-gray-800 shadow-md lg:col-span-1">
          {/* Banner Section */}
          <div className="relative h-40 bg-gradient-to-r from-[#C084FC] via-[#F871A0] to-[#60A5FA] rounded-b-3xl">
            <div className="absolute top-4 right-4">
              <PencilIcon className="w-5 h-5 text-white hover:text-gray-300 cursor-pointer" />
            </div>
          </div>

          {/* Avatar & Basic Info */}
          <div className="relative -mt-16 flex flex-col items-center px-4">
            <Avatar className="w-24 h-24 border-4 border-black">
              <AvatarImage src="/avatar.jpg" />
              <AvatarFallback className="bg-yellow-500 text-black">U</AvatarFallback>
            </Avatar>
            <h1 className="mt-2 text-lg font-semibold">Name</h1>
            <a href="http://personalwebsite.com" className="text-blue-400 text-sm hover:underline">http://personalwebsite.com</a>
            <p className="text-xs text-gray-400">DK Member Since 2019</p>
            <p className="text-sm text-gray-300">Bangalore, India</p>

            <div className="flex gap-4 mt-4">
              <button className="bg-blue-500 text-white px-4 py-1 text-sm rounded">Follow</button>
              <button className="bg-gray-700 text-white px-4 py-1 text-sm rounded">Message</button>
            </div>
          </div>

          <CardContent className="pt-6 space-y-6 px-6 pb-8">
            {/* About */}
            <div className="bg-black rounded-xl px-4 py-4">
              <h3 className="text-sm font-semibold mb-2">About Designer</h3>
              <p className="text-sm text-gray-300">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labpr.
              </p>
            </div>

            {/* Stats */}
            <div className="rounded-xl border border-gray-700 grid grid-cols-4 text-center text-sm overflow-hidden">
              <div className="px-2 py-3 bg-black border-r border-gray-700">
                <p className="text-gray-400">Profile Views</p>
                <p className="text-white font-medium">2046</p>
              </div>
              <div className="px-2 py-3 bg-black border-r border-gray-700">
                <p className="text-gray-400">Likes</p>
                <p className="text-white font-medium">309</p>
              </div>
              <div className="px-2 py-3 bg-black border-r border-gray-700">
                <p className="text-gray-400">Avg paid rate</p>
                <p className="text-white font-medium">₹ 900 pr/hr</p>
              </div>
              <div className="px-2 py-3 bg-black">
                <p className="text-gray-400">Ratings</p>
                <p className="inline-flex items-center justify-center gap-1 font-medium text-green-400">
                  4.5 <StarIcon className="w-4 h-4 fill-green-500 text-green-500" />
                </p>
              </div>
            </div>

            {/* Rate */}
            <div className="bg-black rounded-xl px-4 py-3">
              <h3 className="text-sm font-semibold mb-1">Rate</h3>
              <div className="text-blue-300 bg-[#1a1a1a] inline-block px-3 py-1 rounded-full text-sm font-medium">
                2000 - 2500₹/hr
              </div>
            </div>

            {/* Expertise */}
            <div className="bg-black rounded-xl px-4 py-4">
              <h3 className="text-sm font-semibold mb-2">✨ Expertise</h3>
              <div className="flex flex-wrap gap-4 text-sm underline text-white">
                {"User Experience,User Interface,User Research,User Interface".split(",").map((item) => (
                  <a key={item} href="#" className="hover:text-blue-400">{item}</a>
                ))}
              </div>
              <hr className="my-4 border-gray-800" />

              {/* Skills */}
              <h3 className="text-sm font-semibold mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {"Research,Prototype,Interviews,Wireframes,UI,Interviews,Wireframes,UI".split(",").map((item) => (
                  <span
                    key={item}
                    className="bg-[#1b1b1b] text-white text-sm px-3 py-1 rounded-full"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Followers */}
            <div className="bg-black rounded-xl flex text-center divide-x divide-gray-800">
              <div className="flex-1 py-4">
                <p className="text-sm text-gray-400">Followers</p>
                <p className="text-lg font-semibold">1396</p>
              </div>
              <div className="flex-1 py-4">
                <p className="text-sm text-gray-400">Following</p>
                <p className="text-lg font-semibold">246</p>
              </div>
            </div>

            {/* Ratings */}
            <div className="bg-black rounded-xl px-4 py-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Ratings</h3>
                <span className="text-xs text-gray-400">236 Reviews</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-green-500 text-white px-2 py-0.5 rounded text-sm w-fit">
                4.5 <StarIcon className="w-4 h-4 fill-white" />
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

            {/* Education */}
            <div className="bg-black rounded-xl px-4 py-4 space-y-3">
              <h3 className="text-sm font-semibold text-gray-300">Education</h3>

              <div className="flex justify-between text-sm">
                <span className="text-white">UI/UX Design Essentials</span>
                <span className="text-gray-400">Meta 2019 - 2023</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-white">Wireframing and Prototyping</span>
                <span className="text-gray-400">University of Maryland 2023 - 2024</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* RIGHT SECTION */}
        <div className="lg:col-span-3">
          <Card className="bg-[#111] min-h-[800px] border border-dashed border-gray-700 rounded-2xl flex items-center justify-center text-gray-500">
            <CardContent>
              {/* You can add content later here */}
              <p>Right side content area</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
