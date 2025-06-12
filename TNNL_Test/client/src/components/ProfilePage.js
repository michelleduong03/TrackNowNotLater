import { useEffect, useState } from 'react';
import axios from '../api';

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
          <h2>Hello, {user.fname} {user.lname} 👋</h2>
          <p>Email: {user.email}</p>
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
    </div>
  );
};

export default ProfilePage;
