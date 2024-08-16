import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './StudentManagement.css';
import io from 'socket.io-client';
import { ToastContainer } from 'react-toastify';

const socket = io.connect('https://heavensmanagement.onrender.com');

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [sortOption, setSortOption] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [searchStudentId, setSearchStudentId] = useState('');
  const [studentInfo, setStudentInfo] = useState({ name: '', password: '' });

  useEffect(() => {
    fetchStudents();
  
    // Listening to socket events to refresh data
    socket.on('update', fetchStudents);
  
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'm') {
        e.preventDefault();
        setIsPopupOpen(true);
      }
    };
  
    window.addEventListener('keydown', handleKeyDown);
  
    return () => {
      socket.off('update', fetchStudents);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [sortOption, searchQuery]);
  
  const fetchStudents = async () => {
    try {
      const response = await fetch('https://heavensmanagement.onrender.com/api/students');
      const data = await response.json();
  
      // Filter students with current status 'Checked in' or 'Checked out'
      let filteredStudents = data.filter(
        (student) => student.currentStatus === 'Checked in' || student.currentStatus === 'Checked out'
      );
  
      let sortedStudents = filteredStudents;
  
      switch (sortOption) {
        case 'Hostel':
          sortedStudents = filteredStudents.sort((a, b) => a.hostelName.localeCompare(b.hostelName));
          break;
        case 'Payment_Pending':
          sortedStudents = filteredStudents.filter(student => student.paymentStatus === 'Pending');
          break;
        case 'Payment_paid':
          sortedStudents = filteredStudents.filter(student => student.paymentStatus === 'Paid');
          break;
        case 'First_year':
          sortedStudents = filteredStudents.filter(student => student.year === '1st year');
          break;
        case 'Second_year':
          sortedStudents = filteredStudents.filter(student => student.year === '2nd year');
          break;
        case 'third_year':
          sortedStudents = filteredStudents.filter(student => student.year === '3rd year');
          break;
        case 'fourth_year':
          sortedStudents = filteredStudents.filter(student => student.year === '4th year');
          break;
        case 'Working':
          sortedStudents = filteredStudents.filter(student => student.year === 'Working');
          break;
        case 'status_in':
          sortedStudents = filteredStudents.filter(student => student.currentStatus === 'Checked in');
          break;
        case 'status_out':
          sortedStudents = filteredStudents.filter(student => student.currentStatus === 'Checked out');
          break;
        default:
          sortedStudents = filteredStudents.sort((a, b) => a.name.localeCompare(b.name));
          break;
      }
  
      if (searchQuery) {
        sortedStudents = sortedStudents.filter(student =>
          student.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
  
      setStudents(sortedStudents);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };
  
  


  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
    setSearchStudentId('');
    setStudentInfo({ name: '', password: '' });
  };

  const handleSearchStudentIdChange = (e) => {
    setSearchStudentId(e.target.value);
  };

  const handleSearch = () => {
    if (searchStudentId) {
      const student = students.find(student => student.studentId === searchStudentId);
      if (student) {
        // Display student name and password
        setStudentInfo({ name: student.name, password: student.password }); // Assuming password is available as a field
      } else {
        alert('Student not found');
        setStudentInfo({ name: '', password: '' });
      }
    }
  
  };

  return (
    <div className='StudentManagement-container'>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <div className='StudentManagement-header'>
        <h4 className='StudentManagement-title'>Student Management</h4>
        <select className='StudentManagement-sort' onChange={handleSortChange} value={sortOption}>
          <option value="all">Sort By All</option>
          <option value="Payment_Pending">Sort By Payment Pending</option>
          <option value="Payment_paid">Sort By Payment Paid</option>
          <option value="status_in">Sort By Students In</option>
          <option value="status_out">Sort By Students out</option>
          <option value="First_year">Sort By 1st year</option>
          <option value="Second_year">Sort By 2nd year</option>
          <option value="third_year">Sort By 3rd year</option>
          <option value="fourth_year">Sort By 4th year</option>
          <option value="Working">Sort By working</option>
        </select>
      </div>
      <div className='StudentManagement-search-bar'>
        <input
          type="text"
          placeholder="Search by student name..."
          value={searchQuery}
          onChange={handleSearchChange}
          className='StudentManagement-search-input'
        />
      </div>
      <div className='StudentManagement-boxes-wrapper'>
        <div className='StudentManagement-boxes'>
          {students.length === 0 ? (
            <div className='no-students-found'>No student found</div>
          ) : (
            students.map(student => (
              <Link key={student._id} to={`/student/${student._id}`} className='box'>
                <div className='box-content'>
                  <div className='avatar-name'>
                    <div className='avatar'>
                      <img src={student.photo} alt={`${student.name}'s photo`} />
                    </div>
                    <div className='name-hostel'>
                      <div className='name'>{student.name}</div>
                      <div className='hostel'>{student.hostelName}</div>
                      <div className='hostel-id'>{student.studentId}</div>
                    </div>
                  </div>
                  <div className='details'>
                    <div className='detail-item'>
                      <span>Room Number</span>
                      <div className='detail-item-value' style={{color:'violet'}}>{student.roomNo}</div>
                    </div>
                    <div className='detail-item'>
                      <span>Payment Status</span>
                      <div className='detail-item-value' style={{color:'goldenrod'}}>{student.paymentStatus}</div>
                    </div>
                    <div className='detail-item'>
                      <span>Current Status</span>
                      <div className='detail-item-value' style={{color:'green'}}>{student.currentStatus}</div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {isPopupOpen && (
        <div className='popup'>
          <div className='popup-content'>
            <h4>Enter Student ID</h4>
            <input
              type='text'
              placeholder='Enter student ID'
              value={searchStudentId}
              onChange={handleSearchStudentIdChange}
              className='popup-input'
            />
            <button onClick={handleSearch} className='popup-button'>Search</button>
            <button onClick={handlePopupClose} className='popup-close-button'>Close</button>
            {studentInfo.name && (
              <div className='student-info'>
                <h5>Name: {studentInfo.name}</h5>
                <h5>Password:</h5>
                <p>{studentInfo.password}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentManagement;
