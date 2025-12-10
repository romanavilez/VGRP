import React from 'react'
import { useState } from 'react'

const LoginPage = ({ setShowLogin, setShowSignUp}) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        
        try {
            const res = await fetch("http://localhost:5001/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });
            
            if (res.ok) {
                console.log("Logged in successfull!y");
                setShowLogin(false);
                document.querySelector(".welcome-text").textContent = `Welcome, ${username}!`;
            }
            else console.log("Login failed.");
        } catch (e) {
            console.log("Login error:", e);
        }
    }

    return (
        <div className="login-container">
            <span className="login-icon-close" id="icon-close" onClick={() => setShowLogin(false)}>
                <i class="fi fi-rr-cross"></i>
            </span>
            <div className="login">
                <h1>LOGIN</h1>
                <div className="username">
                    <i class="fi fi-rr-user"></i>
                    <input type="text" name="username" placeholder='Username' onChange={(e) => setUsername(e.target.value)}></input>
                </div>

                <div className="password">
                    <i class="fi fi-rr-lock"></i>
                    <input type="password" name="password" placeholder='Password' onChange={(e) => setPassword(e.target.value)}></input>
                </div>
                <button className="login-button" onClick={handleLogin}>LOGIN</button>
            </div>
            <div className="login-form-signup">
                <p>Don't have an account?</p>
                <button className="login-signup-button" onClick={() => {setShowLogin(false), setShowSignUp(true)}}>SIGN UP</button>
            </div>

        </div>
    )
}

export default LoginPage;