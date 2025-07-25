import * as yup from 'yup';

export const aboutUpdateSchema = yup.object({
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  bio: yup.string().max(500, 'Bio cannot exceed 500 characters')
});

export const profileTagsSchema = yup.object({
  skills: yup.array().of(yup.string().trim()).optional(),
  interests: yup.array().of(yup.string().trim()).optional(),
  extracurricular: yup.array().of(yup.string().trim()).optional()
});

export const educationSchema = yup.object({
  title: yup.string().trim().required('Title is required'),
  startYear: yup
    .string()
    .matches(/^\d{4}$/, 'Start year must be a 4-digit year'),
  endYear: yup
    .string()
    .matches(/^\d{4}$/, 'End year must be a 4-digit year')
    .test(
      'is-after-start',
      'End year must be greater than or equal to start year',
      function (endYear) {
        const { startYear } = this.parent;
        if (!startYear || !endYear) return true;
        return parseInt(endYear) >= parseInt(startYear);
      }
    )
});

export const educationListSchema = yup.object({
  educations: yup.array().of(educationSchema).required()
});
