// /frontend/src/BookForm.js
import React, { useState } from 'react';
import axios from 'axios';

// --- STYLES FOR ATTRACTIVENESS & MODAL (No Change) ---
const MODAL_STYLE = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex',
    justifyContent: 'center', alignItems: 'center', zIndex: 1000,
};

const FORM_CARD_STYLE = {
    backgroundColor: '#fff', padding: '30px', borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)', width: '90%',
    maxWidth: '700px', animation: 'fadeIn 0.3s ease-out',
};

const GRID_STYLE = {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px', marginBottom: '20px',
};

const FIELD_STYLE = {
    width: '100%', padding: '10px', margin: '5px 0 10px 0', border: '1px solid #ccc',
    borderRadius: '6px', boxSizing: 'border-box', transition: 'border-color 0.3s, box-shadow 0.3s',
    WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none',
    backgroundColor: '#fff', cursor: 'pointer',
};

const SELECT_CONTAINER_STYLE = {
    position: 'relative',
};

const SUBMIT_BUTTON_STYLE = {
    backgroundColor: '#007bff', color: 'white', border: 'none', padding: '12px',
    borderRadius: '6px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold',
    transition: 'background-color 0.2s', marginTop: '10px',
};


// --- BASE FIELDS & OPTIONS ---
// 🔑 CORRECTED ORDER: Ensure the keys exactly match the structure from the server for mapping. 
// SrNo must be present here for edit mode iteration.
const BASE_INITIAL_STATE = {
    'Class': '', 'SrNo': '', 'Book Name': '', 'Volume': '', 'Date': '', 
    'Book Price': '', 'Room': '', 'Kapat': '', 'other1': ''
};

const REQUIRED_FIELDS = ['Class', 'Book Name', 'Book Price'];
const CLASS_OPTIONS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];


