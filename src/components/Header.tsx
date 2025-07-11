import { SearchIconSvg } from '@/components/icons';
import { PUBLIC_ROUTE } from '@/constants/app-routes';
import { Images } from '@/lib/images';
import Image from 'next/image';
import Link from 'next/link';

function Header() {
  return (
    <header className="w-full bg-[#1D1D1D]">
      <div className="mx-auto flex w-full max-w-[1920px] flex-col items-center gap-4 px-4 py-4 sm:px-6 md:px-10 lg:flex-row lg:justify-between lg:gap-0">
        <div className="flex w-full justify-center lg:w-1/3 lg:justify-start">
          <div className="relative flex aspect-[120/60] w-[120px] items-center justify-center">
            <Image
              src={Images.logo}
              alt="logo"
              fill
              className="object-contain object-center"
            />
          </div>
        </div>

        <div className="relative w-full max-w-md lg:w-1/3">
          <input
            type="text"
            placeholder="Search"
            className="w-full rounded-full bg-[#252525] py-2 pr-4 pl-10 text-sm text-[#676767] placeholder-[#676767] outline-none"
          />
          <SearchIconSvg className="absolute top-3 left-4 text-sm text-gray-400" />
        </div>

        <nav className="flex w-full flex-wrap justify-center gap-x-6 gap-y-2 text-sm lg:w-1/3 lg:justify-end">
          <Link href="#" className="text-base text-[#FFF2E3]">
            Find Work
          </Link>
          <Link href="#" className="text-base text-[#FFF2E3]">
            Contracts
          </Link>
          <Link
            href={PUBLIC_ROUTE.USER_LOGIN_PAGE_PATH}
            className="text-base text-[#FFF2E3]"
          >
            Login
          </Link>
          <Link href={PUBLIC_ROUTE.SIGNUP_PAGE_PATH} className="text-base text-[#FFF2E3]">
            Signup
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
