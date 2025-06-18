import React from 'react';

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
  state = { hover: false };

  toggleHover = () => this.setState({ hover: !this.state.hover });

  render() {
    const { gmailEmail } = this.props;
    const { hover } = this.state;

    return (
      <div style={widgetStyle}>
        <h3 style={headingStyle}>Gmail Connection</h3>
        <p style={textStyle}>Gmail: {gmailEmail || 'Not linked'}</p>
        {!gmailEmail ? (
          <button
            style={hover ? { ...buttonStyle, ...buttonHoverStyle } : buttonStyle}
            onMouseEnter={this.toggleHover}
            onMouseLeave={this.toggleHover}
            onClick={() => alert('Start Gmail linking flow')}
          >
            Link Gmail
          </button>
        ) : (
          <button
            style={hover ? { ...buttonStyle, ...buttonHoverStyle } : buttonStyle}
            onMouseEnter={this.toggleHover}
            onMouseLeave={this.toggleHover}
            onClick={() => alert('Unlink Gmail')}
          >
            Unlink Gmail
          </button>
        )}
      </div>
    );
  }
}

export default GmailWidget;
