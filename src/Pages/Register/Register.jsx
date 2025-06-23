import React, { useState } from 'react'
import { useNavigate } from 'react-router';
import api from '../../api/api'; // adjust path if needed
import styles from './Register.module.css'
import greeneryImage from '../../assets/login.png'


export default function AuthPage() {
  const navigate = useNavigate()

  const [isLogin, setIsLogin] = useState(true)

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const toggleForm = () => setIsLogin(!isLogin)

  const handleRegister = async () => {
    try {
      const res = await api.post('/auth/register', {
        name,
        email,
        password,
        role: 'user'
      });
      console.log('Registered:', res.data);
      alert("✅ Registration successful");
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      window.dispatchEvent(new Event("userChanged"));
      navigate('/discover')
    } catch (err) {
      console.error(err);
      alert("❌ Registration failed");
    }
  };


  const handleLogin = async () => {
    
    try {
      const res = await api.post('/auth/login', {
        email,
        password
      });
      
      // ✅ Save token & user info
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      
      window.dispatchEvent(new Event("userChanged"));
      alert("✅ Login successful");
      await navigate("/discover"); // Go to homepage
    } catch (err) {
      console.error(err);
      alert("❌ Login failed");
    }
  };


  return (
    <div className="min-h-screen flex flex-col w-[100vw] md:flex-row overflow-y-auto">
      {/* Left Side Image */}
      <div className="md:w-1/2 w-[110%] h-64 md:h-auto">
        <img
          src={greeneryImage}
          alt="Eco Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side Form */}
      <div className="md:w-1/2 flex items-center justify-center p-6 bg-green-50">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-green-700 text-center mb-6">
            {isLogin ? 'Login' : 'Register'}
          </h2>

          {/* LOGIN FORM */}
          {isLogin ? (
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleLogin() }}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-all"
              >
                Login
              </button>
            </form>
          ) : (
            // REGISTER FORM
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleRegister() }}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Upload Profile Image</label>
                <input
                  type="file"
                  className={`w-full mt-1 ${styles.customFileInput}`}
                  accept="image/*"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-all"
              >
                Register
              </button>
            </form>
          )}

          {/* Toggle Login/Register Button */}
          <p className="text-center text-sm text-gray-600 mt-4">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={toggleForm}
              className="text-green-600 font-medium hover:underline"
            >
              {isLogin ? 'Register' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
