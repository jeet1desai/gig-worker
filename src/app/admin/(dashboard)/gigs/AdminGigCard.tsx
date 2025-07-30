import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenuItem, DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { statusColors, tierColors, tierLabels } from '@/constants';
import { PRIVATE_ROUTE } from '@/constants/app-routes';
import { formatDate, getDaysBetweenDates } from '@/lib/date-format';
import { cn } from '@/lib/utils';
import { AdminGigsList } from '@/types/fe';
import { GIG_STATUS } from '@prisma/client';
import { Calendar, Clock, Eye, HammerIcon, MoreVertical, Star, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export const AdminGigCard = ({
  gig_details,
  onDelete,
  onUpdate
}: {
  gig_details: AdminGigsList;
  onDelete: (id: string) => void;
  onUpdate: (id: string, status: GIG_STATUS) => Promise<void>;
}) => {
  const { id, title, description, tier, price_range, start_date, end_date, thumbnail, bids, pipeline, user, slug } = gig_details;

  const formatLabel = (status: string) => status && status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div
      className={`group relative flex h-full flex-col overflow-hidden rounded-xl border ${'border-gray-700/50'} ${'bg-gray-800/50'} transition-all duration-300 ${'hover:border-gray-600 hover:shadow-gray-900/20'}`}
    >
      <div className="relative flex h-48 items-center justify-center overflow-hidden bg-gray-700">
        {thumbnail ? (
          <Image src={thumbnail} alt={title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-800 via-gray-700 to-gray-600 text-sm text-gray-400"></div>
        )}
        <div className="absolute top-3 right-3">
          <Badge variant="outline" className={`${tierColors[tier]} border-2 font-medium capitalize backdrop-blur-sm`}>
            {tierLabels[tier]} Tier
          </Badge>
        </div>
        <div className="absolute bottom-3 left-3 max-w-max">
          <Badge
            variant="outline"
            className={`${statusColors[pipeline?.status] || 'bg-primary/10 text-primary border-primary/20'} border-2 font-medium capitalize backdrop-blur-sm`}
          >
            {formatLabel(pipeline?.status)}
          </Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-start justify-between">
          <div className="flex-1">
            <Link href={`${PRIVATE_ROUTE.ADMIN_GIGS_DASHBOARD_PATH}/${slug}`} className="group-hover:text-blue-400">
              <h3 className="text-md mb-1 line-clamp-2 font-bold text-white capitalize transition-colors">{title}</h3>
            </Link>
            <p className="text-sm text-gray-400">
              ${price_range.min} - ${price_range.max}
            </p>
          </div>
        </div>

        <p className="mb-4 line-clamp-3 text-sm text-gray-300">{description}</p>

        <div className={cn('mt-auto grid gap-2 border-t border-gray-700/50 pt-4', 'grid-cols-3')}>
          <div className="flex items-center space-x-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-blue-900/30">
              <Clock className="size-4 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Delivery</p>
              <p className="text-xs text-white">{formatDate(end_date)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-blue-900/30">
              <HammerIcon className="size-4 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Bids</p>
              <p className="text-xs text-white">{bids?.length}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-blue-900/30">
              <Calendar className="size-4 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Timeline</p>
              <p className="text-xs text-white">{getDaysBetweenDates(start_date, end_date)} days</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700/50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="overflow-hidden rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user.profile_url || ''} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">{`${user.first_name[0] + user.last_name[0]}`}</AvatarFallback>
              </Avatar>
            </div>
            <div>
              <p className="text-sm font-medium text-white">{`${user.first_name} ${user.last_name}`}</p>
              <div className="flex items-center space-x-1">
                <Star className="size-2 fill-amber-400 text-amber-400" />
                <span className="text-xs text-gray-400">1 (5)</span>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 bg-transparent p-0 text-white">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem onClick={() => onUpdate(id, GIG_STATUS.open)}>Mark as Open</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onUpdate(id, GIG_STATUS.requested)}>Mark as Requested</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onUpdate(id, GIG_STATUS.in_progress)}>Mark as In Progress</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onUpdate(id, GIG_STATUS.completed)}>Mark as Completed</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onUpdate(id, GIG_STATUS.rejected)}>Mark as Rejected</DropdownMenuItem>
              <Link href={`${PRIVATE_ROUTE.ADMIN_GIGS_DASHBOARD_PATH}/${slug}`}>
                <DropdownMenuItem>
                  <Eye className="mr-2 h-4 w-4" />
                  <span>View Details</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDelete(id)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Gig
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
