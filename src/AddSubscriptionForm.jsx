import React, { useState } from "react";
import { Client, Databases, ID, Account } from "appwrite"; // Import Appwrite functions

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("667c187d00198a43e82a");

const databases = new Databases(client);
const account = new Account(client);

const AddSubscriptionForm = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [billingCycle, setBillingCycle] = useState("Monthly");
  const [expirationDate, setExpirationDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [isSplitWithSomeone, setIsSplitWithSomeone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = account.get();
      const userid = (await user).$id;
      const response = await databases.createDocument(
        "database",
        "subscriptions",
        ID.unique(),
        {
          name,
          price: parseFloat(price),
          billingCycle,
          expirationDate,
          paymentMethod,
          isRecurring,
          isSplitWithSomeone,
          userid: userid,
        }
      ).then(function (response2) {
        const response = databases.updateDocument("database", "subscriptions", response2.$id, {id: response2.$id});
        // console.log("Subscription created:", response);
      })

      console.log("Subscription added:", response);
      alert("Subscription added successfully!");
      window.location.href = "/";
    } catch (error) {
      console.error("Error adding subscription:", error);
      alert("Failed to add subscription");
    }

    // Clear form fields after submission
    setName("");
    setPrice("");
    setBillingCycle("Monthly");
    setExpirationDate("");
    setPaymentMethod("");
    setIsRecurring(false);
    setIsSplitWithSomeone(false);
  };

  return (
    <div className="">


    <form onSubmit={handleSubmit} className="p-6 rounded-lg shadow-lg mb-6 max-w-lg mx-auto">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2" htmlFor="name">
          Name*
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 rounded-lg bg-[#1c1c1d] text-textPrimary"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2" htmlFor="price">
          Price
        </label>
        <input
          type="number"
          id="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full p-2 rounded-lg bg-[#1c1c1d] text-textPrimary"
          required
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-sm font-medium mb-2"
          htmlFor="billingCycle"
        >
          Billing Cycle
        </label>
        <select
          id="billingCycle"
          value={billingCycle}
          onChange={(e) => setBillingCycle(e.target.value)}
          className="w-full p-2 rounded-lg bg-[#1c1c1d] text-textPrimary"
        >
          <option value="Monthly">Monthly</option>
          <option value="Yearly">Yearly</option>
        </select>
      </div>
      <div className="mb-4">
        <label
          className="block text-sm font-medium mb-2"
          htmlFor="expirationDate"
        >
          Expiration Date
        </label>
        <input
          type="date"
          id="expirationDate"
          value={expirationDate}
          onChange={(e) => setExpirationDate(e.target.value)}
          className="w-full p-2 rounded-lg bg-[#1c1c1d] text-textPrimary"
          required
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-sm font-medium mb-2"
          htmlFor="paymentMethod"
        >
          Payment Method
        </label>
        <input
          type="text"
          id="paymentMethod"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full p-2 rounded-lg bg-[#1c1c1d] text-textPrimary"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Recurring Payment
          <input
            type="checkbox"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
            className="ml-2"
          />
        </label>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Split with Someone
          <input
            type="checkbox"
            checked={isSplitWithSomeone}
            onChange={(e) => setIsSplitWithSomeone(e.target.checked)}
            className="ml-2"
          />
        </label>
      </div>
      <button
        type="submit"
        className="w-full bg-[#E92735] text-textPrimary py-2 rounded-3xl mt-6"
      >
        Add Subscription
      </button>
    </form>
    </div>
  );
};

export default AddSubscriptionForm;
