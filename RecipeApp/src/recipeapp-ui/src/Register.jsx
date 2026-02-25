 import { useState } from "react";
 import { useNavigate } from "react-router-dom";
 import api from "../services/api";

const Register = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [address, setAddress] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!name.trim() || !username.trim() || !password) {
      setMessage("Name, username and password are required.");
      return;
    }

    const payload = {
      name: name.trim(),
      age: age ? parseInt(age, 10) : null,
      gender,
      address: address.trim(),
      username: username.trim(),
      password,
    };

    try {
      setLoading(true);
      const response = await api.post("/auth/register", payload);
      
      setMessage("Registration successful. Redirecting to login...");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      const errMsg = err?.response?.data?.message || err?.message || "Network error";
      setMessage(`Registration failed: ${errMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Register</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Full name</label>
          <input className="w-full border rounded p-2" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium">Age</label>
            <input type="number" min="0" className="w-full border rounded p-2" value={age} onChange={(e) => setAge(e.target.value)} />
          </div>

          <div className="w-40">
            <label className="block text-sm font-medium">Gender</label>
            <select className="w-full border rounded p-2" value={gender} onChange={(e) => setGender(e.target.value)}>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Address</label>
          <textarea className="w-full border rounded p-2" value={address} onChange={(e) => setAddress(e.target.value)} rows={3} />
        </div>

        <div>
          <label className="block text-sm font-medium">Username</label>
          <input className="w-full border rounded p-2" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>

        <div>
          <label className="block text-sm font-medium">Password</label>
          <input type="password" className="w-full border rounded p-2" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        <div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded">
            {loading ? "Registering…" : "Register"}
          </button>
        </div>

        {message && <div className="text-sm mt-2 text-red-600">{message}</div>}
      </form>
    </div>
  );
};

export default Register;