import Link from 'next/link';
import { FacebookIconSvg, InstagramIconSvg, LinkedInIconSvg, TwitterIconSvg } from './icons';
import Image from 'next/image';
import { Images } from '@/lib/images';
import { FACEBOOK_PROFILE_PATH, INSTAGRAM_PROFILE_PATH, LINKEDIN_PROFILE_PATH, TWITTER_PROFILE_PATH } from '@/constants/app-routes';
import { PUBLIC_ROUTE } from '@/constants/app-routes';

function Footer() {
  return (
    <footer className="bg-[#111111] text-white border-t-4 border-[#404040]">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center space-x-2">
            <div className="relative w-[200px] aspect-[200/113] flex items-center justify-center">
              <Image src={Images.logo} alt="logo" fill className="object-contain object-center" />
            </div>
            <div className="relative w-full max-w-auto aspect-[130/22]">
              <Image src={Images.big_logo_icon} alt="logo" fill className="object-contain" />
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-300">Your one stop marketplace for exclusive design resource</p>
        </div>

        <div>
          <h2
            className="bg-clip-text text-transparent font-semibold italic text-sm"
            style={{
              backgroundImage:
                'linear-gradient(271.26deg, #A8E5EC -32.48%, #1CBAE0 -6.29%, #6C98EE 19.89%, #AB9EF5 55.1%, #CF8CCC 88.51%, #FFB9C7 111.09%, #FFC29F 140.88%)',
            }}
          >
            For User
          </h2>
          <div className="space-y-2 text-sm text-gray-300 flex flex-col">
            <Link href="#" className="font-inter">
              Post an Opportunity
            </Link>
            <Link href="#" className="font-inter">
              Project management
            </Link>
            <Link href="#" className="font-inter">
              Why us?
            </Link>
            <Link href="#" className="font-inter">
              FAQs
            </Link>
          </div>
        </div>

        <div>
          <h2
            className="bg-clip-text text-transparent font-semibold italic text-sm"
            style={{
              backgroundImage:
                'linear-gradient(271.26deg, #A8E5EC -32.48%, #1CBAE0 -6.29%, #6C98EE 19.89%, #AB9EF5 55.1%, #CF8CCC 88.51%, #FFB9C7 111.09%, #FFC29F 140.88%)',
            }}
          >
            For Provider
          </h2>
          <div className="space-y-2 text-sm text-gray-300 flex flex-col">
            <Link href="#" className="font-inter">
              Create a portfolio
            </Link>
            <Link href="#" className="font-inter">
              Freelancing
            </Link>
            <Link href="#" className="font-inter">
              Why us?
            </Link>
            <Link href="#" className="font-inter">
              FAQs
            </Link>
          </div>
        </div>

        <div className="space-y-2 text-sm text-gray-300 flex flex-col">
          <Link href="#" className="font-inter">
            Community
          </Link>
          <Link href={PUBLIC_ROUTE.ABOUT} className="font-inter">
            About us
          </Link>
          <Link href="#" className="font-inter">
            FAQs
          </Link>
          <Link href="#" className="font-inter">
            Contact us
          </Link>
        </div>
      </div>

      <div
        className="h-[2px] w-full max-w-[1920px] mx-auto"
        style={{
          background:
            'linear-gradient(271.26deg, #A8E5EC -32.48%, #1CBAE0 -6.29%, #6C98EE 19.89%, #AB9EF5 55.1%, #CF8CCC 88.51%, #FFB9C7 111.09%, #FFC29F 140.88%)',
        }}
      ></div>

      <div className="max-w-[1920px] mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
        <div className="space-x-4">
          <Link href="#" className="font-inter">
            Terms & Conditions
          </Link>
          <span>|</span>
          <Link href="#" className="font-inter">
            Privacy Policy
          </Link>
          <span>|</span>
          <Link href="#" className="font-inter">
            Code of conduct
          </Link>
        </div>

        <div className="flex space-x-4 mt-4 md:mt-0">
          <Link href={LINKEDIN_PROFILE_PATH} target="_blank" rel="noopener noreferrer">
            <LinkedInIconSvg />
          </Link>
          <Link href={INSTAGRAM_PROFILE_PATH} target="_blank" rel="noopener noreferrer">
            <InstagramIconSvg />
          </Link>
          <Link href={TWITTER_PROFILE_PATH} target="_blank" rel="noopener noreferrer">
            <TwitterIconSvg />
          </Link>
          <Link href={FACEBOOK_PROFILE_PATH} target="_blank" rel="noopener noreferrer">
            <FacebookIconSvg />
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
