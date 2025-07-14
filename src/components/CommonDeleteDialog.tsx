import { DialogClose, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import CommonModal from './CommonModal';

interface ControlledConfirmDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  isLoading?: boolean;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
}

const CommonDeleteDialog = ({
  open,
  onOpenChange,
  title = 'User',
  isLoading = false,
  description = 'Are you sure you want to delete user?',
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  onConfirm
}: ControlledConfirmDeleteDialogProps) => {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <CommonModal
      open={open}
      onOpenChange={onOpenChange}
      className="border-slate-700 bg-slate-800 text-white sm:max-w-md"
      title={title}
      subtitle={description}
    >
      <DialogFooter className="">
        <DialogClose asChild>
          <Button
            type="button"
            disabled={isLoading}
            variant="secondary"
            className="cursor-pointer border border-slate-500 outline-none focus:outline-none focus-visible:ring-0 dark:border-white dark:text-white"
          >
            {cancelLabel}
          </Button>
        </DialogClose>
        <DialogClose asChild>
          <Button
            type="button"
            variant="destructive"
            disabled={isLoading}
            className="cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 text-white outline-none focus:outline-none focus-visible:ring-0"
            onClick={handleConfirm}
          >
            {confirmLabel}
          </Button>
        </DialogClose>
      </DialogFooter>
    </CommonModal>
  );
};

export default CommonDeleteDialog;
