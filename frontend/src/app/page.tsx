import Form from "next/form";

const inputClass =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-[#209dd7] focus:outline-none focus:ring-2 focus:ring-[#209dd7]/30";

/**
 * Placeholder sign-in screen. There is no authentication yet: submitting simply
 * navigates into the platform. Inputs have no `name`, so nothing is sent.
 */
export default function Login() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm space-y-8">
        <header className="space-y-2 text-center">
          <p className="text-sm font-semibold tracking-wide text-[#ecad0a]">Prelegal</p>
          <h1 className="text-3xl font-bold tracking-tight text-[#032147]">Sign in</h1>
          <p className="text-sm text-[#888888]">Draft common legal agreements in minutes.</p>
        </header>

        <Form
          action="/nda/"
          className="space-y-4 rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200"
        >
          <label className="block space-y-1 text-sm font-medium text-slate-800">
            <span>Email</span>
            <input type="email" autoComplete="email" className={inputClass} />
          </label>
          <label className="block space-y-1 text-sm font-medium text-slate-800">
            <span>Password</span>
            <input type="password" autoComplete="current-password" className={inputClass} />
          </label>
          <button
            type="submit"
            className="w-full rounded-md bg-[#753991] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#753991]/90"
          >
            Sign in
          </button>
        </Form>
      </div>
    </main>
  );
}
