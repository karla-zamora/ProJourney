import trad_dsa from "@/public/images/trad_dsa_d.png";
import pro_dsa from "@/public/images/pro_dsa_d.png";
import "@/styles/home.css"
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from "./ui/button";
import Link from "next/link";


export default function MainPage({ user, setRedirect, handleGoogleSignIn }) {


    return (
        <main className="flex flex-col items-center justify-center w-full flex-1 px-4 sm:px-6 lg:px-8 text-center">
            {/* Title + cards */}
            <div id="top-page">
                <h4 className="font-bold text-slate-200 opacity-75 drop-shadow-lg pt-4 text-indigo-950">
                    Welcome to your <span className="">Computer Science</span>
                </h4>
                <h1 className="pb-16 text-6xl font-bold text-neutral-50 drop-shadow-lg">
                    <span className="shiny-text text-cyan-600 drop-shadow-lg">PRO</span>
                    <span className="text-slate-400 drop-shadow-lg">Journey</span>
                </h1>
                <div className="mb-3">
                    <h2 className="text-neutral-50 italic bg-indigo-950 bg-opacity-25 rounded-xl p-1">Master data structures & algorithms questions in a unique non-linear way:</h2>
                </div>


                {/* Intro cards */}
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                    <Card className="w-80 bg-transparent shadow-cyan-50 shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-neutral-50 text-3xl">Repetition</CardTitle>
                            <CardDescription className="text-neutral-400">Is the Key to Learning</CardDescription>
                        </CardHeader>
                        <CardContent className="text-neutral-50">
                            With an algorithm designed to help you retain your past knowledge.
                        </CardContent>
                    </Card>

                    <Card className="w-80 bg-transparent shadow-cyan-50 shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-neutral-50 text-3xl">Customized</CardTitle>
                            <CardDescription className="text-neutral-400">Learning Experience</CardDescription>
                        </CardHeader>
                        <CardContent className="text-neutral-50">
                            With a program designed specifically for you.
                        </CardContent>
                    </Card>

                    <Card className="w-80 bg-transparent shadow-cyan-50 shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-neutral-50 text-3xl">Unlimited</CardTitle>
                            <CardDescription className="text-neutral-400">Practice</CardDescription>
                        </CardHeader>
                        <CardContent className="text-neutral-50">
                            Never lose your hard-earned programming skills.
                        </CardContent>
                    </Card>
                </div>
                <Button asChild>
                    <Link href="/waitlist">Get started</Link>
                </Button>
            </div>


            {/* Images */}
            <div className="flex flex-col items-center gap-4 lg:w-4/5">
                <br></br>
                <div className="w-full p-5 bg-indigo-950 rounded-xl bg-opacity-30">
                    <h1 className="text-4xl p-5 text-amber-50 bg-cyan-600 bg-opacity-30 rounded-xl">Why is current DSA learning inefficient?</h1>
                    <div className="pt-5 grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
                        <div className="col-span-2">
                            <Image src={trad_dsa} className="ring-2 ring-cyan-500 max-w-full rounded-xl h-auto" />
                        </div>
                        <div>
                            <ul className="pl-5 text-balance text-amber-50 space-y-5">
                                <li>
                                    <h3 className="text-lg">
                                        <span className="text-xl font-semibold text-amber-300">Linear Learning:</span> Traditional DSA teaching is often linear, progressing from one topic to the next without revisiting earlier concepts.
                                    </h3>
                                </li>
                                <li>
                                    <h3 className="text-lg">
                                        <span className="text-xl font-semibold text-amber-300">Memorization Over Understanding:</span> The focus is usually on memorizing algorithms rather than truly understanding how and when to apply them.
                                    </h3>
                                </li>
                                <li>
                                    <h3 className="text-lg">
                                        <span className="text-xl font-semibold text-amber-300">Forgetting Basics:</span> As new topics are introduced, earlier concepts and foundational knowledge are easily forgotten, making it harder to solve complex problems later on.
                                    </h3>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="w-full p-5 bg-indigo-950 rounded-xl bg-opacity-50">
                    <h1 className="text-4xl p-5 text-cyan-50 bg-cyan-600 bg-opacity-30 rounded-xl">How ProJourney helps you stand out!</h1>
                    <div className="pt-5 grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
                        <div>
                            <ul className="pl-5 text-balance text-amber-50 space-y-5">
                                <li>
                                    <h3 className="text-lg pb-5">
                                        <span className="text-xl font-semibold text-emerald-400">✔ Hands-On Projects:</span> Apply DSA concepts in small projects or challenges, like building a simple game or implementing a common algorithm from scratch.
                                    </h3>
                                </li>
                                <li>
                                    <h3 className="text-lg pb-5">
                                        <span className="text-xl font-semibold text-emerald-400">✔ Game-based Learning:</span> Treat your learning like a videogame. Level up, recognize patterns, and master each skill.
                                    </h3>
                                </li>
                                <li>
                                    <h3 className="text-lg pb-5">
                                        <span className="text-xl font-semibold text-emerald-400">✔ Visual lessons: </span> Understanding hard concepts by breaking them down into smaller topics, each with a visual lesson.
                                    </h3>
                                </li>
                                <li>
                                    <h3 className="text-lg pb-5">
                                        <span className="text-xl font-semibold text-emerald-400">✔ Keep your skills on rotation: </span> Never forget what you learned by consistently revising previous topics during our interactive challenges!
                                    </h3>
                                </li>
                            </ul>
                        </div>
                        <div className="col-span-1">
                            <Image src={pro_dsa} className="ring-2 ring-white max-w-full rounded-xl h-auto" />
                        </div>
                    </div>
                </div>

            </div>

            {/* Waitlist button 2 */}
            <div className="text-center py-10">
                <h1 className="text-4xl font-bold text-cyan-50 mb-6 animate-pulse">&#128640; Excited for our launch? &#128640;</h1>
                <a
                    href="/waitlist"
                    className="inline-block py-3 px-6 text-lg font-semibold text-white bg-rose-600 rounded-full shadow-lg transition-all duration-300 ease-in-out hover:bg-rose-700 hover:shadow-2xl hover:-translate-y-1"
                >
                    Join our Waitlist!
                </a>
            </div>




        </main>
    )
}