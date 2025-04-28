import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../contexts/AuthContext";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    role: "customer",
    username: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    email: "",
    phoneNumber: "",
    address: "",
    dateOfBirth: "",
    gender: "male",
    kebeleId: "",
    hospitalName: "",
    licenseNumber: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (formData.username.length < 4)
      newErrors.username = "Username must be at least 4 characters";

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";

    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (!formData.email) newErrors.email = "Email is required";
    if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Email is invalid";

    if (formData.role === "customer") {
      if (!formData.dateOfBirth)
        newErrors.dateOfBirth = "Date of birth is required";
      if (!formData.phoneNumber)
        newErrors.phoneNumber = "Phone number is required";
      if (!formData.address) newErrors.address = "Address is required";
      if (!formData.kebeleId && !user)
        newErrors.kebeleId = "Kebele ID is required";
    }

    if (formData.role === "hospital") {
      if (!formData.hospitalName)
        newErrors.hospitalName = "Hospital name is required";
      if (!formData.licenseNumber)
        newErrors.licenseNumber = "License number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      let endpoint = "/auth/register";
      let payload = {
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
        password: formData.password,
        email: formData.email,
        role: formData.role,
      };

      if (formData.role === "customer") {
        endpoint = "/customer/register";
        payload = {
          ...payload,
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
          kebeleId: formData.kebeleId,
        };
      } else if (formData.role === "hospital") {
        endpoint = "/hospital/register";
        payload = {
          ...payload,
          hospitalName: formData.hospitalName,
          licenseNumber: formData.licenseNumber,
        };
      } else if (formData.role === "kebele") {
        endpoint = "/kebele/register";
      }

      if (user && user.role === "kebele" && formData.role === "customer") {
        payload.kebeleManagerId = user.id;
      }

      await api.post(endpoint, payload);
      setSuccess(true);

      if (user && user.role === "kebele") {
        setTimeout(() => navigate("/kebele"), 2000);
      }
    } catch (error) {
      setErrors({
        general:
          error.response?.data?.message ||
          "Registration failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="register-container">
        <div className="register-success">
          <h2>Registration Successful!</h2>
          <p>
            {user && user.role === "kebele"
              ? "Customer has been registered successfully."
              : "Your account has been created. Please wait for approval."}
          </p>
          {!user && (
            <button onClick={() => navigate("/login")}>Go to Login</button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="register-container">
      <div className="register-form">
        <h2>
          {user?.role === "kebele" ? "Register New Customer" : "Create Account"}
        </h2>

        {errors.general && (
          <div className="error-message">{errors.general}</div>
        )}

        <form onSubmit={handleSubmit}>
          {!user && (
            <div className="form-group">
              <label>Account Type</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                disabled={!!user}
              >
                <option value="customer">Customer</option>
                <option value="hospital">Hospital Officer</option>
                <option value="kebele">Kebele Manager</option>
              </select>
            </div>
          )}

          {/* Username */}
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.username && (
              <span className="error">{errors.username}</span>
            )}
          </div>

          {/* First Name */}
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.firstName && (
              <span className="error">{errors.firstName}</span>
            )}
          </div>

          {/* Last Name */}
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.lastName && (
              <span className="error">{errors.lastName}</span>
            )}
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.password && (
              <span className="error">{errors.password}</span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.confirmPassword && (
              <span className="error">{errors.confirmPassword}</span>
            )}
          </div>

          {/* Email */}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          {/* Customer-specific fields */}
          {(formData.role === "customer" ||
            (user && user.role === "kebele")) && (
            <>
              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.dateOfBirth && (
                  <span className="error">{errors.dateOfBirth}</span>
                )}
              </div>

              <div className="form-group">
                <label>Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.phoneNumber && (
                  <span className="error">{errors.phoneNumber}</span>
                )}
              </div>

              <div className="form-group">
                <label>Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.address && (
                  <span className="error">{errors.address}</span>
                )}
              </div>

              {!user && (
                <div className="form-group">
                  <label>Kebele ID</label>
                  <input
                    type="text"
                    name="kebeleId"
                    value={formData.kebeleId}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  {errors.kebeleId && (
                    <span className="error">{errors.kebeleId}</span>
                  )}
                </div>
              )}
            </>
          )}

          {/* Hospital officer specific fields */}
          {formData.role === "hospital" && !user && (
            <>
              <div className="form-group">
                <label>Hospital Name</label>
                <input
                  type="text"
                  name="hospitalName"
                  value={formData.hospitalName}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.hospitalName && (
                  <span className="error">{errors.hospitalName}</span>
                )}
              </div>

              <div className="form-group">
                <label>License Number</label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.licenseNumber && (
                  <span className="error">{errors.licenseNumber}</span>
                )}
              </div>
            </>
          )}

          <button type="submit" disabled={loading} className="register-button">
            {loading ? "Processing..." : "Register"}
          </button>

          {!user && (
            <p className="login-link">
              Already have an account?{" "}
              <span onClick={() => navigate("/login")}>Login</span>
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Register;
