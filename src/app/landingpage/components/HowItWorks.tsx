'use client';

import { DoubleDotIconSvg } from '@/components/icons';
import Loader from '@/components/Loader';
import { working_steps } from '@/constants';
import { PUBLIC_API_ROUTES } from '@/constants/app-routes';
import { HttpStatusCode } from '@/enums/shared/http-status-code';
import { Images } from '@/lib/images';
import { toast } from '@/lib/toast';
import apiService from '@/services/api';
import { StepItem, StepsHomeResponse } from '@/types/fe';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

function HowItWorks() {
  const [steps, setSteps] = useState<StepItem[]>(working_steps as StepItem[]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getAllWorkingSteps = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiService.get<StepsHomeResponse>(PUBLIC_API_ROUTES.LANDING_PAGE_STEPS_LIST_API, { withAuth: true });

      if (response.data.data && response.data.data.length > 0 && response.status === HttpStatusCode.OK && response.data.message) {
        setSteps(response.data.data);
      }
    } catch (error: unknown) {
      console.error('Error fetching working steps', error);
      toast.error('Error fetching working steps');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getAllWorkingSteps();
  }, []);

  return (
    <section className="w-full bg-[#111111] py-16">
      <Loader isLoading={isLoading} />
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
              <li key={i} className="flex h-full max-h-20 rounded-tr-2xl rounded-br-2xl bg-[#0A0502] md:max-h-24">
                <div
                  className="mr-4 flex h-20 min-w-20 items-center justify-center rounded-md bg-[#FFFFFF] text-2xl font-bold md:h-24"
                  style={{ color: step.color }}
                >
                  {i + 1 < 10 ? `0${i + 1}` : `${i + 1}`}
                </div>
                <div className="flex flex-col justify-evenly p-2">
                  <p className="text-sm font-semibold text-[#CECECE] sm:text-base md:text-lg">{step.title}</p>
                  <p className="text-[10px] font-semibold text-[#A0A0A0] sm:text-xs md:text-[13px]">{step.description}</p>
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
