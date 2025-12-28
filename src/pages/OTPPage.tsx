import { useState, useRef, useEffect } from "react";
import "../assets/css/main.css";

interface OTPPageProps {
  mobile: string;
  onVerify: () => void;
  onBack: () => void;
}

function OTPPage({ mobile, onVerify, onBack }: OTPPageProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^[0-9]*$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);
    inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      setError("Please enter complete 6-digit OTP");
      return;
    }

    // Simulate OTP verification (accept any 6-digit OTP for demo)
    onVerify();
  };

  const handleResend = () => {
    setTimer(30);
    setOtp(["", "", "", "", "", ""]);
    setError("");
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-card">
          {/* Header */}
          <div className="auth-header">
            <div className="auth-icon">🔐</div>
            <h1>Enter OTP</h1>
            <p>
              We've sent a 6-digit code to
              <br />
              <strong>+91 {mobile}</strong>
            </p>
          </div>

          {/* OTP Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="otp-container">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  className={`otp-input ${error ? "error" : ""}`}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  autoFocus={index === 0}
                />
              ))}
            </div>

            {error && <span className="error-text center">{error}</span>}

            {/* Timer and Resend */}
            <div className="otp-footer">
              {timer > 0 ? (
                <p className="timer-text">
                  Resend OTP in <strong>{timer}s</strong>
                </p>
              ) : (
                <button
                  type="button"
                  className="resend-btn"
                  onClick={handleResend}
                >
                  Resend OTP
                </button>
              )}
            </div>

            {/* Submit Button */}
            <button type="submit" className="submit-btn">
              <span>✓</span> Verify & Continue
            </button>

            {/* Back Button */}
            <button type="button" className="back-btn" onClick={onBack}>
              ← Change Mobile Number
            </button>
          </form>
        </div>

        {/* Decorative Elements */}
        <div className="decoration decoration-1"></div>
        <div className="decoration decoration-2"></div>
        <div className="decoration decoration-3"></div>
      </div>
    </div>
  );
}

export default OTPPage;
