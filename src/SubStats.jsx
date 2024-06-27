import React, { useState, useEffect } from "react";
import { Client, Databases, Query, Account } from "appwrite";
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("667c187d00198a43e82a");

const databases = new Databases(client);
const account = new Account(client);

const SubscriptionStats = () => {
  const [subs, setSubs] = useState([]);
  const [stats, setStats] = useState({
    monthlySpend: 0,
    yearlySpend: 0,
    totalSpend: 0,
    activeSubs: 0,
    endedSubs: 0,
    expectedSpend: 0,
  });

  useEffect(() => {
    const fetchSubs = async () => {
      try {
        const user = await account.get();
        const userId = user.$id;
        const response = await databases.listDocuments(
          "database", // Replace with your database ID
          "subscriptions", // Replace with your collection ID
          [
            Query.equal("userid", userId),
            Query.orderAsc("expirationDate")
          ]
        );
        const fetchedSubs = response.documents;
        setSubs(fetchedSubs);
        calculateStats(fetchedSubs);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSubs();
  }, []);

  const calculateStats = (subs) => {
    let monthlySpend = 0;
    let yearlySpend = 0;
    let totalSpend = 0;
    let activeSubs = 0;
    let endedSubs = 0;
    let expectedSpend = 0;

    const today = new Date();

    subs.forEach((sub) => {
      const isRecurring = sub.recurring;
      const isExpired = new Date(sub.expirationDate) < today;
      const price = parseFloat(sub.price);
      const billingCycle = sub.billingCycle.toLowerCase();

      if (!isExpired) {
        activeSubs += 1;
        if (billingCycle === 'monthly') {
          monthlySpend += price;
          expectedSpend += price * 12;
        } else if (billingCycle === 'yearly') {
          yearlySpend += price;
          expectedSpend += price;
        }
      } else {
        endedSubs += 1;
      }

      totalSpend += price;
    });

    setStats({
      monthlySpend,
      yearlySpend,
      totalSpend,
      activeSubs,
      endedSubs,
      expectedSpend,
    });
  };

  const data = {
    labels: ['Monthly Spend', 'Yearly Spend', 'Total Spend', 'Expected Spend'],
    datasets: [
      {
        label: 'Spending Statistics',
        data: [stats.monthlySpend, stats.yearlySpend, stats.totalSpend, stats.expectedSpend],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="mx-auto mt-24 flex justify-center items-center w-screen flex-col">
      <h2 className="text-2xl font-bold mb-16">Subscription Statistics</h2>
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mx-20">
        <div className="bg-[#1c1c1d] p-4 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-200">Monthly Spend</h3>
          <p className="text-gray-400">${stats.monthlySpend}</p>
        </div>
        <div className="bg-[#1c1c1d] p-4 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-200">Yearly Spend</h3>
          <p className="text-gray-400">${stats.yearlySpend}</p>
        </div>
        <div className="bg-[#1c1c1d] p-4 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-200">Total Spend</h3>
          <p className="text-gray-400">${stats.totalSpend}</p>
        </div>
        <div className="bg-[#1c1c1d] p-4 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-200">Active Subscriptions</h3>
          <p className="text-gray-400">{stats.activeSubs}</p>
        </div>
        <div className="bg-[#1c1c1d] p-4 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-200">Ended Subscriptions</h3>
          <p className="text-gray-400">{stats.endedSubs}</p>
        </div>
        <div className="bg-[#1c1c1d] p-4 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-200">Expected Spend</h3>
          <p className="text-gray-400">${stats.expectedSpend}</p>
        </div>
      </div>
      <div className="w-full max-w-4xl mt-16">
        <Line data={data} />
      </div>
    </div>
  );
};

export default SubscriptionStats;
