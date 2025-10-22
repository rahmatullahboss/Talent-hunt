export default function AuthCallbackLoading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent" aria-hidden="true" />
      <p className="text-sm text-muted">Confirming your account...</p>
    </div>
  );
}