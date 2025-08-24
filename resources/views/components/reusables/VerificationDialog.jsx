import React, { useState } from "react";

const VerificationDialog = ({ userId, onSuccess }) => {
    const [code, setCode] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [message, setMessage] = useState(null);

    const token = document
        .querySelector('meta[name="csrf-token"]')
        .getAttribute("content");

    const handleVerify = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        setMessage(null);

        try {
            const res = await fetch("/verify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": token,
                },
                body: JSON.stringify({ user_id: userId, code }),
            });

            const data = await res.json();

            if (res.ok) {
                onSuccess();
            } else {
                setError(data.message || "Verification failed");
            }
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setError(null);
        setMessage(null);
        setResending(true);

        try {
            const res = await fetch("/resend-code", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": token,
                },
                body: JSON.stringify({ user_id: userId }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage("A new code has been sent to your email.");
            } else {
                setError(data.message || "Failed to resend code");
            }
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className="bg-[#1a1a1a] p-8 rounded-2xl shadow-lg max-w-md w-full space-y-4">
                <h2 className="text-2xl font-bold text-yellow text-center">
                    Verify Your Email
                </h2>
                <p className="text-gray-400 text-sm text-center">
                    We sent a 6-digit code to your email. Enter it below to
                    continue.
                </p>
                <form onSubmit={handleVerify} className="space-y-4">
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Enter code"
                        className="w-full px-4 py-3 rounded-lg bg-[#2a2a2a] text-white focus:ring-2 focus:ring-yellow outline-none text-center tracking-widest text-xl"
                        required
                    />
                    {error && (
                        <p className="text-red-500 text-sm text-center">
                            {error}
                        </p>
                    )}
                    {message && (
                        <p className="text-green-500 text-sm text-center">
                            {message}
                        </p>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-yellow text-black font-semibold py-3 rounded-lg transition 
                        ${
                            loading
                                ? "opacity-70 cursor-not-allowed"
                                : "hover:bg-white"
                        }`}
                    >
                        {loading ? "Verifying..." : "Verify"}
                    </button>
                </form>

                <button
                    onClick={handleResend}
                    disabled={resending}
                    className="w-full text-sm text-gray-400 hover:text-yellow mt-2"
                >
                    {resending ? "Resending..." : "Resend Code"}
                </button>
            </div>
        </div>
    );
};

export default VerificationDialog;
