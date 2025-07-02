'use client';
import { getUserDetailsAction } from '@/actions/AdminUserActions';
import InputGroup from '@/components/FormElements/InputGroup';
import Loader from '@/components/Loader';
import SmallLoader from '@/components/SmallLoader';
import { PRIVATE_ROUTE } from '@/constants/app-routes';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Form, Button, Typography } from 'antd';
import TextField from '@/components/TextField';

function UserDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form] = Form.useForm();

  const [userDetailsPage, setUserDetailsPage] = useState<{ [key: string]: any }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserDetails = async () => {
    const response = await getUserDetailsAction(id as string);

    if (response.success) {
      setUserDetailsPage(response.data as { [key: string]: any });
    } else {
      toast.error(response.error);
      redirectToPreviousPage();
    }
    setIsLoading(false);
  };

  const redirectToPreviousPage = () => {
    router.push(PRIVATE_ROUTE.ADMIN_USERS_DASHBOARD_PATH);
  };

  const handleFinish = async (values: any) => {
    setIsLoading(true);
    try {
      const { first_name, last_name, is_banned } = values;
      console.log('Updated:', { first_name, last_name, is_banned });

      toast.success('User updated successfully');
      redirectToPreviousPage();
    } catch (err) {
      toast.error('Failed to update user');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchUserDetails();
  }, []);

  return (
    <div className="rounded-[10px] bg-[#122031]">
      {isLoading && <Loader />}
      <div className="w-full p-4">
        <InputGroup
          className="mb-5 w-full sm:w-9/12 md:w-1/2"
          value={userDetailsPage.first_name}
          placeholder="First Name"
          label="First Name"
          name="first_name"
          type="text"
          error=""
        />

        <InputGroup
          className="mb-5 w-full sm:w-9/12 md:w-1/2"
          value={userDetailsPage.last_name}
          placeholder="Last Name"
          label="Last Name"
          name="last_name"
          type="text"
          error=""
        />

        <InputGroup
          className="mb-5 w-full sm:w-9/12 md:w-1/2"
          value={userDetailsPage.email}
          placeholder="Email"
          label="Email"
          name="email"
          disabled={true}
          type="text"
          error=""
        />

        <div className="mb-5 flex items-center gap-2">
          <input
            type="checkbox"
            name="is_banned"
            checked={userDetailsPage.is_banned}
            className="h-4 w-4 rounded border-gray-300"
            aria-label="Banned status"
          />
          <label className="text-sm font-medium text-gray-300">Banned</label>
        </div>

        <div className="flex justify-start gap-3">
          <button
            className="border-stroke cursor-pointer rounded-lg border border-[#374151] px-6 py-[7px] font-medium text-white"
            type="button"
            onClick={redirectToPreviousPage}
          >
            Cancel
          </button>

          <button
            className="text-gray-2 hover:bg-opacity-90 rounded-lg bg-[#5750F1] px-6 py-[7px] font-medium"
            type="submit"
            disabled={isLoading}
          >
            Save <SmallLoader loading={isLoading} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserDetailsPage;
