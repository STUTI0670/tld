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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { BrainCircuit, Loader2 } from 'lucide-react';

const FormSchema = z.object({
  platform: z.enum(['leetcode', 'codeforces', 'cses', 'spoj']),
  solutionUrl: z.string().url({ message: 'Please enter a valid solution URL.' }),
});

const REPAYMENT_AMOUNT_MINUTES = 30;

export function PuzzleRepaymentForm() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { repayDebt } = useTimeDebt();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      platform: 'leetcode',
      solutionUrl: '',
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsSubmitting(true);
    // Mock validation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    repayDebt(REPAYMENT_AMOUNT_MINUTES);
    toast({
      title: 'Submission Successful',
      description: `Successfully credited ${REPAYMENT_AMOUNT_MINUTES} minutes for your ${data.platform} solution.`,
    });
    setIsSubmitting(false);
    setOpen(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full h-24 flex-col gap-2">
          <BrainCircuit className="h-8 w-8" />
          <span>Submit Puzzle/Algorithm</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Puzzle/Algorithm Repayment</DialogTitle>
          <DialogDescription>
            Submit your solution from a competitive programming platform. Credit is fixed at {REPAYMENT_AMOUNT_MINUTES} minutes per valid solution.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="platform"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Platform</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a platform" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="leetcode">LeetCode</SelectItem>
                      <SelectItem value="codeforces">Codeforces</SelectItem>
                      <SelectItem value="cses">CSES</SelectItem>
                      <SelectItem value="spoj">SPOJ</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="solutionUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Solution URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://leetcode.com/problems/..." {...field} />
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
