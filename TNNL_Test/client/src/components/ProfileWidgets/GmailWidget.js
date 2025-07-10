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
  backgroundColor: '#28a745',
  border: 'none',
  padding: '0.5rem 1rem',
  borderRadius: '6px',
  color: '#fff',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
};

const buttonHoverStyle = {
  backgroundColor: '#1e7e34',
};

class GmailWidget extends React.Component {
  state = {
    hover: false,
    localGmailEmail: this.props.gmailEmail || null,
  };

  toggleHover = () => this.setState({ hover: !this.state.hover });

  handleUnlink = async () => {
    if (!window.confirm('Are you sure you want to unlink Gmail and delete all purchase data?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete('/auth/unlink-gmail', {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('Gmail unlinked and data deleted.');
      this.setState({ localGmailEmail: null });
    } catch (err) {
      console.error('Unlink failed', err);
      alert('Something went wrong. Please try again.');
    }
  };

  render() {
    const { hover, localGmailEmail } = this.state;

    return (
      <div style={widgetStyle}>
        <h3 style={headingStyle}>Gmail Connection</h3>
        <p style={textStyle}>Gmail: {localGmailEmail || 'Not linked'}</p>
        {!localGmailEmail ? (
          <button
            style={hover ? { ...buttonStyle, ...buttonHoverStyle } : buttonStyle}
            onMouseEnter={this.toggleHover}
            onMouseLeave={this.toggleHover}
            onClick={() => {
              const userId = this.props.userId;
              window.location.href = `http://localhost:3000/dashboard?importGmail=true&userId=${userId}`;
              // window.location.href = gmailAuthUrl;
            }}
          >
            Link Gmail
          </button>
        ) : (
          <button
            style={hover ? { ...buttonStyle, ...buttonHoverStyle } : buttonStyle}
            onMouseEnter={this.toggleHover}
            onMouseLeave={this.toggleHover}
            onClick={this.handleUnlink}
          >
            Unlink Gmail
          </button>
        )}
      </div>
    );
  }
}

export default GmailWidget;
