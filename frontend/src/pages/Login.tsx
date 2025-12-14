import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An error occurred";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex  items-center justify-center bg-neutral-50  px-4">
      <div className="bg-white shadow-lg  rounded-xl p-10 w-full max-w-md">
        <h1 className="text-3xl font-semibold text-center text-neutral-900 mb-8">
          Welcome Back
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-neutral-900 mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="w-full h-12 px-4 border border-neutral-200 rounded-md bg-white text-neutral-900 focus:outline-none focus:ring-2  focus:ring-indigo-500 focus:border-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-neutral-900 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="w-full h-12 px-4 border border-neutral-200 rounded-md bg-white text-neutral-900 focus:outline-none focus:ring-2  focus:ring-indigo-500 focus:border-indigo-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-indigo-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            className=" w-full h-12 bg-indigo-500 text-white rounded-md font-medium hover:bg-indigo-600 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-neutral-500 mt-6">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-indigo-500 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
