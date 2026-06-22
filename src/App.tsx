import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronRight,
  LayoutDashboard,
  LineChart,
  Megaphone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";

const metrics = [
  { label: "Campaign lift", value: "34%" },
  { label: "Launch time saved", value: "18d" },
  { label: "Pipeline influenced", value: "$4.2m" },
];

const features = [
  {
    title: "Positioning sprints",
    description: "Turn messy product value into sharp narratives your buyer can repeat.",
    icon: Sparkles,
  },
  {
    title: "Launch systems",
    description: "Plan, produce, and ship campaigns with a repeatable operating cadence.",
    icon: Megaphone,
  },
  {
    title: "Revenue insight",
    description: "Connect channel activity to pipeline signals without drowning teams in reports.",
    icon: LineChart,
  },
];

const checklist = [
  "Messaging architecture",
  "Conversion-focused landing pages",
  "Launch calendar and asset map",
  "Weekly performance readouts",
];

export function App() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <a className="flex items-center gap-2 font-semibold" href="#top">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-950 text-white">
              <LayoutDashboard className="h-5 w-5" aria-hidden="true" />
            </span>
            Northstar Studio
          </a>
          <div className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            <a className="hover:text-slate-950" href="#services">
              Services
            </a>
            <a className="hover:text-slate-950" href="#results">
              Results
            </a>
            <a className="hover:text-slate-950" href="#pricing">
              Pricing
            </a>
          </div>
          <Button size="sm">
            Book a call
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </nav>
      </header>

      <section id="top" className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-[1fr_0.85fr] md:py-20">
          <div className="flex flex-col justify-center">
            <Badge className="mb-5 w-fit">B2B growth studio</Badge>
            <h1 className="max-w-3xl text-5xl font-bold leading-tight tracking-normal text-slate-950 sm:text-6xl">
              Marketing strategy that turns launches into pipeline.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Northstar Studio helps ambitious teams clarify positioning, ship
              campaigns faster, and measure the revenue signals that matter.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg">
                Start a sprint
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </Button>
              <Button variant="secondary" size="lg">
                View services
              </Button>
            </div>
          </div>

          <div className="relative min-h-[430px] overflow-hidden rounded-lg border border-slate-200 bg-slate-950 p-5 text-white shadow-xl">
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-emerald-400/25 to-transparent" />
            <div className="relative flex h-full flex-col justify-between">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-300">Campaign dashboard</p>
                  <h2 className="mt-1 text-2xl font-semibold">Q3 launch plan</h2>
                </div>
                <BarChart3 className="h-7 w-7 text-emerald-300" aria-hidden="true" />
              </div>

              <div className="my-10 grid gap-3">
                {metrics.map((metric) => (
                  <div
                    className="grid grid-cols-[1fr_auto] items-center gap-4 rounded-md border border-white/10 bg-white/5 p-4"
                    key={metric.label}
                  >
                    <span className="text-sm text-slate-300">{metric.label}</span>
                    <strong className="text-2xl">{metric.value}</strong>
                  </div>
                ))}
              </div>

              <div className="rounded-md bg-white p-4 text-slate-950">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-semibold">Launch readiness</span>
                  <span className="text-sm text-emerald-700">86%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full w-[86%] rounded-full bg-emerald-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
            Services
          </p>
          <h2 className="mt-3 text-3xl font-bold">Focused work for teams ready to move.</h2>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <feature.icon className="h-6 w-6 text-emerald-600" aria-hidden="true" />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-7 text-slate-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="results" className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-[0.9fr_1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
              Operating model
            </p>
            <h2 className="mt-3 text-3xl font-bold">A practical cadence from story to signal.</h2>
            <p className="mt-5 leading-8 text-slate-600">
              We work inside your launch rhythm: sharpen the message, map the
              buyer journey, ship assets, and review performance weekly.
            </p>
          </div>
          <div className="grid gap-3">
            {checklist.map((item) => (
              <div className="flex items-center gap-3 rounded-md border border-slate-200 p-4" key={item}>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <Check className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 rounded-lg border border-slate-200 bg-white p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8">
          <div>
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-emerald-700">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              Fixed-scope sprint
            </div>
            <h2 className="text-3xl font-bold">Get a launch-ready marketing system in 30 days.</h2>
            <p className="mt-4 max-w-2xl leading-8 text-slate-600">
              Strategy, copy direction, campaign assets, reporting, and a handoff
              your team can keep using after the sprint.
            </p>
          </div>
          <div className="min-w-56 rounded-md bg-slate-50 p-5">
            <p className="text-sm text-slate-600">Starting at</p>
            <p className="mt-1 text-4xl font-bold">$8k</p>
            <Button className="mt-5 w-full">Request proposal</Button>
          </div>
        </div>
      </section>
    </main>
  );
}
