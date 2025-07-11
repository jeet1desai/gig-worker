import * as yup from 'yup';

export const subscribeSchema = yup.object({
  subscriptionId: yup.string().nullable(),
  planId: yup.string().required('Plan id is required')
});
