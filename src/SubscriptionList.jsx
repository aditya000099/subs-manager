import React, { useState, useEffect } from "react";
import { Client, Databases, Query, Account } from "appwrite";
import Header from "./Header";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Modal from "./Modal";
import ModalU from "./ModalUpdate";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("667c187d00198a43e82a");

const databases = new Databases(client);
const account = new Account(client);

const SubscriptionList = () => {
  const [subs, setSubs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchSubs = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const user = await account.get();
        const userId = user.$id;
        const response = await databases.listDocuments(
          "database", // Replace with your database ID
          "subscriptions", // Replace with your collection ID
          [Query.equal("userid", userId), Query.orderAsc("expirationDate")]
        );
        const fetchedSubs = response.documents;
        setSubs(fetchedSubs);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubs();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-screen">
        <div className="animate-spin rounded-full h-12 w-32 border-t-2 border-b-2 border-rose-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-4 text-red-500">
        Error: {error.message}
      </div>
    );
  }

  const handleAdd = (e) => {
    e.preventDefault();
    window.location.href = "/new";
  };

  const handleEditClick = (sub) => {
    setSelectedSub(sub);
    setShowEditModal(true);
  };

  const handleDeleteClick = (sub) => {
    setSelectedSub(sub);
    setIsModalOpen(true);
  };

  const deleteSubscription = async () => {
    try {
      await databases.deleteDocument(
        "database",
        "subscriptions",
        selectedSub.$id
      );
      setSubs((prevSubs) => prevSubs.filter((sub) => sub.$id !== selectedSub.$id));
      setIsModalOpen(false);
      setSelectedSub(null);
    } catch (err) {
      console.error("Failed to delete subscription", err);
      setError(err);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const updatedSub = {
      name: e.target.name.value,
      price: parseFloat(e.target.price.value),
      billingCycle: e.target.billingCycle.value,
      expirationDate: e.target.expirationDate.value
    };

    try {
      await databases.updateDocument(
        "database",
        "subscriptions",
        selectedSub.$id,
        updatedSub
      );
      setSubs((prevSubs) =>
        prevSubs.map((sub) =>
          sub.$id === selectedSub.$id ? { ...sub, ...updatedSub } : sub
        )
      );
      setShowEditModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  const ONE_WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;

  const today = new Date();
  const calculateDaysLeft = (expirationDate) => {
    const diffInMs = new Date(expirationDate).getTime() - today.getTime();
    return Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="mx-auto mt-36 flex justify-center items-center w-screen flex-col">
      <Header />
      <h2 className="text-2xl font-bold mb-12">Your Subscriptions</h2>
      <ul className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mx-20">
        {subs.map((sub, index) => {
          const isExpiringSoon =
            today.getTime() + ONE_WEEK_IN_MS >= new Date(sub.expirationDate).getTime() &&
            new Date(sub.expirationDate).getTime() > today.getTime();
          const daysLeft = calculateDaysLeft(sub.expirationDate);
          const isExpired = today.getTime() > new Date(sub.expirationDate).getTime();

          const expirationText = isExpiringSoon
            ? daysLeft > 0
              ? `Expiring in ${daysLeft} day${daysLeft > 1 ? "s" : ""}`
              : "Expired"
            : isExpired
            ? "Expired"
            : `Expires in ${daysLeft} day${daysLeft > 1 ? "s" : ""}`;

          const expirationColor = isExpiringSoon
            ? "text-rose-500"
            : isExpired
            ? "text-gray-700"
            : "text-gray-400";

          const borderColor = isExpiringSoon
            ? "border border-rose-500"
            : isExpired
            ? ""
            : "";

          return (
            <li key={index}>
              <p className={`${expirationColor} text-sm mb-2`}>
                {expirationText}
              </p>
              <div className={`bg-[#1c1c1d] p-4 rounded-xl shadow-lg ${borderColor}`}>
                <h3 className="text-lg font-semibold text-gray-200">{sub.name}</h3>
                <p className="text-gray-400">Price: ${sub.price}</p>
                <p className="text-gray-400">Billing Cycle: {sub.billingCycle}</p>
                <p className="text-gray-400">Next Payment: {formatDate(sub.expirationDate)}</p>
              </div>
              <div className="flex justify-end items-center mt-2 bg-transparent">
                <FaEdit className="text-gray-400 mr-4 cursor-pointer" onClick={() => handleEditClick(sub)} />
                <FaTrashAlt className="text-gray-400 cursor-pointer" onClick={() => handleDeleteClick(sub)} />
              </div>
            </li>
          );
        })}
      </ul>
      <div className="flex justify-center items-center w-screen mb-48">
        <p className="text-gray-600 mt-16 text-lg">
          <span
            onClick={handleAdd}
            className="text-rose-500 cursor-pointer hover:text-rose-200"
          >
            Add new subscription
          </span>
        </p>
      </div>
      {isModalOpen && (
        <Modal
          title="Confirm Deletion"
          onClose={() => setIsModalOpen(false)}
          onConfirm={deleteSubscription}
        >
          <p>Are you sure you want to delete this subscription?</p>
        </Modal>
      )}
      {showEditModal && (
        <Modal title="Edit Subscription" onClose={() => setShowEditModal(false)}>
          {selectedSub && (
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Name:</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={selectedSub.name}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Price:</label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  defaultValue={selectedSub.price}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Billing Cycle:</label>
                <input
                  type="text"
                  name="billingCycle"
                  defaultValue={selectedSub.billingCycle}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Expiration Date:</label>
                <input
                  type="date"
                  name="expirationDate"
                  defaultValue={selectedSub.expirationDate}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-500 text-white rounded hover:bg-rose-700"
                >
                  Save
                </button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
};

export default SubscriptionList;
