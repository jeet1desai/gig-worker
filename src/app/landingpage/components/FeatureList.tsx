import { AchievementIconSvg, DollarIconSvg, SafeIconSvg } from '@/components/icons';
import { Images } from '@/lib/images';
import Image from 'next/image';

function FeatureList() {
  return (
    <section className="w-full bg-[#111111] py-16 text-white">
      <div className="mx-auto grid max-w-[1920px] items-center gap-10 px-4 sm:px-6 md:grid-cols-2 lg:px-10">
        <div className="relative mx-auto aspect-[1076/716] w-full max-w-[845px] rounded-sm border-none">
          <Image
            src={Images.laptop_girl_image}
            alt="Images.laptop_girl_image"
            fill
            className="object-contain"
          />
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl leading-snug font-semibold sm:text-3xl md:text-4xl lg:text-5xl">
            A whole world of freelance talent at your fingertips
          </h2>

          <ul className="space-y-6 text-gray-300">
            <li className="flex items-start space-x-4">
              <AchievementIconSvg className="mt-1 min-w-[24px]" />
              <div>
                <h3 className="text-xl font-medium text-white sm:text-2xl md:text-3xl">
                  Proof of quality
                </h3>
                <p className="mt-1 text-base font-normal text-[#FFFFFF] sm:text-lg md:text-xl">
                  Check any pro's work samples, client reviews, and identity verification.
                </p>
              </div>
            </li>

            <li className="flex items-start space-x-4">
              <DollarIconSvg className="mt-1 min-w-[24px]" />
              <div>
                <h3 className="text-xl font-medium text-white sm:text-2xl md:text-3xl">
                  No cost until you hire
                </h3>
                <p className="mt-1 text-base font-normal text-[#FFFFFF] sm:text-lg md:text-xl">
                  Check any pro's work samples, client reviews, and identity verification.
                </p>
              </div>
            </li>

            <li className="flex items-start space-x-4">
              <SafeIconSvg className="mt-1 min-w-[24px]" />
              <div>
                <h3 className="text-xl font-medium text-white sm:text-2xl md:text-3xl">
                  Safe and secure
                </h3>
                <p className="mt-1 text-base font-normal text-[#FFFFFF] sm:text-lg md:text-xl">
                  Check any pro's work samples, client reviews, and identity verification.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default FeatureList;
