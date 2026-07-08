import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col flex-1">
      <header className="flex items-center justify-between px-6 h-16 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold">Clonary</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors"
          >
            Get Started
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-24">
        <div className="max-w-2xl text-center space-y-8">
          <h1 className="text-5xl font-bold tracking-tight">
            Your Voice,{" "}
            <span className="text-primary">Reimagined</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Clone your voice in seconds and generate natural speech with emotion control.
            Perfect for content creators, developers, and storytellers.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/register"
              className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:bg-primary-hover transition-colors"
            >
              Start Cloning
            </Link>
            <Link
              href="/login"
              className="border border-border px-6 py-3 rounded-xl font-medium text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
          <div className="rounded-xl border border-card-border bg-card p-6 text-center space-y-3">
            <div className="text-3xl">🎤</div>
            <h3 className="font-semibold">Voice Cloning</h3>
            <p className="text-sm text-muted-foreground">
              Upload a sample and get a digital replica of your voice
            </p>
          </div>
          <div className="rounded-xl border border-card-border bg-card p-6 text-center space-y-3">
            <div className="text-3xl">🎭</div>
            <h3 className="font-semibold">Emotion Control</h3>
            <p className="text-sm text-muted-foreground">
              Add emotion tags to make speech sound happy, sad, or energetic
            </p>
          </div>
          <div className="rounded-xl border border-card-border bg-card p-6 text-center space-y-3">
            <div className="text-3xl">⚡</div>
            <h3 className="font-semibold">Instant Generation</h3>
            <p className="text-sm text-muted-foreground">
              Generate high-quality speech in seconds with your cloned voice
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
