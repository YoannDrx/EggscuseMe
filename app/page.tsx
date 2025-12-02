import { CircleSvg } from "@/components/svg/circle-svg";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FAQSection } from "@/features/landing/faq-section";
import { LandingHeader } from "@/features/landing/landing-header";
import { SectionDivider } from "@/features/landing/section-divider";
import { Footer } from "@/features/layout/footer";
import { Pricing } from "@/features/plans/pricing-section";
import { Typography } from "@/components/nowts/typography";
import { Egg, Clock, TrendingDown, Sparkles, Timer, Users } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="bg-background text-foreground relative flex h-fit flex-col">
      <div className="mt-16"></div>

      <LandingHeader />

      {/* Hero Section */}
      <section className="relative isolate flex flex-col">
        <div className="bg-grid absolute inset-0 [mask-image:linear-gradient(180deg,transparent,var(--foreground),transparent)]"></div>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="from-primary relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr to-amber-400 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>
        <main className="relative py-24 sm:py-32 lg:pb-40">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <Typography
                variant="h1"
                className="text-5xl font-semibold tracking-tight text-balance sm:text-7xl lg:text-7xl"
              >
                Stop throwing away your{" "}
                <span className="relative inline-block">
                  <span>eggs</span>
                  <CircleSvg className="fill-primary absolute inset-0" />
                </span>
              </Typography>
              <Typography
                variant="large"
                className="text-muted-foreground mt-8 text-lg font-medium text-pretty sm:text-xl/8"
              >
                Track freshness, get cooking recommendations, and reduce food
                waste. Know exactly what to cook based on your eggs&apos; age.
              </Typography>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  href="/auth/signin"
                  className={buttonVariants({ size: "lg", variant: "default" })}
                >
                  Create my free fridge
                </Link>
                <Link
                  href="#features"
                  className={buttonVariants({ size: "lg", variant: "link" })}
                >
                  Learn more <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>

            {/* Freshness preview cards */}
            <div className="mx-auto mt-16 grid max-w-4xl gap-4 sm:grid-cols-4">
              <Card className="border-fresh-extra bg-fresh-extra/10">
                <CardContent className="p-4 text-center">
                  <div className="text-fresh-extra text-2xl font-bold">
                    0-9 days
                  </div>
                  <p className="text-muted-foreground text-sm">Extra-fresh</p>
                </CardContent>
              </Card>
              <Card className="border-fresh bg-fresh/10">
                <CardContent className="p-4 text-center">
                  <div className="text-fresh text-2xl font-bold">
                    10-21 days
                  </div>
                  <p className="text-muted-foreground text-sm">Fresh</p>
                </CardContent>
              </Card>
              <Card className="border-fresh-cook bg-fresh-cook/10">
                <CardContent className="p-4 text-center">
                  <div className="text-fresh-cook text-2xl font-bold">
                    22-28 days
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Cook thoroughly
                  </p>
                </CardContent>
              </Card>
              <Card className="border-expired bg-expired/10">
                <CardContent className="p-4 text-center">
                  <div className="text-expired text-2xl font-bold">
                    29+ days
                  </div>
                  <p className="text-muted-foreground text-sm">Expired</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </section>

      {/* Stats Section */}
      <section className="border-y py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Typography variant="h2" className="text-3xl font-bold">
              The food waste problem
            </Typography>
            <Typography className="text-muted-foreground mt-4">
              Every year, millions of eggs are thrown away due to confusion
              about expiration dates
            </Typography>
          </div>
          <div className="mx-auto mt-10 grid max-w-4xl gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="text-primary text-4xl font-bold">10B+</div>
              <p className="text-muted-foreground mt-2">
                Eggs thrown away annually in Europe
              </p>
            </div>
            <div className="text-center">
              <div className="text-primary text-4xl font-bold">30%</div>
              <p className="text-muted-foreground mt-2">
                Of purchased eggs end up in the trash
              </p>
            </div>
            <div className="text-center">
              <div className="text-primary text-4xl font-bold">2 weeks</div>
              <p className="text-muted-foreground mt-2">
                Of freshness lost due to lack of knowledge
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Typography variant="h2" className="text-3xl font-bold">
              Everything you need to save your eggs
            </Typography>
            <Typography className="text-muted-foreground mt-4">
              Simple tools to track freshness, get recommendations, and reduce
              waste
            </Typography>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <Egg className="text-primary mb-2 size-8" />
                <CardTitle>Virtual Fridge</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Track all your egg boxes with color-coded freshness
                  indicators. Never lose track of what&apos;s in your fridge.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Sparkles className="text-primary mb-2 size-8" />
                <CardTitle>Smart Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Get cooking suggestions based on your eggs&apos; age.
                  Soft-boiled, fried, or hard-boiled? We&apos;ll tell you.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Timer className="text-primary mb-2 size-8" />
                <CardTitle>Intelligent Timer</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Perfect cooking times adjusted for egg size and temperature.
                  Get perfect results every time.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <TrendingDown className="text-primary mb-2 size-8" />
                <CardTitle>Anti-Waste Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Track how many eggs you&apos;ve saved from waste and how much
                  money you&apos;ve saved.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Clock className="text-primary mb-2 size-8" />
                <CardTitle>Expiration Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Get notified before your eggs expire so you can use them in
                  time.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="text-primary mb-2 size-8" />
                <CardTitle>Family Sharing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Share your fridge with family or roommates. Everyone stays in
                  sync.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* How it works */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Typography variant="h2" className="text-3xl font-bold">
              3 simple steps
            </Typography>
            <Typography className="text-muted-foreground mt-4">
              Start reducing waste in minutes
            </Typography>
          </div>

          <div className="mx-auto mt-16 grid max-w-4xl gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="bg-primary/10 text-primary mx-auto flex size-16 items-center justify-center rounded-full text-2xl font-bold">
                1
              </div>
              <h3 className="mt-6 text-lg font-semibold">Add your eggs</h3>
              <p className="text-muted-foreground mt-2">
                Enter the laying date when you buy a new box
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 text-primary mx-auto flex size-16 items-center justify-center rounded-full text-2xl font-bold">
                2
              </div>
              <h3 className="mt-6 text-lg font-semibold">Track freshness</h3>
              <p className="text-muted-foreground mt-2">
                Color codes show you exactly how fresh each box is
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 text-primary mx-auto flex size-16 items-center justify-center rounded-full text-2xl font-bold">
                3
              </div>
              <h3 className="mt-6 text-lg font-semibold">Cook perfectly</h3>
              <p className="text-muted-foreground mt-2">
                Get recommendations and use the timer for perfect results
              </p>
            </div>
          </div>
        </div>
      </section>

      <Pricing />

      <FAQSection
        faq={[
          {
            question: "How do I know if an egg is still good?",
            answer:
              "An egg can be safely consumed up to 28 days after laying. EggscuseMe tracks this for you and tells you exactly what cooking method is best for each stage of freshness.",
          },
          {
            question:
              "What's the difference between 'use by' and 'best before' dates?",
            answer:
              "The 'use by' date (DCR) is typically 28 days after laying. The 'best before' date on boxes is often set shorter as a precaution by retailers. EggscuseMe uses the actual laying date for accurate tracking.",
          },
          {
            question: "Can I eat raw eggs?",
            answer:
              "Yes, but only within the first 9 days after laying (extra-fresh). After that, prefer cooking methods that heat the yolk well, like frying or hard-boiling.",
          },
          {
            question: "How does the freshness color coding work?",
            answer:
              "Green (0-9 days): Extra-fresh, perfect for soft-boiled or raw. Yellow (10-21 days): Fresh, great for fried or scrambled. Orange (22-28 days): Cook thoroughly, best hard-boiled. Red (29+ days): Expired, discard.",
          },
          {
            question: "Can I share my fridge with family?",
            answer:
              "Yes! EggscuseMe supports organizations, so you can share your virtual fridge with family members or roommates. Everyone can add, consume, and track eggs together.",
          },
          {
            question: "Is there a free plan?",
            answer:
              "Yes! The free plan lets you track up to 2 egg boxes with basic features. Premium unlocks unlimited boxes, detailed statistics, and notifications.",
          },
        ]}
      />

      <SectionDivider />

      {/* Final CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="bg-primary/10 mx-auto max-w-2xl rounded-2xl p-8 text-center sm:p-12">
            <Egg className="text-primary mx-auto size-12" />
            <Typography variant="h2" className="mt-6 text-3xl font-bold">
              Ready to save your eggs?
            </Typography>
            <Typography className="text-muted-foreground mt-4">
              Join thousands of users reducing their food waste. It&apos;s free
              to get started.
            </Typography>
            <div className="mt-8">
              <Link
                href="/auth/signin"
                className={buttonVariants({ size: "lg" })}
              >
                Create my free fridge
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
