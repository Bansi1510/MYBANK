import { useState } from "react";
import { Login_API, OtpSendAPI, VerifyOtpAPI } from "../services/auth.service";
import { useDispatch } from "react-redux";
import { setAuth } from "../redux/slices/authSlice";
import { getProfileAPI } from "../services/user.service";

import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [step, setStep] = useState(1);
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [mobile, setMobile] = useState<string>("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!accountNumber || !password || !mobile) {
      setError("All fields are required");
      return;
    }

    const normalizedMobile: string = mobile.startsWith("+91")
      ? mobile
      : "+91" + mobile;

    setError("");

    const res = await Login_API(accountNumber, password);
    if (res) {
      const isTrue = await OtpSendAPI(accountNumber, normalizedMobile);
      if (isTrue) setStep(2);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp) {
      setError("OTP is required");
      return;
    }

    const normalizedMobile = mobile.startsWith("+91")
      ? mobile
      : "+91" + mobile;

    setError("");

    const verified = await VerifyOtpAPI(normalizedMobile, accountNumber, otp);

    if (!verified) {
      setError("OTP verification failed");
      return;
    }

    // 🔥 FETCH FULL USER + ACCOUNT DATA ONCE
    const profile = await getProfileAPI();
    console.log(profile);
    if (profile) {
      dispatch(setAuth(profile));
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-8 tracking-wide">
          MYBANK
        </h1>

        {step === 1 && (
          <form onSubmit={handleSendOTP} className="space-y-6">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">Login</h2>

            {error && <p className="text-red-600 text-sm text-center">{error}</p>}

            <div>
              <label className="block text-sm font-medium mb-1">Account Number</label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Enter account number"
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Mobile Number</label>
              <input
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Enter registered mobile"
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <button className="w-full py-3 bg-blue-700 text-white font-semibold rounded-xl hover:bg-blue-800 transition active:scale-95">
              Send OTP
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerify} className="space-y-6">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">Verify OTP</h2>

            {error && <p className="text-red-600 text-sm text-center">{error}</p>}

            <div>
              <label className="block text-sm font-medium mb-1">Mobile Number</label>
              <input
                type="text"
                value={mobile}
                readOnly
                className="w-full px-4 py-3 border rounded-xl bg-gray-100 text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <button className="w-full py-3 bg-blue-700 text-white font-semibold rounded-xl hover:bg-blue-800 transition active:scale-95">
              Verify OTP
            </button>

            <p
              className="text-sm text-blue-600 cursor-pointer text-center mt-2 hover:underline"
              onClick={() => {
                setOtp("");
                setError("");
                setStep(1);
              }}
            >
              Back to Login
            </p>
          </form>
        )}

        <p className="text-center text-sm text-gray-500 mt-6">
          Secure Banking • MYBANK © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};

export default Login;
