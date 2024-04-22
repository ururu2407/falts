import React, { useState } from 'react'
import axios from 'axios';

export const Registration = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("https://04cb5470549a62ec.mokky.dev/register", {
                fullName: fullName,
                email: email,
                password: password
            });
            console.log("Registration successful!", response.data);
            // Дополнительные действия после успешной регистрации
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setErrorMessage("User already registered. Please log in.");
            } else {
                setErrorMessage("Registration failed. Please try again later.");
            }
            console.error("Registration failed:", error);
            // Обработка ошибки регистрации
        }
    };

    return (
        <div className='main'>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
                <label>
                    Full Name:
                    <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />
                </label>
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
                <button type="submit">Register</button>
            </form>
            {errorMessage && <p>{errorMessage}</p>}
        </div>
    )
}
