import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/api';

const RegisterPage = () => {
    // 1. Updated state to include email and phone
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        fullName: '',
        role: 'student', // Default
        email: '',       // New field
        phone: ''        // New field
    });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // The formData now includes email and phone automatically
            await API.post('/auth/register', formData);
            alert('Registration successful! Please wait for Warden approval.');
            navigate('/');
        } catch (err) {
            console.log("Full Error Object:", err);
            // This will show the specific error from the backend (e.g., "Phone number must be exactly 10 digits")
            alert(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div style={{ padding: '50px', maxWidth: '400px', margin: 'auto' }}>
            <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">

                {/* Full Name */}
                <input
                    type="text"
                    placeholder="Full Name"
                    required
                    className="w-full p-2 border rounded"
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />

                {/* --- NEW EMAIL INPUT --- */}
                <input
                    type="email"
                    placeholder="Email Address (e.g., tejas@example.com)"
                    required
                    className="w-full p-2 border rounded"
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />

                {/* --- NEW PHONE INPUT --- */}
                {/* pattern="[0-9]{10}" enforces exactly 10 digits on the frontend */}
                <input
                    type="tel"
                    placeholder="Phone Number (10 digits)"
                    required
                    pattern="[0-9]{10}"
                    title="Phone number must be exactly 10 digits"
                    className="w-full p-2 border rounded"
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />

                {/* Username */}
                <input
                    type="text"
                    placeholder="Username"
                    required
                    className="w-full p-2 border rounded"
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />

                {/* Password */}
                <input
                    type="password"
                    placeholder="Password"
                    required
                    className="w-full p-2 border rounded"
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />

                <label className="font-semibold mt-2">Register as:</label>
                <select
                    value={formData.role}
                    className="w-full p-2 border rounded mb-4"
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                    <option value="student">Student</option>
                    <option value="warden">Warden</option>
                    <option value="staff">Staff</option>
                </select>

                <button type="submit" className="w-full p-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition">
                    Register
                </button>
            </form>
            <p className="mt-4 text-center">
                Already have an account? <Link to="/" className="text-blue-600 font-semibold">Login</Link>
            </p>
        </div>
    );
};

export default RegisterPage;