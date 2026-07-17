const Profile = () => {
  const user = JSON.parse(localStorage.getItem("userInfo"));

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Profile</h2>

      <div className="bg-white p-4 rounded shadow w-[300px]">
        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
      </div>
    </div>
  );
};

export default Profile;