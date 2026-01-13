import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/api';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.post('/auth/login', formData);
            login(data.user, data.token);

            // Redirect based on role
            if (data.user.role === 'student') navigate('/student-dashboard');
            else navigate('/warden-dashboard');
        } catch (err) {
            alert(err.response?.data?.message || 'Login Failed');
        }
    };

    return (
        <div style={{ padding: '50px', maxWidth: '400px', margin: 'auto' }}>
            <h2>Hostel Query System</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Username" required
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
                <br /><br />
                <input type="password" placeholder="Password" required
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                <br /><br />
                <button type="submit">Login</button>
            </form>
            <p>Don't have an account? <Link to="/register">Register here</Link></p>
        </div>
    );
};

export default LoginPage;