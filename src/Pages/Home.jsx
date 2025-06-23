import React from 'react'
import { Link } from 'react-router'
import { useEffect } from 'react'
import landingLeaves from '../assets/wmremove-transformed(1).png'
import { Upload } from 'lucide-react'

export default function Home() {

  const [user, setUser] = React.useState('')
  const [isLoaded, setIsLoaded] = React.useState(false)

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if(savedUser == undefined || savedUser == null){
      setUser({name: 'Guest User'});
    }
    else{
      setUser(savedUser);
    }

    // Listen for custom event on login
    const handleUserChange = () => {
      const updatedUser = JSON.parse(localStorage.getItem('user'));
      setUser(updatedUser);
    };

    window.addEventListener("userChanged", handleUserChange);

    // Lock scroll
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden' // for mobile

    return () => {
      window.removeEventListener("userChanged", handleUserChange);
      // Unlock scroll when leaving this page
      document.body.style.overflowY = 'auto'
      document.documentElement.style.overflowY = 'auto'
    }
  }, [])

  return (
    <div className='home'>
      <div className="flex flex-col md:flex-row items-center justify-between bg-green-50 h-[100vh] w-[100vw] overflow-hidden">

        {/* Left Content */}
        <div className="md:w-1/2 w-full p-8 space-y-6 mt-[20%] md:mt-0 z-10">
          <h1 className="text-[42px] md:text-5xl font-bold text-green-800 leading-tight">
            Revolutionizing Waste Management in India
          </h1>
          <p className="text-lg md:text-xl text-gray-700">
            EcoBarter creates a responsible and rewarding system where citizens contribute to a cleaner environment, and collectors benefit from verified waste sources.
          </p>
          <Link to={'/upload'} className="mt-4 bg-[#1a1a1a] text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-green-700 transition-all shadow-md">
            Get Started
          </Link>

          <h3 className='absolute top-[10%] right-5 text-black uppercase'>Hey😀 {user.name}</h3>
        </div>

        {/* Right (Optional Image or Design Section) */}
        <div className="absolute bottom-0 h-full w-full overflow-hidden">
          <div className='relative h-full w-[250vw] md:w-[100vw]'>
            <img
              src={landingLeaves}
              alt="EcoBarter Illustration"
              onLoad={() => {
                // Ensure the image is fully loaded before applying styles
                setIsLoaded(true)
              }}
              className={`absolute bottom-0 w-full ${isLoaded ? "animate__animated animate__slideInUp" : "hidden"} object-cover`}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
