import Link from "next/link";

// Required privacy consent + separate, unticked marketing opt-in (§9).
export function ConsentFields({
  privacy,
  marketing,
  onPrivacy,
  onMarketing,
  error,
}: {
  privacy: boolean;
  marketing: boolean;
  onPrivacy: (v: boolean) => void;
  onMarketing: (v: boolean) => void;
  error?: string;
}) {
  return (
    <div className="space-y-3 rounded-2xl bg-stone-50 p-4 text-[15px]">
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={privacy}
          onChange={(e) => onPrivacy(e.target.checked)}
          className="mt-1 size-5 shrink-0 accent-teal-ink"
          aria-invalid={!!error}
          aria-describedby={error ? "privacy-error" : undefined}
        />
        <span>
          I agree that Momentum Accounting can use these details to respond to me, as described in the{" "}
          <Link href="/privacy-policy" className="font-semibold text-teal-ink underline underline-offset-2">
            privacy policy
          </Link>
          .
        </span>
      </label>
      {error && (
        <p id="privacy-error" role="alert" className="text-sm font-medium text-red-700">
          {error}
        </p>
      )}
      <label className="flex cursor-pointer items-start gap-3">
        <input type="checkbox" checked={marketing} onChange={(e) => onMarketing(e.target.checked)} className="mt-1 size-5 shrink-0 accent-teal-ink" />
        <span className="text-muted">Optional: send me occasional emails with tips and updates for business owners. Unsubscribe any time.</span>
      </label>
    </div>
  );
}
