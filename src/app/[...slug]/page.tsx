import FAQPage from '@/components/FAQPage';
import RichContent from '@/components/RichContent';
import { cmsPagesServices } from '@/lib/server/cmsPagesServices';
import { FAQItem } from '@/types/fe';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const all_data = (await cmsPagesServices.getAllFooterContent()) || [];

  return all_data.map((page) => ({
    slug: page.slug.split('/')
  }));
}

export default async function Page({ params }: { params: { slug: string[] | string } }) {
  const slugParam = Array.isArray(params.slug) ? params.slug.join('/') : params.slug;

  const data = await cmsPagesServices.getPageDataUsingSlug(slugParam);

  if (!data) {
    return notFound();
  }

  switch (data.type) {
    case 'faqs':
      return <FAQPage data={data.faqs as unknown as FAQItem[]} title={data.title} />;
    case 'informative':
      return <RichContent content={data.richContent as string} title={data.title} />;
    default:
      return notFound();
  }
}
