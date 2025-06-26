import { createFileRoute } from "@tanstack/react-router"
import { Helmet } from "react-helmet-async"
import Listener from "@/features/listener"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

export const Route = createFileRoute("/_authenticated/")({
  component: HomePage,
})

function HomePage() {
  const { claims, isLoading } = useAuth()
  const isFree = claims?.plan === "free"

  return (
    <>
      <Helmet>
        <title>Listen to global stations on Hörgen</title>
      </Helmet>

      <div className="container p-6">
        <div className="space-y-2">
          {isLoading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : isFree ? (
            <Alert className="mb-4 rounded-xs">
              <AlertTitle>Upgrade to Pro</AlertTitle>
              <AlertDescription>
                Unlock unlimited listening and exclusive features. <br />
                <Button asChild className="mt-2 rounded-none bg-[#26E056] hover:bg-[#1DBB4D]">
                  <a href="/subscriptions" className="text-zinc-800">Subscribe Now</a>
                </Button>
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <h1 className="text-3xl font-bold tracking-tight">Now Playing</h1>
              <p className="text-muted-foreground">
                Discover and listen to your favorite radio stations
              </p>
            </>
          )}
        </div>
        <Listener />
      </div>
    </>
  )
}
