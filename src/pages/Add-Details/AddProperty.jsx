import React, { useState } from 'react';
import { FaWifi, FaWater, FaToilet, FaTshirt, FaUtensils, FaDumbbell, FaBed, FaTv, FaCouch, FaBolt, FaCoffee } from 'react-icons/fa';
import { MdElevator } from 'react-icons/md';
import './AddProperty.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const AddProperty = () => {

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    propertyName: '',
    location: '',
    address: '',
    description: '',
    contactNumber: '',
    totalBeds: '',
    preferredBy: '',
    googleMapUrl: '',
    startingPrice: '',
    oneSharing: '',
    twoSharing: '',
    fourSharing: '',
    sixSharing: '',
    virtualVideoUrl: '',
    amenities: [],
    images: [],
    occupancy: [],
    propertyType: '',
    branch: '',
    phase: '',
    propertyOwnerName: '',
  });
  const [error, setError] = useState('');

  const handleStepChange = (newStep) => {
    if (newStep > 0 && newStep <= 4) {
      setStep(newStep);
    }
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handlePrev = () => {
    setStep(step - 1);
  };

  const handleAmenityChange = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((item) => item !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleOccupancyChange = (option) => {
    setFormData((prev) => ({
      ...prev,
      occupancy: prev.occupancy.includes(option)
        ? prev.occupancy.filter((item) => item !== option)
        : [...prev.occupancy, option]
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + formData.images.length > 6) {
      setError('You can select a maximum of 6 images.');
      return;
    }
    setError('');
    setFormData((prev) => ({ ...prev, images: [...prev.images, ...files] }));
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const uploadImage = async (imageFile) => {
    console.log(import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
    console.log(import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
        return response.data.secure_url;
    } catch (error) {
        console.error('Image upload failed:', error);
        throw error;
    }
};

const generateUniqueId = () => {
  const randomNineDigitNumber = Math.floor(100000000 + Math.random() * 900000000);
  return `HVNS-Prop-${randomNineDigitNumber}`;
};

  const handleSubmit = async () => {
    try {
      // Ensure formData.images is an array
      const { images } = formData;
      if (!Array.isArray(images)) {
        throw new Error('Images should be an array');
      }
  
      // Upload images to Cloudinary and get their URLs
      const imageUrls = await Promise.all(
        images.map(async (image) => {
          return await uploadImage(image);
        })
      );
  
      const propertyData = {
        uniquepropertyId: generateUniqueId(),
        propertyName: formData.propertyName,
        location: formData.location,
        address: formData.address,
        description: formData.description,
        contactNumber: formData.contactNumber,
        totalBeds: formData.totalBeds,
        preferredBy: formData.preferredBy,
        googleMapUrl: formData.googleMapUrl,
        startingPrice: formData.startingPrice,
        oneSharing: formData.oneSharing,
        twoSharing: formData.twoSharing,
        fourSharing: formData.fourSharing,
        sixSharing: formData.sixSharing,
        virtualVideoUrl: formData.virtualVideoUrl,
        amenities: formData.amenities,
        occupancy: formData.occupancy,
        images: imageUrls, // Include the image URLs
        propertyType: formData.propertyType,
        branch: formData.branch,
        phase: formData.phase,
        propertyOwnerName: formData.propertyOwnerName,
      };
  
      const response = await axios.post('http://localhost:5000/api/properties/add-property', propertyData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      toast.success(response.data.message);
      setFormData({
        uniquepropertyId: '',
        propertyName: '',
        location: '',
        address: '',
        description: '',
        contactNumber: '',
        totalBeds: '',
        preferredBy: '',
        googleMapUrl: '',
        startingPrice: '',
        oneSharing: '',
        twoSharing: '',
        fourSharing: '',
        sixSharing: '',
        virtualVideoUrl: '',
        amenities: [],
        images: [],
        occupancy: [],
        propertyType: '',
        branch: '',
        phase: '',
        propertyOwnerName: '',
      });
      setStep(1);
    } catch (error) {
      console.error('Failed to add property:', error);
      toast.error('Failed to add property');
    }
  };
  
  
  
  
  
  return (
    <div className="container">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <div className="content-wrapper">
        <h3 className="Add-Property-title">
          Add Property <i className="bx bx-buildings"></i>
        </h3>
        <div className="content-container">
          <div className="steps-indicator">
            <button onClick={() => handleStepChange(1)} className={`step ${step === 1 ? 'active' : ''}`}>Step 1</button>
            <button onClick={() => handleStepChange(2)} className={`step ${step === 2 ? 'active' : ''}`}>Step 2</button>
            <button onClick={() => handleStepChange(3)} className={`step ${step === 3 ? 'active' : ''}`}>Step 3</button>
            <button onClick={() => handleStepChange(4)} className={`step ${step === 4 ? 'active' : ''}`}>Step 4</button>
          </div>

          {step === 1 && (
            <form className="property-form">
              <div className="form-row-addprop">
                <div className="form-group-addprop" style={{flexDirection:'column',alignItems:'start'}}>
                  <label htmlFor="propertyName">Property Name</label>
                  <input
                    type="text"
                    id="propertyName"
                    name="propertyName"
                    className="form-control"
                    value={formData.propertyName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group-addprop" style={{flexDirection:'column',alignItems:'start'}}>
                  <label htmlFor="location">Location</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    className="form-control"
                    value={formData.location}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-group-addprop" style={{flexDirection:'column',alignItems:'start',marginTop:'-20px'}}>
                <label htmlFor="address">Address</label>
                <textarea
                  id="address"
                  name="address"
                  className="form-control textarea"
                  rows="4"
                  value={formData.address}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              <div className="form-group-addprop" style={{flexDirection:'column',alignItems:'start'}}>
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  className="form-control"
                  rows="3"
                  value={formData.description}
                  onChange={handleInputChange}
                  style={{resize:'none'}}
                ></textarea>
              </div>
              <div className="form-row-addprop">
              <div className="form-group-addprop" style={{flexDirection:'column',alignItems:'start'}}>
                <label htmlFor="contactNumber">Contact Number</label>
                <input
                  type="number"
                  id="contactNumber"
                  name="contactNumber"
                  className="form-control"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group-addprop" style={{flexDirection:'column',alignItems:'start'}}>
                <label htmlFor="totalBeds">Total Beds</label>
                <input
                  type="number"
                  id="totalBeds"
                  name="totalBeds"
                  className="form-control"
                  value={formData.totalBeds}
                  onChange={handleInputChange}
                />
              </div>
              </div>
              <button type="button" className="btn-next" style={{marginTop:'-10px'}} onClick={handleNext}>
                Next
              </button>
            </form>
          )}

          {step === 2 && (
            <form className="property-form">
              <div className="form-row-addprop">
                <div className="form-group-addprop" style={{flexDirection:'column',alignItems:'start'}}>
                  <label htmlFor="preferredBy">Preferred By</label>
                  <div className="form-options">
                    <label>
                      <input
                        type="radio"
                        name="preferredBy"
                        value="Girls"
                        checked={formData.preferredBy === 'Girls'}
                        onChange={handleInputChange}
                      /> Girls
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="preferredBy"
                        value="Boys"
                        checked={formData.preferredBy === 'Boys'}
                        onChange={handleInputChange}
                      /> Boys
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="preferredBy"
                        value="Unisex"
                        checked={formData.preferredBy === 'Unisex'}
                        onChange={handleInputChange}
                      /> Unisex
                    </label>
                  </div>
                </div>
                <div className="form-group-addprop" style={{flexDirection:'column',alignItems:'start'}}>
                  <label htmlFor="googleMapUrl">Google Map URL</label>
                  <input
                    type="text"
                    id="googleMapUrl"
                    name="googleMapUrl"
                    className="form-control"
                    value={formData.googleMapUrl}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-row-addprop">
                <div className="form-group-addprop" style={{flexDirection:'column',alignItems:'start'}}>
                  <label htmlFor="startingPrice">Starting Price</label>
                  <input
                    type="number"
                    id="startingPrice"
                    name="startingPrice"
                    className="form-control"
                    value={formData.startingPrice}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group-addprop" style={{flexDirection:'column',alignItems:'start'}}>
                  <label htmlFor="oneSharing">1 Sharing</label>
                  <input
                    type="number"
                    id="oneSharing"
                    name="oneSharing"
                    className="form-control"
                    value={formData.oneSharing}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group-addprop" style={{flexDirection:'column',alignItems:'start'}}>
                  <label htmlFor="twoSharing">2 Sharing</label>
                  <input
                    type="number"
                    id="twoSharing"
                    name="twoSharing"
                    className="form-control"
                    value={formData.twoSharing}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group-addprop" style={{flexDirection:'column',alignItems:'start'}}>
                  <label htmlFor="fourSharing">4 Sharing</label>
                  <input
                    type="number"
                    id="fourSharing"
                    name="fourSharing"
                    className="form-control"
                    value={formData.fourSharing}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group-addprop" style={{flexDirection:'column',alignItems:'start'}}>
                  <label htmlFor="sixSharing">6 Sharing</label>
                  <input
                    type="number"
                    id="sixSharing"
                    name="sixSharing"
                    className="form-control"
                    value={formData.sixSharing}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-group-addprop" style={{flexDirection:'column',alignItems:'start'}}>
                <label htmlFor="virtualVideoUrl">Virtual Video URL</label>
                <input
                  type="text"
                  id="virtualVideoUrl"
                  name="virtualVideoUrl"
                  className="form-control"
                  value={formData.virtualVideoUrl}
                  onChange={handleInputChange}
                />
              </div>
             
              <button type="button" className="btn-next" onClick={handleNext}>
                Next
              </button>
            </form>
          )}

          {step === 3 && (
           <div className="amenities-form">
           <h4 style={{ marginBottom: '20px' }}>Select Amenities</h4>
           <div className="form-options">
             <label>
               <input
                 type="checkbox"
                 checked={formData.amenities.includes('WiFi')}
                 onChange={() => handleAmenityChange('WiFi')}
               />
               <FaWifi /> WiFi
             </label>
             <label>
               <input
                 type="checkbox"
                 checked={formData.amenities.includes('Cupboard')}
                 onChange={() => handleAmenityChange('Cupboard')}
               />
               <FaUtensils /> Spacious Cupboard
             </label>
             <label>
               <input
                 type="checkbox"
                 checked={formData.amenities.includes('Washroom')}
                 onChange={() => handleAmenityChange('Washroom')}
               />
               <FaToilet /> Attached Washroom
             </label>
             <label>
               <input
                 type="checkbox"
                 checked={formData.amenities.includes('Laundry')}
                 onChange={() => handleAmenityChange('Laundry')}
               />
               <FaTshirt /> Laundry
             </label>
             <label>
               <input
                 type="checkbox"
                 checked={formData.amenities.includes('Cafeteria')}
                 onChange={() => handleAmenityChange('Cafeteria')}
               />
               <FaCoffee /> Cafeteria
             </label>
             <label>
               <input
                 type="checkbox"
                 checked={formData.amenities.includes('Gym')}
                 onChange={() => handleAmenityChange('Gym')}
               />
               <FaDumbbell /> Gym
             </label>
             <label>
               <input
                 type="checkbox"
                 checked={formData.amenities.includes('Single Bed')}
                 onChange={() => handleAmenityChange('Single Bed')}
               />
               <FaBed /> Single Bed
             </label>
             <label>
               <input
                 type="checkbox"
                 checked={formData.amenities.includes('Double Bed')}
                 onChange={() => handleAmenityChange('Double Bed')}
               />
               <FaBed /> Double Bed
             </label>
             <label>
               <input
                 type="checkbox"
                 checked={formData.amenities.includes('Hot Water')}
                 onChange={() => handleAmenityChange('Hot Water')}
               />
               <FaWater /> Hot Water
             </label>
             <label>
               <input
                 type="checkbox"
                 checked={formData.amenities.includes('TV')}
                 onChange={() => handleAmenityChange('TV')}
               />
               <FaTv /> TV
             </label>
             <label>
               <input
                 type="checkbox"
                 checked={formData.amenities.includes('Water Purifier')}
                 onChange={() => handleAmenityChange('Water Purifier')}
               />
               <FaWater /> Water Purifier
             </label>
             <label>
               <input
                 type="checkbox"
                 checked={formData.amenities.includes('Washing Area')}
                 onChange={() => handleAmenityChange('Washing Area')}
               />
               <FaTshirt /> Washing Area
             </label>
             <label>
               <input
                 type="checkbox"
                 checked={formData.amenities.includes('Washing Machine')}
                 onChange={() => handleAmenityChange('Washing Machine')}
               />
               <FaTshirt /> Washing Machine
             </label>
             <label>
               <input
                 type="checkbox"
                 checked={formData.amenities.includes('Power Backup')}
                 onChange={() => handleAmenityChange('Power Backup')}
               />
               <FaBolt /> Power Backup
             </label>
             <label>
               <input
                 type="checkbox"
                 checked={formData.amenities.includes('Lift')}
                 onChange={() => handleAmenityChange('Lift')}
               />
               <MdElevator /> Lift
             </label>
           </div>
           <div className="form-row-addprop" style={{marginTop:'50px'}}>
            <div className="form-group-addprop" style={{ flexDirection: 'column', alignItems: 'start' }}>
              <label htmlFor="propertyOwnerName">Property Owner Name</label>
              <input
                type="text"
                id="propertyOwnerName"
                name="propertyOwnerName"
                className="form-control"
                value={formData.propertyOwnerName}
                onChange={handleInputChange}
              />
            </div>
          </div>
           <button type="button" className="btn-next" onClick={handleNext}>
             Next
           </button>
         </div>
          )}

          {step === 4 && (
            <div className="image-upload-form">
              <div className="form-group-addprop" style={{flexDirection:'column',alignItems:'start'}}>
                <label htmlFor="images">Upload Images (max 6)</label>
                <input
                  type="file"
                  id="images"
                  name="images"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {error && <div className="error-text">{error}</div>}
              </div>
              <div className="image-preview">
                {formData.images.map((image, index) => (
                  <div key={index} className="image-preview-item">
                    <img src={URL.createObjectURL(image)} alt={`preview-${index}`} />
                    <button
                      type="button"
                      className="remove-image"
                      onClick={() => handleRemoveImage(index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <div className="form-group-addprop" style={{flexDirection:'column',alignItems:'start'}}>
                <label>Available Occupancy</label>
                <div className="form-options">
                  {['1 Sharing', '2 Sharing', '4 Sharing', '6 Sharing'].map((option) => (
                    <label key={option}>
                      <input
                        type="checkbox"
                        value={option}
                        checked={formData.occupancy.includes(option)}
                        onChange={() => handleOccupancyChange(option)}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
              <div className="form-group-addprop" style={{ flexDirection: 'column', alignItems: 'start' }}>
            <label htmlFor="propertyType">Property Type</label>
            <select
              id="propertyType"
              name="propertyType"
              className="form-control"
              value={formData.propertyType}
              onChange={handleInputChange}
            >
              <option value="">Select Type</option>
              <option value="Hostel">Hostel</option>
              <option value="PG">PG</option>
              <option value="Co-living">Co-living</option>
              <option value="Serviced Apartment">Serviced Apartment</option>
            </select>
          </div>
          <div className="form-group-addprop" style={{ flexDirection: 'column', alignItems: 'start' }}>
                <label htmlFor="branch">Branch</label>
                <select
                  id="branch"
                  name="branch"
                  className="form-control"
                  value={formData.branch}
                  onChange={handleInputChange}
                >
                  <option value="">Select Branch</option>
                  <option value="Jigani">Jigani</option>
                </select>
              </div>

              <div className="form-group-addprop" style={{ flexDirection: 'column', alignItems: 'start' }}>
                <label htmlFor="phase">Phase</label>
                <select
                  id="phase"
                  name="phase"
                  className="form-control"
                  value={formData.phase}
                  onChange={handleInputChange}
                >
                  <option value="">Select Phase</option>
                  <option value="Jigani 1">Jigani 1</option>
                </select>
              </div>
              <button type="button" className="btn-submit" onClick={handleSubmit}>
                Submit
              </button>
            </div>
         ) }
        </div>
      </div>
    </div>
  );
};

export default AddProperty;
