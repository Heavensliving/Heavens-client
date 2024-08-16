import React, { useEffect, useState } from 'react';
import './ExpenseModal.css';
import { toast } from 'react-toastify';

const ExpenseModal = ({ isOpen, onClose }) => {
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [title, setTitle] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [amount, setAmount] = useState('');
  const [expenseId, setExpenseId] = useState(null);
  const [propertyName, setPropertyName] = useState('');
  const [propertyId, setPropertyId] = useState('');


  useEffect(() => {
    if (isOpen) {
      // Fetch property name and ID from localStorage
      const storedPropertyName = localStorage.getItem('userPropertyName');
      const storedPropertyId = localStorage.getItem('userPropertyId');

      if (storedPropertyName && storedPropertyId) {
        setPropertyName(storedPropertyName);
        setPropertyId(storedPropertyId);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTypeChange = (e) => {
    setType(e.target.value);
    if (e.target.value === 'Other') {
      setCategory('Other');
    } else {
      setCategory('');
    }
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
    if (e.target.value !== 'Upi' && e.target.value !== 'Bank Transfer') {
      setTransactionId('');
    }
  };

  const clearFields = () => {
    setType('');
    setCategory('');
    setOtherReason('');
    setTitle('');
    setPaymentMethod('');
    setTransactionId('');
    setAmount('');
    setExpenseId(null); // Clear expense ID
    setPropertyName('');
    setPropertyId('');
  };

  const handleClose = () => {
    clearFields();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://heavensmanagement.onrender.com/api/add-expense', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          type,
          category,
          otherReason,
          paymentMethod,
          transactionId,
          amount,
          propertyName,
          propertyId,
        }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        console.log('Expense added:', result.expense);
        setExpenseId(result.id);
        toast.success('Expense added successfully!');
        clearFields();
        onClose();
      } else {
        // Handle specific error
        if (result.error === 'Transaction ID already exists') {
          toast.error('Transaction ID already exists');
        } else {
          toast.error('Error adding expense');
        }
        console.error('Error adding expense:', result.error);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error: ' + error.message);
    }
  };
  

  const categoryOptions = {
    PG: ['Electricity', 'Water', 'Cleaning', 'Building Maintenance', 'Wifi', 'Furniture', 'Other'],
    Mess: ['Grocery', 'Utensils', 'Other'],
    Other: ['Other'],
  };

  return (
    <div className="adding-expence-sec-modal">
      <div className="adding-expence-sec-content">
        <button className="adding-expence-sec-close" onClick={handleClose}>
          <span className="adding-expence-sec-close-icon">×</span>
        </button>
        <h2 className="adding-expence-sec-title">Expense Details</h2>
        <form onSubmit={handleSubmit}>
          <div className="adding-expence-sec-form-group">
            <div className="adding-expence-sec-form-group-item">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="adding-expence-sec-form-group-item">
              <label htmlFor="amount">Amount Paid</label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          <div className="adding-expence-sec-form-group">
            <div className="adding-expence-sec-form-group-item">
              <label htmlFor="type">Type</label>
              <select id="type" value={type} onChange={handleTypeChange}>
                <option value="">Select Type</option>
                <option value="PG">PG</option>
                <option value="Mess">Mess</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="adding-expence-sec-form-group-item">
              <label htmlFor="category">Category</label>
              <select id="category" value={category} onChange={handleCategoryChange}>
                <option value="">Select Category</option>
                {categoryOptions[type]?.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="adding-expence-sec-form-group">
            <div className="adding-expence-sec-form-group-item">
              <label htmlFor="otherReason">Add Note</label>
              <input
                type="text"
                id="otherReason"
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
              />
            </div>
            <div className="adding-expence-sec-form-group-item">
              <label htmlFor="paymentMethod">Payment Method</label>
              <select id="paymentMethod" value={paymentMethod} onChange={handlePaymentMethodChange}>
                <option value="">Select Payment Method</option>
                <option value="Upi">UPI</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Card">Card</option>
                <option value="Cash">Cash</option>
              </select>
            </div>
          </div>

          {(['Upi', 'Bank Transfer'].includes(paymentMethod)) && (
            <div className="adding-expence-sec-form-group">
              <div className="adding-expence-sec-form-group-item">
                <label htmlFor="transactionId">Transaction ID</label>
                <input
                  type="text"
                  id="transactionId"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                />
              </div>
            </div>
          )}
          <input type="hidden" value={propertyName} readOnly />
          <input type="hidden" value={propertyId} readOnly />

          <button type="submit" className="adding-expence-sec-submit-button">Add Expense</button>
        </form>
      </div>
    </div>
  );
};

export default ExpenseModal;
