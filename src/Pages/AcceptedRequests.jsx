import React, { useEffect, useState } from 'react';
import api from '../api/api';

export default function AcceptedPosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.role === "org") {
      api.get(`/posts/org/pickups/${user._id}`)
        .then(res => setPosts(res.data))
        .catch(err => console.error("Failed to load posts", err));
    }
  }, []);

  return (
    <div className="pt-24 px-4 md:px-16 min-h-screen bg-green-50">
      <h2 className="text-3xl font-bold text-green-800 mb-6">Your Accepted Requests</h2>
      {posts.length === 0 ? (
        <p className="text-gray-600">No requests yet.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map(post => (
            <div key={post._id} className="bg-white rounded-lg shadow p-4">
              <img src={post.imageUrl} alt="Spot" className="w-full h-48 object-cover rounded" />
              <p className="mt-2 text-green-700">Lat: {post.location.lat.toFixed(3)}, Lng: {post.location.lng.toFixed(3)}</p>
              <p className="text-sm text-gray-500">Created by: {post.postedBy?.name}</p>
            </div>
          ))}
        </div> 
      )}
    </div>
  );
}
