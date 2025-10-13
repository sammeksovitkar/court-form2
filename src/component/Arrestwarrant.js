import React, { useState } from 'react';

// Utility function to convert ISO date (YYYY-MM-DD) to DD/MM/YYYY format
const formatDateToIndian = (isoDate) => {
    if (!isoDate || isoDate.length !== 10) return '...............'; // Default placeholder
    // Expected format is YYYY-MM-DD
    const parts = isoDate.split('-');
    if (parts.length === 3) {
        // Rearrange to DD/MM/YYYY
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return isoDate; // Return original if format is unexpected
};

// Component for the printable document content (Arrest Warrant - CrPC 75)
const ArrestWarrantDocument = ({ data }) => {
    
    // Helper to extract day, month, year for the issue date section
    const getIssueDateParts = (isoDate) => {
        const dateString = formatDateToIndian(isoDate);
        if (dateString.includes('/')) {
             const parts = dateString.split('/');
             // Ensure parts has at least 3 elements before accessing indices
             return { 
                 day: parts[0] || '..........', 
                 month: parts[1] || '..........', 
                 year: parts[2] || '..........' 
             };
        }
        return { day: '..........', month: '..........', year: '..........' };
    };

    const issueDateParts = getIssueDateParts(data.issueDate);
    const appearanceYear = data.appearanceDate ? new Date(data.appearanceDate).getFullYear().toString() : '....';

    // Descriptive name for the Warrant Type
    const descriptiveWarrantType = data.warrantType === 'B.W.' 
        ? 'Bailable Warrant (जामीनपात्र वॉरंट)' 
        : 'Non Bailable Warrant (अजामीनपात्र वॉरंट)';

    return (
        <div className="printable-area" id="print-warrant-content">
            <div className="warrant-document">
                
                {/* Court and Heading */}
                <p className="align-center court-title" style={{fontSize:"18px", fontWeight: 'bold', marginBottom: '5px'}}>
                    <span className="data-placeholder">{data.courtName}</span>
                </p>
                <h3 className="align-center court-slogan" style={{fontSize:"20px", marginTop: '5px', marginBottom: '5px', textDecoration: 'underline'}}>
                    पकडण्याचा वॉरंट
                </h3>
                
                {/* Warrant Type and Case Type Display */}
                <div style={{ marginBottom: '15px', width: '100%', lineHeight: '1.2', textAlign:"center" }}>
                    <p style={{ margin: '0 0 2px 0', textAlign:"center",fontWeight: 'bold', fontSize: '1.1rem', color: data.warrantType === 'N.B.W.' ? '#880000' : '#006400' }} >
                        <span className="data-placeholder">{descriptiveWarrantType}</span>
                    </p>
                    <p style={{ margin: '0', textAlign:"center",fontSize: '10pt', fontWeight: 'bold'}}>
                        {data.caseType} खटला क्र. (Case No.): <span className="data-placeholder">{data.caseNo}</span>
                    </p>
                    <p style={{ margin: '0', fontSize: '10pt',textAlign:"center"}}>
                        (क्रि. प्रो. को. क. ७५ पहा)
                    </p>
                </div>

                {/* To: Police Inspector */}
                <div style={{ marginTop: '10px', marginBottom: '10px', padding: '0 0mm' }}>
                    <p style={{marginBottom: '5px', fontWeight: 'bold'}}>प्रति,</p>
                    <p style={{marginBottom: '5px'}}>पोलीस निरीक्षक,</p>
                    <p style={{marginBottom: '5px'}}>
                        <span className="data-placeholder">{data.policeStationName}</span> पोलीस स्टेशन,
                    </p>
                    <p style={{marginBottom: '15px'}}>
                        ता. <span className="data-placeholder">{data.policeStationTaluka}</span> जि. <span className="data-placeholder">{data.policeStationDistrict}</span> यांस
                    </p>
                </div>

                {/* Main Body of Warrant */}
                <div style={{ marginTop: '20px', textAlign: 'justify' }}>
                    
                    <p className="warrant-paragraph" style={{ marginBottom: '15px' }}>
                        ज्यापेक्षा <span className="data-placeholder bold-text">{data.accusedName}</span> राह. 
                        <span className="data-placeholder bold-text">{data.accusedAddress}</span> यावर 
                        <span className="data-placeholder bold-text">{data.offenseSection}</span> या अपराधाचा आरोप आलेला आहे, 
                        त्यापेक्षा तुम्ही सदरहू <span className="data-placeholder bold-text">{data.accusedName}</span> यास धरून माझ्यापुढे आणावे असा तुम्हास या वॉरंटद्वारे हुकूम केला आहे. 
                        यात लिहिल्याप्रमाणे तुम्ही चुकू नये.
                    </p>
                    
                    {/* Conditional Bail/Surety Clause (Only for Bailable Warrant) */}
                    {data.warrantType === 'B.W.' && (
                        <div className="bail-clause" style={{ marginBottom: '15px', border: '1px dashed #ccc', padding: '10px', background: '#f9f9f9', borderRadius: '4px' }}>
                            <p style={{ fontWeight: 'bold', textDecoration: 'underline', margin: '0 0 5px 0'}}>जामीन सूचना (Bail Instruction):</p>
                            <p className="warrant-paragraph" style={{ margin: '0' }}>
                                सदरहू <span className="data-placeholder bold-text">{data.accusedName}</span> जर तारीख <span className="data-placeholder bold-text">{formatDateToIndian(data.appearanceDate)}</span> सन 
                                <span className="data-placeholder bold-text">{appearanceYear}</span> रोजी माझ्यापुढे हजर होण्याविषयी व मी अन्य रितीने हुकूम येईपर्यंत हजर होत राहतील 
                                याविषयी आपण स्वतः रु. <span className="data-placeholder bold-text">{data.personalBondAmount}</span> रकमेचे तारण लिहून देऊन 
                                रु. <span className="data-placeholder bold-text">{data.suretyAmount1}</span> रकमेचा एक जामीन (अगर रु. <span className="data-placeholder bold-text">{data.suretyAmount2}</span> रकमेचा प्रत्येक असे दोन)
                                द्याल, तर त्यास सोडून द्यावे.
                            </p>
                        </div>
                    )}
                    
                    {/* Issue Date */}
                    <p className="warrant-paragraph" style={{ marginTop: '20px', textAlign: 'left', fontWeight: 'bold' }}>
                        आज तारीख <span className="data-placeholder bold-text">{issueDateParts.day}</span> माहे <span className="data-placeholder bold-text">{issueDateParts.month}</span> सन <span className="data-placeholder bold-text">{issueDateParts.year}</span>.
                    </p>
                </div>

                {/* Footer/Signature Block */}
                <div className="footer-section" style={{marginTop: '30px', textAlign: 'right'}}>
                    <div className="signature-block align-right" style={{
                        width: 'auto', 
                        display: 'inline-block',
                        paddingTop: '5px',
                        marginRight: '0px'
                    }}> 
                        <p style={{marginBottom: '0', marginTop: '10px', textAlign: 'center', fontWeight: 'bold', textDecoration: 'underline'}}>
                            न्यायदंडाधिकारी प्रथम वर्ग,
                        </p>
                        <p style={{marginBottom: '0', marginTop: '0', textAlign: 'center'}}>
                            <span className="data-placeholder">{data.courtLocationFooter}</span> शहर.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};


// The main application component
const ArrestWarrantApp = () => {
    const today = new Date().toISOString().substring(0, 10);
    
    // Initial Data - Now includes explicit warrantType and caseType
    const initialData = {
        courtName: 'न्यायदंडाधिकारी, प्रथम वर्ग, मनमाड शहर',
        warrantType: '', // B.W. or N.B.W.
        caseType: '',     // RCC or SCC
        caseNo: '',
        policeStationName: '',
        policeStationTaluka: 'नांदगाव',
        policeStationDistrict: 'नाशिक',
        accusedName: '',
        accusedAddress: '',
        offenseSection: '',
        appearanceDate: today,
        personalBondAmount: '', // Taran Amount
        suretyAmount1: '', // One Surety Amount
        suretyAmount2: '', // Two Surety Amount
        issueDate: today, // Date of Warrant Issuance
        courtLocationFooter: '', // Location in the footer
    };

    const [data, setData] = useState(initialData);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };
    
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="summons-container">
            {/* --------------------- CSS STYLES (Includes A4 Print Media Query) --------------------- */}
            <style>
                {`
          /* --- SCREEN VIEW STYLES (Tailwind base) --- */
          .summons-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 1.5rem;
            min-height: 100vh;
            background-color: #f7f7f7;
            font-family: 'Inter', sans-serif;
          }

          .input-form {
            width: 100%;
            max-width: 1140px;
            padding: 2rem;
            border: 1px solid #e0e0e0;
            border-radius: 0.5rem;
            margin-bottom: 2rem;
            background-color: #ffffff;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
          }

          .form-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
            margin-bottom: 1.5rem;
          }

          .input-form label {
            display: block;
            font-weight: 600;
            color: #374151;
            margin-bottom: 0.25rem;
          }
          
          /* Radio Group Styling */
          .radio-group {
              display: flex;
              gap: 1.5rem;
              margin-top: 0.5rem;
              padding: 0.75rem;
              border: 1px solid #d1d5db;
              border-radius: 0.5rem;
              background-color: #f9fafb;
              box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);
          }
          
          .radio-group label {
              display: flex;
              align-items: center;
              font-weight: normal;
              cursor: pointer;
              margin-bottom: 0;
              color: #1f2937;
              transition: color 0.15s ease-in-out;
          }
          
          .radio-group input[type="radio"] {
              width: auto;
              height: 1.25rem;
              margin-right: 0.6rem;
              cursor: pointer;
              appearance: none;
              border: 2px solid #9ca3af;
              border-radius: 50%;
              transition: all 0.2s;
              outline: none;
              min-width: 1.25rem;
          }
          
          .radio-group input[type="radio"]:checked {
              background-color: #2563eb;
              border-color: #2563eb;
              box-shadow: inset 0 0 0 4px #f9fafb;
          }

          .input-form input:not([type="radio"]), .input-form select {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #d1d5db;
            border-radius: 0.375rem;
            margin-top: 0.25rem;
            box-sizing: border-box;
            transition: border-color 0.15s ease-in-out;
          }
          .input-form input:focus {
            border-color: #2563eb;
            outline: none;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.25);
          }

          .print-button {
            width: 100%;
            padding: 1rem;
            font-size: 1.125rem;
            font-weight: 700;
            cursor: pointer;
            background-color: #ef4444; /* Red for Warrant */
            color: white;
            border: none;
            border-radius: 0.5rem;
            transition: background-color 0.15s ease-in-out, transform 0.1s ease-in-out;
            box-shadow: 0 4px 6px rgba(239, 68, 68, 0.3);
          }
          .print-button:hover {
            background-color: #dc2626;
            box-shadow: 0 6px 8px rgba(220, 38, 38, 0.4);
          }
          .print-button:active {
            transform: scale(0.99);
          }
          
          /* Print Area (Visible on screen for preview) */
          .printable-area {
            width: 210mm; /* A4 width */
            min-height: 297mm; /* A4 height */
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); 
            background-color: white;
            padding: 12mm 12mm; 
            box-sizing: border-box;
            /* Use Devanagari friendly fonts */
            font-family: 'Lohit Devanagari', 'Arial Unicode MS', 'Mangal', sans-serif; 
            font-size: 12pt;
            line-height: 1.5; 
          }

          /* TIGHTER VERTICAL SPACING for the document to fit on one page */
          .warrant-document p, .warrant-document div {
            text-align: justify;
            text-indent: 0;
            margin: 0;
            padding: 0;
          }
          .warrant-document h3 {
            margin-top: 10px; 
            margin-bottom: 8px; 
          }
          .warrant-paragraph {
              margin: 8px 0 !important;
              text-align: justify;
          }


          .align-center {
            text-align: center !important;
          }

          .align-right {
            text-align: right !important;
          }
          .bold-text {
              font-weight: bold;
          }
          
          /* --- PRINT STYLES (CRITICAL FOR A4 FORMAT) --- */
          @media print {
            
            /* 1. Universal Cleanup: Removes all shadows and backgrounds */
            * {
                box-shadow: none !important;
                text-shadow: none !important;
                background: transparent !important;
                border: none !important;
            }

            /* 2. Global Print Cleanup: Ensures white background */
            body, html {
              background-color: white !important;
              overflow: hidden !important; 
              padding: 0 !important;
              margin: 0 !important;
              width: 100% !important; 
              height: 100% !important; 
            }
            
            /* 3. Container Cleanup */
            .summons-container {
              background-color: white !important;
              overflow: hidden !important;
              padding: 0 !important;
              margin: 0 !important;
              box-shadow: none !important;
              min-height: auto !important; 
            }
          
            /* Hide the input form and print button */
            .input-form, .print-button {
              display: none !important;
            }

            /* 4. Page Size & Margin */
            @page {
              size: A4 portrait;
              margin: 5mm; /* Minimal symmetrical margin */
            }
            
            /* 5. Printable Area Styling: Ensures the document itself takes over the page */
            .printable-area {
              width: 100% !important; 
              min-height: 100% !important;
              margin: 0 !important;
              border: none !important; 
              box-shadow: none !important; 
              /* IMPORTANT: Use a minimal internal padding */
              padding: 5mm 8mm !important; 
              font-size: 11pt; 
              line-height: 1.7; 
              font-family: 'Lohit Devanagari', 'Arial Unicode MS', 'Mangal', sans-serif;
            }

            /* Apply tighter spacing specifically for printing */
            .warrant-document p, .warrant-document div {
              margin: 0;
            }
            .warrant-document h3 {
              margin-top: 6px; 
              margin-bottom: 4px; 
            }
            .warrant-paragraph {
                margin: 5px 0 !important;
            }
            .footer-section {
                margin-top: 25px !important;
            }
            /* Remove bail border/background for print */
            .bail-clause {
                border: none !important;
                background: transparent !important;
                padding: 0 !important;
                margin: 5px 0 !important;
            }
          }
        `}
            </style>

            {/* --------------------- Input Form Section --------------------- */}
            <div className="input-form">
                <h2 className="text-xl font-bold mb-6 text-center text-gray-800">
                    पकडण्याचा वॉरंट माहिती भरा (Arrest Warrant Details - CrPC 75)
                </h2>
                
                {/* 1. Warrant Type Selection */}
                <h3 className="text-lg font-semibold mb-3 text-gray-700">१. वॉरंटचा प्रकार (Warrant Type)</h3>
                <div className="radio-group">
                    <label>
                        <input
                            type="radio"
                            name="warrantType"
                            value="N.B.W."
                            checked={data.warrantType === 'N.B.W.'}
                            onChange={handleChange}
                        />
                        **N.B.W.** (Non Bailable Warrant - अजामीनपात्र)
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="warrantType"
                            value="B.W."
                            checked={data.warrantType === 'B.W.'}
                            onChange={handleChange}
                        />
                        **B.W.** (Bailable Warrant - जामीनपात्र)
                    </label>
                </div>

                {/* 2. Case Type Selection */}
                <h3 className="text-lg font-semibold mb-3 text-gray-700 mt-6 border-t pt-4">२. खटल्याचा प्रकार (Case Type)</h3>
                <div className="radio-group">
                    <label>
                        <input
                            type="radio"
                            name="caseType"
                            value="RCC"
                            checked={data.caseType === 'RCC'}
                            onChange={handleChange}
                        />
                        **RCC** (Regular Criminal Case)
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="caseType"
                            value="SCC"
                            checked={data.caseType === 'SCC'}
                            onChange={handleChange}
                        />
                        **SCC** (Summary Criminal Case)
                    </label>
                </div>

                <h3 className="text-lg font-semibold mb-3 text-gray-700 mt-6 border-t pt-4">३. न्यायालयीन तपशील</h3>
                <div className="form-grid">
                    <label style={{gridColumn: 'span 2'}}>
                        न्यायालय/वॉरंट जारी करणारे (Court/Issuing Authority):
                        <input
                            type="text"
                            name="courtName"
                            value={data.courtName}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        खटला क्रमांक (Case No.):
                        <input
                            type="text"
                            name="caseNo"
                            value={data.caseNo}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                       कोर्टाचे ठिकाण (Court Location):
                        <input
                            type="text"
                            name="courtLocationFooter"
                            value={data.courtLocationFooter}
                            onChange={handleChange}
                        />
                    </label>
                </div>

                 <h3 className="text-lg font-semibold mb-3 text-gray-700 mt-6 border-t pt-4">४. आरोपी आणि गुन्हा तपशील</h3>
                <div className="form-grid">
                    <label>
                        आरोपीचे नांव (Accused Name):
                        <input
                            type="text"
                            name="accusedName"
                            value={data.accusedName}
                            onChange={handleChange}
                        />
                    </label>
                    <label style={{gridColumn: 'span 2'}}>
                        आरोपीचा पत्ता (Accused Address):
                        <input
                            type="text"
                            name="accusedAddress"
                            value={data.accusedAddress}
                            onChange={handleChange}
                        />
                    </label>
                    <label style={{gridColumn: 'span 1'}}>
                        गुन्हा/कलम (Offense/Section):
                        <input
                            type="text"
                            name="offenseSection"
                            value={data.offenseSection}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        पोलीस स्टेशनचे नांव (Police Station):
                        <input
                            type="text"
                            name="policeStationName"
                            value={data.policeStationName}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        पोलीस स्टेशन तालुका (Taluka):
                        <input
                            type="text"
                            name="policeStationTaluka"
                            value={data.policeStationTaluka}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        पोलीस स्टेशन जिल्हा (District):
                        <input
                            type="text"
                            name="policeStationDistrict"
                            value={data.policeStationDistrict}
                            onChange={handleChange}
                        />
                    </label>
                </div>
                
                {/* 5. Bail/Surety Details (Only shown if B.W. is selected) */}
                {data.warrantType === 'B.W.' && (
                    <>
                        <h3 className="text-lg font-semibold mb-3 text-gray-700 mt-6 border-t pt-4">५. तारण/जामीन तपशील (Bail/Surety Details)</h3>
                        <div className="form-grid">
                            <label>
                                न्यायालयात हजर होण्याची तारीख (Appearance Date):
                                <input
                                    type="date"
                                    name="appearanceDate"
                                    value={data.appearanceDate}
                                    onChange={handleChange}
                                />
                            </label>
                            <label>
                                स्वतःचे तारण रक्कम (Personal Bond Amount - रु.):
                                <input
                                    type="text"
                                    name="personalBondAmount"
                                    value={data.personalBondAmount}
                                    onChange={handleChange}
                                    placeholder="उदा. 20,000/-"
                                />
                            </label>
                            <label>
                                जामीनदार रक्कम (Surety Amount - १ जामीन):
                                <input
                                    type="text"
                                    name="suretyAmount1"
                                    value={data.suretyAmount1}
                                    onChange={handleChange}
                                    placeholder="उदा. 10,000/-"
                                />
                            </label>
                            <label>
                                प्रत्येक जामीनदार रक्कम (Surety Amount - २ जामीन):
                                <input
                                    type="text"
                                    name="suretyAmount2"
                                    value={data.suretyAmount2}
                                    onChange={handleChange}
                                    placeholder="उदा. 10,000/-"
                                />
                            </label>
                        </div>
                    </>
                )}
                
                <h3 className="text-lg font-semibold mb-3 text-gray-700 mt-6 border-t pt-4">वॉरंट जारी करण्याची तारीख</h3>
                <div className="form-grid">
                    <label>
                        वॉरंट जारी करण्याची तारीख (Issue Date):
                        <input
                            type="date"
                            name="issueDate"
                            value={data.issueDate}
                            onChange={handleChange}
                        />
                    </label>
                </div>

                <button onClick={handlePrint} className="print-button mt-6">
                    वॉरंट प्रिंट करा (Print Warrant) 🖨️
                </button>
            </div>

            <hr className="w-full max-w-4xl border-gray-300 my-4" />

            {/* --------------------- Print View Section (A4 Layout) --------------------- */}
            <ArrestWarrantDocument data={data} />
        </div>
    );
};

export default ArrestWarrantApp;
