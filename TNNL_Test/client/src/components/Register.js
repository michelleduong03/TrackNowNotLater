import { useState } from 'react';
import axios from '../api';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/auth/register', form);
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
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: '"Inter", sans-serif',
      background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
      color: '#1f2937',
      padding: '2rem',
      boxSizing: 'border-box'
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}
      >
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Create Account</h2>

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          required
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            marginBottom: '1rem',
            borderRadius: '8px',
            border: '1px solid #ccc',
            fontSize: '1rem'
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          required
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            marginBottom: '1.5rem',
            borderRadius: '8px',
            border: '1px solid #ccc',
            fontSize: '1rem'
          }}
        />
        <button
          type="submit"
          style={{
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
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1d4ed8'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2563eb'}
        >
          Sign Up
        </button>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', color: '#4b5563' }}>
          <p>
            Already have an account?{' '}
            <span
              onClick={() => navigate('/login')}
              style={{ color: '#2563eb', cursor: 'pointer', fontWeight: '600' }}
            >
              Log In
            </span>
          </p>
          <p>
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
