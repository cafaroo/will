import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const features = [
  {
    title: "No code required",
    description:
      "Describe what you want in plain language. Your AI agent handles the rest — scheduling, emails, data entry, and more.",
    icon: "💬",
  },
  {
    title: "Works while you sleep",
    description:
      "Set up automations that run 24/7. Your agents monitor, respond, and take action even when you're offline.",
    icon: "⚡",
  },
  {
    title: "Built for real people",
    description:
      "No technical jargon, no complex workflows. Just tell your agent what to do, in Swedish, Norwegian, Danish, or English.",
    icon: "🇸🇪",
  },
];

const steps = [
  { step: "1", title: "Describe your task", description: "Tell your agent what you need done." },
  {
    step: "2",
    title: "Your agent gets to work",
    description: "It figures out the steps and starts executing.",
  },
  { step: "3", title: "Review and relax", description: "Check results and let it keep running." },
];

export default function Home() {
  return (
    <>
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-6 pt-24 pb-16 text-center">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              AI that actually
              <span className="text-primary"> does the work</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
              Create personal AI agents that automate your everyday tasks — no coding, no
              complexity. Built for people in the Nordics who want to get more done.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/sign-up"
                className="w-full sm:w-auto rounded-lg bg-primary px-8 py-3 text-base font-medium text-white hover:bg-primary-hover transition-colors"
              >
                Start for free
              </Link>
              <a
                href="#how-it-works"
                className="w-full sm:w-auto rounded-lg border border-border px-8 py-3 text-base font-medium hover:bg-muted transition-colors"
              >
                See how it works
              </a>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-6xl px-6 py-24">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
            Automation for the rest of us
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
            You shouldn&apos;t need to be a developer to benefit from AI. willdo.work puts the power
            of automation in your hands.
          </p>
          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-xl border border-border bg-card p-8">
                <div className="text-3xl">{feature.icon}</div>
                <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="bg-muted py-24">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
              Three steps. That&apos;s it.
            </h2>
            <div className="mt-16 grid gap-12 sm:grid-cols-3">
              {steps.map((item) => (
                <div key={item.step} className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
                    {item.step}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-6 py-24 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to let AI do the work?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Join the waitlist and be among the first to try willdo.work when we launch.
          </p>
          <Link
            href="/sign-up"
            className="mt-8 inline-block rounded-lg bg-primary px-8 py-3 text-base font-medium text-white hover:bg-primary-hover transition-colors"
          >
            Get early access
          </Link>
        </section>
      </main>

      <Footer />
    </>
  );
}
