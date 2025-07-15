import { DoubleDotIconSvg } from '@/components/icons';
import { steps } from '@/constants/LandingPage';
import { Images } from '@/lib/images';
import Image from 'next/image';

function HowItWorks() {
  return (
    <section className="w-full bg-[#111111] py-16">
      <div className="mx-auto max-w-[1920px] px-10">
        <h2 className="mb-2 flex items-center text-3xl font-semibold">
          <DoubleDotIconSvg />
          &nbsp;How it Works&nbsp;
          <DoubleDotIconSvg className="rotate-180" />
        </h2>
        <p className="mb-8 text-sm text-[#A0A0A0]">Focusing on the positive experience of buying and selling in the marketplace.</p>
        <div className="mx-auto grid max-w-[1920px] grid-cols-1 items-start gap-8 px-4 md:grid-cols-2">
          <ul className="w-full max-w-full space-y-8 place-self-center text-gray-300">
            {steps.map((step, i) => (
              <li key={i} className="flex h-full max-h-20 rounded-tr-2xl rounded-br-2xl bg-[#0A0502]">
                <div
                  className="mr-4 flex h-20 min-w-20 items-center justify-center rounded-md bg-[#FFFFFF] text-2xl font-bold"
                  style={{ color: step.color }}
                >
                  {step.step}
                </div>
                <div className="flex flex-col justify-evenly p-2">
                  <p className="text-sm font-semibold text-[#CECECE] sm:text-base md:text-lg">{step.title}</p>
                  <p className="text-[10px] font-semibold text-[#A0A0A0] sm:text-xs md:text-sm">{step.desc}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex flex-row items-end justify-end gap-4">
            <div className="flex flex-col gap-4">
              <div className="flex justify-end overflow-hidden rounded-md">
                <Image src={Images.photographer_image} alt="Photographer" width={245} height={162} className="object-cover" />
              </div>
              <div className="flex justify-end overflow-hidden rounded-md">
                <Image src={Images.meeting_image} alt="Team Working" width={334} height={229} className="object-cover" />
              </div>
              <div className="flex justify-end overflow-hidden rounded-md">
                <Image src={Images.meeting_image_2} alt="Meeting" width={245} height={165} className="object-cover" />
              </div>
            </div>

            <div className="flex flex-col gap-4 self-end">
              <div className="flex justify-end overflow-hidden rounded-md">
                <Image src={Images.robot_image} alt="Robot Typing" width={249} height={207} className="object-cover" />
              </div>
              <div className="flex justify-end overflow-hidden rounded-md">
                <Image src={Images.man_image} alt="Man Standing" width={249} height={368} className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
