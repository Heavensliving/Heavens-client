import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './StudentDetail.css';
import { toast, ToastContainer } from 'react-toastify';


const StudentDetail = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [payments, setPayments] = useState([]);
  const [modalImage, setModalImage] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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
    monthlyRent: '',
    hostelName: '',
    roomType: '',
    roomNo: '',
    referredBy: '',
    typeOfStay: '',
    joinDate: '',
    dateOfBirth: '',
    gender: '',
    year: '',
    collegeName: '',
    parentOccupation: '',
    workingPlace: '',
    branch: '',
    phase: '',
    nonRefundableDeposit: '',
    currentStatus: ''
  });

  const navigate = useNavigate();


  useEffect(() => {
    const fetchStudentDetail = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/students/${id}`);
        const data = await response.json();
        setStudent(data);
        setFormData({
          name: data.name || '',
          address: data.address || '',
          contactNo: data.contactNo || '',
          email: data.email || '',
          bloodGroup: data.bloodGroup || '',
          parentName: data.parentName || '',
          parentNumber: data.parentNumber || '',
          course: data.course || '',
          advanceFee: data.advanceFee || '',
          monthlyRent: data.monthlyRent || '',
          hostelName: data.hostelName || '',
          roomType: data.roomType || '',
          roomNo: data.roomNo || '',
          referredBy: data.referredBy || '',
          typeOfStay: data.typeOfStay || '',
          joinDate: data.joinDate ? data.joinDate.split('T')[0] : '', // format date
          dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : '', // format date
          gender: data.gender || '',
          year: data.year || '',
          collegeName: data.collegeName || '',
          parentOccupation: data.parentOccupation || '',
          workingPlace: data.workingPlace || '',
          branch: data.branch || '',
          phase: data.phase || '',
          nonRefundableDeposit: data.nonRefundableDeposit || '', // Added field
          currentStatus: data.currentStatus || '' 
        });
        console.log('Selected Student ID:', data.studentId);

      const paymentResponse = await fetch(`http://localhost:5000/api/payments/payments/${data.studentId}`);
      const paymentData = await paymentResponse.json();
      setPayments(Array.isArray(paymentData) ? paymentData : []);

      const sortedPayments = Array.isArray(paymentData) ? paymentData.sort((a, b) => new Date(b.paidDate) - new Date(a.paidDate)) : [];
      setPayments(sortedPayments);
      } catch (error) {
        console.error('Error fetching student details:', error);
      }
    };

    fetchStudentDetail();
  }, [id]);

  const openImageModal = (imageUrl) => {
    setModalImage(imageUrl);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setModalImage(null);
  };

  const openEditModal = () => {
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/students/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    });
        const result = await response.json();
        if (response.ok) {
            setStudent(result);
            closeEditModal();
            toast.success("Updated Successfully!");
        } else {
            console.error('Error updating student:', result.error);
            alert(`Error: ${result.error}`);
        }
    } catch (error) {
        console.error('Error updating student:', error);
        alert(`Error: ${error.message}`);
    }
};

  

  if (!student) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className='StudentDetail-container'>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        <div className='StudentDetail-header'>
          <img
            src={student.photo}
            alt={`${student.name}'s photo`}
            style={{ cursor: 'pointer' }}
            onClick={() => openImageModal(student.photo)}
          />
          <div className='StudentDetail-info'>
            <div className='StudentDetail-name'>
              <h3>{student.name}</h3>
              <button className='edit-button' onClick={openEditModal}>Edit</button>
            </div>
            <p style={{ fontSize: '13px' }}>{student.studentId}</p>
            <p style={{ fontSize: '13px' }}>{student.hostelName}</p>
            <p style={{ fontSize: '13px' }}>Room Number: {student.roomNo}</p>
          </div>
        </div>
        <div className='StudentDetail-details'>
          <p>Address:</p>
          <span style={{ color: '#555', fontSize: '14px' }}>{student.address}</span>
          <div className='StudentDetail-details-row'>
            <p>Email Id: <span>{student.email}</span></p>
            <p>Blood Group: <span>{student.bloodGroup}</span></p>
          </div>
          <div className='StudentDetail-details-row'>
            <p>Course: <span>{student.course}</span></p>
            <p>Date of Birth: <span>{formatDate(student.dateOfBirth)}</span></p>
          </div>
          <p style={{ fontSize: '14px' }}>College Name: <span style={{ color: '#555', fontSize: '14px',fontWeight:'400'}}>{student.collegeName}</span></p>
          <div className='StudentDetail-details-row'>
            <p>Year: <span>{student.year}</span></p>
            <p>Gender: <span>{student.gender}</span></p>
          </div>
          <div className='StudentDetail-details-row'>
            <p>Parent Name: <span>{student.parentName}</span></p>
            <p>Parent Number: <span>{student.parentNumber}</span></p>
          </div>
          <div className='StudentDetail-details-row'>
            <p>Parent Occupation: <span>{student.parentOccupation}</span></p>
            <p>Room Type: <span>{student.roomType}</span></p>
          </div>
          <div className='StudentDetail-details-row'>
            <p>Type of Stay: <span>{student.typeOfStay}</span></p>
            <p>Join Date: <span>{formatDate(student.joinDate)}</span></p>
          </div>
          <div className='StudentDetail-details-row'>
            <p>Working Place: <span>{student.workingPlace}</span></p>
          </div>
          <div className='StudentDetail-proof'>
            <h3>ID Proof</h3>
            <div className='StudentDetail-proof-images'>
              <img
                src={student.adharFrontImage}
                alt="Aadhaar Front"
                className='proof-image'
                onClick={() => openImageModal(student.adharFrontImage)}
              />
              <img
                src={student.adharBackImage}
                alt="Aadhaar Back"
                className='proof-image'
                onClick={() => openImageModal(student.adharBackImage)}
              />
            </div>
          </div>
          <div className='StudentDetail-details-row'>
            <p>Advance Paid: <span>{student.advanceFee}</span></p>
            <p>Monthly Rent: <span>{student.monthlyRent}</span></p>
          </div>
          <div className='StudentDetail-details-row'>
            <p>Referred By: <span>{student.referredBy}</span></p>
            <p>Current Status: <span style={{ color: 'green' }}>{student.currentStatus}</span></p>
          </div>
          <div className='StudentDetail-details-row1'>
          <button className='delete-button' style={{width:'60%'}}>Vacate User</button>
          </div>
        </div>
      </div>
      <section>
            <div className='Payment-container-student'>
              <div className='payment-history-title'>Payment History</div>
              <div className='payment-history' style={{cursor:'pointer'}}>
                {payments.length === 0 ? (
                  <p>No payments found for this student.</p>
                ) : (
                  payments.map(payment => (
                    <div className='payment-history-item' key={payment._id}>
                      <div className='payment-avatar'>✓</div>
                      <div className='payment-details'>
                        <p className='payment-id' style={{fontSize:'12px'}}>Payment ID: {payment.transactionId}</p>
                        <p className='payment-month-year' style={{fontWeight:'600',color:'green'}}>{payment.monthYear}</p>
                        <p className='payment-date' style={{fontSize:'12px'}}>Date of Payment: <span style={{fontWeight:'600'}}>{formatDate(payment.paidDate)}</span></p>
                      </div>
                      <div className='payment-status'>
                        <div className='status-paid'>Paid</div>
                      </div>
                      <div className='tooltip'>
                      <p><strong>Payment ID:</strong> {payment.transactionId}</p>
                      <p><strong>Month/Year:</strong> {payment.monthYear}</p>
                      <p><strong>Date of Payment:</strong> {formatDate(payment.paidDate)}</p>
                      <p><strong>Amount:</strong> ₹ {payment.totalAmount}</p>
                      <p><strong>WaveOff:</strong> {payment.waveOff}</p>
                      {/* Add more details as needed */}
                    </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

      {isImageModalOpen && (
        <div className='modal-overlay image-modal-overlay' onClick={closeImageModal}>
          <div className='modal-content image-modal-content'>
            <img src={modalImage} alt="Modal" className='modal-image' />
            <button className='modal-close' onClick={closeImageModal}>Close</button>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className='modal-overlay edit-modal-overlay'>
          <div className='modal-content edit-modal-content'>
            <h2>Edit Student Details</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Name:
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
              </label>
              <label>
                Address:
                <input type="text" name="address" value={formData.address} onChange={handleInputChange} />
              </label>
              <label>
                Contact No:
                <input type="text" name="contactNo" value={formData.contactNo} onChange={handleInputChange} />
              </label>
              <label>
                Email:
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} />
              </label>
              <label>
                Blood Group:
                <input type="text" name="bloodGroup" value={formData.bloodGroup} onChange={handleInputChange} />
              </label>
              <label>
                Parent Name:
                <input type="text" name="parentName" value={formData.parentName} onChange={handleInputChange} />
              </label>
              <label>
                Parent Number:
                <input type="text" name="parentNumber" value={formData.parentNumber} onChange={handleInputChange} />
              </label>
              <label>
                Course:
                <input type="text" name="course" value={formData.course} onChange={handleInputChange} />
              </label>
              <label>
                Refundable Deposite:
                <input type="number" name="advanceFee" value={formData.advanceFee} onChange={handleInputChange} />
              </label>
              <label>
                Non-Refundable Deposit:
                <input type="number" name="nonRefundableDeposit" value={formData.nonRefundableDeposit} onChange={handleInputChange} />
              </label>
              <label>
                Monthly Rent:
                <input type="number" name="monthlyRent" value={formData.monthlyRent} onChange={handleInputChange} />
              </label>
              <label>
                Hostel Name:
                <input type="text" name="hostelName" value={formData.hostelName} onChange={handleInputChange} />
              </label>
              <label>
                Room Type:
                <input type="text" name="roomType" value={formData.roomType} onChange={handleInputChange} />
              </label>
              <label>
                Room No:
                <input type="text" name="roomNo" value={formData.roomNo} onChange={handleInputChange} />
              </label>
              <label>
                Referred By:
                <input type="text" name="referredBy" value={formData.referredBy} onChange={handleInputChange} />
              </label>
              <label>
                Type of Stay:
                <input type="text" name="typeOfStay" value={formData.typeOfStay} onChange={handleInputChange} />
              </label>
              <label>
                Join Date:
                <input type="date" name="joinDate" value={formData.joinDate} onChange={handleInputChange} />
              </label>
              <label>
                Date of Birth:
                <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} />
              </label>
              <label>
                Gender:
                <input type="text" name="gender" value={formData.gender} onChange={handleInputChange} />
              </label>
              <label>
                Year:
                <input type="text" name="year" value={formData.year} onChange={handleInputChange} />
              </label>
              <label>
                College Name:
                <input type="text" name="collegeName" value={formData.collegeName} onChange={handleInputChange} />
              </label>
              <label>
                Parent Occupation:
                <input type="text" name="parentOccupation" value={formData.parentOccupation} onChange={handleInputChange} />
              </label>
              <label>
                Working Place:
                <input type="text" name="workingPlace" value={formData.workingPlace} onChange={handleInputChange} />
              </label>
              <label>
                Current Status:
                <select name="currentStatus" value={formData.currentStatus} onChange={handleInputChange}>
                  <option value="">Select Status</option>
                  <option value="Checked in">Checked in</option>
                  <option value="Checked out">Checked out</option>
                  <option value="Vacate">Vacate</option>
                  {/* Add more options as needed */}
                </select>
              </label>
              <label>
                Branch:
                <input type="text" name="branch" value={formData.branch} onChange={handleInputChange} />
              </label>
              <label>
                Phase:
                <input type="text" name="phase" value={formData.phase} onChange={handleInputChange} />
              </label>
              
              <button type="submit">Save Changes</button>
              <button type="button" onClick={closeEditModal}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentDetail;
