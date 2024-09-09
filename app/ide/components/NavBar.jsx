import { FaUserCircle } from 'react-icons/fa'; // Example icon
import astronaut from '../../../public/images/projourney.png'
import Image from 'next/image';

const Navbar = ({problemName}) => {
  return (
    <nav className="bg-dark-layer-2 h-14 w-full flex items-center justify-between px-5">
      {/* Left: Logo */}
      <div className="flex items-center">
            <a id="title" href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                <Image src={astronaut} width={40} className="h-8 shadow-white" alt="ProJourney Logo" />
                <span className="self-center text-medium text-white font-semibold whitespace-nowrap dark:text-white">ProJourney</span>
            </a>
      </div>

      {/* Middle: Text */}
      <div className="flex-1 text-center">
        <span className="text-white font-medium text-lg">{problemName}</span>
      </div>

      {/* Right: Icon */}
      <div className="flex items-center">
        <FaUserCircle className="text-white h-8 w-8 cursor-pointer" />
      </div>
    </nav>
  );
};

export default Navbar;
