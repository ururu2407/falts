import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RemoveIcon, EyeIcon, EyeOffIcon } from '../../icons';
import './Login-Register.scss';

export const BackdropRegistertion = ({ open, onClick, account, onClose }) => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const body = document.querySelector('body');
        if (open) {
            body.classList.add('modal-open-2');
        } else {
            body.classList.remove('modal-open-2');
        }
    }, [open]);

    const togglePasswordVisibility = () => {
        setShowPassword(prevState => !prevState);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("https://04cb5470549a62ec.mokky.dev/register", {
                fullName: fullName,
                email: email,
                password: password
            });
            console.log("Registration successful!", response.data);
            loginUser(email, password);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setErrorMessage("User already registered. Please log in.");
            } else {
                setErrorMessage("Registration failed. Please try again later.");
            }
            console.error("Registration failed:", error);
        }
    };

    const loginUser = async (email, password) => {
        try {
            const response = await axios.post("https://04cb5470549a62ec.mokky.dev/auth", {
                email: email,
                password: password
            });
            const userData = response.data;
            localStorage.setItem("user", JSON.stringify(userData.data));
            console.log("Authentication successful!", userData);
            // Перезагрузка страницы после успешной аутентификации
            window.location.reload();
        } catch (error) {
            setErrorMessage("Invalid email or password. Please try again.");
            console.error("Authentication failed:", error);
        }
    };

    return (
        <div className={`backdrop ${open ? 'open' : ''}`} onClick={onClick}>
            <form onSubmit={handleSubmit} className='backdrop-content' onClick={(e) => e.stopPropagation()}>
                <div className="backdrop-header">
                    <div className="backdrop-icon" onClick={onClose}>
                        <RemoveIcon />
                    </div>
                </div>
                <div className="backdrop-container">
                    <h3>Вітаємо в Фальц</h3>
                    <div className="fields">
                        <div className="field user">
                            <p>Ім’я</p>
                            <div className="input">
                                <input type="text"
                                    placeholder='MyNickname'
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)} />
                            </div>
                        </div>
                        <div className="field email">
                            <p>Електронна пошта</p>
                            <div className="input">
                                <input type="text"
                                    placeholder='email@gmail.com'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)} />
                            </div>
                        </div>
                        <div className="field password">
                            <p>Пароль</p>
                            <div className="input">
                                <input type={showPassword ? 'text' : 'password'}
                                    placeholder='password1234'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)} />
                                <div className="eye" onClick={togglePasswordVisibility}>
                                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                </div>
                            </div>
                        </div>
                    </div>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    <div className="backdrop-submit">
                        <button type='submit'>Продовжити</button>
                        <p>Маєте акаунт? <span onClick={account}>Увійти</span></p>
                    </div>
                </div>
            </form>
        </div>
    );
};
