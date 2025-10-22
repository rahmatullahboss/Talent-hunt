export default function UpdatePasswordLoading() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold leading-tight text-foreground">Choose a new password</h1>
        <p className="mt-2 text-sm text-muted">Enter a strong, unique password to keep your account secure.</p>
      </div>
      <div className="space-y-5">
        <div className="space-y-1.5">
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="space-y-1.5">
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  );
}