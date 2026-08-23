import Link from "next/link";
import { Button } from "@/components/ui/button";
import { login } from "../actions";

const inputClass =
  "rounded-lg border border-green-200 px-3 py-2 outline-none focus:border-brown-500 focus:ring-2 focus:ring-brown-400/40";
const labelClass = "flex flex-col gap-1 text-sm font-medium text-green-900";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-xl font-semibold text-green-950">Log in</h1>

      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
      )}

      <form action={login} className="flex flex-col gap-4">
        <input type="hidden" name="next" value={next ?? "/dashboard"} />
        <label className={labelClass}>
          Email
          <input type="email" name="email" required className={inputClass} />
        </label>
        <label className={labelClass}>
          Password
          <input type="password" name="password" required className={inputClass} />
        </label>
        <Button type="submit" className="btn-earthy soil-line font-semibold">
          Log in
        </Button>
      </form>

      <p className="text-sm text-green-700">
        No account?{" "}
        <Link href="/signup" className="font-medium text-brown-700 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
