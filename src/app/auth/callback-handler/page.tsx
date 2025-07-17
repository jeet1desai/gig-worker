'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from 'next-auth/react';
import { PRIVATE_ROUTE } from '@/constants/app-routes';
import Loader from '@/components/Loader';

export default function CallbackHandler() {
    const router = useRouter();

    useEffect(() => {
        async function checkSubscriptionAndRedirect() {
            const session = await getSession();

            if (!session) return;

            if (session.user?.subscription) {
                router.replace(PRIVATE_ROUTE.DASHBOARD);
            } else {
                router.replace(PRIVATE_ROUTE.PLANS);
            }
        }
        checkSubscriptionAndRedirect();
    }, [router]);

    return (
        <div className="h-screen w-screen flex items-center justify-center bg-black">
            <Loader isLoading={true} />
        </div>
    );
}
