import React, { useState } from 'react';
import PrintLayout from './PrintLayout';
import './style.css';

const initialFormData = {
  rccNo: '',
  sccNo: '',
  accusedName: '',
  lawSection: '',
  summonDate: '', // समन्सची तारीख
  currentDate: new Date().toLocaleDateString('en-GB'), // आजची तारीख
  courtLocation: 'मनमाड शहर', 
  policeStation: 'मनमाड शहर',
  witnesses: [
    { name: '', address: '' },
  ],
};

const SummonsForm = () => {
  const [formData, setFormData] = useState(initialFormData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleWitnessChange = (index, field, value) => {
    const newWitnesses = formData.witnesses.map((witness, i) => {
      if (i === index) {
        return { ...witness, [field]: value };
      }
      return witness;
    });
    setFormData((prev) => ({ ...prev, witnesses: newWitnesses }));
  };
  
  const handleAddWitness = () => {
    setFormData(prev => ({
      ...prev,
      witnesses: [...prev.witnesses, { name: '', address: '' }]
    }));
  };


  // प्रिंट हाताळणी (Print Handler)
  const handlePrint = () => {
    const printContent = document.getElementById('print-area').innerHTML;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>साक्षीरारास समन्स</title>');
    
    // A4 आणि प्रिंटसाठी आवश्यक स्टाईल्स (सिंगल पेजसाठी ऑप्टिमाइझ्ड)
    printWindow.document.write('<style>');
    printWindow.document.write(`
      @page { size: A4; margin: 15mm 25mm 15mm 25mm; } 
      body { 
          font-family: 'Arial', sans-serif; 
          font-size: 10.5pt;
          line-height: 1.2;
          margin: 0;
      }
      .a4-page {
          width: 100%;
          padding: 0;
      }
      .align-center { text-align: center; }
      .align-right { text-align: right; }
      .case-numbers { display: flex; justify-content: space-between; margin-top: 5px; }
      .witness-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
      .witness-table th, .witness-table td { border: 1px solid black; padding: 2px 4px; }
      .data-placeholder { text-decoration: underline; font-weight: bold; }
      
      .court-title { font-size: 13pt; margin-bottom: 2px; line-height: 1.2;}
      .court-slogan { font-size: 18pt; margin: 5px 0 10px 0; }
      
      .body-paragraph {
          text-align: justify;
          text-indent: 1em;
          margin-bottom: 5px;
      }
      
      .footer-section { 
          margin-top: 30px; 
          display: flex; 
          justify-content: space-between; 
          align-items: flex-end; 
          width: 100%;
          font-size: 11pt;
      }
      .signature-block { 
          text-align: center;
          width: 40%;
          line-height: 1.1;
      }
      @media print {
        -webkit-print-color-adjust: exact !important; 
        color-adjust: exact !important;
      }
    `);
    printWindow.document.write('</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write('<div class="a4-page">');
    printWindow.document.write(printContent);
    printWindow.document.write('</div>');
    printWindow.document.write('</body></html>');
    
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="form-container">
      <h2>साक्षीरारास समन्स - माहिती भरा</h2>
      
      <button onClick={handlePrint} className="print-button">
        प्रिंट करा 🖨️
      </button>

      {/* कोर्टाच्या ठिकाणाची इनपुट फील्ड्स */}
      <div className="input-group">
        <label>न्यायालयाचे ठिकाण:</label>
        <input type="text" name="courtLocation" value={formData.courtLocation} onChange={handleInputChange} />
      </div>
      <div className="input-group">
        <label>पोलीस स्टेशनचे ठिकाण:</label>
        <input type="text" name="policeStation" value={formData.policeStation} onChange={handleInputChange} />
      </div>

      {/* केस क्रमांक */}
      <div className="input-group">
        <label>R-C-C. No.:</label>
        <input type="text" name="rccNo" value={formData.rccNo} onChange={handleInputChange} />
      </div>
      <div className="input-group">
        <label>S-C-C. No.:</label>
        <input type="text" name="sccNo" value={formData.sccNo} onChange={handleInputChange} />
      </div>

      {/* आरोपी आणि कलम */}
      <div className="input-group">
        <label>आरोपीचे नांव:</label>
        <input type="text" name="accusedName" value={formData.accusedName} onChange={handleInputChange} />
      </div>
      <div className="input-group">
        <label>कायदा/कलम:</label>
        <input type="text" name="lawSection" value={formData.lawSection} onChange={handleInputChange} />
      </div>

      {/* समन्सची तारीख 🔴 हे फील्ड सुनिश्चित करा */}
      <div className="input-group">
        <label>समन्सची तारीख (दिनांक):</label>
        <input type="date" name="summonDate" value={formData.summonDate} onChange={handleInputChange} />
      </div>

      {/* साक्षदार यादी */}
      <h3>साक्षीदारांची यादी</h3>
      <table className="witness-input-table">
        <thead>
          <tr>
            <th>अ.क्र</th>
            <th>साक्षीदाराचे नांव</th>
            <th>राहणार (पत्ता)</th>
          </tr>
        </thead>
        <tbody>
          {formData.witnesses.map((witness, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <input
                  type="text"
                  value={witness.name}
                  onChange={(e) => handleWitnessChange(index, 'name', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={witness.address}
                  onChange={(e) => handleWitnessChange(index, 'address', e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <button onClick={handleAddWitness} className="add-button">
        + साक्षदार जोडा
      </button>
      
      {/* आजची तारीख 🔴 हे फील्ड सुनिश्चित करा */}
      <div className="input-group" style={{marginTop: '20px'}}>
        <label>आजची तारीख (दिनांक):</label>
        <input 
            type="text" 
            name="currentDate" 
            value={formData.currentDate} 
            onChange={handleInputChange} 
            placeholder="DD/MM/YYYY"
        />
      </div>


      {/* प्रिंटसाठी लपवलेला भाग */}
      <div id="print-area" style={{ display: 'none' }}>
        <PrintLayout data={formData} />
      </div>
    </div>
  );
};

export default SummonsForm;