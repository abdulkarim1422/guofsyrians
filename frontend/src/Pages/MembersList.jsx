import { useState, useEffect } from "react";
import api from "@/utils/api";

export const MembersList = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/members');
        setMembers(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching members:", err);
        setError(err.response?.data?.detail || err.message || "Failed to fetch members");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading members...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Members CVs</h1>
      <p>Click on any member name to view their CV</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
        {members.map((member) => (
          <div key={member._id} style={{ 
            border: '1px solid #ddd', 
            borderRadius: '8px', 
            padding: '1rem',
            backgroundColor: '#f9f9f9'
          }}>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>
              <a 
                href={`/cv/${member._id}`} 
                style={{ 
                  color: '#007bff', 
                  textDecoration: 'none',
                  fontSize: '1.1rem'
                }}
                onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                onMouseOut={(e) => e.target.style.textDecoration = 'none'}
              >
                {member.name}
              </a>
            </h3>
            <p style={{ margin: '0.5rem 0', color: '#666' }}>
              {member.professional_title || 'Professional'}
            </p>
            <p style={{ margin: '0.5rem 0', fontSize: '0.9rem', color: '#888' }}>
              {member.city && member.country ? `${member.city}, ${member.country}` : (member.city || member.country || 'Location not specified')}
            </p>
            <p style={{ margin: '0.5rem 0', fontSize: '0.8rem', color: '#999' }}>
              ID: {member._id}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
