const Profile = () => {
  // Placeholder user data
  const user = {
    name: "Sindhura Voona",
    email: "example@text.com",
    joined: "2025-01-15",
  };

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      <div className="profile-card">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Joined:</strong> {user.joined}</p>
      </div>
    </div>
  );
};

export default Profile;
