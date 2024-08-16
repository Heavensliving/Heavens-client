import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './PropertyManagement.css';

const socket = io('https://heavensmanagement.onrender.com');

const PropertyManagement = () => {
  const [properties, setProperties] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [foundProperty, setFoundProperty] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('https://heavensmanagement.onrender.com/api/properties/get-properties');
        const data = await response.json();
        setProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    fetchProperties();

    socket.on('propertiesUpdate', (updatedProperties) => {
      setProperties(updatedProperties);
    });

    return () => {
      socket.off('propertiesUpdate');
    };
  }, []);

  const handleViewClick = (property) => {
    console.log('View clicked for property:', property);
  };

  const handleSearch = () => {
    const property = properties.find(p => p.propertyName.toLowerCase() === searchTerm.toLowerCase());
    setFoundProperty(property || null);
  };

  const copyToClipboard = (id) => {
    navigator.clipboard.writeText(id).then(() => {
      alert('Property ID copied to clipboard!');
    });
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === 'm') {
      e.preventDefault();
      setIsPopupVisible(true);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const closePopup = () => {
    setIsPopupVisible(false);
    setSearchTerm(''); // Clear the text field
    setFoundProperty(null); // Clear the found property
  };

  return (
    <div>
      <h4>Property Management</h4>
      <div className="table-container">
        <table className="property-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Property Name</th>
              <th>Hostel ID</th>
              <th>Contact No</th>
              <th>Branch</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((property, index) => (
              <tr key={index}>
                <td>
                  <div className="carousel">
                    <img src={property.images} alt={property.propertyName} />
                  </div>
                </td>
                <td>{property.propertyName}</td>
                <td>{property.uniquepropertyId}</td>
                <td>{property.contactNumber}</td>
                <td>{property.branch}</td>
                <td>
                  <button className="view-button" onClick={() => handleViewClick(property)}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Popup Component */}
      {isPopupVisible && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button className="popup-close" onClick={closePopup}>X</button>
            <h4>Search Property Id</h4>
            <input
              type="text"
              placeholder="Enter property name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
            {foundProperty && (
              <div>
                <p>Property ID: {foundProperty.uniquepropertyId}</p>
                <button className="copy-button" onClick={() => copyToClipboard(foundProperty.uniquepropertyId)}>Copy ID</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyManagement;
