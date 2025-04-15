import React, { useState, useEffect } from "react";
import "./Login.css";
import logo from "../../images/logo.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import v1 from "../../vedio/v1.mp4";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showForgot, setShowForgot] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otp, setOtp] = useState("");
    const [timer, setTimer] = useState(60);
    const [resendVisible, setResendVisible] = useState(false);

    const togglePassword = () => setShowPassword(!showPassword);

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error("Please fill all fields!", {
                position: "top-center",
                autoClose: 2500,
            });
        } else if (!validateEmail(email)) {
            toast.error("Invalid email format!", {
                position: "top-center",
                autoClose: 2500,
            });
        } else {
            toast.success("Login successful!", {
                position: "top-center",
                autoClose: 2500,
            });
        }
    };

    const handleForgotPassword = () => setShowForgot(true);

    const handleSendOtp = (e) => {
        e.preventDefault();
        if (!validateEmail(email)) {
            toast.error("Please enter a valid registered email!", {
                position: "top-center",
                autoClose: 2500,
            });
            return;
        }

        setOtpSent(true);
        setShowOtpModal(true);
        setTimer(60);
        setResendVisible(false);
    };

    const handleResendOtp = () => {
        setOtp("");
        setTimer(60);
        setResendVisible(false);
        toast.success("OTP resent to your email ✔", {
            position: "top-center",
            autoClose: 2000,
        });
    };

    useEffect(() => {
        if (otpSent && timer > 0) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else if (timer === 0) {
            setResendVisible(true);
        }
    }, [timer, otpSent]);

    const handleVerifyOtp = () => {
        if (otp.length === 6) {
            toast.success("OTP verified successfully! 🎉", {
                position: "top-center",
                autoClose: 3000,
            });
            setShowOtpModal(false);
        } else {
            toast.error("Please enter a valid 6-digit OTP!", {
                position: "top-center",
                autoClose: 3000,
            });
        }
    };

    return (
        <div className="admin-login">
            <div className="video-wrapper">
                <video autoPlay loop muted playsInline>
                    <source src={v1} type="video/mp4" />
                </video>
            </div>

            <div className="admin-login-container">
                <img src={logo} alt="Logo" className="admin-logo" />

                <div className="welcome-text">
                    <h1>Welcome to Aarambh Adornments</h1>
                    <div className="welcome-underline"></div>
                </div>

                <form className="admin-login-form fade-in" onSubmit={handleLogin}>
                    <h2>Login</h2>
                    <p>Login in and manage your candidates!</p>

                    <input
                        type="email"
                        placeholder="Admin Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <div className="password-wrapper input-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <span className="eye-icon" onClick={togglePassword}>
                            {showPassword ? <FaEye /> : <FaEyeSlash />}
                        </span>
                    </div>

                    <p className="forgot-link" onClick={handleForgotPassword}>
                        Forgot password?
                    </p>
                    <button type="submit">Login</button>

                    {showForgot && !otpSent && (
                        <div className="otp-section">
                            <input
                                type="email"
                                value={email}
                                placeholder="Enter your registered email"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <button className="send-otp-btn" onClick={handleSendOtp}>
                                Send OTP
                            </button>
                        </div>
                    )}
                </form>
            </div>

            {showOtpModal && (
                <div className="otp-modal">
                    <div className="otp-modal-content">
                        <h3>Enter OTP</h3>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength={6}
                            placeholder="Enter 6-digit OTP"
                        />
                        <p className="timer-text">
                            {resendVisible ? (
                                <span className="resend-link" onClick={handleResendOtp}>
                                    Resend OTP
                                </span>
                            ) : (
                                `OTP valid for ${timer}s`
                            )}
                        </p>
                        <button onClick={handleVerifyOtp}>Verify OTP</button>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
};

export default Login;
