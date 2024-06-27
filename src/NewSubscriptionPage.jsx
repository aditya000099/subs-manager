import React, { useState, useEffect } from "react";
import AddSubscriptionForm from './AddSubscriptionForm';
import SubscriptionList from './SubscriptionList';
import { Client, Databases, ID, Storage, Account } from "appwrite";
import Login from './Login';
import Header from "./Header";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("667c187d00198a43e82a");

const databases = new Databases(client);

// const storage = new Storage(client);

const account = new Account(client);

const NewSubPage = () => {
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
    <Header />
    <div className=" bg-background text-textPrimary p-4 w-screen mt-16 ">

      <h1 className="text-3xl font-bold text-center text-slate-200 mb-6 inter-heading">Add new subscription</h1>
      <div className="max-w-xl mx-auto">
        <AddSubscriptionForm />
      </div>
    </div>
    </>
  );
};

export default NewSubPage;
