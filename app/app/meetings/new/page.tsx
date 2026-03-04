import { NewMeetingForm } from '@/components/new-meeting-form';

export default function NewMeetingPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">New Meeting</h1>
      <p className="text-sm text-slate-400">Upload an audio or video recording to generate transcript and summary.</p>
      <NewMeetingForm />
    </div>
  );
}
