import React from "react";
import { useNavigate } from "react-router-dom";
import useOTPToken from "../hooks/useOTPToken";

const Login = () => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    const navigate = useNavigate();
    const { handleOTPToken } = useOTPToken(); // store token

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/join`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Login failed");
            }
            
            handleOTPToken(data.data.tempToken);
            navigate("/verify-otp");

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 sm:p-8">
                        <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Sign in to your account
                        </h1>

                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Your email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    placeholder="name@company.com"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            {/* ❌ Error message */}
                            {error && (
                                <p className="text-sm text-red-500 font-medium">
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center 
                  ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}
                `}
                            >
                                {loading ? "Signing in..." : "Sign in"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;
