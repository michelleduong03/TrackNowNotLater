import { useState } from 'react';
import axios from '../api';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Register() {
  const [form, setForm] = useState({ fname: '', lname: '', email: '', password: '' });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

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
          type="text"
          placeholder="First Name"
          value={form.fname}
          onChange={e => setForm({ ...form, fname: e.target.value })}
          required
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={form.lname}
          onChange={e => setForm({ ...form, lname: e.target.value })}
          required
          style={inputStyle}
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          required
          style={inputStyle}
        />
        {/* <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          required
          style={{ ...inputStyle, marginBottom: '1.5rem' }}
        /> */}
        <div style={{ position: 'relative' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            required
            style={{ ...inputStyle, marginBottom: '1.5rem' }}
          />
         <span
            onClick={() => setShowPassword(prev => !prev)}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-68%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              cursor: 'pointer',
              color: '#6b7280',
              fontSize: '1.2rem',
            }}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>


        <button
          type="submit"
          style={buttonStyle}
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

const inputStyle = {
  width: '100%',
  padding: '0.75rem 0.1rem',
  marginBottom: '1rem',
  borderRadius: '8px',
  border: '1px solid #ccc',
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
