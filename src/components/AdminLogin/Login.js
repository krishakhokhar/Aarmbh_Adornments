import React, { useState, useEffect } from "react";
import "./Login.css";
import logo from "../../images/logo.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import v1 from "../../vedio/v1.mp4";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../../Server";
import Loader from "../../Pages/Loader/Loader";


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
    const [loading, setLoading] = useState(false)

    const togglePassword = () => setShowPassword(!showPassword);

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    // Inside your component:
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error("Please fill all fields!", {
                position: "top-center",
                autoClose: 2500,
            });
            return;
        }

        if (!validateEmail(email)) {
            toast.error("Invalid email format!", {
                position: "top-center",
                autoClose: 2500,
            });
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(API.AdminLogin, {
                email,
                password
            });

            // ✅ Access response data correctly
            const data = response.data;

            if (response.status === 200) {
                // ✅ Store data in localStorage
                localStorage.setItem("adminId", data.data._id);
                localStorage.setItem("email", data.data.email);
                localStorage.setItem("token", data.Token);

                // 🎉 Show success SweetAlert
                Swal.fire({
                    title: "Login Successful 🎉",
                    text: "Welcome back, Admin!",
                    icon: "success",
                    background: "#f0f0f0",
                    color: "#333",
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                }).then(() => {
                    // ✅ Redirect to main layout
                    navigate("/mainlayout");
                });
            } else {
                toast.error(data.message || "Login failed!", {
                    position: "top-center",
                    autoClose: 2500,
                });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Server error. Please try again later.", {
                position: "top-center",
                autoClose: 2500,
            });
            console.error("Login error:", error);
        } finally {
            setLoading(false)
        }
    };

    const handleForgotPassword = () => setShowForgot(true);

    const handleSendOtp = async (e) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            Swal.fire({
                icon: "error",
                title: "Invalid Email",
                text: "Please enter a valid registered email!",
                background: "#fff3f3",
                confirmButtonColor: "#d33",
            });
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(API.AdminSendCode, {
                email,
            });

            if (response.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "OTP Sent ✔",
                    text: "OTP has been sent to your email.",
                    background: "#f0f0f0",
                    confirmButtonColor: "#3085d6",
                });

                setOtpSent(true);
                setShowOtpModal(true);
                setTimer(60);
                setResendVisible(false);
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Failed",
                    text: response.data.message || "Failed to send OTP.",
                    background: "#fff3f3",
                    confirmButtonColor: "#d33",
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Server Error",
                text: error.response?.data?.message || "Something went wrong. Please try again later.",
                background: "#fff3f3",
                confirmButtonColor: "#d33",
            });
            console.error("Send OTP error:", error);
        } finally {
            setLoading(false);
        }
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

    const handleVerifyOtp = async () => {
        // Validate OTP length (6 digits)
        if (otp.length !== 6) {
            Swal.fire({
                icon: "error",
                title: "Invalid OTP",
                text: "Please enter a valid 6-digit OTP!",
                background: "#fff3f3",
                confirmButtonColor: "#d33",
            });
            return;
        }

        try {
            setLoading(true);
            // Call the verify OTP API
            const response = await axios.post(API.VerifyCode, {
                email,
                resetCode: otp,
            });

            if (response.status === 200) {
                // OTP verification is successful, now show the new password input box
                Swal.fire({
                    title: "Enter New Password",
                    input: "password",  // Show password input
                    inputPlaceholder: "Enter your new password",
                    showCancelButton: true,
                    confirmButtonText: "Reset Password",
                    inputValidator: (value) => {
                        if (!value || value.length < 6) {
                            return "Password must be at least 6 characters!";
                        }
                    },
                }).then(async (result) => {
                    if (result.isConfirmed && result.value) {
                        const newPassword = result.value;

                        // Proceed with password reset API call
                        const resetResponse = await axios.post(API.ResetPassword, {
                            email,
                            newPassword: newPassword, // New password
                        });

                        if (resetResponse.status === 200) {
                            Swal.fire({
                                icon: "success",
                                title: "Password Reset Successfully ✔",
                                text: "Your password has been reset. You can now log in with your new password.",
                                background: "#f0f0f0",
                                confirmButtonColor: "#3085d6",
                            }).then(() => {
                                // Optionally, close the OTP modal
                                setShowOtpModal(false);
                            });
                        } else {
                            Swal.fire({
                                icon: "error",
                                title: "Password Reset Failed",
                                text: resetResponse.data.message || "Password reset failed.",
                                background: "#fff3f3",
                                confirmButtonColor: "#d33",
                            });
                        }
                    }
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "OTP Verification Failed",
                    text: response.data.message || "Invalid OTP or verification failed.",
                    background: "#fff3f3",
                    confirmButtonColor: "#d33",
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.response?.data?.message || "An error occurred. Please try again later.",
                background: "#fff3f3",
                confirmButtonColor: "#d33",
            });
            console.error("OTP Verification error:", error);
        } finally {
            setLoading(false);
        }
    };


    return (

        <>
            {
                loading && (
                    <Loader />
                )
            }
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
        </>
    );
};

export default Login;
