import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './CommissionModal.css';

const CommissionModal = ({ isOpen, onClose }) => {
  const [paymentType, setPaymentType] = useState('Cash');
  const [transactionId, setTransactionId] = useState('');
  const [userPropertyName, setUserPropertyName] = useState('');
  const [userPropertyId, setUserPropertyId] = useState('');
  const [agentName, setAgentName] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    const storedPropertyName = localStorage.getItem('userPropertyName') || '';
    const storedPropertyId = localStorage.getItem('userPropertyId') || '';
    setUserPropertyName(storedPropertyName);
    setUserPropertyId(storedPropertyId);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const commissionData = {
      agentName,
      amount,
      note,
      paymentType,
      transactionId: paymentType === 'Upi/Bank Transfer' ? transactionId : null,
      userPropertyName,
      userPropertyId,
    };

    try {
      const response = await fetch('https://heavensmanagement.onrender.com/api/commission/commissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commissionData),
      });

      if (response.ok) {
        alert('Commission added successfully!'); 
        onClose(); // Close the modal after successful submission
      } else {
        alert('Failed to add commission');
      }
    } catch (error) {
      console.error('Error adding commission:', error);
      alert('An error occurred while adding the commission');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="addcommissionsection-modal-overlay">
      <div className="addcommissionsection-modal-content">
        <button className="addcommissionsection-modal-close" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes}/>
        </button>
        <h2>Add Commission</h2>
        <form onSubmit={handleSubmit}>
          <div className="addcommissionsection-form-group">
            <label>
              Agent Name:
              <input type="text" name="agentName" value={agentName} onChange={(e) => setAgentName(e.target.value)} />
            </label>
          </div>
          <div className="addcommissionsection-form-group">
            <label>
              Amount:
              <input type="number" name="amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </label>
          </div>
          <div className="addcommissionsection-form-group">
            <label>
              Note:
              <input type="text" name="note" value={note} onChange={(e) => setNote(e.target.value)} />
            </label>
          </div>
          <div className="addcommissionsection-form-group">
            <label>
              Payment Type:
              <select name="paymentType" value={paymentType} onChange={(e) => setPaymentType(e.target.value)}>
                <option value="Cash">Cash</option>
                <option value="Upi/Bank Transfer">Upi/Bank Transfer</option>
              </select>
            </label>
          </div>
          {paymentType === 'Upi/Bank Transfer' && (
            <div className="addcommissionsection-form-group">
              <label>
                Transaction ID:
                <input type="text" name="transactionId" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} />
              </label>
            </div>
          )}
          <input type="hidden" name="userPropertyName" value={userPropertyName} />
          <input type="hidden" name="userPropertyId" value={userPropertyId} />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default CommissionModal;
