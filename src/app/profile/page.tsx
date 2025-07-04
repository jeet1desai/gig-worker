import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StarIcon, PencilIcon } from "lucide-react";

export default function UserProfilePage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 px-4 py-6 md:px-8 lg:px-16">
        
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
            <p className="text-sm text-gray-300">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Profile Views</p>
                <p>2046</p>
              </div>
              <div>
                <p className="text-gray-400">Likes</p>
                <p>309</p>
              </div>
              <div>
                <p className="text-gray-400">Avg Paid Rate</p>
                <p>₹ 900 pr/hr</p>
              </div>
              <div>
                <p className="text-gray-400">Rating</p>
                <p className="inline-flex items-center gap-1">
                  4.5 <StarIcon className="w-4 h-4 fill-yellow-400" />
                </p>
              </div>
            </div>

            {/* Rate */}
            <div className="text-sm text-blue-300">
              <p className="font-semibold">Rate</p>
              <p>₹ 2000 - 2500/hr</p>
            </div>

            {/* Expertise */}
            <div>
              <h3 className="font-semibold text-white mb-1">Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {"User Experience,User Interface,User Research,User Interface".split(",").map((item) => (
                  <Badge key={item} className="bg-gray-700 border border-gray-600 text-white">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div>
              <h3 className="font-semibold text-white mb-1">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {"Research,Prototype,Interviews,Wireframes,UI".split(",").map((item) => (
                  <Badge key={item} className="bg-gray-800 text-white">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Followers */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Followers</p>
                <p>1396</p>
              </div>
              <div>
                <p className="text-gray-400">Following</p>
                <p>246</p>
              </div>
            </div>

            {/* Ratings */}
            <div>
              <h3 className="font-semibold text-white mb-2">Ratings</h3>
              {[1, 2].map((_, i) => (
                <div key={i} className="text-sm mb-2">
                  <p className="text-gray-300 mb-1">
                    Efficient to work with Lorem ipsum dolor sit amet, consectetur adipiscing elit...
                  </p>
                  <p className="text-gray-500 text-xs">Anil Mishra (Senior UI/UX Designer)</p>
                </div>
              ))}
            </div>

            {/* Work Experience */}
            <div>
              <h3 className="font-semibold text-white mb-2">Work Experience (7)</h3>
              <div className="text-sm mb-2">
                <p className="font-medium">Senior Brand Identity Designer</p>
                <p className="text-gray-400">ABC Technologies</p>
                <p className="text-gray-500">2019 - Present • 5 years</p>
              </div>
              <div className="text-sm">
                <p className="font-medium">Senior Brand Identity Designer</p>
                <p className="text-gray-400">Client Name</p>
                <p className="text-gray-500">2019 - Present • 5 years</p>
              </div>
            </div>

            {/* Education */}
            <div>
              <h3 className="font-semibold text-white mb-2">Education</h3>
              <div className="text-sm">
                <p className="font-medium">UI/UX Design Essentials</p>
                <p className="text-gray-400">Meta 2019 - 2023</p>
              </div>
              <div className="text-sm mt-2">
                <p className="font-medium">Wireframing and Prototyping</p>
                <p className="text-gray-400">University of Maryland 2023 - 2024</p>
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
