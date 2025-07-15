import { useState } from 'react';
import axios from '../api';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.user._id);
      navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Login failed';
      alert('Login failed: ' + message);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: '"Lora", serif',
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
          Welcome back
        </h2>

        <label style={{ fontWeight: '600', color: '#374151', fontSize: '0.95rem' }}>Email</label>
        <input
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          required
          style={{
            width: '100%',
            padding: '0.75rem 0.2rem',
            marginTop: '0.25rem',
            marginBottom: '1.5rem',
            borderRadius: '10px',
            border: '1px solid #d1d5db',
            fontSize: '1rem'
          }}
        />

        <label style={{ fontWeight: '600', color: '#374151', fontSize: '0.95rem' }}>Password</label>
        <div style={{ position: 'relative' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            required
            style={{
              width: '100%',
              padding: '0.75rem 0.2rem',
              marginTop: '0.25rem',
              marginBottom: '1.5rem',
              borderRadius: '10px',
              border: '1px solid #d1d5db',
              fontSize: '1rem'
            }}
          />
          <span
            onClick={() => setShowPassword(prev => !prev)}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-80%)',
              cursor: 'pointer',
              color: '#9ca3af'
            }}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '0.75rem',
            borderRadius: '9999px',
            border: 'none',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            fontWeight: '600',
            fontSize: '1.05rem',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
            transition: 'background-color 0.3s ease'
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1d4ed8'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2563eb'}
        >
          Log In
        </button>

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.95rem', color: '#6b7280' }}>
          <p>
            Don’t have an account?{' '}
            <span
              onClick={() => navigate('/register')}
              style={{ color: '#2563eb', cursor: 'pointer', fontWeight: '600' }}
            >
              Register
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
    </div>
  );
}