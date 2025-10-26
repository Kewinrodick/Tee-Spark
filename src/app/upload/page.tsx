import { UploadForm } from '@/components/upload-form';

export default function UploadPage() {
  return (
    <div className="container max-w-2xl py-8 md:py-12">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold font-headline tracking-tighter">Upload Your Design</h1>
        <p className="text-muted-foreground">
          Showcase your artwork to the world. Fill out the details below to get started.
        </p>
      </div>
      <UploadForm />
    </div>
  );
}
