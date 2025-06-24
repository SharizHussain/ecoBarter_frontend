import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import api from '../api/api';
import Loader from '../Components/Loader';

export default function MapView() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/posts/${id}`)
      .then(res => setPost(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading || !post) return <Loader />;

  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_API_KEY&q=${post.location.lat},${post.location.lng}`;

  return (
    <div className="pt-20 px-6 md:px-20 min-h-screen bg-green-50">
      <h2 className="text-2xl font-bold text-green-800 mb-6">Request Details</h2>

      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        <p><strong>Posted by:</strong> {post.postedBy?.name}</p>
        <p><strong>Posted at:</strong> {new Date(post.createdAt).toLocaleString()}</p>
        <p><strong>Accepted by:</strong> {post.pickedBy?.name || 'Not accepted yet'}</p>
        {post.pickedAt && <p><strong>Accepted at:</strong> {new Date(post.pickedAt).toLocaleString()}</p>}
        <p><strong>Address:</strong> {post.address}</p>

        {/* Google Map Embed */}
        <div className="mt-4">
          <iframe
            title="Google Map"
            width="100%"
            height="350"
            className="rounded-lg shadow"
            loading="lazy"
            allowFullScreen
            src={mapUrl}
          ></iframe>
        </div>
      </div>
    </div>
  );
}
