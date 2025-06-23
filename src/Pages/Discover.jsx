import React, { useState, useEffect } from 'react';
import api from '../api/api'
import { ToastContainer, toast } from 'react-toastify';
import dummy1 from '../assets/dc-Cover-ilfs9q2235kmvlii39nv33tkn2-20220509085557.Medi.jpeg';
import dummy2 from '../assets/MT-MESSY-DEMONTE-CLY.jpg';
import dummy3 from '../assets/istockphoto-157437399-612x612.jpg';

// const dummyData = [
//     { id: 1, name: "Ravi Kumar", address: "Sector 21, Noida, UP", image: dummy1 },
//     { id: 2, name: "Anita Sharma", address: "JP Nagar, Bangalore", image: dummy3 },
//     { id: 3, name: "Farhan Qureshi", address: "Wadala, Mumbai", image: dummy2 },
//     { id: 4, name: "Ravi Kumar", address: "Sector 21, Noida, UP", image: dummy1 },
//     { id: 5, name: "Anita Sharma", address: "JP Nagar, Bangalore", image: dummy3 },
//     { id: 6, name: "Farhan Qureshi", address: "Wadala, Mumbai", image: dummy2 },
// ];


export default function Discover() {
    const [showModal, setShowModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState([]);
    const [acceptedIds, setAcceptedIds] = useState([]); // <- track accepted cards
    const [posts, setPosts] = useState([]);
    const [isOrg, setIsOrg] = useState(false)

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem("user"));
        if (currentUser?.role === "org") {
            setIsOrg(true);
        }


        const fetchPosts = async () => {
            try {
                const res = await api.get('/posts/all');
                setPosts(res.data);
            } catch (err) {
                console.error('Error fetching posts:', err);
            }
        };

        fetchPosts();
    }, []);


    const notify = (name) => toast.success(`You Accepted ${name}'s Request!`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
    });

    const openModal = (card) => {
        setSelectedCard(card);
        setShowModal(true);
    };

    const confirmPickup = async () => {
        try {
            const currentUser = JSON.parse(localStorage.getItem("user"));

            // Send real pickup request
            await api.post(`/posts/pickup/${selectedCard._id}`, {
                pickedBy: currentUser._id
            });

            setAcceptedIds((prev) => [...prev, selectedCard._id]);
            notify(selectedCard.pickedBy?.name || "User");
            setShowModal(false);
            setSelectedCard(null);
        } catch (err) {
            console.error("Pickup failed:", err);
            alert("❌ Failed to confirm pickup.");
        }
    };

    const cancelModal = () => {
        setShowModal(false);
        setSelectedCard(null);
    };


    return (
        <>
            <div className="pt-24 w-screen h-[100%] overflow-x-hidden min-h-screen bg-green-50 px-4 md:px-16 py-10">
                <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-8 text-center">
                    Discover Pickup Requests
                </h2>

                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {posts.map((data) => {
                        const isAccepted = acceptedIds.includes(data._id);
                        return (
                            <div key={data._id} className="h-[65vh] bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all">
                               <img src={`${data.imageUrl}`} alt="Garbage Location" className='w-[100%] h-[66%] object-cover'/>
                                <div className="p-5">
                                    <h3 className="text-xl font-semibold text-green-700">From: {data.postedBy?.name}</h3>
                                    <p className="text-gray-600">{data.location.lat.toFixed(3)}</p>
                                    {isOrg ? (
                                        <button
                                            disabled={isAccepted}
                                            className={`mt-3 w-full py-2 px-4 rounded-md font-medium transition
      ${isAccepted ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}
                                            onClick={() => openModal(data)}
                                        >
                                            {isAccepted ? 'Request Accepted' : 'Pick Up'}
                                        </button>
                                    ) : (
                                        <p className="mt-3 text-sm font-semibold text-blue-700">
                                            Status: <span className="capitalize">{isAccepted ? "accepted" : "pending"}</span>
                                        </p>
                                    )}

                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Modal */}
                {showModal && selectedCard && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                        <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-md p-6">
                            <h3 className="text-xl font-bold text-green-700 mb-4">Confirm Pickup</h3>
                            <p className="text-gray-700 mb-6">
                                Are you sure you want to pick this request from <strong>{selectedCard.postedBy?.name}</strong> at <strong>{selectedCard.location.lat.toFixed(3)}</strong>?
                            </p>
                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={cancelModal}
                                    className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmPickup}
                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                <ToastContainer />
            </div>
        </>
    );
}
