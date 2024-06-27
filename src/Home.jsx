import React, { useEffect } from "react";
import SubscriptionList from "./SubscriptionList";
import SubscriptionStats from "./SubStats";
import { Client, Databases, ID, Storage, Account } from "appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("667c187d00198a43e82a");

const databases = new Databases(client);

const account = new Account(client);

const Home = () => {
  useEffect(() => {
    const checkSession = async () => {
      try {
        await account.getSession("current");
      } catch {
        // No session found, stay on login page
        window.location.href = "/login";
      }
    };
    checkSession();
  }, []);
  return (
    <>
      <SubscriptionStats />
      <SubscriptionList />
    </>
  );
};

export default Home;
