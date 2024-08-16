import React, { useState, useEffect } from 'react';
import './SignupPage.css';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'client',
    propertyName: '',
    propertyId: ''
  });
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    // Fetch property names and IDs from the backend
    const fetchProperties = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/properties/get-properties');
        const data = await response.json();
        setProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    fetchProperties();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // If the propertyName field is changed, automatically set the propertyId
    if (name === 'propertyName') {
      const selectedProperty = properties.find(property => property.propertyName === value);
      setFormData({
        ...formData,
        propertyName: value,
        propertyId: selectedProperty ? selectedProperty.uniquepropertyId : ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/user/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        console.log('Signup successful');
      } else {
        console.error('Signup failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="signup-container">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="role">User Role:</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="client">Client</option>
            <option value="property-manager">Property Manager</option>
            <option value="branch-manager">Branch Manager</option>
            <option value="property-owner">Property Owner</option>
            <option value="heavens-admin">Heavens Admin</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="propertyName">Property Name:</label>
          <select
            id="propertyName"
            name="propertyName"
            value={formData.propertyName}
            onChange={handleChange}
            required
          >
            <option value="">Select Property</option>
            {properties.map(property => (
              <option key={property._id} value={property.propertyName}>
                {property.propertyName}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="propertyId">Property ID:</label>
          <input
            type="text"
            id="propertyId"
            name="propertyId"
            value={formData.propertyId}
            readOnly
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignupPage;
