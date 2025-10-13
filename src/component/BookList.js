// /frontend/src/Component/BookList.js

import React from 'react';

// 🔑 THE DISPLAY HEADERS
const headers = ['Class', 'Book Name', 'Volume', 'Date', 'Book Price', 'Room', 'Kapat', 'other1'];
const classOptions = ['All', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

// 🔑 THE CRITICAL FIX: Explicit mapping from display header to the object's property key.
// Since your previous code (book[header]) worked, your data keys MUST match the headers exactly.
// We are defining this map to ensure consistency when accessing data.
const dataKeyMap = {
    'Class': 'Class',
    'Book Name': 'Book Name',    // ⬅️ Assuming your data key actually has a space
    'Volume': 'Volume',
    'Date': 'Date',
    'Book Price': 'Book Price',  // ⬅️ Assuming your data key actually has a space
    'Room': 'Room',
    'Kapat': 'Kapat',
    'other1': 'other1',
    // IMPORTANT: If any of these are wrong (e.g., 'BookName' instead of 'Book Name'), change it here.
};


const tableHeaderStyle = { padding: '10px', border: '1px solid #ddd', backgroundColor: '#f2f2f2', textAlign: 'left' };
const tableCellStyle = { padding: '10px', border: '1px solid #ddd', fontSize: '14px' };

const tableScrollContainerStyle = {
    overflowX: 'auto', 
    border: '1px solid #ddd', 
    borderRadius: '8px',
    maxHeight: '480px', 
    overflowY: 'auto', 
};


function BookList({ 
    books, loading, searchTerm, setSearchTerm, handleSearch, handleImport, 
    handleEditClick, handleDelete, selectedClass, setSelectedClass 
}) {
    
    // --- HANDLER FOR CLASS CHANGE (Triggers parent filter logic) ---
    const handleClassChange = (e) => {
        const newClass = e.target.value;
        setSelectedClass(newClass);
        // This line is essential for applying the class filter
        handleSearch(newClass, searchTerm); 
    };
    
    // --- HANDLER FOR SEARCH TERM CHANGE (Triggers parent filter logic) ---
    const handleSearchTermChange = (e) => {
        const newSearchTerm = e.target.value;
        setSearchTerm(newSearchTerm);
        // This line is essential for applying the general search filter
        handleSearch(selectedClass, newSearchTerm);
    }

    return (
        <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <h2 style={{ color: '#333' }}>📚 Book Inventory ({books.length} Books)</h2>
            
            {/* Search and Action Bar */}
            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                
                {/* Class Selector */}
                <select
                    value={selectedClass}
                    onChange={handleClassChange}
                    style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
                >
                    {classOptions.map(cls => (
                        <option key={cls} value={cls}>{cls === 'All' ? 'All Classes' : `Class ${cls}`}</option>
                    ))}
                </select>

                {/* General Search Input */}
                <input
                    type="text"
                    placeholder="Search by name, SrNo, etc."
                    value={searchTerm}
                    onChange={handleSearchTermChange}
                    style={{ padding: '10px', flexGrow: 1, minWidth: '200px', border: '1px solid #ccc', borderRadius: '5px' }}
                />
                
                {/* Filter and Import Buttons */}
                <button 
                    onClick={() => { setSelectedClass('All'); setSearchTerm(''); handleSearch('All', ''); }} 
                    style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                    Clear Filter
                </button>
                <button 
                    onClick={handleImport} 
                    style={{ padding: '10px 20px', backgroundColor: 'teal', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                    Upload/Import
                </button>
            </div>

            {loading ? (
                <p style={{ textAlign: 'center', fontSize: '1.2em', padding: '30px' }}>Loading books... Please wait.</p>
            ) : (
                <div style={tableScrollContainerStyle}> 
                    <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f1f8ff' }}>
                                {/* Fixed table headers */}
                                <th style={{...tableHeaderStyle, width: '50px', position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#f1f8ff'}}>Sl. No.</th>
                                {headers.map(header => (
                                    <th key={header} style={{...tableHeaderStyle, position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#f1f8ff'}}>{header}</th>
                                ))}
                                <th style={{ ...tableHeaderStyle, width: '150px', position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#f1f8ff' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map((book, index) => (
                                <tr key={index} style={{ borderBottom: '1px solid #eee', transition: 'background-color 0.2s' }}>
                                    <td style={{...tableCellStyle, textAlign: 'center'}}>{index + 1}</td> 
                                    {/* 🔑 THE FIX: Use the map to reliably access data keys, which we assume match the headers */}
                                    {headers.map(header => {
                                        const dataKey = dataKeyMap[header]; // Get the actual key from the map
                                        return (
                                            <td key={header} style={tableCellStyle}>
                                                {book[dataKey]}
                                            </td>
                                        );
                                    })}
                                    <td style={{ ...tableCellStyle, width: '150px' }}>
                                        <button 
                                            onClick={() => handleEditClick(book)}
                                            style={{ padding: '5px 10px', marginRight: '5px', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            ✏️ 
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(book.SrNo)}
                                            style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            🗑️ 
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {!books.length && (
                                <tr>
                                    <td colSpan={headers.length + 2} style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                                        No books found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default BookList;