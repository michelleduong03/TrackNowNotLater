import { useEffect, useState } from 'react';
import axios from '../api';
import AccountInfoWidget from './ProfileWidgets/AccountInfoWidget';
import GmailWidget from './ProfileWidgets/GmailWidget';

const ProfilePage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await axios.get('/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(res.data);
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };

    fetchUser();
  }, []);

  return (
    <div style={{ padding: '2rem', position: 'relative', minHeight: '85vh' }}>
      {user ? (
        <>
          <h1>Hello, {user.fname} {user.lname} 👋</h1>
          <AccountInfoWidget email={user.email} />
          <GmailWidget gmailEmail={user.gmailEmail} />


          {user.lastLogin && (
            <div style={{
              position: 'absolute',
              bottom: '10px',
              left: '10px',
              fontSize: '0.9rem',
              color: '#555'
            }}>
              Last logged in: {new Date(user.lastLogin).toLocaleString()}
            </div>
          )}
        </>
      ) : (
        <h2>Loading profile...</h2>
      )}

      <br></br>
      <br></br>
      <br></br>

      <button
        onClick={() => {
          window.location.href = `mailto:TrackNowNotLater@gmail.com?subject=Feedback%20or%20Issue%20Report&body=Hi%20TNNL%20team,%0A%0AI%20have%20some%20feedback%20or%20an%20issue%20to%20report:%0A%0A[Write%20your%20message%20here]%0A%0AThanks!`;
        }}
        style={{
          marginTop: '1rem',
          marginBottom: '1rem',
          padding: '0.6rem 1rem',
          background: '#1677ff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Feedback / Report Issue
      </button>

      {/* <br></br> */}

      <button
        onClick={async () => {
            const confirmed = window.confirm('Are you sure you want to delete your account? This cannot be undone.');
            if (!confirmed) return;

            try {
            const token = localStorage.getItem('token');
            await axios.delete('/auth/delete', {
                headers: {
                Authorization: `Bearer ${token}`
                }
            });
            localStorage.removeItem('token');
            alert('Account deleted successfully.');
            window.location.href = '/';
            } catch (err) {
            console.error('Delete error:', err);
            alert('Error deleting account.');
            }
        }}
        style={{
            marginTop: '2rem',
            padding: '0.6rem 1rem',
            background: '#ff4d4f',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
        }}
        >
        Delete Account
        </button>

    </div>
  );
};

export default ProfilePage;
