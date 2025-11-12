import React, { useEffect, useState } from "react";
import api from "../services/api"; // existing axios instance with baseURL https://localhost:7136/api

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const { data } = await api.get("/auth/profile"); // baseURL applied automatically
        setUser(data);
      } catch (err) {
        setError(err?.response?.data?.message ?? err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      {user ? (
        <div className="profile-card">
          <p><strong>User ID:</strong> {user.userId}</p>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Full Name:</strong> {user.name}</p>
          <p><strong>Age:</strong> {user.age}</p>
          <p><strong>Gender:</strong> {user.gender}</p>
          <p><strong>Address:</strong> {user.address}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Created At:</strong> {new Date(user.createdAt).toLocaleString()}</p>
        </div>
      ) : (
        <p>No user data available</p>
      )}
    </div>
  );
};

export default Profile;