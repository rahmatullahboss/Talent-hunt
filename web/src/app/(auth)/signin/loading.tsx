export default function SignInLoading() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold leading-tight text-foreground">Welcome back</h1>
        <p className="mt-2 text-sm text-muted">Log in to manage your projects, proposals, and payouts.</p>
      </div>
      <div className="space-y-6">
        <div className="space-y-1.5">
          <div className="h-4 w-24 bg-[#dff4df] rounded animate-pulse"></div>
          <div className="h-10 bg-[#dff4df] rounded animate-pulse"></div>
        </div>
        <div className="space-y-1.5">
          <div className="h-4 w-20 bg-[#dff4df] rounded animate-pulse"></div>
          <div className="h-10 bg-[#dff4df] rounded animate-pulse"></div>
        </div>
        <div className="h-10 bg-[#dff4df] rounded animate-pulse"></div>
      </div>
      <div className="flex flex-col gap-2 text-sm text-muted">
        <div className="h-4 w-32 bg-[#dff4df] rounded animate-pulse"></div>
        <div className="h-4 w-48 bg-[#dff4df] rounded animate-pulse"></div>
      </div>
    </div>
  );
}