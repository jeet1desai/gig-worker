'use client';

import { useState } from 'react';
import { Star, DollarSign, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PRIVATE_API_ROUTES } from '@/constants/app-routes';
import apiService from '@/services/api';
import { toast } from '@/lib/toast';
import { CreateProvidersReviewAPIResponse } from '@/types/fe';
import CommonModal from '../CommonModal';
import { ratingLabels } from '@/constants';

interface GigReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  gigId: string;
  gigTitle: string;
  bidAmount: number;
  providerName: string;
}

const GigReviewModal = ({ isOpen, onClose, gigId, gigTitle, bidAmount, providerName }: GigReviewModalProps) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewResult, setReviewResult] = useState<any>(null);
  const [errors, setErrors] = useState<{ rating?: string; feedback?: string }>({});

  const handleRatingClick = (selectedRating: number) => {
    setRating(selectedRating);
    setErrors((prev) => ({ ...prev, rating: '' }));
  };

  const handleReviewChange = (review: string) => {
    setFeedback(review);
    setErrors((prev) => ({ ...prev, feedback: '' }));
  };

  const handleSubmitReview = async () => {
    let newErrors: { rating?: string; feedback?: string } = {};
    if (rating === 0) {
      newErrors.rating = 'Please select a rating';
    }
    if (!feedback.trim()) {
      newErrors.feedback = 'Comment is required';
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiService.post<CreateProvidersReviewAPIResponse>(
        `${PRIVATE_API_ROUTES.CREATE_PROVIDER_REVIEW_API}/${gigId}`,
        {
          rating,
          rating_feedback: feedback
        },
        {
          withAuth: true
        }
      );

      if (response.data.message) {
        setReviewResult(response.data.data);
      }
    } catch (error: any) {
      const message = error?.response?.data?.error?.message || error?.message || 'Error deleting subscription plan';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayment = () => {
    if (reviewResult?.paymentOrder?.links) {
      const approveLink = reviewResult.paymentOrder.links.find((link: any) => link.rel === 'approve');
      if (approveLink) {
        window.location.href = approveLink.href;
      }
    }
  };

  const handleClose = () => {
    setRating(0);
    setFeedback('');
    setReviewResult(null);
    onClose();
  };

  return (
    <CommonModal
      open={isOpen}
      onOpenChange={handleClose}
      title="Review & Payment"
      classTitle="text-white"
      subtitle={`Rate your experience and complete payment for ${gigTitle}`}
      classSubTitle="text-gray-400"
      className="no-scrollbar max-w-2xl border-gray-700 bg-gray-800 text-white"
    >
      {!reviewResult ? (
        <>
          <div className="space-y-6">
            <Card className="border-gray-600 bg-gray-700/50">
              <CardHeader>
                <CardTitle className="text-lg text-white">Provider</CardTitle>
                <p className="text-gray-300">{providerName}</p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-green-400" />
                  <span className="font-semibold text-green-400">{bidAmount}</span>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Label className="text-white">Rate your experience (1-5 stars)</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isActive = rating >= star;
                  return (
                    <button
                      key={star}
                      onClick={() => handleRatingClick(star)}
                      className={`rounded-lg p-2 transition-colors ${
                        isActive ? 'bg-yellow-400/10 text-yellow-400' : 'text-gray-400 hover:text-yellow-400'
                      }`}
                    >
                      <Star className="h-8 w-8" fill={isActive ? 'currentColor' : 'none'} />
                    </button>
                  );
                })}
              </div>
              {errors.rating && <p className="text-sm text-red-400">{errors.rating}</p>}
              {rating > 0 && <p className="text-sm text-gray-400">{ratingLabels[rating]}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="feedback" className="text-white">
                Additional feedback <span className="text-red-400">*</span>
              </Label>
              <Textarea
                id="feedback"
                placeholder="Share your experience with this provider..."
                value={feedback}
                onChange={(e) => handleReviewChange(e.target.value)}
                className="border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                rows={4}
              />
              {errors.feedback && <p className="text-sm text-red-400">{errors.feedback}</p>}
            </div>

            {rating > 0 && rating < 3 && (
              <div className="flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-500/10 p-4">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-400" />
                <div>
                  <p className="font-medium text-red-400">Low Rating Notice</p>
                  <p className="mt-1 text-sm text-red-300">
                    Ratings below 3 stars will result in a complaint being filed and payment will be withheld.
                  </p>
                </div>
              </div>
            )}

            {rating >= 3 && (
              <div className="flex items-start gap-3 rounded-lg border border-blue-500/20 bg-blue-500/10 p-4">
                <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-400" />
                <div>
                  <p className="font-medium text-blue-400">Payment Required</p>
                  <p className="mt-1 text-sm text-blue-300">You will be redirected to PayPal to complete the payment of ${bidAmount}.</p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleClose} className="border-gray-600 bg-transparent text-gray-300">
              Cancel
            </Button>
            <Button
              onClick={handleSubmitReview}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Review'
              )}
            </Button>
          </DialogFooter>
        </>
      ) : (
        <div className="space-y-6">
          {reviewResult.requiresPayment ? (
            <>
              <div className="text-center">
                <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-400" />
                <h3 className="mb-2 text-xl font-semibold text-white">Review Submitted!</h3>
                <p className="mb-6 text-gray-400">
                  Your review has been submitted successfully. Please complete the payment to finalize the transaction.
                </p>
              </div>

              <Card className="border-gray-600 bg-gray-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <DollarSign className="h-5 w-5 text-green-400" />
                    Payment Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Amount:</span>
                    <span className="font-semibold text-white">${bidAmount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Provider:</span>
                    <span className="text-white">{providerName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Gig:</span>
                    <span className="text-white">{gigTitle}</span>
                  </div>
                </CardContent>
              </Card>

              <div className="flex items-center justify-end">
                <Button
                  onClick={handlePayment}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                >
                  Pay with PayPal
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="text-center">
                <AlertCircle className="mx-auto mb-4 h-16 w-16 text-red-400" />
                <h3 className="mb-2 text-xl font-semibold text-white">Complaint Filed</h3>
                <p className="mb-6 text-gray-400">Due to the low rating, a complaint has been filed and payment has been withheld.</p>
              </div>

              <Card className="border-red-500/20 bg-red-500/10">
                <CardHeader>
                  <CardTitle className="text-red-400">Complaint Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-red-300">Your feedback has been recorded and will be reviewed by our support team.</p>
                </CardContent>
              </Card>

              <Button onClick={handleClose} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                Close
              </Button>
            </>
          )}
        </div>
      )}
    </CommonModal>
  );
};

export default GigReviewModal;
