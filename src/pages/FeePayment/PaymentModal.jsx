import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './PaymentModal.css';

const PaymentModal = ({ isOpen, onClose }) => {
  const initialFormData = {
    name: '',
    studentId: '',
    hostelId: '',
    hostelName: '',
    transactionId: '',
    monthYear: '',
    paidDate: '',
    rentAmount: '',
    waveOff: '',
    waveOffReason: '',
    totalAmount: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [monthYearOptions, setMonthYearOptions] = useState([]);

  useEffect(() => {
    if (isOpen) {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth(); // Get month as a number (0-11)
      const day = String(currentDate.getDate()).padStart(2, '0');
      const localDate = `${year}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${day}`;

      // Format month as month name
      const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(currentDate);
      const monthYear = `${monthName}-${year}`;

      setFormData(prevData => ({
        ...prevData,
        paidDate: localDate,
        monthYear: monthYear
      }));

      // Check if payment for the current month already exists
      checkPaymentExistence(monthYear);
    }
  }, [isOpen]);

  const checkPaymentExistence = (monthYear) => {
    fetch(`https://heavensmanagement.onrender.com/api/payments/check-payment/${monthYear}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (data.exists) {
          toast.warn('Payment has already been done for this month.');
        }
      })
      .catch(error => console.error('Error checking payment existence:', error));
  };

  const clearForm = () => {
    setFormData(initialFormData);
    setMonthYearOptions([]);
  };

  const fetchHostelId = (hostelName) => {
    if (hostelName) {
      fetch(`https://heavensmanagement.onrender.com/api/properties/property-name/${encodeURIComponent(hostelName)}`)
        .then(response => {
          if (!response.ok) {
            return response.json().then(err => { throw new Error(err.message); });
          }
          return response.json();
        })
        .then(data => {
          if (data && data.uniquepropertyId) {
            setFormData(prevData => ({
              ...prevData,
              hostelId: data.uniquepropertyId
            }));
          } else {
            console.error('Unique Property ID not found for this property name');
          }
        })
        .catch(error => console.error('Error fetching hostel ID:', error.message));
    } else {
      console.error('Hostel name is empty');
    }
  };

  const fetchStudentDetails = () => {
    if (formData.studentId) {
      fetch(`https://heavensmanagement.onrender.com/api/students/student-id/${formData.studentId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          console.log("Fetched student data:", data);
          setFormData(prevData => ({
            ...prevData,
            name: data.name,
            hostelName: data.hostelName,
            rentAmount: data.monthlyRent,
            totalAmount: data.monthlyRent // Initially, totalAmount is the rent amount
          }));
          
          if (data.hostelName) {
            console.log("Calling fetchHostelId with:", data.hostelName);
            fetchHostelId(data.hostelName);
          } else {
            console.error("No hostelName found in fetched data");
          }

          // Generate month-year options
          if (data.joinDate) {
            generateMonthYearOptions(data.joinDate);
          } else {
            console.error("No joinDate found in fetched data");
          }
        })
        .catch(error => console.error('Error fetching student data:', error));
    } else {
      console.error('Student ID is empty');
    }
  };

  const generateMonthYearOptions = (joinDate) => {
    const options = [];
    const joinDateObj = new Date(joinDate);
    const currentDate = new Date();

    while (joinDateObj <= currentDate) {
      const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(joinDateObj);
      const year = joinDateObj.getFullYear();
      options.push(`${monthName}-${year}`);

      // Increment to the next month
      joinDateObj.setMonth(joinDateObj.getMonth() + 1);
    }

    setMonthYearOptions(options);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'waveOff') {
      const waveOffValue = parseFloat(value) || 0;
      const rentAmount = parseFloat(formData.rentAmount) || 0;

      // Ensure wave off doesn't exceed rent amount
      if (waveOffValue > rentAmount) {
        alert("Wave Off amount cannot exceed the Rent Amount");
        return;
      }

      // Calculate totalAmount based on waveOff
      setFormData(prevData => ({
        ...prevData,
        waveOff: value,
        totalAmount: (rentAmount - waveOffValue).toFixed(2)
      }));
    } else {
      setFormData(prevData => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('https://heavensmanagement.onrender.com/api/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(response => response.json())
      .then(data => {
        if (data.message === 'Payment successful') {
          toast.success('Payment successful!');
          clearForm(); // Clear the form after successful submission
          onClose(); // Close the modal after successful submission
        } else if (data.message === 'Transaction ID already exists') {
          toast.error('Transaction ID already exists');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        toast.error('Payment failed: ' + error.message);
      });
  };

  const handleClose = () => {
    clearForm(); // Clear the form when the modal is closed
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className='payfeesection-modal-overlay'>
      <div className='payfeesection-modal-content'>
        <button className='payfeesection-close-icon' onClick={handleClose}>&times;</button>
        <h2>Pay Fee</h2>
        <form onSubmit={handleSubmit}>
          <div className='payfeesection-form-row'>
            <div className='payfeesection-form-field'>
              <label>Name:</label>
              <input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleChange}
                disabled
                required
              />
            </div>
            <div className='payfeesection-form-field' style={{marginLeft:'20px'}}>
              <label>Student ID:</label>
              <input
                type='text'
                name='studentId'
                value={formData.studentId}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className='payfeesection-form-row'>
            <div className='payfeesection-form-field'>
              <label>Hostel ID:</label>
              <input
                type='text'
                name='hostelId'
                value={formData.hostelId}
                onChange={handleChange}
                disabled
                required
              />
            </div>
            <div className='payfeesection-form-field' style={{marginLeft:'20px'}}>
              <label>Hostel Name:</label>
              <input
                type='text'
                name='hostelName'
                value={formData.hostelName}
                onChange={handleChange}
                disabled
                required
              />
            </div>
          </div>
          <div className='payfeesection-form-row'>
            <div className='payfeesection-form-field'>
              <label>Transaction ID:</label>
              <input
                type='text'
                name='transactionId'
                value={formData.transactionId}
                onChange={handleChange}
                required
              />
            </div>
            <div className='payfeesection-form-field' style={{marginLeft:'20px'}}>
              <label>Month with Year:</label>
              <select
                name='monthYear'
                value={formData.monthYear}
                onChange={handleChange}
                required
              >
                <option value=''>Select Month and Year</option>
                {monthYearOptions.map((option, index) => (
                  <option key={index} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
          <div className='payfeesection-form-row'>
            <div className='payfeesection-form-field'>
              <label>Payment Date:</label>
              <input
                type='date'
                name='paidDate'
                value={formData.paidDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className='payfeesection-form-field' style={{marginLeft:'20px'}}>
              <label>Rent Amount:</label>
              <input
                type='text'
                name='rentAmount'
                value={formData.rentAmount}
                disabled  // Make the field non-editable
                required
              />
            </div>
          </div>
          <div className='payfeesection-form-row'>
            <div className='payfeesection-form-field'>
              <label>Wave Off:</label>
              <input
                type='text'
                name='waveOff'
                value={formData.waveOff}
                onChange={handleChange}
              />
            </div>
            <div className='payfeesection-form-field' style={{marginLeft:'20px'}}>
              <label>Wave Off Reason:</label>
              <input
                type='text'
                name='waveOffReason'
                value={formData.waveOffReason}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className='payfeesection-form-row'>
            <div className='payfeesection-form-field'>
              <label>Total Amount:</label>
              <input
                type='text'
                name='totalAmount'
                value={formData.totalAmount}
                disabled  // Make the field non-editable
                required
              />
            </div>
          </div>
          <div className='payfeesection-button-row'>
            <button type='submit'>Pay</button>
            <button type='button' onClick={fetchStudentDetails}>Fetch</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Ensure to configure toast container at the top level of your app
export default PaymentModal;
