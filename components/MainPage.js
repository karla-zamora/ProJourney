import trad_dsa from "@/public/images/trad_dsa_d.png";
import pro_dsa from "@/public/images/pro_dsa_d.png";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from "./ui/button";


export default function MainPage({ user, setRedirect, handleGoogleSignIn }) {


    return (
        <main className="flex flex-col items-center justify-center w-full flex-1 px-4 sm:px-6 lg:px-8 text-center">
            {/* Title + cards */}
            <div id="top-page">
                <h4 className="font-bold text-slate-200 opacity-75 drop-shadow-lg pt-4 text-indigo-950">
                    Welcome to your <span className="">Computer Science</span>
                </h4>
                <h1 className="card-shine-effect pb-16 text-6xl font-bold text-neutral-50 drop-shadow-lg">
                    <span className="text-cyan-600 drop-shadow-lg">PRO</span>
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
                <Button>Get started</Button>
            </div>


            {/* Images */}
            <div className="flex flex-col items-center gap-4">
                <br></br>
                <div className="w-full p-5 bg-indigo-950 rounded-xl bg-opacity-30">
                    <h1 className="text-4xl p-5 text-amber-50 bg-cyan-600 bg-opacity-30 rounded-xl">Why is current DSA learning inefficient?</h1>
                    <div>
                        <Image src={trad_dsa} className="ring-2 ring-cyan-500 max-w-full lg:w-2/3 rounded-xl h-auto" />
                    </div>
                    <div>
                        <ul>
                            <li>
                                Linear Learning: Traditional DSA teaching is often linear, progressing from one topic to the next without revisiting earlier concepts.
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="w-full p-5 bg-indigo-950 rounded-xl bg-opacity-50 shadow-cyan-50 shadow-xl">
                    <Image src={pro_dsa} className="ring-2 ring-cyan-50 max-w-full lg:w-1/2 rounded-xl h-auto" />
                </div>
            </div>


        </main>
    )
}