import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/lib/toast';
import { contentFEService } from '@/services/cms.services';
import { ContentItem } from '@/types/fe';

export function useContent(type: string) {
  const queryClient = useQueryClient();

  const {
    data: contents = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['contents', type],
    queryFn: () => contentFEService.getContentByType(type)
  });

  const createMutation = useMutation({
    mutationFn: contentFEService.createContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contents', type] });
      toast.success('New content has been successfully added.');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to add content.');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ContentItem> }) => contentFEService.updateContent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contents', type] });
      toast.success('The content has been successfully updated.');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to update content.');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: contentFEService.deleteContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contents', type] });
      toast.success('The content has been successfully deleted.');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'v');
    }
  });

  const reorderMutation = useMutation({
    mutationFn: contentFEService.reorderContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contents', type] });
      toast.success('The content has been reordered successfully.');
    }
  });

  return {
    contents,
    isLoading,
    error,
    createContent: createMutation.mutate,
    updateContent: updateMutation.mutate,
    deleteContent: deleteMutation.mutate,
    reorderContent: reorderMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isReordering: reorderMutation.isPending
  };
}
