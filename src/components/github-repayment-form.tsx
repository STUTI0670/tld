'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTimeDebt } from '@/hooks/use-time-debt';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Github, Loader2 } from 'lucide-react';

const FormSchema = z.object({
  commitUrl: z.string().url({ message: 'Please enter a valid GitHub commit URL.' }),
});

const REPAYMENT_AMOUNT_MINUTES = 45;

export function GithubRepaymentForm() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { repayDebt } = useTimeDebt();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      commitUrl: '',
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsSubmitting(true);
    // Mock validation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    repayDebt(REPAYMENT_AMOUNT_MINUTES);
    toast({
      title: 'Commit Submitted',
      description: `Successfully credited ${REPAYMENT_AMOUNT_MINUTES} minutes.`,
    });
    setIsSubmitting(false);
    setOpen(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full h-24 flex-col gap-2">
          <Github className="h-8 w-8" />
          <span>Submit GitHub Commit</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>GitHub Commit Repayment</DialogTitle>
          <DialogDescription>
            Enter the URL of your GitHub commit to earn time credit. Credit is fixed at {REPAYMENT_AMOUNT_MINUTES} minutes per valid commit.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="commitUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Commit URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://github.com/user/repo/commit/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary" disabled={isSubmitting}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
