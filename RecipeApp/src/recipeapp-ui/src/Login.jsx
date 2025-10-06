import { useState } from "react";
import { useNavigate } from "react-router-dom";


const Login = ({ onLogin }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        try {
            const response = await fetch("https://localhost:7136/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
            if (!response.ok) throw new Error("Invalid credentials");
            const data = await response.json();
            setMessage("Login successful!");
            if (onLogin) onLogin(data.token);
            navigate("/home"); // Redirect to home page
        } catch (err) {
            setMessage("Login failed: " + err.message);
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