import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import AlertDialog from "../components/reusables/AlertDialog";
import SmoothFollower from "../components/Cursor";

const ForgotPasswordPage = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [alert, setAlert] = useState(null); // control AlertDialog

    // Step 1: Send reset email
    const handleSendReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const response = await fetch("/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            if (!response.ok)
                throw new Error(data.message || "Error sending reset");

            setAlert({
                type: "success",
                message: "Reset code sent to your email.",
            });
            setStep(2);
        } catch (err) {
            setAlert({ type: "error", message: err.message });
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Confirm reset code
    const handleConfirmCode = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const response = await fetch("/forgot-password/verify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },
                body: JSON.stringify({ email, code }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Invalid code");

            if (data.redirect) {
                window.location.href = data.redirect;
            } else {
                setAlert({
                    type: "success",
                    message: "Code verified! Redirecting...",
                });
            }
        } catch (err) {
            setAlert({ type: "error", message: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0e0e0e]">
            <SmoothFollower />
            <div className="bg-[#1a1a1a] p-10 rounded-2xl shadow-2xl w-full max-w-md text-white">
                <div className="text-center mb-6">
                    <h1 className="text-4xl font-modern-negra text-yellow">
                        {step === 1 ? "Forgot Password" : "Confirm Code"}
                    </h1>
                    <p className="text-gray-400 text-sm">
                        {step === 1
                            ? "Enter your email to reset your password"
                            : "Enter the code sent to your email"}
                    </p>
                </div>

                {/* 🚨 Animated Alert */}
                {alert && (
                    <AlertDialog
                        type={alert.type}
                        message={alert.message}
                        onClose={() => setAlert(null)}
                    />
                )}

                {step === 1 ? (
                    <form className="space-y-5" onSubmit={handleSendReset}>
                        <div>
                            <label
                                htmlFor="reset-email"
                                className="block text-sm text-gray-300 mb-1"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                id="reset-email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full px-4 py-3 rounded-lg bg-[#2a2a2a] text-white focus:outline-none focus:ring-2 focus:ring-yellow"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-yellow text-black font-semibold py-3 rounded-lg hover:bg-white transition duration-300 shadow-lg"
                        >
                            {loading ? "Sending..." : "Send Reset Link"}
                        </button>
                    </form>
                ) : (
                    <form className="space-y-5" onSubmit={handleConfirmCode}>
                        <div>
                            <label
                                htmlFor="reset-code"
                                className="block text-sm text-gray-300 mb-1"
                            >
                                Code
                            </label>
                            <input
                                type="text"
                                id="reset-code"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="Enter 6-digit code"
                                className="w-full px-4 py-3 rounded-lg bg-[#2a2a2a] text-white focus:outline-none focus:ring-2 focus:ring-yellow"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-yellow text-black font-semibold py-3 rounded-lg hover:bg-white transition duration-300 shadow-lg"
                        >
                            {loading ? "Verifying..." : "Verify Code"}
                        </button>
                    </form>
                )}

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

// 🔑 Mount
const container = document.getElementById("forgotpass");
if (container) {
    createRoot(container).render(<ForgotPasswordPage />);
}
