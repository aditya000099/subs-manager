import React, { useState, useEffect } from "react";
import { Account, Client, Databases } from "appwrite"; // Import Appwrite functions
import Header from "./Header";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("667c187d00198a43e82a");

const account = new Account(client);
const databases = new Databases(client);

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(true); // State for loading animation

  useEffect(() => {
    const checkSession = async () => {
      try {
        await account.getSession("current");
        window.location.href = "/"; // Redirect to dashboard if logged in
      } catch {
        setLoading(false); // No session found, stay on signup page
      }
    };
    checkSession();
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await account.create("unique()", email, pass, name);

      const post = await databases.createDocument(
        "database", // replace with your database ID
        "users", // replace with your collection ID
        response.$id,
        { name, email, id: response.$id }
      );

      console.log("User created:", post);
      console.log("Signup successful! Please login.");
      alert("Signup successful! Please login.");
      setLoading(false);
      window.location.href = "/login"; // Redirect to login page
    } catch (error) {
      console.error("Signup failed:", error);
      alert("Signup failed");
      setLoading(false);
    }

    setEmail("");
    setPass("");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    window.location.href = "/login";
  };

  return (
    <>
      
      {loading ? (
        <div class="flex justify-center items-center w-screen h-screen">
          <div class="animate-spin rounded-full h-12 w-32 border-t-2 border-b-2 border-rose-900"></div>
        </div>
      ) : (
        <>
        <Header />
        <div className="bg-background text-textPrimary w-screen flex justify-center items-center">
          <form
            onSubmit={handleSignup}
            className="p-2 mb-6 flex justify-center items-center flex-col bg-background"
          >
            <h1 className="text-3xl font-bold text-center text-slate-50 mb-16 inter-heading">
              Create your account
            </h1>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" htmlFor="name">
                Name*
              </label>
              <input
                type="name"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#1c1c1d] text-textPrimary"
                required
              />
            </div>
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
              className="w w-5/12 bg-[#E92735] text-textPrimary py-2 rounded-3xl mt-6"
            >
              Sign Up
            </button>
            <p className="text-gray-600 mt-8 text-sm">
              Already have an account?{" "}
              <span
                onClick={handleLogin}
                className="text-red-500 cursor-pointer"
              >
                Login Here
              </span>
            </p>
          </form>
        </div>
        </>
      )}
    </>
  );
};

export default Signup;
