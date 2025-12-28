import { useState } from "react";
import "../assets/css/main.css";

interface LoginPageProps {
  onLogin: (name: string, mobile: string) => void;
}

function LoginPage({ onLogin }: LoginPageProps) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [errors, setErrors] = useState({ name: "", mobile: "" });

  const validateForm = () => {
    const newErrors = { name: "", mobile: "" };
    let isValid = true;

    // Validate name
    if (!name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
      isValid = false;
    }

    // Validate mobile
    if (!mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
      isValid = false;
    } else if (!/^[0-9]{10}$/.test(mobile.trim())) {
      newErrors.mobile = "Please enter a valid 10-digit mobile number";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onLogin(name.trim(), mobile.trim());
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-card">
          {/* Header */}
          <div className="auth-header">
            <div className="auth-icon">📚</div>
            <h1>Welcome to Library</h1>
            <p>Enter your details to get started</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            {/* Name Input */}
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  className={`form-input ${errors.name ? "error" : ""}`}
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: "" });
                  }}
                />
              </div>
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            {/* Mobile Input */}
            <div className="form-group">
              <label className="form-label">Mobile Number</label>
              <div className="input-wrapper">
                <span className="input-icon">📱</span>
                <input
                  type="tel"
                  className={`form-input ${errors.mobile ? "error" : ""}`}
                  placeholder="Enter 10-digit mobile number"
                  value={mobile}
                  maxLength={10}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    setMobile(value);
                    if (errors.mobile) setErrors({ ...errors, mobile: "" });
                  }}
                />
              </div>
              {errors.mobile && (
                <span className="error-text">{errors.mobile}</span>
              )}
            </div>

            {/* Submit Button */}
            <button type="submit" className="submit-btn">
              <span>🚀</span> Get OTP
            </button>
          </form>

          {/* Footer */}
          <div className="auth-footer">
            <p>By continuing, you agree to our Terms & Conditions</p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="decoration decoration-1"></div>
        <div className="decoration decoration-2"></div>
        <div className="decoration decoration-3"></div>
      </div>
    </div>
  );
}

export default LoginPage;
