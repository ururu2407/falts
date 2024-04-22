import React, { useState, useEffect } from 'react'
import axios from 'axios';

export const Login = () => {
    const [email, setEmail] = useState("123@gmail.com");
    const [password, setPassword] = useState("12345");
    const [user, setUser] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("https://04cb5470549a62ec.mokky.dev/auth", {
                email: email,
                password: password
            });
            const userData = response.data;
            setUser(userData.data);
            localStorage.setItem("user", JSON.stringify(userData.data));
            console.log("Authentication successful!", userData);
        } catch (error) {
            setErrorMessage("Invalid email or password. Please try again.");
            console.error("Authentication failed:", error);
        }
    };

    const logout = () => {
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <div className='main'>
            {user ? (
                <div>
                    <h2>Welcome, {user.fullName}!</h2>
                    <p>Email: {user.email}</p>
                    <button onClick={logout}>Logout</button>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <label>
                        Email:
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </label>
                    <label>
                        Password:
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </label>
                    <button type="submit">Login</button>
                </form>
            )}
            {errorMessage && <p>{errorMessage}</p>}
        </div>
    )
}
