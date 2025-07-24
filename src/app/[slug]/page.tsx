import FAQPage from '@/components/FAQPage';
import RichContent from '@/components/RichContent';
import { BASE_API_URL } from '@/constants';
import { PUBLIC_API_ROUTES } from '@/constants/app-routes';
import { CMSPage, FAQItem } from '@/types/fe';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  try {
    const res = await fetch(`${baseUrl}/${BASE_API_URL}/${PUBLIC_API_ROUTES.CMS_PARENT_API}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    const data = await res.json();

    const slugs = data.items
      .filter((item: CMSPage) => item.isPublished)
      .map((page: CMSPage) => ({
        slug: page.slug
      }));

    return slugs;
  } catch (err: any) {
    console.error('generateStaticParams error:', err.message);
    return [];
  }
}

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = await params;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  try {
    const res = await fetch(`${baseUrl}/${BASE_API_URL}/${PUBLIC_API_ROUTES.CMS_PARENT_API}?slug=${slug}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    const pageData: CMSPage | undefined = data?.items?.[0];

    if (!pageData) {
      return <div>404: Page Not Found</div>;
    }

    switch (pageData.type) {
      case 'faqs':
        return <FAQPage data={pageData.faqs as FAQItem[]} title={pageData.title} />;
      case 'informative':
        return <RichContent content={pageData.richContent as string} title={pageData.title} />;
      default:
        return notFound();
    }
  } catch (error: any) {
    console.error('CMS Page fetch error:', error.message);
    return <div>Something went wrong</div>;
  }
}
