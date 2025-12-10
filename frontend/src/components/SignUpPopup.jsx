import React from 'react'
import { useState } from 'react'

const SignUpPage = ({ setShowSignUp, setShowLogin }) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [birthdate, setBirthDate] = useState("");
    const [gamertag, setGamerTag] = useState("");

    const handleSignUp = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:5001/api/users/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, email, password, birthdate, gamertag }),
            });

            if (res.ok) {
                console.log("Sign Up successful!");
                setShowSignUp(false);
                setShowLogin(true);
            }
            else console.log("Sign Up failed.");
        }
        catch (e) {
            console.log("Sign Up error:", e);
        }
    }
    return (
        <div className="signup-container">
            <span className="signup-icon-close" id="icon-close" onClick={() => setShowSignUp(false)}>
                <i class="fi fi-rr-cross"></i>
            </span>
            <div className="signup">
                <h1>SIGN UP</h1>
                <div className="username">
                    <i class="fi fi-rr-user"></i>
                    <input type="text" name="username" placeholder='Username' onChange={(e) => {setUsername(e.target.value)}}></input>
                </div>

                <div className="email">
                    <i class="fi fi-rr-envelope"></i>
                    <input type="text" name="email" placeholder='Email' onChange={(e) => {setEmail(e.target.value)}}></input>
                </div>

                <div className="password">
                    <i class="fi fi-rr-lock"></i>
                    <input type="password" name="password" placeholder='Password' onChange={(e) => {setPassword(e.target.value)}}></input>
                </div>

                <div className="birthdate">
                    <i class="fi fi-rr-cake-birthday"></i>
                    <input type="date" name="birthdate" onChange={(e) => {console.log(e.target.value); setBirthDate(e.target.value)}}></input>
                </div>

                <div className="gamer-tag">
                    <i class="fi fi-rr-gamepad"></i>
                    <input type="text" name="gamer-tag" placeholder='Gamer Tag' onChange={(e) => {setGamerTag(e.target.value)}}></input>
                </div>
                <button className="signup-button" onClick={handleSignUp}>SIGN UP</button>
            </div>
        </div>
    )
}

export default SignUpPage;