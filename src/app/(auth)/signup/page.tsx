import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signup } from "../actions";

const inputClass =
  "rounded-lg border border-green-200 px-3 py-2 outline-none focus:border-brown-500 focus:ring-2 focus:ring-brown-400/40";
const labelClass = "flex flex-col gap-1 text-sm font-medium text-green-900";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-xl font-semibold text-green-950">Create an account</h1>

      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
      )}

      <form action={signup} className="flex flex-col gap-4">
        <label className={labelClass}>
          Name
          <input type="text" name="name" required className={inputClass} />
        </label>
        <label className={labelClass}>
          Email
          <input type="email" name="email" required className={inputClass} />
        </label>
        <label className={labelClass}>
          Password
          <input type="password" name="password" required minLength={6} className={inputClass} />
        </label>
        <Button type="submit" className="btn-earthy soil-line font-semibold">
          Sign up
        </Button>
      </form>

      <p className="text-sm text-green-700">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-brown-700 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
