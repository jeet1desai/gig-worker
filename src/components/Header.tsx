'use client';

import { SearchIconSvg } from '@/components/icons';
import { PRIVATE_ROUTE, PUBLIC_ROUTE } from '@/constants/app-routes';
import { Images } from '@/lib/images';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from "next-auth/react";
import * as Popover from '@radix-ui/react-popover';
import { LogOut, User } from 'lucide-react';
import { useCallback, useState } from 'react';
import CommonDeleteDialog from './CommonDeleteDialog';
import { signOut } from 'next-auth/react';
import { clearStorage } from '@/lib/local-storage';
import { useRouter } from 'next/navigation';

function Header() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    setIsLoading(true);
    await signOut({ redirect: false });
    setIsLoggingOut(false);
    clearStorage();
    router.push(PUBLIC_ROUTE.HOME);
    setIsLoading(false);
    router.refresh();
  }, [router]);
  return (
    <header className="w-full bg-[#1D1D1D]">
      <div className="mx-auto w-full max-w-[1920px] px-4 py-4 sm:px-6 md:px-10">
        <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-0">
          <div className="flex w-full flex-row items-center justify-between gap-4 lg:w-2/3 lg:justify-between">
            <div className="relative flex aspect-[120/60] w-[120px] items-center justify-center">
              <Image
                src={Images.logo}
                alt="logo"
                fill
                className="object-contain object-center"
              />
            </div>

            <div className="relative w-full max-w-lg lg:ml-10">
              <input
                type="text"
                placeholder="Search"
                className="w-full rounded-full bg-[#252525] py-2 pr-4 pl-10 text-sm text-[#676767] placeholder-[#676767] outline-none"
              />
              <SearchIconSvg className="absolute top-3 left-4 text-sm text-gray-400" />
            </div>
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
            <Link
              href={PUBLIC_ROUTE.SIGNUP_PAGE_PATH}
              className="text-base text-[#FFF2E3]"
            >
              Signup
            </Link>
          </nav>
        </div>

        <nav className="flex w-full items-center flex-wrap justify-center gap-x-6 gap-y-2 text-sm lg:w-1/3 lg:justify-end">
          <Link href="#" className="text-base text-[#FFF2E3]">
            Find Work
          </Link>
          <Link href="#" className="text-base text-[#FFF2E3]">
            Contracts
          </Link>
          {session?.user ? (
            <Popover.Root open={open} onOpenChange={setOpen} modal={false}>
              <Popover.Trigger asChild>
                <div className="flex cursor-pointer items-center space-x-2 border-l border-slate-700 pl-4">
                  <div className="hidden text-right sm:block">
                    <p className="max-w-[120px] truncate text-sm font-medium text-white">{session?.user.name}</p>
                    <p className="hidden text-xs text-slate-400 md:block">Web Developer</p>
                  </div>
                  <div className="relative">
                    <img
                      className="h-7 w-7 rounded-xl object-cover ring-2 ring-blue-500/20 transition-all duration-200 hover:scale-105 hover:ring-blue-500/40 sm:h-8 sm:w-8"
                      src="https://images.unsplash.com/profile-1704991443592-a7f79d25ffb1image?w=150&dpr=2&crop=faces&bg=%23fff&h=150&auto=format&fit=crop&q=60&ixlib=rb-4.1.0"
                      alt="Profile"
                      width={32}
                      height={32}
                      loading="lazy"
                    />
                    <div className="absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full border-2 border-slate-800 bg-green-500"></div>
                  </div>
                </div>
              </Popover.Trigger>

              <Popover.Portal>
                <Popover.Content
                  sideOffset={8}
                  align="end"
                  className="z-50 mt-2 w-44 rounded-md border border-slate-700 bg-slate-800 p-1 text-white shadow-lg"
                >
                  <Link
                    href={PRIVATE_ROUTE.USER_PROFILE}
                    className="flex w-full cursor-pointer items-center space-x-2 rounded-md px-3 py-2 text-sm outline-none hover:bg-slate-700 focus:outline-none focus-visible:ring-0"
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={() => setIsLoggingOut(true)}
                    className="flex w-full cursor-pointer items-center space-x-2 rounded-md px-3 py-2 text-sm outline-none hover:bg-slate-700 focus:outline-none focus-visible:ring-0"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          ) : (
            <>
              <Link href={PUBLIC_ROUTE.USER_LOGIN_PAGE_PATH} className="text-base text-[#FFF2E3]">
                Login
              </Link>
              <Link href={PUBLIC_ROUTE.SIGNUP_PAGE_PATH} className="text-base text-[#FFF2E3]">
                Signup
              </Link>
            </>
          )}
        </nav>
      </div>
      {isLoggingOut && (
        <CommonDeleteDialog
          open={isLoggingOut}
          title="Logout"
          isLoading={isLoading}
          description="Are you sure you want to logout?"
          onConfirm={handleLogout}
          cancelLabel="Cancel"
          confirmLabel="Logout"
          onOpenChange={setIsLoggingOut}
        />
      )}
    </header>
  );
}

export default Header;
