'use client';

import { useState, useTransition } from 'react';
import { useFormState } from 'react-dom';
import { useTimeDebt } from '@/hooks/use-time-debt';
import { validateVideoRepaymentAction } from '@/lib/actions';

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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { FileVideo, Loader2 } from 'lucide-react';

const initialState = {
  success: false,
  error: undefined,
  fieldErrors: undefined,
  data: undefined,
};

export function VideoRepaymentForm() {
  const [open, setOpen] = useState(false);
  const [videoDataUri, setVideoDataUri] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [formState, formAction] = useFormState(validateVideoRepaymentAction, initialState);
  const [isPending, startTransition] = useTransition();

  const { repayDebt } = useTimeDebt();
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit for Gemini
        toast({
          variant: 'destructive',
          title: 'File too large',
          description: 'Please upload a video smaller than 4MB.',
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = e => {
        setVideoDataUri(e.target?.result as string);
        setFileName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (formData: FormData) => {
    if (!videoDataUri) {
      toast({
        variant: 'destructive',
        title: 'No video selected',
        description: 'Please select a video file to upload.',
      });
      return;
    }
    formData.append('videoDataUri', videoDataUri);

    startTransition(async () => {
      const result = await validateVideoRepaymentAction(formState, formData);
      if (result.success && result.data?.isValid) {
        repayDebt(result.data.timeCreditMinutes);
        toast({
          title: 'Submission Approved',
          description: `${result.data.feedback} You've earned ${result.data.timeCreditMinutes} minutes credit.`,
        });
        setOpen(false);
        setVideoDataUri(null);
        setFileName('');
      } else {
        const description = result.data?.feedback || result.error || 'Your submission could not be validated.';
        toast({
          variant: 'destructive',
          title: 'Submission Rejected',
          description,
        });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full h-24 flex-col gap-2">
          <FileVideo className="h-8 w-8" />
          <span>Submit Video Learning</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Video-Based Repayment</DialogTitle>
          <DialogDescription>
            Submit a video to prove your learning. Valid submissions credit 30-60 minutes.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="submissionType">Submission Type</Label>
            <Select name="submissionType" defaultValue="teachBackExplanation" required>
              <SelectTrigger>
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="teachBackExplanation">Teach-Back Explanation</SelectItem>
                <SelectItem value="diagramReconstruction">Diagram Reconstruction</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="topic">Topic</Label>
            <Input name="topic" id="topic" placeholder="e.g., React Server Components" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="videoFile">Video Submission (Max 4MB)</Label>
            <Input id="videoFile" type="file" accept="video/*" onChange={handleFileChange} required />
            {fileName && <p className="text-sm text-muted-foreground">Selected: {fileName}</p>}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary" disabled={isPending}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit for Validation
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
