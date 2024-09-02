'use client'
import { useState } from 'react';
import Image from 'next/image'
import projourney_logo from '@/public/images/projourney.png'

export default function AppBar({user, setRedirect, handleGoogleSignIn}) {
    const [isOpen, setIsOpen] = useState(false);

    /**
     * Toggle the state of the navigation menu. If the menu is open, it will be
     * closed and vice versa.
     */
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className='sticky'>
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <div className='flex justify-between place-content-between'>
                    <a id="title" href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <Image src={projourney_logo} width={40} className="h-8 shadow-white" alt="ProJourney Logo" />
                        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">ProJourney</span>
                    </a>
                    <button
                        id="mobile-btn"
                        onClick={toggleMenu}
                        type="button"
                        className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                        aria-controls="navbar-default"
                        aria-expanded={isOpen}
                    >
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15" />
                        </svg>
                    </button>
                </div>
                <div className={`${isOpen ? 'block' : 'hidden'} w-full md:block md:w-auto`} id="navbar-default">
                    <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                        <li>
                            <a href="/" className="block py-2 px-3 text-white bg-transparent sm:hover:bg-black md:hover:bg-transparent rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500" aria-current="page">Home</a>
                        </li>
                        <li>
                            <a href="/waitlist" className="block py-2 px-3 text-slate-50 rounded hover:bg-gray-100 sm:hover:bg-black md:hover:bg-transparent md:border-0 md:hover:text-rose-600 md:p-0 md:hover:shadow-none bg-violet-600 shadow-violet-500 shadow-lg">
                            <p className='px-2'>Join our Waitlist!</p>
                            </a>
                        </li>
                        <li>
                            <a href="/services" className="block py-2 px-3 text-slate-50 rounded hover:bg-gray-100 sm:hover:bg-black md:hover:bg-transparent md:border-0 md:hover:text-cyan-600 md:p-0">Services</a>
                        </li>
                        <li>
                            <a href="pricing" className="block py-2 px-3 text-slate-50 rounded hover:bg-gray-100 sm:hover:bg-black md:hover:bg-transparent md:border-0 md:hover:text-cyan-600 md:p-0">Pricing</a>
                        </li>
                        <li>
                            <a href="/contact" className="block py-2 px-3 text-slate-50 rounded hover:bg-gray-100 sm:hover:bg-black md:hover:bg-transparent md:border-0 md:hover:text-cyan-600 md:p-0">Contact</a>
                        </li>
                        <li>
                            <div className="block py-2 px-3 text-slate-50 rounded hover:bg-gray-100 sm:hover:bg-black md:hover:bg-transparent md:border-0 md:hover:text-rose-600 md:p-0">
                                {user ?
                                    (
                                        <button
                                            onClick={() => {
                                                setRedirect("/dashboard");
                                            }}
                                        >
                                            Dashboard
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleGoogleSignIn}
                                        >
                                            Sign In with Google
                                        </button>

                                    )
                                }
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
