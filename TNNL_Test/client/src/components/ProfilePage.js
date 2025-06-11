import { useEffect, useState } from 'react';
import axios from '../api';

const ProfilePage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      console.log('TOKEN:', token);

      try {
        const res = await axios.get('/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('USER RESPONSE:', res.data);

        setUser(res.data);
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };

    fetchUser();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      {user ? (
        <h2>Hello, {user.fname} {user.lname} 👋</h2>
      ) : (
        <h2>Loading profile...</h2>
      )}
    </div>
  );
};

export default ProfilePage;
