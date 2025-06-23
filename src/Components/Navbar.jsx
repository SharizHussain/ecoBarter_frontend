import React, { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react' // For hamburger icons
import { Link } from 'react-router' // <-- update import

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
  const savedUser = JSON.parse(localStorage.getItem('user'));
  setUser(savedUser);

  // Listen for custom event on login
  const handleUserChange = () => {
    const updatedUser = JSON.parse(localStorage.getItem('user'));
    setUser(updatedUser);
  };

  window.addEventListener("userChanged", handleUserChange);

  return () => {
    window.removeEventListener("userChanged", handleUserChange);
  };
}, []);


  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-screen z-50 font-[Poppins]">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold text-green-600">
          Eco<span className="text-gray-800">Barter</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-8 text-[16px] font-medium">
          <Link to="/" className="text-gray-700 hover:text-green-600 transition">Home</Link>
          <Link to="/discover" className="text-gray-700 hover:text-green-600 transition">Discover</Link>
          {
            user?.role == 'org' ?
              <Link to="/acceptedRequests" className="text-gray-700 hover:text-green-600 transition"> Requests
              </Link>
              :
              <Link to="/upload" className="text-gray-700 hover:text-green-600 transition">
                Upload
              </Link>
          }
          <Link to="/register" className="text-gray-700 hover:text-green-600 transition">Profile</Link>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button onClick={() => setOpen(!open)}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {
        open && (
          <div className="md:hidden w-[100vw] pb-4 space-y-2 ml-5">
            <Link to="/" className="block text-gray-700 hover:text-green-600">Home</Link>
            <Link to="/discover" className="block text-gray-700 hover:text-green-600">Discover</Link>
            <Link to="/upload" className="block text-gray-700 hover:text-green-600">Upload</Link>
            <Link to="/register" className="block text-gray-700 hover:text-green-600">Profile</Link>
          </div>
        )
      }
    </nav >
  )
}
