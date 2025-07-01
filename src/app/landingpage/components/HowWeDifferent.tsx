import { Images } from '@/lib/images';
import Image from 'next/image';

function HowWeDifferent() {
  return (
    <section className="w-full px-10 py-16 text-center">
      <div className="mx-auto max-w-[1920px]">
        <h2 className="mb-3 text-2xl font-bold">How are we Different?</h2>
        <div className="mb-6 text-sm font-[500] text-[#C7C7C7]">
          Why Us? Explore What Makes Our Design Platform Stand Out & Elevate Your
          Experience.
        </div>
        <div className="relative mx-auto aspect-[845/774] w-full max-w-[845]">
          <Image
            src={Images.how_it_works}
            alt="vein_diagram"
            fill
            className="object-contain"
          />
        </div>
      </div>
    </section>
  );
}

export default HowWeDifferent;
