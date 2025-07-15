'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { X, Upload, FileText, CalendarIcon, Loader, ArrowLeft } from 'lucide-react';
import { Form, Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import Image from 'next/image';

import DashboardLayout from '@/components/layouts/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

import { cn } from '@/lib/utils';
import { formatDate, formatDateInternational } from '@/lib/date-format';

import { useDispatch } from '@/store/store';
import { gigService } from '@/services/gig.services';

const TIER_OPTIONS = [
  { value: 'basic', label: 'Basic' },
  { value: 'standard', label: 'Standard' },
  { value: 'premium', label: 'Premium' }
];

const NewGigPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [keywordInput, setKeywordInput] = useState<string>('');

  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    tier: string;
    start_date: string;
    end_date: string;
    min_price: string;
    max_price: string;
    keywords: string[];
    attachments: File[];
    thumbnail?: File | null;
  }>({
    title: '',
    description: '',
    tier: 'basic',

    start_date: '',
    end_date: '',

    min_price: '',
    max_price: '',

    keywords: [],

    thumbnail: null,
    attachments: []
  });

  const handleSubmit = async (values: any, { setSubmitting, resetForm }: FormikHelpers<any>) => {
    try {
      console.log(values);

      const formData = new FormData();

      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('tier', values.tier);
      formData.append('start_date', values.start_date);
      formData.append('end_date', values.end_date);
      formData.append('price_min', values.min_price);
      formData.append('price_max', values.max_price);
      formData.append('keywords', values.keywords.join(','));
      [...values.attachments].forEach((file: File, index: number) => {
        console.log(file);
        formData.append('attachments', file);
      });
      if (values.thumbnail) {
        formData.append('thumbnail', values.thumbnail);
      }
      const response = await dispatch(gigService.createGig({ body: formData }) as any);
      if (response && response.data) {
        resetForm();
      }
    } catch (error: any) {
      console.error('Error creating gig:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const redirectToPreviousPage = () => {
    router.push('/gigs');
  };

  return (
    <DashboardLayout>
      <main className="space-y-4 p-3 pl-5 sm:space-y-6 sm:p-4 md:p-6">
        <div className="mb-8 flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="cursor-pointer rounded-xl hover:bg-[#374151]" onClick={redirectToPreviousPage}>
            <ArrowLeft className="h-4 w-4 text-white" />
          </Button>
          <h2 className="text-2xl font-bold text-white">Post Your Gig Request</h2>
        </div>

        <Formik
          initialValues={formData}
          enableReinitialize
          validationSchema={Yup.object().shape({
            title: Yup.string().required('Required'),
            description: Yup.string().required('Required'),
            tier: Yup.string().required('Required'),

            start_date: Yup.string().required('Required'),
            end_date: Yup.string().required('Required'),

            min_price: Yup.string().required('Required'),
            max_price: Yup.string().required('Required'),

            keywords: Yup.array(),

            attachments: Yup.array(),
            thumbnail: Yup.mixed().optional().notRequired()
          })}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values, getFieldProps, errors, touched, setFieldValue, handleSubmit, handleBlur }) => {
            return (
              <Form className="space-y-8" onSubmit={handleSubmit}>
                <Card className="rounded-lg border-gray-700/50 bg-inherit text-white">
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Gig Title *</Label>
                        <Input
                          id="title"
                          placeholder="e.g., Need help with calculus homework"
                          className={cn(
                            '!h-10 w-full rounded-lg border-gray-700/50 bg-inherit px-4 py-2',
                            errors.title && touched.title && 'border-red-500'
                          )}
                          {...getFieldProps('title')}
                        />
                        {errors.title && touched.title && <div className="text-sm text-red-500">{errors.title}</div>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                          id="description"
                          {...getFieldProps('description')}
                          placeholder="Describe your gig in detail..."
                          rows={5}
                          className={cn(
                            '!h-10 w-full rounded-lg border-gray-700/50 bg-inherit px-4 py-2',
                            errors.description && touched.description && 'border-red-500'
                          )}
                        />
                        {errors.description && touched.description && <div className="text-sm text-red-500">{errors.description}</div>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tier">Tier</Label>
                        <Select value={values.tier} onValueChange={(value) => setFieldValue('tier', value)}>
                          <SelectTrigger
                            className={cn(
                              '!h-10 rounded-lg border-gray-700/50 bg-inherit px-4 py-2',
                              errors.tier && touched.tier && 'border-red-500'
                            )}
                          >
                            <SelectValue placeholder="Select tier" />
                          </SelectTrigger>
                          <SelectContent>
                            {TIER_OPTIONS.map((tier) => (
                              <SelectItem key={tier.value} value={tier.value}>
                                {tier.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.tier && touched.tier && <div className="text-sm text-red-500">{errors.tier}</div>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="thumbnail">Thumbnail (Optional)</Label>
                        <div className="flex w-full items-center justify-center">
                          <label
                            htmlFor="thumbnail"
                            className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed"
                          >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="text-muted-foreground mb-2 h-8 w-8" />
                              <p className="text-muted-foreground text-sm">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                              </p>
                            </div>
                            <input
                              id="thumbnail"
                              name="thumbnail"
                              type="file"
                              className="hidden"
                              accept="image/*"
                              multiple
                              onBlur={handleBlur}
                              onChange={(e) => {
                                const files = e.target.files;
                                if (files && files.length > 0) {
                                  setFieldValue('thumbnail', files[0]);
                                }
                              }}
                            />
                          </label>
                        </div>
                        {errors.thumbnail && touched.thumbnail && <div className="text-sm text-red-500">{errors.thumbnail}</div>}
                        <div>
                          {values.thumbnail && (
                            <div className="relative w-fit rounded-lg border border-gray-700/50 p-2">
                              <Image
                                src={URL.createObjectURL(values.thumbnail)}
                                alt="Thumbnail"
                                width={100}
                                height={100}
                                className="h-20 w-20 rounded-lg object-cover"
                              />
                              <Button
                                variant="destructive"
                                onClick={() => setFieldValue('thumbnail', null)}
                                className="absolute top-2 right-2 !size-4 rounded-full !p-1"
                              >
                                <X className="size-2" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-lg border-gray-700/50 bg-inherit text-white">
                  <CardHeader>
                    <CardTitle>Pricing</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="min_price">Minimum Price * ($)</Label>
                        <Input
                          id="min_price"
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          className={cn(
                            '!h-10 w-full rounded-lg border-gray-700/50 bg-inherit px-4 py-2',
                            errors.min_price && touched.min_price && 'border-red-500'
                          )}
                          {...getFieldProps('min_price')}
                        />
                        {errors.min_price && touched.min_price && <div className="text-sm text-red-500">{errors.min_price}</div>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="max_price">Maximum Price * ($)</Label>
                        <Input
                          id="max_price"
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          className={cn(
                            '!h-10 w-full rounded-lg border-gray-700/50 bg-inherit px-4 py-2',
                            errors.max_price && touched.max_price && 'border-red-500'
                          )}
                          {...getFieldProps('max_price')}
                        />
                        {errors.max_price && touched.max_price && <div className="text-sm text-red-500">{errors.max_price}</div>}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-lg border-gray-700/50 bg-inherit text-white">
                  <CardHeader>
                    <CardTitle>Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="start_date">Start Date *</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-full rounded-lg border-gray-700/50 bg-inherit px-4 py-2 text-left font-normal text-white hover:bg-inherit hover:text-white',
                                !values.start_date && 'text-muted-foreground hover:text-muted-foreground',
                                errors.start_date && touched.start_date && 'border-red-500'
                              )}
                            >
                              {values.start_date ? formatDate(values.start_date) : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              captionLayout="dropdown"
                              selected={values.start_date ? new Date(values.start_date) : undefined}
                              onSelect={(date: any) => setFieldValue('start_date', formatDateInternational(date))}
                            />
                          </PopoverContent>
                        </Popover>
                        {errors.start_date && touched.start_date && <div className="text-sm text-red-500">{errors.start_date}</div>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="end_date">End Date *</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-full rounded-lg border-gray-700/50 bg-inherit px-4 py-2 text-left font-normal text-white hover:bg-inherit hover:text-white',
                                !values.end_date && 'text-muted-foreground hover:text-muted-foreground',
                                errors.end_date && touched.end_date && 'border-red-500'
                              )}
                            >
                              {values.end_date ? formatDate(values.end_date) : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              captionLayout="dropdown"
                              selected={values.end_date ? new Date(values.end_date) : undefined}
                              onSelect={(date: any) => setFieldValue('end_date', formatDateInternational(date))}
                            />
                          </PopoverContent>
                        </Popover>
                        {errors.end_date && touched.end_date && <div className="text-sm text-red-500">{errors.end_date}</div>}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-lg border-gray-700/50 bg-inherit text-white">
                  <CardHeader>
                    <CardTitle>Keywords</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label>Add Keywords (Press Enter to add)</Label>
                      <Input
                        className="!h-10 w-full rounded-lg border-gray-700/50 bg-inherit px-4 py-2"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && keywordInput.trim()) {
                            e.preventDefault();
                            if (!values.keywords.includes(keywordInput.trim())) {
                              setFieldValue('keywords', [...values.keywords, keywordInput.trim()]);
                              setKeywordInput('');
                            }
                          }
                        }}
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                        placeholder="Type a keyword and press Enter"
                      />
                      <div className="mt-2 flex flex-wrap gap-2">
                        {values.keywords.map((keyword) => (
                          <div key={keyword} className="flex items-center rounded-full bg-white px-3 py-1 text-sm text-black">
                            {keyword}
                            <button
                              type="button"
                              onClick={() => {
                                const keywords = values.keywords.filter((kw: string) => kw !== keyword);
                                setFieldValue('keywords', keywords);
                              }}
                              className="text-muted-foreground hover:text-muted-foreground ml-2 rounded-full"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                      {errors.keywords && touched.keywords && <div className="text-sm text-red-500">{errors.keywords}</div>}
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-lg border-gray-700/50 bg-inherit text-white">
                  <CardHeader>
                    <CardTitle>Attachments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex w-full items-center justify-center">
                        <label
                          htmlFor="attachments"
                          className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="text-muted-foreground mb-2 h-8 w-8" />
                            <p className="text-muted-foreground text-sm">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                          </div>
                          <input
                            id="attachments"
                            name="attachments"
                            type="file"
                            className="hidden"
                            multiple
                            onChange={(e) => {
                              if (e.target.files) {
                                const files = Array.from(e.target.files);
                                setFieldValue('attachments', [...values.attachments, ...files]);
                              }
                            }}
                          />
                        </label>
                      </div>

                      {values.attachments.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Uploaded Files</h4>
                          <div className="space-y-2">
                            {values.attachments.map((file, index) => (
                              <div key={index} className="flex items-center justify-between rounded-lg border border-gray-700/50 p-2">
                                <div className="flex items-center space-x-2">
                                  <FileText className="text-muted-foreground h-4 w-4" />
                                  <span className="max-w-xs truncate text-sm">{file.name}</span>
                                  <span className="text-muted-foreground text-xs">{(file.size / 1024).toFixed(1)} KB</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setFieldValue(
                                      'attachments',
                                      values.attachments.filter((_, i) => i !== index)
                                    )
                                  }
                                  className="text-muted-foreground hover:text-destructive"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <div className="mb-10 flex justify-end space-x-4">
                  <Button type="button" className="bg-inherit text-white" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <Loader className="h-4 w-4 animate-spin" /> : 'Create Gig'}
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </main>
    </DashboardLayout>
  );
};

export default NewGigPage;
