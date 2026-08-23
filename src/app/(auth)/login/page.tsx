import Link from "next/link";
import { login } from "../actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-stone-900">Log in</h1>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <form action={login} className="flex flex-col gap-4">
        <input type="hidden" name="next" value={next ?? "/dashboard"} />
        <label className="flex flex-col gap-1 text-sm">
          Email
          <input
            type="email"
            name="email"
            required
            className="rounded-md border border-stone-300 px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Password
          <input
            type="password"
            name="password"
            required
            className="rounded-md border border-stone-300 px-3 py-2"
          />
        </label>
        <button
          type="submit"
          className="rounded-full bg-green-800 px-4 py-2 font-medium text-white hover:bg-green-900"
        >
          Log in
        </button>
      </form>

      <p className="text-sm text-stone-600">
        No account?{" "}
        <Link href="/signup" className="font-medium text-green-800">
          Sign up
        </Link>
      </p>
    </div>
  );
}
