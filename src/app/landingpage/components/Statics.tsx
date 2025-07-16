import {
  getAllCompletedGigsNumber,
  getAllCreatedGigsNumber,
  getAllFreelancersNumber,
  getAllPositiveReviewsNumber
} from '@/lib/server/cmsLandingPageStats';

async function Statics() {
  const totalFreelancers = await getAllFreelancersNumber();
  const totalPostiveReviews = await getAllPositiveReviewsNumber();
  const totalGigsCreated = await getAllCreatedGigsNumber();
  const totalCompletedGigs = await getAllCompletedGigsNumber();

  return (
    <section className="mx-auto w-full max-w-[1920px] rounded-lg border border-[#FFFFFF] bg-[#111111]">
      <div className="grid grid-cols-2 px-10 py-10 text-center md:grid-cols-4">
        <div className="text-xl">
          <div className="text-3xl font-bold text-[#FFFFFF] sm:text-4xl">{totalFreelancers}</div>
          <div className="text-sm text-[#FFFFFF] sm:text-base">Total Freelancer</div>
        </div>

        <div className="text-xl">
          <div className="text-3xl font-bold text-[#FFFFFF] sm:text-4xl">{totalPostiveReviews}</div>
          <div className="text-sm text-[#FFFFFF] sm:text-base">Positive Review</div>
        </div>

        <div className="text-xl">
          <div className="text-3xl font-bold text-[#FFFFFF] sm:text-4xl">{totalGigsCreated}</div>
          <div className="text-sm text-[#FFFFFF] sm:text-base">Order received</div>
        </div>

        <div className="text-xl">
          <div className="text-3xl font-bold text-[#FFFFFF] sm:text-4xl">{totalCompletedGigs}</div>
          <div className="text-sm text-[#FFFFFF] sm:text-base">Projects Completed</div>
        </div>
      </div>
    </section>
  );
}

export default Statics;
