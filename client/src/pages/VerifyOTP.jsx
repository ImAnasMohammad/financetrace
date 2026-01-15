import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useOTPToken from "../hooks/useOTPToken";
import useAccessToken from "../hooks/AccessToken";

const VerifyOTP = () => {
    const navigate = useNavigate();
    const { getOTPToken } = useOTPToken();
    const OTPToken = getOTPToken();

    useEffect(() => {
        if (!OTPToken) {
            navigate("/");
        }
    }, [OTPToken, navigate]);

    const [otp, setOtp] = React.useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState("");
    const {handleAccessToken} = useAccessToken();
    const {removeOTPToken} = useOTPToken()

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    const handleChange = (value, index) => {
        if (!/^\d?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`)?.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`)?.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!OTPToken) {
            setError("Session expired. Please register again.");
            return;
        }

        const finalOtp = otp.join("");
        if (finalOtp.length !== 6) {
            setError("Please enter the 6-digit OTP");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch(
                `${API_BASE_URL}/auth/verify-otp`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${OTPToken}`
                    },
                    body: JSON.stringify({ otp: finalOtp })
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "OTP verification failed");
            }

            

            // ✅ store access token (memory only)
            handleAccessToken(data.data.accessToken);
            removeOTPToken();

            navigate("/dashboard");

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-center text-gray-800">
                    Verify OTP
                </h2>

                <p className="text-sm text-gray-500 text-center mt-2">
                    Enter the 6-digit code sent to your email
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    {/* OTP INPUTS */}
                    <div className="flex justify-center gap-4">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                id={`otp-${index}`}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) =>
                                    handleChange(e.target.value, index)
                                }
                                onKeyDown={(e) =>
                                    handleKeyDown(e, index)
                                }
                                className="w-14 h-14 text-center text-2xl font-semibold 
                  rounded-lg border border-gray-300 
                  focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        ))}
                    </div>

                    {/* ERROR MESSAGE */}
                    {error && (
                        <p className="text-center text-sm text-red-500 font-medium">
                            {error}
                        </p>
                    )}

                    {/* SUBMIT BUTTON */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-lg text-white font-semibold 
              transition
              ${loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                            }`}
                    >
                        {loading ? "Verifying OTP..." : "Verify OTP"}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default VerifyOTP;
