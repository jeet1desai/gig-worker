'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import React, { useEffect, useState } from 'react';
import { ArrowLeft, Minus, Plus, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TipTapEditor from '@/components/TipTapEditor';
import { useParams, useRouter } from 'next/navigation';
import { PRIVATE_ROUTE, PUBLIC_API_ROUTES } from '@/constants/app-routes';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/lib/toast';
import { pageSchema } from '@/schemas/fe/auth';
import { Label } from '@/components/ui/label';
import { FAQItem, CMSPage, StepItem, CMSPageResponse, HeroSectionData } from '@/types/fe';
import apiService from '@/services/api';
import Loader from '@/components/Loader';
import { PageType } from '@prisma/client';
import { pageTypes, publish_type } from '@/constants';

function AddEditPage() {
  const [newPage, setNewPage] = useState<Partial<CMSPage>>({
    title: '',
    slug: '',
    type: '',
    isPublished: false,
    heroSection: {
      title: '',
      description: ''
    },
    faqs: [],
    steps: [],
    richContent: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();
  const { action_type, page_id } = useParams();

  const redirectToPreviousPage = () => {
    router.push(PRIVATE_ROUTE.ADMIN_CMS_PAGES_PATH);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  useEffect(() => {
    if (action_type === 'edit' && page_id) {
      getPageDetailsById();
    }
  }, [page_id]);

  const getPageDetailsById = async () => {
    setLoading(true);
    try {
      const response = await apiService.get<CMSPageResponse>(`${PUBLIC_API_ROUTES.CMS_CONTENT_ID_API}/${page_id}`, {
        withAuth: true
      });
      if (response.data.data && response.data.message) {
        setNewPage(response.data.data as unknown as CMSPage);
      }
    } catch (error: any) {
      if (error?.message && !error?.success) {
        router.push(PRIVATE_ROUTE.ADMIN_CMS_PAGES_PATH);
      }
      const message = error?.response?.data?.error?.message || error?.message || 'Failed to fetch page';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (action_type === 'add') {
      handleAdd();
    } else {
      handleUpdate();
    }
  };

  const handleAdd = async () => {
    setLoading(true);
    try {
      await pageSchema.validate(newPage, { abortEarly: false });

      const page: Omit<CMSPage, 'id'> = {
        title: newPage.title!,
        slug: newPage.slug!,
        type: newPage.type as CMSPage['type'],
        isPublished: newPage.isPublished || false,
        heroSection: newPage.type === PageType.landing ? newPage.heroSection : undefined,
        faqs: newPage.type === PageType.faqs ? newPage.faqs : undefined,
        steps: newPage.type === PageType.landing ? newPage.steps : undefined,
        richContent: [`${PageType.informative}`].includes(newPage.type!) ? newPage.richContent : undefined
      };

      const response = await apiService.post<CMSPageResponse>(`${PUBLIC_API_ROUTES.CMS_PARENT_API}`, page, {
        withAuth: true
      });
      if (response.data.data && response.data.message) {
        toast.success(response.data.message);
        resetForm();
        redirectToPreviousPage();
      }
    } catch (error: any) {
      if (error.inner && Array.isArray(error.inner)) {
        const errorMap: Record<string, string> = {};
        error.inner.forEach((err: any) => {
          if (err.path) errorMap[err.path] = err.message;
        });
        setFormErrors(errorMap);
      } else {
        const message = error?.response?.data?.error?.message || error?.message || 'Failed to create page';
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await pageSchema.validate(newPage, { abortEarly: false });

      const page: Omit<CMSPage, 'id'> = {
        title: newPage.title!,
        slug: newPage.slug!,
        type: newPage.type as CMSPage['type'],
        isPublished: newPage.isPublished || false,
        heroSection: newPage.type === PageType.landing ? newPage.heroSection : undefined,
        faqs: newPage.type === PageType.faqs ? newPage.faqs : undefined,
        steps: newPage.type === PageType.landing ? newPage.steps : undefined,
        richContent: [`${PageType.informative}`].includes(newPage.type!) ? newPage.richContent : undefined
      };

      const response = await apiService.patch<CMSPageResponse>(`${PUBLIC_API_ROUTES.CMS_CONTENT_ID_API}/${page_id}`, page, {
        withAuth: true
      });
      if (response.data.data && response.data.message) {
        toast.success(response.data.message);
        resetForm();
        redirectToPreviousPage();
      }
    } catch (error: any) {
      if (error.inner && Array.isArray(error.inner)) {
        const errorMap: Record<string, string> = {};
        error.inner.forEach((err: any) => {
          if (err.path) errorMap[err.path] = err.message;
        });
        setFormErrors(errorMap);
      } else {
        const message = error?.response?.data?.error?.message || error?.message || 'Failed to create page';
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNewPage({
      title: '',
      slug: '',
      type: '',
      isPublished: false,
      heroSection: {
        title: '',
        description: ''
      },
      faqs: [],
      steps: [],
      richContent: ''
    });
    setFormErrors({});
  };

  const addFaq = (pageData: Partial<CMSPage>, setPageData: (data: Partial<CMSPage>) => void) => {
    const newFaq: FAQItem = {
      id: Date.now().toString(),
      question: '',
      answer: '',
      isVisible: false
    };
    setPageData({
      ...pageData,
      faqs: [...(pageData.faqs || []), newFaq]
    });
    setFormErrors({ ...formErrors, faqs: '' });
  };

  const updateFaq = (
    pageData: Partial<CMSPage>,
    setPageData: (data: Partial<CMSPage>) => void,
    faqId: string,
    index: number,
    field: keyof FAQItem,
    value: string | boolean
  ) => {
    setPageData({
      ...pageData,
      faqs: pageData.faqs?.map((faq) => (faq.id === faqId ? { ...faq, [field]: value } : faq))
    });
    setFormErrors({
      ...formErrors,
      [`faqs[${index}].${field}`]: ''
    });
  };

  const removeFaq = (pageData: Partial<CMSPage>, setPageData: (data: Partial<CMSPage>) => void, faqId: string, index: number) => {
    setFormErrors({
      ...formErrors,
      [`faqs[${index}].qustion`]: '',
      [`faqs[${index}].answer`]: ''
    });
    setPageData({
      ...pageData,
      faqs: pageData.faqs?.filter((faq) => faq.id !== faqId)
    });
  };

  const addStep = (pageData: Partial<CMSPage>, setPageData: (data: Partial<CMSPage>) => void) => {
    const newStep: StepItem = {
      id: Date.now().toString(),
      title: '',
      description: '',
      color: '',
      order: (pageData.steps?.length || 0) + 1
    };
    setPageData({
      ...pageData,
      steps: [...(pageData.steps || []), newStep]
    });
    setFormErrors({ ...formErrors, steps: '' });
  };

  const updateStep = (
    pageData: Partial<CMSPage>,
    setPageData: (data: Partial<CMSPage>) => void,
    stepId: string,
    index: number,
    field: keyof StepItem,
    value: string | number
  ) => {
    setPageData({
      ...pageData,
      steps: pageData.steps?.map((step) => (step.id === stepId ? { ...step, [field]: value } : step))
    });
    setFormErrors({
      ...formErrors,
      [`steps[${index}].${field}`]: ''
    });
  };

  const removeStep = (pageData: Partial<CMSPage>, setPageData: (data: Partial<CMSPage>) => void, stepId: string, index: number) => {
    setFormErrors({
      ...formErrors,
      [`steps[${index}].qustion`]: '',
      [`steps[${index}].answer`]: ''
    });
    setPageData({
      ...pageData,
      steps: pageData.steps?.filter((step) => step.id !== stepId)
    });
  };

  const handleHeroSectionChange = (
    pageData: Partial<CMSPage>,
    setPageData: (data: Partial<CMSPage>) => void,
    key: keyof HeroSectionData,
    value: string
  ) => {
    setPageData({
      ...pageData,
      heroSection: { ...pageData.heroSection!, [key]: value }
    });
    setFormErrors((prev) => ({
      ...prev,
      [`heroSection.${key}`]: ''
    }));
  };

  const handleRichContentChange = (pageData: Partial<CMSPage>, setPageData: (data: Partial<CMSPage>) => void, value: string) => {
    setPageData({ ...pageData, richContent: value });
    setFormErrors({ ...formErrors, richContent: '' });
  };

  const handlePageTitleChange = (title: string) => {
    setNewPage({
      ...newPage,
      title,
      slug: generateSlug(title)
    });
    setFormErrors({ ...formErrors, title: '', slug: '' });
  };

  const handleSlugChange = (value: string) => {
    setNewPage({
      ...newPage,
      slug: value.toLocaleLowerCase()
    });
    setFormErrors({ ...formErrors, slug: '' });
  };

  const handlePagePublicationChange = (value: boolean) => {
    setNewPage({
      ...newPage,
      isPublished: value
    });
  };

  const handlePageTypeChange = (value: CMSPage['type']) => {
    setNewPage({ ...newPage, type: value });
    setFormErrors({ ...formErrors, type: '' });
  };

  const renderPageTypeSpecificFields = (pageData: Partial<CMSPage>, setPageData: (data: Partial<CMSPage>) => void) => {
    switch (pageData.type) {
      case PageType.landing:
        return renderLandingPageFields(pageData, setPageData);
      case PageType.informative:
        return renderInformativePageFields(pageData, setPageData);
      case PageType.faqs:
        return renderFAQsFields(pageData, setPageData);
      default:
        return null;
    }
  };

  const renderLandingPageFields = (pageData: Partial<CMSPage>, setPageData: (data: Partial<CMSPage>) => void) => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Hero Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="mb-2 block text-sm font-medium">Hero Title</Label>
            <TipTapEditor
              content={pageData.heroSection?.title || ''}
              onChange={(content: string) => handleHeroSectionChange(pageData, setPageData, 'title', content)}
              placeholder="Hero title"
            />
            {formErrors['heroSection.title'] && <p className="mt-1 text-sm text-red-500">{formErrors['heroSection.title']}</p>}{' '}
          </div>
          <div>
            <Label className="mb-2 block text-sm font-medium">Hero Description</Label>
            <Textarea
              className="bg-transparent"
              placeholder="Hero description"
              value={pageData.heroSection?.description || ''}
              onChange={(e) => handleHeroSectionChange(pageData, setPageData, 'description', e.target.value)}
              rows={3}
            />
            {formErrors['heroSection.description'] && <p className="mt-1 text-sm text-red-500">{formErrors['heroSection.description']}</p>}{' '}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Steps</CardTitle>
          <Button size="sm" onClick={() => addStep(pageData, setPageData)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Step
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {pageData.steps?.map((step, index) => (
            <Card key={step.id} className="p-4">
              <div className="mb-4 flex items-start justify-between">
                <h4 className="font-medium">Step {index + 1}</h4>
                <Button variant="outline" size="sm" className="bg-transparent" onClick={() => removeStep(pageData, setPageData, step.id, index)}>
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-3">
                <div>
                  <Label className="mb-1 block text-sm font-medium">Step Title</Label>
                  <Input
                    placeholder="Step title"
                    value={step.title}
                    onChange={(e) => updateStep(pageData, setPageData, step.id, index, 'title', e.target.value)}
                  />
                  {formErrors[`steps[${index}].title`] && <p className="mt-1 text-sm text-red-500">{formErrors[`steps[${index}].title`]}</p>}
                </div>
                <div>
                  <Label className="mb-1 block text-sm font-medium">Step Description</Label>
                  <Textarea
                    className="bg-transparent"
                    placeholder="Step description"
                    value={step.description}
                    onChange={(e) => updateStep(pageData, setPageData, step.id, index, 'description', e.target.value)}
                    rows={2}
                  />
                  {formErrors[`steps[${index}].description`] && (
                    <p className="mt-1 text-sm text-red-500">{formErrors[`steps[${index}].description`]}</p>
                  )}
                </div>
                <div>
                  <Label className="text-white">Choose Color</Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={step.color}
                      onChange={(e) => updateStep(pageData, setPageData, step.id, index, 'color', e.target.value)}
                      className="border-input h-10 w-12 cursor-pointer rounded-md border"
                    />
                    <Input
                      type="text"
                      value={step.color}
                      onChange={(e) => updateStep(pageData, setPageData, step.id, index, 'color', e.target.value)}
                      placeholder="Choose color"
                      className="flex-1"
                    />
                    <div className="border-input h-10 w-10 rounded-md border" style={{ backgroundColor: step.color }} title="Color preview" />
                  </div>
                  {formErrors[`steps[${index}].color`] && <p className="mt-1 text-sm text-red-500">{formErrors[`steps[${index}].color`]}</p>}{' '}
                </div>
              </div>
            </Card>
          ))}
          {(!pageData.steps || pageData.steps.length === 0) && (
            <p className="text-muted-foreground py-4 text-center">No steps added yet. Click "Add Step" to get started.</p>
          )}
        </CardContent>
      </Card>
      {formErrors['steps'] && <p className="text-sm text-red-500">{formErrors['steps']}</p>}
    </div>
  );

  const renderFAQsFields = (pageData: Partial<CMSPage>, setPageData: (data: Partial<CMSPage>) => void) => (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">FAQs</CardTitle>
          <Button size="sm" onClick={() => addFaq(pageData, setPageData)}>
            <Plus className="mr-2 h-4 w-4" />
            Add FAQ
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {pageData.faqs?.map((faq, index) => (
            <Card key={faq.id} className="p-4">
              <div className="mb-4 flex items-start justify-between">
                <h4 className="font-medium">FAQ {index + 1}</h4>
                <Button variant="outline" size="sm" className="bg-transparent" onClick={() => removeFaq(pageData, setPageData, faq.id, index)}>
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-3">
                <div>
                  <Label className="mb-1 block text-sm font-medium">Question</Label>
                  <Input
                    placeholder="Enter FAQ question"
                    value={faq.question}
                    onChange={(e) => updateFaq(pageData, setPageData, faq.id, index, 'question', e.target.value)}
                  />
                  {formErrors[`faqs[${index}].question`] && <p className="mt-1 text-sm text-red-500">{formErrors[`faqs[${index}].question`]}</p>}
                </div>
                <div>
                  <Label className="mb-1 block text-sm font-medium">Answer</Label>
                  <Textarea
                    className="bg-transparent"
                    placeholder="Enter FAQ answer"
                    value={faq.answer}
                    onChange={(e) => updateFaq(pageData, setPageData, faq.id, index, 'answer', e.target.value)}
                    rows={3}
                  />
                  {formErrors[`faqs[${index}].answer`] && <p className="mt-1 text-sm text-red-500">{formErrors[`faqs[${index}].answer`]}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={`visible-${faq.id}`}
                    checked={faq.isVisible}
                    onCheckedChange={(e) => updateFaq(pageData, setPageData, faq.id, index, 'isVisible', e)}
                  />
                  <Label htmlFor={`visible-${faq.id}`} className="cursor-pointer text-sm font-medium">
                    Show on landing page
                  </Label>
                </div>
              </div>
            </Card>
          ))}
          {(!pageData.faqs || pageData.faqs.length === 0) && (
            <p className="text-muted-foreground py-4 text-center">No FAQs added yet. Click "Add FAQ" to get started.</p>
          )}
        </CardContent>
      </Card>
      {formErrors['faqs'] && <p className="text-sm text-red-500">{formErrors['faqs']}</p>}
    </div>
  );

  const renderInformativePageFields = (pageData: Partial<CMSPage>, setPageData: (data: Partial<CMSPage>) => void) => (
    <div className="space-y-4">
      <div>
        <Label className="mb-2 block text-sm font-medium">Content Editor</Label>
        <p className="text-muted-foreground mb-3 text-sm">
          Use this editor for detailed content like About Us, Terms & Conditions, Privacy Policy, etc.
        </p>
        <TipTapEditor
          content={pageData.richContent || ''}
          onChange={(content: string) => handleRichContentChange(pageData, setPageData, content)}
          placeholder="Start writing your content here"
        />
      </div>
      {formErrors.richContent && <p className="mt-1 text-sm text-red-500">{formErrors.richContent}</p>}
    </div>
  );
  return (
    <div className="min-h-screen">
      <Loader isLoading={loading} />
      {(action_type === 'add' || action_type === 'edit') && (
        <div className="mx-auto max-w-7xl">
          <div className="space-y-6">
            <div className="mb-8 flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="cursor-pointer rounded-xl hover:bg-[#374151]" onClick={redirectToPreviousPage}>
                <ArrowLeft className="h-4 w-4 text-white" />
              </Button>
              <h2 className="text-2xl font-bold text-white">{action_type === 'add' ? 'Create New Page' : 'Edit Page'}</h2>
            </div>
            <Card>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Label className="mb-2 block text-sm font-medium">Page Title</Label>
                    <Input placeholder="Enter page title" value={newPage.title} onChange={(e) => handlePageTitleChange(e.target.value)} />
                    {formErrors.title && <p className="mt-1 text-sm text-red-500">{formErrors.title}</p>}
                  </div>
                  <div>
                    <Label className="mb-2 block text-sm font-medium">URL Slug</Label>
                    <Input placeholder="page-url-slug" value={newPage.slug} onChange={(e) => handleSlugChange(e.target.value)} />
                    {formErrors.slug && <p className="mt-1 text-sm text-red-500">{formErrors.slug}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Label className="mb-2 block text-sm font-medium">Page Type</Label>
                    <Select
                      value={newPage.type}
                      disabled={action_type === 'edit'}
                      onValueChange={(value: CMSPage['type']) => handlePageTypeChange(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select page type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(pageTypes).map(([key, type]) => (
                          <SelectItem key={key} value={key}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.type && <p className="mt-1 text-sm text-red-500">{formErrors.type}</p>}
                  </div>

                  <div>
                    <Label className="mb-2 block text-sm font-medium">Publish Status</Label>
                    <Select value={String(newPage.isPublished)} onValueChange={(value: string) => handlePagePublicationChange(value === 'true')}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select publish status" />
                      </SelectTrigger>
                      <SelectContent>
                        {publish_type.map((type) => (
                          <SelectItem key={type.label} value={String(type.value)}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {renderPageTypeSpecificFields(newPage, setNewPage)}
              </CardContent>
            </Card>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleSave}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
              >
                <Save className="mr-2 h-4 w-4" />
                {action_type === 'add' ? 'Create Page' : 'Edit Page'}
              </Button>
              <Button variant="outline" onClick={redirectToPreviousPage}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddEditPage;
