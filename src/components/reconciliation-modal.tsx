'use client';

import * as React from 'react';
import { useTimeDebt } from '@/hooks/use-time-debt';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent as OriginalDialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Create a custom DialogContent that can hide the close button
const CustomDialogContent = React.forwardRef<
  React.ElementRef<typeof OriginalDialogContent>,
  React.ComponentPropsWithoutRef<typeof OriginalDialogContent> & { hideCloseButton?: boolean }
>(({ children, hideCloseButton, ...props }, ref) => {
  // The original DialogContent from shadcn/ui implicitly includes a DialogClose button.
  // To conditionally hide it, we need to filter it out from the children.
  const childrenArray = React.Children.toArray(children);
  const closeButton = childrenArray.find(
    (child: any) =>
      child.type?.displayName === 'DialogClose' ||
      (child.type?.type?.displayName === 'DialogClose')
  );

  const otherChildren = childrenArray.filter(
    (child: any) =>
      child.type?.displayName !== 'DialogClose' &&
      (child.type?.type?.displayName !== 'DialogClose')
  );

  return (
    <OriginalDialogContent ref={ref} {...props}>
      {otherChildren}
      {!hideCloseButton && closeButton}
    </OriginalDialogContent>
  );
});
CustomDialogContent.displayName = 'CustomDialogContent';


interface ReconciliationModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  timeGap: number;
}

export default function ReconciliationModal({ open, setOpen, timeGap }: ReconciliationModalProps) {
  const { addDebt, reconcileTime } = useTimeDebt();
  const { toast } = useToast();

  const handleDistracted = () => {
    addDebt(timeGap);
    reconcileTime();
    toast({
      title: 'Time Reconciled',
      description: `${timeGap} minutes of distracted time added to your debt.`,
      variant: 'destructive'
    });
    setOpen(false);
  };
  
  const handleWorked = () => {
    // In a full app, this would open a proof-of-work submission flow.
    reconcileTime();
    toast({
      title: 'Time Reconciled',
      description: `Marked ${timeGap} minutes as worked. Remember to submit proof later!`,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <CustomDialogContent hideCloseButton={true} className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Reconcile Your Time</DialogTitle>
          <DialogDescription>
            It's been <span className="font-bold text-foreground">{timeGap} minutes</span> since your last entry. Please account for this time.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            How was this time spent? Be honest. Time debt is a tool for self-improvement, not punishment.
          </p>
          <Button
            size="lg"
            variant="outline"
            onClick={handleWorked}
            className="h-auto py-4"
          >
            <div className="text-left">
              <p className="font-semibold">Worked</p>
              <p className="text-xs text-muted-foreground font-normal">I was productive and focused on my tasks.</p>
            </div>
          </Button>
          <Button
            size="lg"
            variant="destructive"
            onClick={handleDistracted}
            className="h-auto py-4"
          >
             <div className="text-left">
              <p className="font-semibold">Distracted</p>
              <p className="text-xs text-destructive-foreground/80 font-normal">I was not productive and got sidetracked.</p>
            </div>
          </Button>
        </div>
      </CustomDialogContent>
    </Dialog>
  );
}
