import "../styles/home.css"
import AppBar from "@/components/AppBar.js"
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';


export default function Home() {
  return (
    <div className="main-pg min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <AppBar />
      <main className="flex flex-col items-center justify-center w-full flex-1 px-4 sm:px-6 lg:px-8 text-center">
        <h4 className="font-bold text-neutral-50 drop-shadow-lg p-4">
          Welcome to your Computer Science
        </h4>
        <h1 className="pb-32 text-6xl font-bold text-neutral-50 drop-shadow-lg">
          <span className="text-cyan-600 drop-shadow-lg">PRO</span><span className="text-slate-400 drop-shadow-lg	">Journey</span>
        </h1>


        <div class="grid sm:grid-cols-1 md:grid-cols-4 grid-flow-col gap-4 flex justify-evenly">
          <div>
            <div className="pb-5 md:col-span-1">
              <Card className="w-80 bg-black">
                <CardHeader>
                  <CardTitle>Documentation</CardTitle>
                  <CardDescription>Next.js features and API.</CardDescription>
                </CardHeader>
                <CardContent>
                  Hello buenas
                </CardContent>
              </Card>
            </div>

            <div className="pb-5">
              <Card className="w-80">
                <CardHeader>
                  <CardTitle>Documentation</CardTitle>
                  <CardDescription>Next.js features and API.</CardDescription>
                </CardHeader>
                <CardContent>
                  Hello buenas
                </CardContent>
              </Card>
            </div>

            <div className="pb-5">
              <Card className="w-80">
                <CardHeader>
                  <CardTitle>Documentation</CardTitle>
                  <CardDescription>Next.js features and API.</CardDescription>
                </CardHeader>
                <CardContent>
                  Hello buenas
                </CardContent>
              </Card>
            </div>
          </div>


          <div className="md:col-span-3">
            content????
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-around max-w-4xl mt-8 sm:w-full">
          Content
        </div>

      </main>

    </div>
  );
}