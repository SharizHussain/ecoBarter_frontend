import React, { useState } from 'react'
import { useNavigate } from 'react-router';
import api from '../../api/api'; // adjust path if needed
import Loader from '../../Components/Loader';
import styles from './Register.module.css'
import greeneryImage from '../../assets/login.png'

export default function AuthPage() {
  const navigate = useNavigate()

  const [isLogin, setIsLogin] = useState(true)

  const [mode, setMode] = useState("user");
  const [name, setName] = useState('');
  const [email, setEmail] = useState('shad@example.com');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);

  const toggleForm = () => setIsLogin(!isLogin)

  const credentials = {
    user: {
      email: "shad@example.com",
      password: "123456",
    },
    org: {
      email: "greensweep@org.com",
      password: "password123",
    },
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setEmail(credentials[newMode].email);
    setPassword(credentials[newMode].password);
  };

  const handleRegister = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.dispatchEvent(new Event("userChanged"));
      alert("✅ Login successful");
      await navigate("/discover");
    } catch (err) {
      console.error(err);
      alert("❌ Login failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen flex flex-col w-[100vw] md:flex-row overflow-y-auto">
      <div className="md:w-1/2 w-[110%] h-64 md:h-auto">
        <img
          src={greeneryImage}
          alt="Eco Background"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="md:w-1/2 flex items-center justify-center p-6 bg-green-50">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-green-700 text-center mb-6">
            {isLogin ? 'Login' : 'Register'}
          </h2>

          {isLogin && (
            <div className="flex justify-center gap-4 mb-4">
              <div
                onClick={() => switchMode("user")}
                className={`cursor-pointer px-4 py-2 rounded-md font-semibold transition ${mode === "user" ? "bg-green-600 text-white outline-3 outline-green-800" : "bg-gray-200 text-gray-700"}`}
              >
                Login as User
              </div>
              <div
                onClick={() => switchMode("org")}
                className={`cursor-pointer px-4 py-2 rounded-md font-semibold transition ${mode === "org" ? "bg-green-600 text-white outline-3 outline-green-800" : "bg-gray-200 text-gray-700"}`}
              >
                Login as Organisation
              </div>
            </div>
          )}

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
