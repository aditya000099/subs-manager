import React, { useEffect, useState } from "react";
import Header from "./Header";
import { Account, Client } from "appwrite"; // Import Appwrite functions

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("667c187d00198a43e82a");

const account = new Account(client);

const Login = () => {
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      try {
        await account.getSession("current");
        window.location.href = "/"; // Redirect to dashboard if logged in
      } catch {
        setLoading(false); // No session found, stop loading
      }
    };
    checkSession();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const session = await account.createEmailPasswordSession(email, pass);
      localStorage.setItem("userSession", JSON.stringify(session));
      window.location.href = "/"; // Redirect to dashboard
    } catch (error) {
      console.error(error);
      alert("Login failed");
    }

    setEmail("");
    setPass("");
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    window.location.href = "/signup";
  };

  if (loading) {
    return (
      <div class="flex justify-center items-center w-screen h-screen">
        <div class="animate-spin rounded-full h-12 w-32 border-t-2 border-b-2 border-rose-900"></div>
      </div>
    ); 
  }

  return (
    <>
      <Header />
      <div className="bg-background text-textPrimary w-screen flex justify-center items-center min-h-screen">
        <form
          onSubmit={handleSubmit}
          className="p-2 mb-6 flex justify-center items-center flex-col bg-background"
        >
          <h1 className="text-3xl font-bold text-center text-slate-50 mb-16 inter-heading">
            Login to your account
          </h1>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="email">
              Email*
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#1c1c1d] text-textPrimary"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-2"
              htmlFor="password"
            >
              Password*
            </label>
            <input
              type="password"
              id="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#1c1c1d] text-textPrimary"
              required
            />
          </div>

          <button
            type="submit"
            className="w-1/3 bg-[#E92735] text-textPrimary py-2 rounded-3xl mt-6"
          >
            Login
          </button>
          <p className="text-gray-600 mt-8 text-sm">
            Don't have an account?{" "}
            <span
              onClick={handleSignUp}
              className="text-purple-500 cursor-pointer"
            >
              Signup Here
            </span>
          </p>
        </form>
      </div>
    </>
  );
};

export default Login;
