import broken_img from "@/public/images/broken.png"
import Image from "next/image";

export default function contact() {
    return (
        <div className="main-pg h-screen flex flex-col items-center justify-center">
            <div className="h-4/5 flex flex-col items-center justify-center text-center">
                <h1 className="text-white">Hey there! We are still under development.</h1>
                <h1 className="text-white">Why not sign up for our <span className="shiny-text"><a href="/waitlist">waitlist</a></span> while we figure this out?</h1>
                <Image src={broken_img} className="max-h-full w-auto" />
                <a
                    href="/"
                    className="inline-block py-3 px-6 text-lg font-semibold text-white bg-rose-600 rounded-full shadow-lg transition-all duration-300 ease-in-out hover:bg-rose-700 hover:shadow-2xl hover:-translate-y-1"
                >
                    Return Home
                </a>
            </div>
        </div>
    )
}