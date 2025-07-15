import { useState } from 'react';
import axios from '../api';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Register() {
  const [form, setForm] = useState({ fname: '', lname: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const isPasswordValid = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isPasswordValid(form.password)) {
      alert('Password must be at least 8 characters long and include an uppercase letter, a number, and a special character.');
      return;
    }

    try {
      const res = await axios.post('/auth/register', form);
      localStorage.setItem('fname', res.data.user.fname);
      alert('Registration successful!');
      navigate('/login');
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: '"Lora", serif', // Applied Lora font
      background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
      padding: '2rem'
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: '#ffffff',
          padding: '2.5rem',
          borderRadius: '16px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
        }}
      >
        <h2 style={{
          textAlign: 'center',
          fontSize: '1.75rem',
          fontWeight: '700',
          marginBottom: '2rem',
          color: '#1f2937'
        }}>
          Create your account
        </h2>

        <div style={inputGroup}>
          <label style={labelStyle}>First Name</label>
          <input
            type="text"
            value={form.fname}
            onChange={e => setForm({ ...form, fname: e.target.value })}
            required
            style={inputStyle}
          />
        </div>

        <div style={inputGroup}>
          <label style={labelStyle}>Last Name</label>
          <input
            type="text"
            value={form.lname}
            onChange={e => setForm({ ...form, lname: e.target.value })}
            required
            style={inputStyle}
          />
        </div>

        <div style={inputGroup}>
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
            style={inputStyle}
          />
        </div>

        <div style={inputGroup}>
          <label style={labelStyle}>Password</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
              style={{ ...inputStyle, paddingRight: '0.2rem' }}
            />
            <span
              onClick={() => setShowPassword(prev => !prev)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-40%)',
                cursor: 'pointer',
                color: '#9ca3af',
                fontSize: '1.2rem'
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

        <button
          type="submit"
          style={buttonStyle}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1d4ed8'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2563eb'}
        >
          Sign Up
        </button>

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.95rem', color: '#6b7280' }}>
          <p>
            Already have an account?{' '}
            <span
              onClick={() => navigate('/login')}
              style={{ color: '#2563eb', cursor: 'pointer', fontWeight: '600' }}
            >
              Log In
            </span>
          </p>
          <p style={{ marginTop: '0.5rem' }}>
            <span
              onClick={() => navigate('/')}
              style={{ color: '#2563eb', cursor: 'pointer', fontWeight: '600' }}
            >
              Back to Home
            </span>
          </p>
        </div>
      </form>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap');
        `}
      </style>
    </div>
  );
}

const inputGroup = {
  marginBottom: '1.25rem'
};

const labelStyle = {
  fontWeight: '600',
  color: '#374151',
  fontSize: '0.95rem',
  marginBottom: '0.35rem',
  display: 'block'
};

const inputStyle = {
  width: '100%',
  padding: '0.75rem 0.2rem',
  borderRadius: '10px',
  border: '1px solid #d1d5db',
  fontSize: '1rem'
};

const buttonStyle = {
  width: '100%',
  padding: '0.75rem',
  borderRadius: '9999px',
  border: 'none',
  backgroundColor: '#2563eb',
  color: 'white',
  fontWeight: '600',
  fontSize: '1.1rem',
  cursor: 'pointer',
  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.39)',
  transition: 'background-color 0.3s ease'
};