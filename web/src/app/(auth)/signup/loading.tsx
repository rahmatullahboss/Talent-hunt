export default function SignUpLoading() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold leading-tight text-foreground">Create your TalentHunt BD account</h1>
        <p className="mt-2 text-sm text-muted">Tell us a little about yourself to tailor the experience to your goals.</p>
      </div>
      <div className="space-y-6">
        <div className="space-y-1.5">
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-1.5">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="space-y-1.5">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-1.5">
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="space-y-1.5">
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
    </div>
  );
}