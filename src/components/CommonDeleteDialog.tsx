import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';

interface ControlledConfirmDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
}

const CommonDeleteDialog = ({
  open,
  onOpenChange,
  title = 'User',
  description = 'Are you sure you want to delete user?',
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  onConfirm,
}: ControlledConfirmDeleteDialogProps) => {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sborder-slate-700 bg-slate-800 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="">
          <DialogClose asChild>
            <Button type="button" variant="secondary" className="cursor-pointer border border-slate-500 dark:border-white dark:text-white">
              {cancelLabel}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              type="button"
              variant="destructive"
              className="cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 text-white"
              onClick={handleConfirm}
            >
              {confirmLabel}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CommonDeleteDialog;
