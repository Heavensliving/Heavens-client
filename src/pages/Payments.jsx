import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PaymentModal from './FeePayment/PaymentModal';
import ExpenseModal from './Expense modal/ExpenseModal';
import { ToastContainer, toast } from 'react-toastify';
import { FaDollarSign, FaCalendarAlt, FaArrowUp, FaArrowDown, FaFileInvoiceDollar, FaBalanceScale, FaMoneyCheck, FaRegMoneyBillAlt } from 'react-icons/fa';
import './Payments.css';

const Payments = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [sortOption, setSortOption] = useState('');
  const [students, setStudents] = useState([]);
  const [totalAdvanceAmount, setTotalAdvanceAmount] = useState(0);
  const [totalMonthlyAmount, setTotalMonthlyAmount] = useState(0);
  const [balanceAmount, setBalanceAmount] = useState(0);
  const [nonRefundableDepositAmount, setNonRefundableDepositAmount] = useState(0);
  const [totalReceivedAmount, setTotalReceivedAmount] = useState(0);
  const [totalWaveOffAmount, setTotalWaveOffAmount] = useState(0);
  const [totalExpenseAmount, setTotalExpenseAmount] = useState(0);

  useEffect(() => {
    fetchStudents();
    fetchTotalReceivedAmount();
    fetchTotalWaveOffAmount(); // Fetch total wave-off amount from the backend
    fetchTotalExpenseAmount();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/students');
      const studentData = response.data;
      setStudents(studentData);
      calculateTotals(studentData);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchTotalReceivedAmount = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/payments/totalReceivedAmount');
      const totalReceived = response.data.totalAmount;
      setTotalReceivedAmount(totalReceived);
    } catch (error) {
      console.error('Error fetching total received amount:', error);
    }
  };

  const fetchTotalWaveOffAmount = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/payments/totalWaveOff');
      const totalWaveOff = response.data.totalWaveOff;
      setTotalWaveOffAmount(totalWaveOff);
    } catch (error) {
      console.error('Error fetching total wave-off amount:', error);
    }
  };

  const fetchTotalExpenseAmount = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/total-expense'); // Adjust URL as needed
      const totalExpense = response.data.totalAmount;
      setTotalExpenseAmount(totalExpense);
    } catch (error) {
      console.error('Error fetching total expense amount:', error);
    }
  };


  const calculateTotals = (students) => {
    const filteredStudents = students.filter(student => student.currentStatus === 'Checked in' || student.currentStatus === 'Checked out');
    
    const advanceAmountTotal = filteredStudents.reduce((sum, student) => {
      return sum + (parseFloat(student.advanceFee) || 0);
    }, 0);

    const monthlyAmountTotal = filteredStudents.reduce((sum, student) => {
      return sum + (parseFloat(student.monthlyRent) || 0);
    }, 0);

    const nonRefundableDepositTotal = filteredStudents.reduce((sum, student) => {
      return sum + (parseFloat(student.nonRefundableDeposit) || 0); 
    }, 0);

    const totalDueAmount = advanceAmountTotal + monthlyAmountTotal;
    const calculatedBalanceAmount = totalDueAmount - totalReceivedAmount;

    setTotalAdvanceAmount(advanceAmountTotal);
    setTotalMonthlyAmount(monthlyAmountTotal);
    setBalanceAmount(calculatedBalanceAmount);
    setNonRefundableDepositAmount(nonRefundableDepositTotal);
  };

  const handleDelete = async (studentId) => {
    try {
      await axios.delete(`http://localhost:5000/api/students/${studentId}`);
      toast.success('Student data deleted successfully!');
      fetchStudents(); 
    } catch (error) {
      console.error('Error deleting student:', error);
      toast.error('Error deleting student data.');
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenExpenseModal = () => {
    setIsExpenseModalOpen(true);
  };

  const handleCloseExpenseModal = () => {
    setIsExpenseModalOpen(false);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <div className='Payments-container'>
        <h4 className='PaymentSection-title'>Payments</h4>
        <div className='button-container'>
          <button className='add-expense-button' onClick={handleOpenExpenseModal}>Add Expense</button>
          <button className='pay-fee-button' onClick={handleOpenModal}>Pay Fee</button>
        </div>
      </div>
      <div className='moneymanagementdash-section'>
        <div className='moneymanagementdash-header'>
          <h4 className='moneymanagementdash-title'>All Property</h4>
          <select className='moneymanagementdash-sort' value={sortOption} onChange={handleSortChange}>
            <option value="">Sort By</option>
            <option value="totalAmount">Current month</option>
            <option value="monthlyRent">Monthly Rent</option>
            <option value="advanceAmount">Advance Amount</option>
            <option value="pendingAmount">Pending Amount</option>
            <option value="expense">Expense</option>
            <option value="balanceAmount">Balance Amount</option>
          </select>
        </div>

        {/* First Section: Total Income, Expense, Profit */}
        <div className='moneymanagementdash-container'>
          <div className='moneymanagementdash-boxes'>
            <div className='moneymanagementdash-box' style={{ backgroundColor: '#d1e7dd' }}>
              <FaDollarSign className='moneymanagementdash-icon' />
              <div className='moneymanagementdash-box-content'>
                <p className='moneymanagementdash-box-title'>Total Income</p>
                <p className='moneymanagementdash-box-amount'>₹{(nonRefundableDepositAmount + totalMonthlyAmount + totalAdvanceAmount).toFixed(2)}</p>
              </div>
            </div>
            <div className='moneymanagementdash-box' style={{ backgroundColor: '#fff3e0' }}>
              <FaFileInvoiceDollar className='moneymanagementdash-icon' />
              <div className='moneymanagementdash-box-content'>
                <p className='moneymanagementdash-box-title'>Total Expense</p>
                <p className='moneymanagementdash-box-amount'>₹{totalExpenseAmount.toFixed(2)}</p>
              </div>
            </div>
            <div className='moneymanagementdash-box' style={{ backgroundColor: '#d9f9d9' }}>
              <FaBalanceScale className='moneymanagementdash-icon' />
              <div className='moneymanagementdash-box-content'>
                <p className='moneymanagementdash-box-title'>Profit</p>
                <p className='moneymanagementdash-box-amount'>₹{(totalReceivedAmount - totalExpenseAmount).toFixed(2)}</p>
              </div>
            </div>
          </div><br></br><hr></hr>

          {/* Second Section: Refundable and Non-Refundable Deposit */}
          <div className='moneymanagementdash-boxes' style={{marginTop:'20px'}}>
            <div className='moneymanagementdash-box' style={{ backgroundColor: '#e0f7fa' }}>
              <FaArrowUp className='moneymanagementdash-icon' />
              <div className='moneymanagementdash-box-content'>
                <p className='moneymanagementdash-box-title'>Refundable Deposit</p>
                <p className='moneymanagementdash-box-amount'>₹{totalAdvanceAmount.toFixed(2)}</p>
              </div>
            </div>
            <div className='moneymanagementdash-box' style={{ backgroundColor: '#fce4ec' }}>
              <FaArrowUp className='moneymanagementdash-icon' />
              <div className='moneymanagementdash-box-content'>
                <p className='moneymanagementdash-box-title'>Non-Refundable Deposit</p>
                <p className='moneymanagementdash-box-amount'>₹{nonRefundableDepositAmount.toFixed(2)}</p>
              </div>
            </div>
          </div><br></br><hr></hr>

          {/* Third Section: Monthly Rent, Received Amount, Pending Amount */}
          <div className='moneymanagementdash-boxes' style={{marginTop:'20px'}}>
            <div className='moneymanagementdash-box' style={{ backgroundColor: '#d9f9d9' }}>
              <FaCalendarAlt className='moneymanagementdash-icon' />
              <div className='moneymanagementdash-box-content'>
                <p className='moneymanagementdash-box-title'>Monthly Rent</p>
                <p className='moneymanagementdash-box-amount'>₹{totalMonthlyAmount.toFixed(2)}</p>
              </div>
            </div>
            <div className='moneymanagementdash-box' style={{ backgroundColor: '#fff9c4' }}>
              <FaRegMoneyBillAlt className='moneymanagementdash-icon' />
              <div className='moneymanagementdash-box-content'>
                <p className='moneymanagementdash-box-title'>Received Amount</p>
                <p className='moneymanagementdash-box-amount'>₹{totalReceivedAmount.toFixed(2)}</p>
              </div>
            </div>
            <div className='moneymanagementdash-box' style={{ backgroundColor: '#fff3e0' }}>
              <FaArrowDown className='moneymanagementdash-icon' />
              <div className='moneymanagementdash-box-content'>
                <p className='moneymanagementdash-box-title'>Pending Amount</p>
                <p className='moneymanagementdash-box-amount'>₹{(totalMonthlyAmount - totalReceivedAmount - totalWaveOffAmount).toFixed(2)}</p>
              </div>
            </div>
          </div><br></br><hr></hr>

          {/* Fourth Section: Total Expense and Waive Off */}
          <div className='moneymanagementdash-boxes' style={{marginTop:'20px'}}>
            <div className='moneymanagementdash-box' style={{ backgroundColor: '#e1bee7' }}>
              <FaMoneyCheck className='moneymanagementdash-icon' />
              <div className='moneymanagementdash-box-content'>
                <p className='moneymanagementdash-box-title'>Expense</p>
                <p className='moneymanagementdash-box-amount'>₹{totalExpenseAmount.toFixed(2)}</p>
              </div>
            </div>
            <div className='moneymanagementdash-box' style={{ backgroundColor: '#d1c4e9' }}>
              <FaArrowDown className='moneymanagementdash-icon' />
              <div className='moneymanagementdash-box-content'>
                <p className='moneymanagementdash-box-title'>Waive Off</p>
                <p className='moneymanagementdash-box-amount'>₹{totalWaveOffAmount.toFixed(2)}</p>
              </div>
            </div>
            <div className='moneymanagementdash-box' style={{ backgroundColor: '#e8f5e9' }}>
              <FaBalanceScale className='moneymanagementdash-icon' />
              <div className='moneymanagementdash-box-content'>
                <p className='moneymanagementdash-box-title'>Balance Amount</p>
                <p className='moneymanagementdash-box-amount'>₹{(totalReceivedAmount - totalExpenseAmount).toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

     <PaymentModal isOpen={isModalOpen} onClose={handleCloseModal} />
     <ExpenseModal isOpen={isExpenseModalOpen} onClose={handleCloseExpenseModal} />
    </>
  );
};

export default Payments;