// 🔑 DATE FORMATTING HELPER: Converts YYYY-MM-DD (input) to DD/MM/YYYY (backend)
const formatDateForBackend = (dateString) => {
    if (!dateString) return '';
    const parts = dateString.split('-');
    if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`; // DD/MM/YYYY
    }
    return dateString;
};

// 🔑 DATE CONVERSION FOR EDIT: Converts DD/MM/YYYY (server) to YYYY-MM-DD (date input)
const formatDateForInput = (dateString) => {
    if (!dateString || !dateString.match(/^\d{2}\/\d{2}\/\d{4}$/)) return '';
    const parts = dateString.split('/');
    return `${parts[2]}-${parts[1]}-${parts[0]}`; // YYYY-MM-DD
};


// --- CORE BOOK FORM COMPONENT (Unified for Add & Edit) ---
export function BookForm({ initialBook = null, onBookAdded, onClose, onBookUpdated }) {
    
    // Determine initial state: load book data for edit, or use empty state for add
    const initialState = initialBook 
        ? { 
            // 🔑 Merge initialBook data over the BASE_INITIAL_STATE to fill all fields
            ...BASE_INITIAL_STATE, 
            ...initialBook, 
            // 🔑 Ensure Date is correctly converted for the date input type
            'Date': formatDateForInput(initialBook['Date']) 
        }
        : BASE_INITIAL_STATE;

    const [formData, setFormData] = useState(initialState);
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isEditMode = initialBook !== null;
    const formTitle = isEditMode ? `✏️ Edit Book (SrNo: ${initialBook.SrNo})` : '📚 Add New Library Book';
    const submitButtonText = isEditMode ? 'Save Changes' : 'Add Book to Library';
    const api = process.env.REACT_APP_BACKEND_URL

    const handleChange = (e) => {
        // Ensure numbers are stored as strings if the input type is text/date, 
        // but since you use type="number" for Volume/Price, storing as number is fine.
        const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Manual validation
        const missing = REQUIRED_FIELDS.filter(field => !formData[field]);
        if (missing.length) {
            setMessage(`❌ Missing required fields: ${missing.join(', ')}`);
            return;
        }

        setIsSubmitting(true);
        setMessage(isEditMode ? 'Updating book...' : 'Adding book...');
        
        // Prepare data: Convert date format for backend
        const dataToSend = { ...formData };
        if (dataToSend['Date']) {
            dataToSend['Date'] = formatDateForBackend(dataToSend['Date']);
        }
        
        try {
            if (isEditMode) {
                // EDIT: PUT request
                // 🔑 Use the SrNo stored in formData (which comes from initialBook)
                await axios.put(api+`/api/books/${formData.SrNo}`, dataToSend);
                setMessage('✅ Book updated successfully!');
                onBookUpdated(); 
            } else {
                // ADD: POST request
                delete dataToSend['SrNo']; // Ensure SrNo is not sent for a new book
                await axios.post(api+`/api/books`, dataToSend);
                setMessage('✅ Book added successfully!');
                setFormData(BASE_INITIAL_STATE); // Reset form
                onBookAdded(); 
            }
            
            setTimeout(onClose, 1000);

        } catch (error) {
            // Server error suggests a problem with the PUT data format or backend logic.
            setMessage(`❌ Error: ${error.response?.data?.message || 'Server error. Check backend logs for detailed error.'}`);
            console.error('Submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={FORM_CARD_STYLE}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>
                <h2 style={{ margin: 0, color: '#333' }}>{formTitle}</h2>
                <button 
                    onClick={onClose} 
                    style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#aaa' }}
                    aria-label="Close Modal"
                >
                    &times;
                </button>
            </div>
            
            <form onSubmit={handleSubmit}>
                <div style={GRID_STYLE}>
                    {/* Iterate over BASE_INITIAL_STATE keys (which includes SrNo) */}
                    {Object.keys(BASE_INITIAL_STATE).map((key) => {
                        // 🔑 SrNo is skipped in Add mode, but included in Edit mode
                        if (key === 'SrNo' && !isEditMode) return null; 

                        const isRequired = REQUIRED_FIELDS.includes(key);

                        return (
                            <div key={key}>
                                <label htmlFor={key} style={{ display: 'block', fontWeight: '600', marginBottom: '3px' }}>
                                    {key} {!isRequired && <span style={{ color: '#888' }}>(Optional)</span>} {isRequired && <span style={{ color: 'red' }}>*</span>}:
                                </label>

                                {/* --- CLASS SELECTOR --- */}
                                {key === 'Class' ? (
                                    <div style={SELECT_CONTAINER_STYLE}>
                                        <select
                                            id={key}
                                            name={key}
                                            value={formData[key]}
                                            onChange={handleChange}
                                            required={isRequired}
                                            style={FIELD_STYLE}
                                            disabled={isSubmitting}
                                        >
                                            <option value="" disabled>Select Class</option>
                                            {CLASS_OPTIONS.map(cls => (
                                                <option key={cls} value={cls}>Class {cls}</option>
                                            ))}
                                        </select>
                                    </div>
                                ) : (
                                    /* --- DEFAULT INPUTS --- */
                                    <input
                                        type={
                                            key === 'Volume' || key === 'Book Price' || key === 'SrNo' ? 'number' : 
                                            (key === 'Date' ? 'date' : 'text')
                                        }
                                        id={key}
                                        name={key}
                                        value={formData[key] || ''}
                                        onChange={handleChange}
                                        required={isRequired}
                                        // 🔑 Set SrNo as readOnly in Edit mode
                                        readOnly={key === 'SrNo'} 
                                        style={{ 
                                            ...FIELD_STYLE, 
                                            backgroundColor: key === 'SrNo' ? '#eee' : FIELD_STYLE.backgroundColor 
                                        }}
                                        placeholder={`Enter ${key}`}
                                        disabled={isSubmitting}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
                
                <button 
                    type="submit" 
                    style={{...SUBMIT_BUTTON_STYLE, opacity: isSubmitting ? 0.7 : 1}} 
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Processing...' : submitButtonText}
                </button>
                <p style={{ textAlign: 'center', marginTop: '15px', fontWeight: 'bold' }}>
                    {message}
                </p>
            </form>
        </div>
    );
}

// --- MODAL WRAPPER COMPONENT (No Change) ---

export function AddBookButton({ onBookAdded }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button 
                onClick={() => setIsModalOpen(true)}
                style={{
                    padding: '15px 30px',
                    fontSize: '18px',
                    backgroundColor: '#28a745', 
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    margin: '20px auto',
                    display: 'block',
                    boxShadow: '0 4px 10px rgba(40, 167, 69, 0.4)',
                }}
            >
                ➕ Click to Add New Book
            </button>

            {isModalOpen && (
                <div style={MODAL_STYLE}>
                    <BookForm 
                        onBookAdded={onBookAdded} 
                        onClose={() => setIsModalOpen(false)} 
                    />
                </div>
            )}
        </>
    );
}

export default BookForm;