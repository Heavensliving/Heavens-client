import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './WardenDashboard.css'
import { FaPlus, FaUser, FaBuilding } from 'react-icons/fa';
import AddStudentModal from './AddStModal/AddStudentModal';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'; 
import { io } from 'socket.io-client';

const WardenDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalProperties, setTotalProperties] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const socket = io('http://localhost:5000');

    // Fetch the logged-in user's propertyName from localStorage
    const propertyName = localStorage.getItem('userPropertyName');

    const checkUserRole = () => {
      const userRole = localStorage.getItem('userRole');
      
      if (userRole !== 'property-manager') {
          navigate('/login');
      }
    };

    checkUserRole();

    // Fetch the initial total number of students based on propertyName
    const fetchStudents = async () => {
      try {
        // Fetch students where hostelName matches the propertyName
        const response = await axios.get(`http://localhost:5000/api/students/students-by-hostel/${propertyName}`);
        setTotalStudents(response.data.length);
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };

    // Fetch the total number of properties where propertyName matches
    const fetchProperties = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/properties/get-properties');
        const properties = response.data;
        const matchingProperties = properties.filter(property => property.propertyName === propertyName);
        setTotalProperties(matchingProperties.length); // Set the count of matching properties
      } catch (error) {
        console.error('Error fetching properties data:', error);
      }
    };

    fetchStudents();
    fetchProperties();

    // Listen for the update event and fetch the updated student list
    socket.on('update', () => {
      fetchStudents();
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleAddStudent = () => {
    setIsModalOpen(true);
  };

  const handleAddStaff = () => {
    navigate('/add-staff');
  };

  return (
    <>
      <h3 className='DashSection-title'>Dashboard</h3>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover style={{zIndex:"222222222"}} />
      <div className='DashSection-container'>
        <div className='DashSection-left'>
          <div className='DashSection-box'>
            <h4>Total Properties</h4>
            <p style={{color:'goldenrod'}}>{totalProperties}</p>
          </div>
          <div className='DashSection-box'>
            <h4>Total Students</h4>
            <p style={{color:'rebeccapurple'}}>{totalStudents}</p>
          </div>
          <div className='DashSection-box'>
            <h4>Total Staff</h4>
            <p style={{color:'green'}}>0</p>
          </div>
          <div className='DashSection-actions'>
            <button className='DashSection-button' onClick={handleAddStudent}>
              <div className='DashSection-button-icon'><FaUser /></div>
              <span>Add Student</span>
            </button>
            <button className='DashSection-button' onClick={handleAddStaff}>
              <div className='DashSection-button-icon'><FaPlus /></div>
              <span>Add Staff</span>
            </button>
          </div>
        </div>

        <div className='DashSection-right'>
          <div className='DashSection-alert'>
            <h4 style={{textAlign:'center'}}>Maintenance Alert</h4>
            <div className='DashSection-alert-content'>
              <div className='DashSection-alert-box'>
                <div className='alert-avatar'>
                  <i className='bx bx-bell'></i>
                </div>
                <div className='alert-info'>
                  <h5>Alert 1</h5>
                  <p>Scheduled maintenance on 12th Aug.</p>
                </div>
              </div>
              <div className='DashSection-alert-box'>
                <div className='alert-avatar'>
                  <i className='bx bx-bell'></i>
                </div>
                <div className='alert-info'>
                  <h5>Alert 2</h5>
                  <p>Power outage expected on 15th Aug.</p>
                </div>
              </div>
              <div className='DashSection-alert-box'>
                <div className='alert-avatar'>
                  <i className='bx bx-bell'></i>
                </div>
                <div className='alert-info'>
                  <h5>Alert 3</h5>
                  <p>Water supply interruption on 18th Aug.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddStudentModal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default WardenDashboard;
