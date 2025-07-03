import { Images } from '@/lib/images';
import Image from 'next/image';
import Link from 'next/link';

function HeroSection() {
  return (
    <section className="w-full bg-[#000000] py-20">
      <div className="mx-auto flex max-w-[1920px] flex-col items-center justify-between gap-10 px-4 sm:px-6 md:px-10 lg:flex-row">
        <div className="ml-auto max-w-full text-center sm:max-w-[50%] md:max-w-[50%] lg:text-left">
          <div className="flex items-center justify-between">
            <div className="mb-2 flex max-w-max items-center rounded-lg border border-[#191919] bg-[#0A0502] px-2 py-1 text-sm font-medium text-[#ACAAA5]">
              <span className="text-4xl text-orange-600"> · </span>&nbsp;
              <span>Freelance Marketplace</span>
            </div>
            <div className="relative flex aspect-[165/60] w-[165px] items-center justify-center">
              <Image src={Images.round_arrow} alt="round_arrow" fill className="object-contain object-center" />
            </div>
          </div>
          <h1 className="mb-4 text-3xl leading-tight font-extrabold sm:text-3xl md:text-6xl">
            On-Demand <span className="text-[#FFB9C7]">Services</span> for Your Every Need
          </h1>
          <p className="mb-6 text-sm text-[#383937] sm:text-base">
            We pride ourselves on offering a seamless, secure, and efficient experience. Browse through thousands of trusted service providers, read
            reviews, compare prices.
          </p>
          <Link href="#" className="font-inter">
            <div className="inline-block rounded-lg bg-[linear-gradient(45deg,_#20cbff,_#bd9ef5,_#FFC29F)] p-[1px]">
              <button className="hover:bg-opacity-80 h-full w-full cursor-pointer rounded-lg px-5 py-2 text-[#FFFFFF] transition">
                Explore Gigs
              </button>
            </div>
          </Link>
          <div className="flex items-center">
            <div className="relative mr-2 flex aspect-[109/40] w-[109px] items-center justify-center">
              <Image src={Images.reviewers_image} alt="reviewers_image" fill className="object-contain object-center" />
            </div>
            <div>
              <div className="mt-4 text-sm text-yellow-400 sm:text-base">⭐⭐⭐⭐⭐ 4.8/5</div>
              <p className="mb-6 text-sm text-[#383937] sm:text-base">Trusted by 5,300+ customers</p>
            </div>
          </div>
        </div>
        <div className="mt-10 w-full max-w-sm lg:mt-0">
          <Image src={Images.hero_image} alt="Hero" width={400} height={400} className="h-auto w-full rounded-lg" />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
