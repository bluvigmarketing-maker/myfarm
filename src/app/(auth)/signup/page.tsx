import Link from "next/link";
import { signup } from "../actions";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-stone-900">Create an account</h1>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <form action={signup} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Name
          <input
            type="text"
            name="name"
            required
            className="rounded-md border border-stone-300 px-3 py-2"
          />
        </label>
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
            minLength={6}
            className="rounded-md border border-stone-300 px-3 py-2"
          />
        </label>
        <button
          type="submit"
          className="rounded-full bg-green-800 px-4 py-2 font-medium text-white hover:bg-green-900"
        >
          Sign up
        </button>
      </form>

      <p className="text-sm text-stone-600">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-green-800">
          Log in
        </Link>
      </p>
    </div>
  );
}
