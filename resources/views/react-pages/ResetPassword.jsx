import AlertDialog from "../components/reusables/AlertDialog";
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import SmoothFollower from "../components/Cursor";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [alert, setAlert] = useState(null);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const searchParams = new URLSearchParams(window.location.search);
    const email = searchParams.get("email");
    const token = searchParams.get("token"); // 🔑 new

    const handleReset = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setAlert({ type: "error", message: "Passwords do not match" });
            return;
        }

        try {
            const response = await fetch("/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },
                body: JSON.stringify({
                    email,
                    token, // 🔑 send token
                    password,
                    password_confirmation: confirmPassword,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setAlert({
                    type: "success",
                    message: "Password successfully reset!",
                });
                setTimeout(() => {
                    window.location.href = "/login";
                }, 1500);
            } else {
                setAlert({
                    type: "error",
                    message: data.message || "Failed to reset password.",
                });
            }
        } catch (error) {
            setAlert({
                type: "error",
                message: "An error occurred. Please try again later.",
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0e0e0e]">
            <SmoothFollower />
            <div className="bg-[#1a1a1a] p-10 rounded-2xl shadow-2xl w-full max-w-md text-white">
                <h2 className="text-3xl font-modern-negra text-yellow text-center mb-6">
                    Reset Your Password
                </h2>

                {/* 🚨 Animated Alert */}
                {alert && (
                    <AlertDialog
                        type={alert.type}
                        message={alert.message}
                        onClose={() => setAlert(null)}
                    />
                )}

                <form onSubmit={handleReset} className="space-y-5">
                    <div>
                        <label className="block text-sm text-gray-300 mb-1">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="w-full px-4 py-3 pr-12 rounded-lg bg-[#2a2a2a] text-white focus:outline-none focus:ring-2 focus:ring-yellow"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow hover:text-white transition duration-300"
                            >
                                {showPassword ? (
                                    <FaEyeSlash className="text-xl" />
                                ) : (
                                    <FaEye className="text-xl" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-300 mb-1">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                className="w-full px-4 py-3 pr-12 rounded-lg bg-[#2a2a2a] text-white focus:outline-none focus:ring-2 focus:ring-yellow"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                required
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow hover:text-white transition duration-300"
                            >
                                {showConfirmPassword ? (
                                    <FaEyeSlash className="text-xl" />
                                ) : (
                                    <FaEye className="text-xl" />
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-yellow text-black font-semibold py-3 rounded-lg hover:bg-white transition duration-300 shadow-lg"
                    >
                        Reset Password
                    </button>
                </form>

                <div className="text-center text-sm text-gray-500 pt-4">
                    Back to{" "}
                    <a href="/login" className="text-yellow hover:underline">
                        Login
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;

// 🔑 Mount
if (document.getElementById("resetpass")) {
    createRoot(document.getElementById("resetpass")).render(<ResetPassword />);
}
