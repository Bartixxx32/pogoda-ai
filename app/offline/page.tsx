import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CloudOff, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function OfflinePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md">
        <Card className="frosted-glass rounded-xl">
          <CardHeader className="pb-2 text-center">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
              Brak połączenia
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex justify-center my-8">
              <CloudOff className="h-24 w-24 text-blue-500/50" />
            </div>
            <p className="mb-6 text-slate-700 dark:text-slate-300">
              Wygląda na to, że nie masz połączenia z internetem. Sprawdź swoje połączenie i spróbuj ponownie.
            </p>
            <div className="flex justify-center">
              <Button
                asChild
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <Link href="/" className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Odśwież
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

