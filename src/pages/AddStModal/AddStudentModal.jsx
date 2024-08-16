import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import './AddStudentModal.css';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa'; // Import close icon
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');


Modal.setAppElement('#root'); // Set the app element for accessibility

const AddStudentModal = ({ isOpen, onRequestClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contactNo: '',
    email: '',
    bloodGroup: '',
    parentName: '',
    parentNumber: '',
    course: '',
    advanceFee: '',
    nonRefundableDeposit: '',
    monthlyRent: '',
    adharFront: null,
    adharBack: null,
    photo: null,
    hostelName: '',
    roomType: '',
    roomNo: '',
    referredBy: '',
    typeOfStay: '',
    joinDate: '',
    password: '',
    dateOfBirth: '',
    gender: '',
    year: '',
    collegeName: '',
    parentOccupation: '',
    workingPlace: '',
    branch: '',
    phase: '',
  });

  const [hostelNames, setHostelNames] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const branchOptions = ['Jigani'];
  const phaseOptions = ['Jigani 1'];

  const [paymentStatus, setPaymentStatus] = useState('Pending');
  const [currentStatus, setCurrentStatus] = useState('Checked in');
  const [imagePreviews, setImagePreviews] = useState({
    adharFront: null,
    adharBack: null,
    photo: null,
  });

  useEffect(() => {
    const fetchHostelNames = async () => {
      try {
        const response = await axios.get('https://heavensmanagement.onrender.com/api/properties/get-properties');
        if (response.status === 200) {
          const allHostelNames = response.data.map(property => property.propertyName);
          
          // Assuming the role and propertyName are stored in localStorage
          const userRole = localStorage.getItem('userRole');
          const userPropertyName = localStorage.getItem('userPropertyName');
          
          let filteredHostelNames = allHostelNames;
  
          // Filter based on role
          if (userRole === 'property-manager') {
            filteredHostelNames = allHostelNames.filter(name => name === userPropertyName);
          }
  
          setHostelNames(filteredHostelNames);
        } else {
          throw new Error(`Unexpected response status: ${response.status}`);
        }
      } catch (error) {
        console.error('Error fetching hostel names:', error);
        toast.error('Failed to load hostel names');
      }
    };
  
    fetchHostelNames();
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    setFormData({ ...formData, [name]: file });

    // Create a preview URL and update state
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreviews({ ...imagePreviews, [name]: previewUrl });
    }
  };

  const handleRemoveImage = (name) => {
    setFormData({ ...formData, [name]: null });
    setImagePreviews({ ...imagePreviews, [name]: null });
  };

  const uploadImage = async (imageFile) => {
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
  
    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      ); 
      return response.data.secure_url;
    } catch (error) {
      console.error('Image upload failed:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    const formDataObj = new FormData();
    
    // Append form data
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== undefined) {
        formDataObj.append(key, formData[key]);
      }
    });

    formDataObj.append('paymentStatus', paymentStatus);
    formDataObj.append('currentStatus', currentStatus);
  
    // Append files if any
    if (formData.adharFront) formDataObj.append('adharFrontFile', formData.adharFront);
    if (formData.adharBack) formDataObj.append('adharBackFile', formData.adharBack);
    if (formData.photo) formDataObj.append('photoFile', formData.photo);
  
    try {
      // Upload images and append URLs
      const adharFrontUrl = formData.adharFront ? await uploadImage(formData.adharFront) : '';
      const adharBackUrl = formData.adharBack ? await uploadImage(formData.adharBack) : '';
      const photoUrl = formData.photo ? await uploadImage(formData.photo) : '';
  
      formDataObj.append('adharFrontUrl', adharFrontUrl);
      formDataObj.append('adharBackUrl', adharBackUrl);
      formDataObj.append('photoUrl', photoUrl);
  
      // Submit the form data
      await axios.post('https://heavensmanagement.onrender.com/api/students', formDataObj, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Student Added Successfully');

      socket.emit('studentAdded');
  
      onRequestClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to add Student');
    }finally {
      setIsLoading(false); // Reset loading state
    }
  };
  
  
  
  

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Add Student"
      className="modal-addstd"
      overlayClassName="modal-overlay-addstd"
    >
      <button className="close-button" onClick={onRequestClose}><FaTimes /></button>
      <h4 style={{ marginBottom: '15px' }}>Add Student</h4>
      <form onSubmit={handleSubmit} className="modal-form-addstd">
        <div className="form-row-addstd">
          <div className="half-width">
            <label htmlFor="name">Name</label>
            <input id="name" type="text" name="name" placeholder="Name" onChange={handleChange} />
          </div>
          <div className="half-width">
            <label htmlFor="address">Address</label>
            <input id="address" type="text" name="address" placeholder="Address" onChange={handleChange} />
          </div>
        </div>
        <div className="form-row-addstd">
          <div className="half-width">
            <label htmlFor="contactNo">Contact No.</label>
            <input id="contactNo" type="text" name="contactNo" placeholder="Contact No." onChange={handleChange} />
          </div>
          <div className="half-width">
            <label htmlFor="email">Email id</label>
            <input id="email" type="email" name="email" placeholder="Email id" onChange={handleChange} />
          </div>
        </div>
        <div className="form-row-addstd">
          <div className="half-width">
            <label htmlFor="dateOfBirth">Date of Birth</label>
            <input id="dateOfBirth" type="date" name="dateOfBirth" onChange={handleChange} />
          </div>
          <div className="half-width">
            <label htmlFor="gender">Gender</label>
            <select id="gender" name="gender" onChange={handleChange}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Transgender">Transgender</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>
        </div>
        <div className="form-row-addstd">
          <div className="half-width">
            <label htmlFor="year">Select Year you are studying</label>
            <select id="year" name="year" value={formData.year} onChange={handleChange}>
              <option value="">Select Year</option>
              <option value="1st year">1st year</option>
              <option value="2nd year">2nd year</option>
              <option value="3rd year">3rd year</option>
              <option value="4th year">4th year</option>
              <option value="Working">Working</option>
            </select>
          </div>
        </div>
        <div className="form-row-addstd">
          <div className="half-width">
            <label htmlFor="workingPlace">If working , Where you are working</label>
            <input id="workingPlace" type="text" name="workingPlace" placeholder="Where you are working" onChange={handleChange} />
          </div>
        </div>
        <div className="form-row-addstd">
          <div className="half-width">
            <label htmlFor="bloodGroup">Blood Group</label>
            <input id="bloodGroup" type="text" name="bloodGroup" placeholder="Blood Group" onChange={handleChange} />
          </div>
          <div className="half-width">
            <label htmlFor="parentName">Parent Name</label>
            <input id="parentName" type="text" name="parentName" placeholder="Parent Name" onChange={handleChange} />
          </div>
        </div>
        <div className="form-row-addstd">
          <div className="half-width">
            <label htmlFor="parentOccupation">Parent Occupation</label>
            <input id="parentOccupation" type="text" name="parentOccupation" placeholder="Parent Occupation" onChange={handleChange} />
          </div>
        </div>

        <div className="form-row-addstd">
          <div className="half-width">
            <label htmlFor="parentNumber">Parent Number</label>
            <input id="parentNumber" type="text" name="parentNumber" placeholder="Parent Number" onChange={handleChange} />
          </div>
          <div className="half-width">
            <label htmlFor="course">Course</label>
            <input id="course" type="text" name="course" placeholder="Course" onChange={handleChange} />
          </div>
        </div>
        <div className="form-row-addstd">
        <div className="half-width">
          <label htmlFor="collegeName">College Name</label>
          <input id="collegeName" type="text" name="collegeName" placeholder="College Name" onChange={handleChange} />
        </div>
      </div>
        <div className="form-row-addstd">
          <div className="half-width">
            <label htmlFor="advanceFee">Refundable-Deposite</label>
            <input id="advanceFee" type="number" name="advanceFee" placeholder="Advance Fee" onChange={handleChange} />
          </div>
          <div className="half-width">
          <label htmlFor="nonRefundableDeposit">Non-Refundable Deposit</label>
          <input id="nonRefundableDeposit" type="number" name="nonRefundableDeposit" placeholder="Non-Refundable Deposit" onChange={handleChange} />
        </div> 
        </div>
        <div className="half-width">
            <label htmlFor="monthlyRent">Monthly Rent</label>
            <input id="monthlyRent" type="number" name="monthlyRent" placeholder="Monthly Rent" onChange={handleChange} />
          </div>
        <div className="form-row-addstd">
          <div className="half-width">
            <label htmlFor="adharFront">Adhar Front</label>
            <input id="adharFront" type="file" name="adharFront" onChange={handleFileChange} />
            {imagePreviews.adharFront && (
              <div className="image-preview-container">
                <img src={imagePreviews.adharFront} alt="Adhar Front Preview" className="image-preview" />
                <button type="button" className="remove-image-button" onClick={() => handleRemoveImage('adharFront')}>x</button>
              </div>
            )}
          </div>
          <div className="half-width">
            <label htmlFor="adharBack">Adhar Back</label>
            <input id="adharBack" type="file" name="adharBack" onChange={handleFileChange} />
            {imagePreviews.adharBack && (
              <div className="image-preview-container">
                <img src={imagePreviews.adharBack} alt="Adhar Back Preview" className="image-preview" />
                <button type="button" className="remove-image-button" onClick={() => handleRemoveImage('adharBack')}>x</button>
              </div>
            )}
          </div>
        </div>
        <div className="form-row-addstd">
          <div className="half-width">
            <label htmlFor="photo">Photo</label>
            <input id="photo" type="file" name="photo" onChange={handleFileChange} />
            {imagePreviews.photo && (
              <div className="image-preview-container">
                <img src={imagePreviews.photo} alt="Photo Preview" className="image-preview" />
                <button type="button" className="remove-image-button" onClick={() => handleRemoveImage('photo')}>x</button>
              </div>
            )}
          </div>
          <div className="half-width">
            <label htmlFor="hostelName">Hostel Name</label>
            <select id="hostelName" name="hostelName" value={formData.hostelName} onChange={handleChange}>
              <option value="">Select Hostel</option>
              {hostelNames.map((name, index) => (
                <option key={index} value={name}>{name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-row-addstd">
          <div className="half-width">
            <label htmlFor="roomType">Room Type</label>
            <select id="roomType" name="roomType" onChange={handleChange}>
              <option value="">Room Type</option>
              <option value="Single Sharing">Single Sharing</option>
              <option value="Double Sharing">Double Sharing</option>
              <option value="Four Sharing">Four Sharing</option>
              <option value="Six Sharing">Six Sharing</option>
            </select>
          </div>
          <div className="half-width">
            <label htmlFor="roomNo">Room No.</label>
            <input id="roomNo" type="text" name="roomNo" placeholder="Room No." onChange={handleChange} />
          </div>
        </div>
        <div className="form-row-addstd">
          <div className="half-width">
            <label htmlFor="referredBy">Referred By</label>
            <input id="referredBy" type="text" name="referredBy" placeholder="Referred By" onChange={handleChange} />
          </div>
          <div className="half-width">
            <label htmlFor="typeOfStay">Type of Stay</label>
            <select id="typeOfStay" name="typeOfStay" onChange={handleChange}>
              <option value="">Type of Stay</option>
              <option value="PG">PG</option>
              <option value="Hostel">Hostel</option>
            </select>
          </div>
        </div>
        <div className="form-row-addstd">
          <div className="half-width">
            <label htmlFor="paymentStatus">Payment Status</label>
            <select id="paymentStatus" value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
          <div className="half-width">
            <label htmlFor="currentStatus">Current Status</label>
            <select id="currentStatus" value={currentStatus} onChange={(e) => setCurrentStatus(e.target.value)}>
              <option value="Checked in">Checked in</option>
              <option value="Checked out">Checked out</option>
              <option value="Vacate">Vacate</option>
            </select>
          </div>
        </div>
        <div className="form-row-addstd">
          <div className="half-width">
            <label htmlFor="branch">Branch</label>
            <select id="branch" name="branch" onChange={handleChange}>
              <option value="">Select Branch</option>
              {branchOptions.map((branch, index) => (
                <option key={index} value={branch}>{branch}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Phase */}
        <div className="form-row-addstd">
          <div className="half-width">
            <label htmlFor="phase">Phase</label>
            <select id="phase" name="phase" onChange={handleChange}>
              <option value="">Select Phase</option>
              {phaseOptions.map((phase, index) => (
                <option key={index} value={phase}>{phase}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row-addstd">
          <div className="half-width">
            <label htmlFor="joinDate">Join Date</label>
            <input id="joinDate" type="date" name="joinDate" onChange={handleChange} />
          </div>
          <div className="half-width">
            <label htmlFor="password">Create a Password</label>
            <input id="password" type="password" name="password" placeholder="Create a Password" onChange={handleChange} />
          </div>
        </div>
        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? (
            <>
              <ClipLoader size={20} color="#ffffff" loading={isLoading} />
              <span style={{ marginLeft: '10px' }}>Submitting...</span>
            </>
          ) : (
            'Submit'
          )}
        </button>
      </form>
    </Modal>
  );
};

export default AddStudentModal;
