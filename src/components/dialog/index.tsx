import { Button } from '../ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './Dialog';

interface ControlledConfirmDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
}

const CommonDialog = ({
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="">
          <DialogClose asChild>
            <Button type="button" variant="secondary" className="border border-[#5750F1] cursor-pointer dark:border-white dark:text-white">
              {cancelLabel}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" variant="destructive" className="bg-[#5750F1] cursor-pointer text-white" onClick={handleConfirm}>
              {confirmLabel}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CommonDialog;
