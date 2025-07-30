'use client';
import { useCallback, useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Calendar, DollarSign, MapPin, Clock, Users, Star, FileText, Mail, Briefcase, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/lib/toast';
import { PRIVATE_API_ROUTES, PRIVATE_ROUTE } from '@/constants/app-routes';
import { AdminGigsList, AdminGigsSingleDataResponse } from '@/types/fe';
import apiService from '@/services/api';
import { statusColors } from '@/constants';
import Loader from '@/components/Loader';
import { formatOnlyDate, getDaysBetweenDates } from '@/lib/date-format';
import { GIG_STATUS, TIER } from '@prisma/client';

export default function AdminGigDetails() {
  const navigate = useRouter();
  const { id } = useParams();
  const [gig, setGig] = useState<AdminGigsList | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleBack = () => {
    navigate.push(PRIVATE_ROUTE.ADMIN_GIGS_DASHBOARD_PATH);
  };

  const getGigDetailById = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiService.get<AdminGigsSingleDataResponse>(`${PRIVATE_API_ROUTES.ADMIN_GIGS_LIST_API}/${id}`, {
        withAuth: true
      });

      if (response.data.success && response.data.data) {
        setGig(response.data.data);
      }
    } catch (error: any) {
      const message = error?.response?.data?.error?.message || error?.message || 'Error fetching gig detail';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getGigDetailById();
  }, []);

  const formatLabel = (status: string) => status && status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="space-y-6">
      <Loader isLoading={isLoading} />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="!bg-transparent text-white" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Gigs
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={statusColors[gig?.pipeline?.status as GIG_STATUS]} variant="outline">
            {formatLabel(gig?.pipeline?.status as GIG_STATUS)}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="from-card to-card/50 border-0 bg-gradient-to-br shadow-lg">
            <CardHeader>
              <div className="flex">
                {gig?.keywords?.map((keyword: string) => (
                  <Badge variant="outline" key={keyword} className="mx-1 border-amber-500/20 bg-amber-500/10 text-amber-400">
                    {keyword}
                  </Badge>
                ))}
              </div>
              <CardTitle className="text-lg font-bold text-white sm:text-xl md:text-2xl lg:text-3xl">{gig?.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose max-w-none">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{gig?.description}</p>
              </div>
            </CardContent>
          </Card>

          {gig?.attachments && gig?.attachments.length > 0 && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-white">Attachments</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {gig?.attachments?.map((fileUrl: string, index: number) => {
                    const fileName = decodeURIComponent(fileUrl.split('/').pop() || `file-${index}`);

                    return (
                      <div key={fileUrl} className="bg-muted/30 flex items-center justify-between rounded-lg border p-3">
                        <div className="flex items-center gap-3">
                          <FileText className="text-primary h-8 w-8" />
                          <div>
                            <p className="text-sm font-medium">{fileName}</p>
                          </div>
                        </div>
                        <a href={fileUrl} download target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </a>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="from-primary/5 to-primary/10 border-0 bg-gradient-to-br shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-foreground/50 rounded-lg p-3 text-center">
                  <DollarSign className="text-primary mx-auto mb-1 h-5 w-5" />
                  <div className="font-bold">
                    ${gig?.price_range?.min} - ${gig?.price_range?.max}
                  </div>
                  <div className="text-muted-foreground text-xs">Budget</div>
                </div>
                <div className="bg-foreground/50 rounded-lg p-3 text-center">
                  <Users className="text-primary mx-auto mb-1 h-5 w-5" />
                  <div className="font-bold">{gig?.bids?.length || 0}</div>
                  <div className="text-muted-foreground text-xs">Bids</div>
                </div>
                <div className="bg-foreground/50 rounded-lg p-3 text-center">
                  <Clock className="text-primary mx-auto mb-1 h-5 w-5" />
                  <div className="font-bold">{`${getDaysBetweenDates(gig?.start_date as string, gig?.end_date as string) || 0} days`}</div>
                  <div className="text-muted-foreground text-xs">Duration</div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Briefcase className="text-muted-foreground h-4 w-4" />
                  <span className="text-muted-foreground">Tier:</span>
                  <span className="font-medium">{formatLabel(gig?.tier as TIER)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="text-muted-foreground h-4 w-4" />
                  <span className="text-muted-foreground">Deadline:</span>
                  <span className="font-medium">{formatOnlyDate(gig?.end_date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="text-muted-foreground h-4 w-4" />
                  <span className="text-muted-foreground">Created:</span>
                  <span className="font-medium">{formatOnlyDate(gig?.created_at)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Client Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                {gig?.user && (
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={gig?.user?.profile_url || ''} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {`${gig?.user.first_name[0] + gig?.user.last_name[0]}`}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div>
                  <p className="font-medium">{`${gig?.user?.first_name} ${gig?.user?.last_name}`}</p>
                  <div className="flex items-center space-x-1">
                    <Star className="size-2 fill-amber-400 text-amber-400" />
                    <span className="text-xs text-gray-400">1 (5)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="text-muted-foreground h-4 w-4" />
                  <span className="text-muted-foreground break-all">{gig?.user?.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="text-muted-foreground h-4 w-4" />
                  <span className="text-muted-foreground">{gig?.location}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 border-t pt-3">
                <div className="text-center">
                  <div className="text-primary font-bold">{gig?.user?._count?.gigs || 0}</div>
                  <div className="text-muted-foreground text-xs">Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-primary font-bold">{formatOnlyDate(gig?.user?.created_at)}</div>
                  <div className="text-muted-foreground text-xs">Member Since</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
