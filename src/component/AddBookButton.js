// /frontend/src/Component/AddBookButton.js

import React, { useState } from 'react';
import BookForm from './BookForm'; // Assuming BookForm is in the same folder

const MODAL_STYLE = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
    backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex', 
    justifyContent: 'center', alignItems: 'center', zIndex: 1000,
};

const BUTTON_STYLE = {
    padding: '15px 30px',
    fontSize: '18px',
    backgroundColor: '#28a745', // Green color
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 4px 10px rgba(40, 167, 69, 0.4)',
    ':hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 12px rgba(40, 167, 69, 0.6)',
    }
};

function AddBookButton({ onBookAdded }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleBookSubmit = () => {
        onBookAdded(); // Refresh list
        setIsModalOpen(false); // Close modal
    }

    return (
        <>
            <button 
                onClick={() => setIsModalOpen(true)}
                style={BUTTON_STYLE}
            >
                ➕ Add New Book
            </button>

            {isModalOpen && (
                <div style={MODAL_STYLE}>
                    {/* Assuming BookForm takes an onClose prop and calls onBookAdded */}
                    <BookForm 
                        onBookAdded={onBookAdded} 
                        onClose={() => setIsModalOpen(false)}
                    />
                </div>
            )}
        </>
    );
}

export default AddBookButton;