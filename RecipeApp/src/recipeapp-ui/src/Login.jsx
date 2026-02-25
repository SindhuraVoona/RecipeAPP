import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
        const response = await api.post("/auth/login", {
            username,
            password,
        });
        const data = response.data;


        // ensure token exists
        if (!data?.token) {
            throw new Error("Login succeeded but no token returned");
        }

        // persist token and notify app
        localStorage.setItem("token", data.token);
        window.dispatchEvent(new Event("authChanged"));

        setMessage("Login successful!");
        if (onLogin) onLogin(data.token);
        navigate("/"); // Redirect to home page
    } catch (err) {
        setMessage("Login failed: " + (err?.message ?? err));
    }
};
    return (
        <div className="max-w-sm mx-auto p-6 bg-white rounded-2xl shadow-md">
            <h2 className="text-xl font-bold mb-4">Login</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium mb-1">Username</label>
                    <input
                        className="input-small border rounded-lg p-2"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1">Password</label>
                    <input
                        type="password"
                        className="input-small border rounded-lg p-2"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700"
                >
                    Login
                </button>
            </form>
            {message && (
                <div className="mt-4 text-center font-semibold text-red-600">{message}</div>
            )}
        </div>
    );
};

export default Login;