
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import BookList from './BookList';
import AddBookButton from './AddBookButton';
import BookForm from './BookForm';

// NEW: Component for handling Edit (PROPS CORRECTED)


function Liabrary() {
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClass, setSelectedClass] = useState('All');
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [bookToEdit, setBookToEdit] = useState(null);
    const api = process.env.REACT_APP_BACKEND_URL


    // 🔄 Fetch Books Function - Sends both Class and Search term to the backend
    const fetchBooks = useCallback(async (classQuery = 'All', searchQuery = '') => { 
        setLoading(true);
        try {
            const response = await axios.get(api+`/api/books`, {
                params: {
                    search: searchQuery,
                    class: classQuery
                }
            });
           
            setBooks(response.data);
        } catch (error) {
            console.error('Error fetching books:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBooks(selectedClass, searchTerm);
    }, [fetchBooks]);
    
    // 🔍 Search Handler - Triggers fetch with current state values
    const handleSearch = (classQ, searchT) => { 
        fetchBooks(classQ, searchT);
    };

    // 🗑️ DELETE Handler
    const handleDelete = async (srNo) => {
        if (!window.confirm(`Are you sure you want to delete the book with SrNo: ${srNo}?`)) {
            return;
        }
        try {
            await axios.delete(api+`/api/books/${srNo}`);
            alert(`Book ${srNo} deleted successfully!`);
            fetchBooks(selectedClass, searchTerm);
        } catch (error) {
            alert(`Error deleting book: ${error.response?.data?.message || 'Server error.'}`);
            console.error('Delete error:', error);
        }
    };
    
    // ✏️ EDIT Handlers
    const handleEditClick = (book) => {
        setBookToEdit(book);
        setIsEditing(true);
    };

    const handleSaveEdit = async (updatedData) => {
        try {
            console.log(updatedData,"updated data")
            await axios.put(api+`/api/books/${updatedData.SrNo}`, updatedData);
            alert(`Book ${updatedData.SrNo} updated successfully!`);
            setIsEditing(false);
            setBookToEdit(null);
            fetchBooks(selectedClass, searchTerm);
        } catch (error) {
            console.log("adf ",error)
             alert(`Error updating book: ${error.response?.data?.message || 'Server error.'}`);
             console.error('Update error:', error);
        }
    };
    
    // ➕ Placeholder for Import
    const handleImport = () => {
        alert('The Import facility is currently a placeholder. It requires backend support.');
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
            <hr style={{ border: '1px solid #ddd' }}/>
            
            {/* ADD BOOK BUTTON AT THE TOP */}
            <div style={{ marginBottom: '10px', textAlign: 'right' }}>
                <AddBookButton onBookAdded={() => fetchBooks(selectedClass, searchTerm)} />
            </div>

            {/* BOOK LIST COMPONENT */}
            <BookList
                books={books}
                loading={loading}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedClass={selectedClass}
                setSelectedClass={setSelectedClass}
                handleSearch={handleSearch} 
                handleImport={handleImport}
                handleEditClick={handleEditClick}
                handleDelete={handleDelete}
            />

            {/* Edit Modal remains here */}
            {isEditing && bookToEdit && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
                    backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex', 
                    justifyContent: 'center', alignItems: 'center', zIndex: 1000,
                }}>
                    <BookForm
                        initialBook={bookToEdit} // This activates the Edit Mode
                        onBookUpdated={handleSaveEdit} // Function to call on successful update
                        onClose={() => setIsEditing(false)}
                    />
                </div>
            )}
        </div>
    );
}

export default Liabrary;