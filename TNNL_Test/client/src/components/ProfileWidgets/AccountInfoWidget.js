import React from 'react';
import axios from '../../api';

const widgetStyle = {
  border: '1px solid #e0e0e0',
  borderRadius: '12px',
  padding: '1.5rem 2rem',
  marginBottom: '1.5rem',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  backgroundColor: '#fff',
  maxWidth: '400px',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

const headingStyle = {
  marginBottom: '1rem',
  fontWeight: '600',
  fontSize: '1.25rem',
  color: '#333',
};

const textStyle = {
  marginBottom: '1.25rem',
  fontSize: '1rem',
  color: '#555',
};

const buttonStyle = {
  backgroundColor: '#007bff',
  border: 'none',
  padding: '0.5rem 1rem',
  borderRadius: '6px',
  color: '#fff',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
  marginRight: '0.5rem',
};

const buttonHoverStyle = {
  backgroundColor: '#0056b3',
};

const inputStyle = {
  display: 'block',
  width: '100%',
  padding: '0.5rem',
  marginBottom: '1rem',
  borderRadius: '6px',
  border: '1px solid #ccc',
  fontSize: '1rem',
};

class AccountInfoWidget extends React.Component {
  state = {
    hover: false,
    showForm: false,
    currentPassword: '',
    newPassword: '',
    message: '',
    loading: false,
  };

  toggleHover = () => this.setState({ hover: !this.state.hover });

  toggleForm = () => this.setState(({ showForm }) => ({ showForm: !showForm, message: '' }));

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value, message: '' });
  };

  handleSubmit = async () => {
    const { currentPassword, newPassword } = this.state;

    if (!currentPassword || !newPassword) {
      this.setState({ message: 'Please fill out both fields' });
      return;
    }

    this.setState({ loading: true, message: '' });

    try {
      const token = localStorage.getItem('token');

      const res = await axios.post(
        '/auth/change-password',
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      this.setState({
        message: res.data.message || 'Password changed successfully!',
        showForm: false,
        currentPassword: '',
        newPassword: '',
      });
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        this.setState({ message: err.response.data.message });
      } else {
        this.setState({ message: 'Network error' });
      }
    } finally {
      this.setState({ loading: false });
    }
  };


  render() {
    const { email } = this.props;
    const { hover, showForm, currentPassword, newPassword, message, loading } = this.state;

    return (
      <div 
      style={widgetStyle}
      fontFamily= "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      >
        <h3 style={headingStyle}>Account Info</h3>
        <p style={textStyle}>Email: {email}</p>

        {!showForm && (
          <button
            style={hover ? { ...buttonStyle, ...buttonHoverStyle } : buttonStyle}
            onMouseEnter={this.toggleHover}
            onMouseLeave={this.toggleHover}
            onClick={this.toggleForm}
          >
            Change Password
          </button>
        )}

        {showForm && (
          <>
            <input
              type="password"
              name="currentPassword"
              placeholder="Current password"
              value={currentPassword}
              onChange={this.handleChange}
              style={inputStyle}
              disabled={loading}
            />
            <input
              type="password"
              name="newPassword"
              placeholder="New password"
              value={newPassword}
              onChange={this.handleChange}
              style={inputStyle}
              disabled={loading}
            />
            <button
              style={hover ? { ...buttonStyle, ...buttonHoverStyle } : buttonStyle}
              onMouseEnter={this.toggleHover}
              onMouseLeave={this.toggleHover}
              onClick={this.handleSubmit}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Submit'}
            </button>
            <button
              style={{ ...buttonStyle, backgroundColor: '#6c757d' }}
              onClick={this.toggleForm}
              disabled={loading}
            >
              Cancel
            </button>
          </>
        )}

        {message && <p style={{ marginTop: '1rem', color: message.includes('success') ? 'green' : 'red' }}>{message}</p>}
      </div>
    );
  }
}

export default AccountInfoWidget;
