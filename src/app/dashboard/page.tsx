import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Dashboard header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="text-xl font-bold tracking-tight">
            willdo<span className="text-primary">.work</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">My Agents</span>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
              U
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard content */}
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Your Agents</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Create and manage your AI automation agents.
            </p>
          </div>
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors">
            + New Agent
          </button>
        </div>

        {/* Empty state */}
        <div className="mt-16 flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-16 text-center">
          <div className="text-4xl">🤖</div>
          <h2 className="mt-4 text-lg font-semibold">No agents yet</h2>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Create your first AI agent to start automating tasks. Just describe what you need and
            your agent will handle the rest.
          </p>
          <button className="mt-6 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-hover transition-colors">
            Create your first agent
          </button>
        </div>
      </main>
    </div>
  );
}
