import React, { useState, useEffect } from "react";
import SubscriptionList from "./SubscriptionList";
import SubscriptionStats from "./SubStats";
import { Client, Databases, ID, Storage, Account } from "appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("667c187d00198a43e82a");

const databases = new Databases(client);

const account = new Account(client);

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        await account.getSession("current");
        setLoading(false);
      } catch {
        // No session found, stay on login page
        window.location.href = "/login";
      }
    };
    checkSession();
  }, []);

  if (loading) {
    return (
      <div class="flex justify-center items-center w-screen h-screen">
        <div class="animate-spin rounded-full h-12 w-32 border-t-2 border-b-2 border-rose-900"></div>
      </div>
    );
  }

  return (
    <>
      <SubscriptionStats />
      <SubscriptionList />
    </>
  );
};

export default Home;
