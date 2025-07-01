import { SearchIconSvg } from '@/components/icons';
import { Images } from '@/lib/images';
import { PUBLIC_ROUTE } from '@/constants/app-routes';
import Image from 'next/image';
import Link from 'next/link';

function Header() {
  return (
    <header className="bg-[#1D1D1D] w-full">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-10 py-4 flex flex-col lg:flex-row items-center gap-4 lg:gap-0 lg:justify-between">
        <div className="w-full lg:w-1/3 flex justify-center lg:justify-start">
          <div className="relative w-[120px] aspect-[120/60] flex items-center justify-center">
            <Image src={Images.logo} alt="logo" fill className="object-contain object-center" />
          </div>
        </div>

        <div className="relative w-full max-w-md lg:w-1/3">
          <input
            type="text"
            placeholder="Search"
            className="bg-[#252525] text-sm text-[#676767] placeholder-[#676767] py-2 pl-10 pr-4 rounded-full w-full outline-none"
          />
          <SearchIconSvg className="absolute top-3 left-4 text-gray-400 text-sm" />
        </div>

        <nav className="w-full lg:w-1/3 flex justify-center lg:justify-end flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link href="#" className="text-[#FFF2E3] text-base">
            Find Work
          </Link>
          <Link href="#" className="text-[#FFF2E3] text-base">
            Contracts
          </Link>
          <Link href={PUBLIC_ROUTE.LOGIN} className="text-[#FFF2E3] text-base">
            Login
          </Link>
          <Link href={PUBLIC_ROUTE.SIGNUP} className="text-[#FFF2E3] text-base">
            Signup
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
