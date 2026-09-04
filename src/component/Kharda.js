import React, { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const CourtDiaryFinalFix = () => {
  const [rawData, setRawData] = useState([]);
  const [selection, setSelection] = useState({ start: '', end: '', all: false });
  const [caseType, setCaseType] = useState('civil'); 
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary', cellDates: true });
      const json = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);

      const mappedData = json.map(row => {
        const getVal = (targets) => {
          const key = Object.keys(row).find(k => 
            targets.some(t => k.trim().toLowerCase() === t.toLowerCase())
          );
          return key ? row[key] : "";
        };

        let rawDate = getVal(['Next Date', 'Date']);
        let formattedDate = null;

        if (rawDate instanceof Date) {
          formattedDate = rawDate;
        } else if (typeof rawDate === 'string') {
          const parts = rawDate.split(/[-/]/);
          if (parts.length === 3) {
            formattedDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
          }
        }

        return {
          caseNum: getVal(['Cases', 'Case Number', 'Case']),
          nextDate: formattedDate,
          purpose: getVal(['Next Purpose', 'Purpose'])
        };
      }).filter(item => item.caseNum && item.nextDate);

      setRawData(mappedData);
    };
    reader.readAsBinaryString(file);
  };

  // Helper logic for categorization
  const getStageCategory = (purpose) => {
    const p = String(purpose).toLowerCase();
    if (p.includes('judgment') || p.includes('order')) return 'Judgment';
    if (p.includes('argument')) return 'Arguments';
    if (p.includes('part heard')) return 'Evidence PH';
    if (p.includes('evidence') || p.includes('witness')) return 'Evidence';
    if (p.includes('issue')) return 'Issues';
    if (p.includes('hearing') || p.includes('say') || p.includes('compliance') || 
        p.includes('summons') || p.includes('notice') || p.includes('citation') || 
        p.includes('steps') || p.includes('awaiting') || p.includes('amended')) return 'Hearing';
    return 'Other';
  };

  const filteredData = useMemo(() => {
    if (selection.all) return rawData;
    if (!selection.start || !selection.end) return [];

    const startDate = new Date(selection.start);
    startDate.setHours(0,0,0,0);
    const endDate = new Date(selection.end);
    endDate.setHours(23,59,59,999);

    return rawData.filter(item => {
      const d = item.nextDate;
      return d >= startDate && d <= endDate;
    });
  }, [rawData, selection]); // Dependencies fixed

const generatePDF = () => {
    if (filteredData.length === 0) return alert("No records selected!");
    setIsLoading(true);
    
    setTimeout(() => {
      const doc = new jsPDF('p', 'mm', 'a4');
      let currentY = 15;

      const dateGroups = filteredData.reduce((acc, row) => {
        const dStr = row.nextDate.toLocaleDateString('en-GB').replace(/\//g, '-');
        if (!acc[dStr]) acc[dStr] = [];
        acc[dStr].push(row);
        return acc;/* ---------------------------------------------------- */
/* २. फॉर्म (नवीन नोंदणी किंवा एडिट करण्यासाठी एकच फॉर्म) */
/* ---------------------------------------------------- */
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export function AddEmployeeForm({ editingData, allEmployees = [], onSaveComplete, onCancelEdit }) {
  const [formData, setFormData] = useState({
    id: '',
    employeeName: '',
    employeeType: 'Clerk', 
    employeeRole: '',
    clerkSubtype: '', 
    employeeId: '',
    gender: 'Male',
    panNumber: '',
    basicSalary: '',
    flowerNumber: '',
    roomNumber: '',
    roomType: 'General',
    sectionName: '',
    officeStation: '',
    judgeDesignation: '',
    designation: '', 
    mobileNo: '',
    underTaluka: 'Nashik (HQ)',
    underOfficeOrCourt: '',
    underJudicialOfficer: '',
    joiningDate: '',
    officeJoiningDate: '',
    transferHistory: [],
    takenLeaves: [],
    officersDuration: []
  });

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://172.16.171.96:5000/api';

  const [isCustomCourt, setIsCustomCourt] = useState(false);
  const [customCourtInput, setCustomCourtInput] = useState('');
  const [isCustomSection, setIsCustomSection] = useState(false);
  const [customSectionInput, setCustomSectionInput] = useState('');
  const [isCustomFloor, setIsCustomFloor] = useState(false);
  const [customFloorInput, setCustomFloorInput] = useState('');
  const [isCustomRole, setIsCustomRole] = useState(false);
  const [customRoleInput, setCustomRoleInput] = useState('');

  const defaultRoles = [
    "Clerk", "Peon", "Bailiff", "Driver", "Judge", 
    "Stenographer", "Assistant Superintendent", "Superintendent", "Judicial Officer"
  ];

  const defaultSections = [
    "General", "Court Hall", "Chamber", "Record Room", 
    "Computer", "Paybill", "Inward Outward", "EST Room", 
    "Building", "Muddemal", "Stationary"
  ];

  const defaultFloors = ["1", "2", "3", "4", "5", "6", "7", "Ground Floor"];

  const envCourtsString = process.env.REACT_APP_NASHIK_COURTS || "";
  const defaultCourts = [
    "District and Sessions Court, Nashik",
    "Civil Court Senior Division, Nashik",
    "Civil Court Junior Division, Nashik",
    "Chief Judicial Magistrate Court, Nashik",
    "Civil Court Senior Division, Malegaon",
    "Civil Court Junior Division, Malegaon",
    "Civil Court Senior Division, Niphad",
    "Civil Court Junior Division, Niphad",
    "Civil Court Senior Division, Sinnar",
    "Civil Court Junior Division, Sinnar",
    "Civil Court Senior Division, Yeola",
    "Civil Court Junior Division, Yeola",
    "Civil Court Senior Division, Chandwad",
    "Civil Court Junior Division, Chandwad",
    "Civil Court Senior Division, Kalwan",
    "Civil Court Junior Division, Kalwan",
    "Civil Court Senior Division, Dindori",
    "Civil Court Junior Division, Dindori",
    "Civil Court Senior Division, Igatpuri",
    "Civil Court Junior Division, Igatpuri",
    "Civil Court Senior Division, Trimbakeshwar",
    "Civil Court Junior Division, Trimbakeshwar",
    "Civil Court Senior Division, Peth",
    "Civil Court Junior Division, Peth",
    "Civil Court Senior Division, Surgana",
    "Civil Court Junior Division, Surgana",
    "Labour Court, Nashik",
    "Industrial Court, Nashik",
    "Cooperative Court, Nashik"
  ];

  const nashikCourtsList = envCourtsString.trim() 
    ? envCourtsString.split(',').map(c => c.trim()) 
    : defaultCourts;

  const uniqueJudges = [...new Set(
    allEmployees
      .filter(emp => {
        const role = (emp.employeeRole || '').trim().toLowerCase();
        const type = (emp.employeeType || '').trim().toLowerCase();
        return role === 'judge' || role === 'judicial officer' || type === 'judge' || type === 'judicial officer' || emp.underJudicialOfficer;
      })
      .map(emp => emp.underJudicialOfficer || (['judge', 'judicial officer'].includes((emp.employeeRole || '').toLowerCase()) ? emp.employeeName : ''))
      .filter(Boolean)
  )];

  useEffect(() => {
    if (editingData) {
      setFormData(editingData);
      
      if (editingData.employeeRole && !defaultRoles.includes(editingData.employeeRole)) {
        setIsCustomRole(true);
        setCustomRoleInput(editingData.employeeRole);
      } else {
        setIsCustomRole(false);
        setCustomRoleInput('');
      }

      if (editingData.underOfficeOrCourt && !nashikCourtsList.includes(editingData.underOfficeOrCourt)) {
        setIsCustomCourt(true);
        setCustomCourtInput(editingData.underOfficeOrCourt);
      } else {
        setIsCustomCourt(false);
        setCustomCourtInput('');
      }

      if (editingData.sectionName && !defaultSections.includes(editingData.sectionName)) {
        setIsCustomSection(true);
        setCustomSectionInput(editingData.sectionName);
      } else {
        setIsCustomSection(false);
        setCustomSectionInput('');
      }

      if (editingData.flowerNumber && !defaultFloors.includes(editingData.flowerNumber)) {
        setIsCustomFloor(true);
        setCustomFloorInput(editingData.flowerNumber);
      } else {
        setIsCustomFloor(false);
        setCustomFloorInput('');
      }
    }
  }, [editingData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const finalEmployeeRole = isCustomRole ? customRoleInput : formData.employeeRole;
    const finalOfficeOrCourt = isCustomCourt ? customCourtInput : formData.underOfficeOrCourt;
    const finalSectionName = isCustomSection ? customSectionInput : formData.sectionName;
    const finalFlowerNumber = isCustomFloor ? customFloorInput : formData.flowerNumber;

    let updatedOfficersDuration = formData.officersDuration || formData.tenureHistory || [];
    const changeDate = formData.officeJoiningDate || new Date().toISOString().split('T')[0];

    if (formData.underJudicialOfficer && formData.underJudicialOfficer.trim() !== '') {
      const lastTenure = updatedOfficersDuration[updatedOfficersDuration.length - 1];
      if (!lastTenure || lastTenure.judgeName !== formData.underJudicialOfficer) {
        updatedOfficersDuration = updatedOfficersDuration.map(tenure => {
          if (!tenure.toDate || tenure.toDate === '') {
            return { ...tenure, toDate: changeDate };
          }
          return tenure;
        });

        updatedOfficersDuration.push({
          judgeName: formData.underJudicialOfficer,
          fromDate: changeDate,
          toDate: '',
          stationName: finalOfficeOrCourt || '-'
        });
      }
    }

    const dataToSend = { 
      ...formData, 
      employeeRole: finalEmployeeRole,
      underOfficeOrCourt: finalOfficeOrCourt,
      sectionName: finalSectionName,
      flowerNumber: finalFlowerNumber,
      officersDuration: updatedOfficersDuration,
      tenureHistory: updatedOfficersDuration
    };

    try {
      if (formData.id || formData._id) {
        const targetId = formData.id || formData._id;
        await axios.put(`${API_BASE_URL}/employees/${targetId}`, dataToSend);
        alert('✅ कर्मचाऱ्याची माहिती यशस्वीरीत्या अपडेट झाली!');
      } else {
        await axios.post(`${API_BASE_URL}/employees`, dataToSend);
        alert('✅ नवीन कर्मचाऱ्याची माहिती यशस्वीरीत्या सेव्ह झाली!');
      }
      if (onSaveComplete) onSaveComplete();
    } catch (err) {
      console.error("Save/Update Error:", err);
      alert('🛑 डेटा सेव्ह/अपडेट करताना एरर आला.');
    }
  };

  return (
    <div style={cardWrapperStyle}>
      <div style={cardHeaderStyle}>
        <h2 style={{margin: 0, fontSize: '18px', color: '#1e293b'}}>
          {(formData.id || formData._id) ? '✏️ Edit Employee Record' : '➕ Add New Employee Record'}
        </h2>
        {(formData.id || formData._id) && (
          <button type="button" onClick={onCancelEdit} style={cancelBtnStyle}>
            ✖ Cancel
          </button>
        )}
      </div>
      
      <form onSubmit={handleSubmit} style={formStyle}>
        
        {/* युनिट १ */}
        <div style={sectionBoxStyle}>
          <h3 style={sectionHeadingStyle}>👤 मूलभूत माहिती (Basic Details)</h3>
          <div style={gridStyle}>
            <div>
              <label style={labelStyle}>कर्मचाऱ्याचे पूर्ण नाव:</label>
              <input type="text" name="employeeName" value={formData.employeeName || ''} onChange={handleChange} required placeholder="उदा. राहुल पाटील" style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>लिंग (Gender):</label>
              <select name="gender" value={formData.gender || 'Male'} onChange={handleChange} style={inputStyle}>
                <option value="Male">Male (पुरुष)</option>
                <option value="Female">Female (स्त्री)</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>कर्मचारी पद (Employee Role):</label>
              {!isCustomRole ? (
                <select 
                  name="employeeRole"
                  value={formData.employeeRole || ''} 
                  onChange={(e) => {
                    const selectedRole = e.target.value;
                    if (selectedRole === 'CUSTOM_ROLE') {
                      setIsCustomRole(true);
                      setFormData(prev => ({ ...prev, employeeRole: '', clerkSubtype: '', designation: '' }));
                    } else {
                      setFormData(prev => ({ 
                        ...prev, 
                        employeeRole: selectedRole, 
                        clerkSubtype: selectedRole !== 'Clerk' ? '' : prev.clerkSubtype,
                        designation: (selectedRole === 'Judge' || selectedRole === 'Stenographer') ? prev.designation : '' 
                      }));
                    }
                  }}
                  style={inputStyle}
                  required
                >
                  <option value="">-- पद निवडा --</option>
                  <option value="Clerk">Clerk (लिपिक)</option>
                  <option value="Peon">Peon (शिपाई)</option>
                  <option value="Bailiff">Bailiff (बिफ)</option>
                  <option value="Driver">Driver (वाहनचालक)</option>
                  <option value="Judge">Judge (न्यायाधीश)</option>
                  <option value="Stenographer">Stenographer (लघुलेखक)</option>
                  <option value="Assistant Superintendent">Assistant Superintendent</option>
                  <option value="Superintendent">Superintendent</option>
                  <option value="Judicial Officer">Judicial Officer</option>
                  <option value="CUSTOM_ROLE" style={{ fontWeight: 'bold', color: '#2563eb' }}>➕ इतर पद...</option>
                </select>
              ) : (
                <div style={{ display: 'flex', gap: '5px' }}>
                  <input type="text" placeholder="पदाचे नाव लिहा" value={customRoleInput} onChange={(e) => setCustomRoleInput(e.target.value)} style={inputStyle} required />
                  <button type="button" onClick={() => { setIsCustomRole(false); setCustomRoleInput(''); }} style={smallBtnStyle}>⬅️</button>
                </div>
              )}
            </div>

            {formData.employeeRole === 'Clerk' && (
              <div>
                <label style={labelStyle}>लिपिक प्रकार:</label>
                <select name="clerkSubtype" value={formData.clerkSubtype || ''} onChange={handleChange} style={inputStyle} required>
                  <option value="">-- निवडा --</option>
                  <option value="Senior Clerk">Senior Clerk</option>
                  <option value="Junior Clerk">Junior Clerk</option>
                </select>
              </div>
            )}

            {formData.employeeRole === 'Judge' && (
              <div>
                <label style={labelStyle}>न्यायाधीश पद:</label>
                <select name="designation" value={formData.designation || ''} onChange={handleChange} style={inputStyle}>
                  <option value="">-- निवडा --</option>
                  <option value="Principal District Judge">Principal District Judge</option>
                  <option value="Additional Sessions Judge">Additional Sessions Judge</option>
                  <option value="Civil Judge Senior Division">Civil Judge Senior Division</option>
                  <option value="Civil Judge Junior Division">Civil Judge Junior Division</option>
                  <option value="Chief Judicial Magistrate">Chief Judicial Magistrate</option>
                </select>
              </div>
            )}

            {formData.employeeRole === 'Stenographer' && (
              <div>
                <label style={labelStyle}>स्टेनो ग्रेड:</label>
                <select name="designation" value={formData.designation || ''} onChange={handleChange} style={inputStyle}>
                  <option value="">-- ग्रेड निवडा --</option>
                  <option value="Steno Grade-I">Steno Grade-I</option>
                  <option value="Steno Grade-II">Steno Grade-II</option>
                  <option value="Steno Grade-III">Steno Grade-III</option>
                </select>
              </div>
            )}

            <div>
              <label style={labelStyle}>कर्मचारी आयडी:</label>
              <input type="text" name="employeeId" value={formData.employeeId || ''} onChange={handleChange} placeholder="EMP-001" style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>पॅन नंबर:</label>
              <input type="text" name="panNumber" value={formData.panNumber || ''} onChange={handleChange} maxLength="10" placeholder="ABCDE1234F" style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>मूळ वेतन:</label>
              <input type="number" name="basicSalary" value={formData.basicSalary || ''} onChange={handleChange} placeholder="उदा. 125000" style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>मोबाईल नंबर:</label>
              <input type="text" name="mobileNo" value={formData.mobileNo || ''} onChange={handleChange} placeholder="9876543210" style={inputStyle} />
            </div>
          </div>
        </div>

        {/* युनिट २ */}
        <div style={sectionBoxStyle}>
          <h3 style={sectionHeadingStyle}>🏛️ ऑफिस व लोकेशन माहिती (Office Details)</h3>
          <div style={gridStyle}>
            <div>
              <label style={labelStyle}>रूम नंबर:</label>
              <input type="text" name="roomNumber" value={formData.roomNumber || ''} onChange={handleChange} placeholder="Room 105" style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>फ्लोअर नंबर:</label>
              {!isCustomFloor ? (
                <select 
                  name="flowerNumber"
                  value={formData.flowerNumber || ''} 
                  onChange={(e) => {
                    if (e.target.value === 'CUSTOM_FLOOR') {
                      setIsCustomFloor(true);
                      setFormData(prev => ({ ...prev, flowerNumber: '' }));
                    } else {
                      handleChange(e);
                    }
                  }}
                  style={inputStyle}
                >
                  <option value="">-- फ्लोअर --</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="Ground Floor">Ground Floor</option>
                  <option value="CUSTOM_FLOOR" style={{ color: '#2563eb' }}>➕ इतर...</option>
                </select>
              ) : (
                <div style={{ display: 'flex', gap: '5px' }}>
                  <input type="text" placeholder="फ्लोअर लिहा" value={customFloorInput} onChange={(e) => setCustomFloorInput(e.target.value)} style={inputStyle} required />
                  <button type="button" onClick={() => { setIsCustomFloor(false); setCustomFloorInput(''); }} style={smallBtnStyle}>⬅️</button>
                </div>
              )}
            </div>

            <div>
              <label style={labelStyle}>सेक्शनचे नाव:</label>
              {!isCustomSection ? (
                <select 
                  name="sectionName"
                  value={formData.sectionName || ''} 
                  onChange={(e) => {
                    if (e.target.value === 'CUSTOM_SECTION') {
                      setIsCustomSection(true);
                      setFormData(prev => ({ ...prev, sectionName: '' }));
                    } else {
                      handleChange(e);
                    }
                  }}
                  style={inputStyle}
                >
                  <option value="">-- सेक्शन --</option>
                  {defaultSections.map((sec, index) => (
                    <option key={index} value={sec}>{sec}</option>
                  ))}
                  <option value="CUSTOM_SECTION" style={{ color: '#2563eb' }}>➕ इतर...</option>
                </select>
              ) : (
                <div style={{ display: 'flex', gap: '5px' }}>
                  <input type="text" placeholder="सेक्शन लिहा" value={customSectionInput} onChange={(e) => setCustomSectionInput(e.target.value)} style={inputStyle} required />
                  <button type="button" onClick={() => { setIsCustomSection(false); setCustomSectionInput(''); }} style={smallBtnStyle}>⬅️</button>
                </div>
              )}
            </div>

            <div>
              <label style={labelStyle}>ऑफिस / कोर्ट:</label>
              {!isCustomCourt ? (
                <select 
                  name="underOfficeOrCourt"
                  value={formData.underOfficeOrCourt || ''} 
                  onChange={(e) => {
                    if (e.target.value === 'CUSTOM_OPTION') {
                      setIsCustomCourt(true);
                      setFormData(prev => ({ ...prev, underOfficeOrCourt: '' }));
                    } else {
                      handleChange(e);
                    }
                  }}
                  style={inputStyle}
                >
                  <option value="">-- कोर्ट निवडा --</option>
                  {nashikCourtsList.map((court, index) => (
                    <option key={index} value={court}>{court}</option>
                  ))}
                  <option value="CUSTOM_OPTION" style={{ color: '#2563eb' }}>➕ इतर...</option>
                </select>
              ) : (
                <div style={{ display: 'flex', gap: '5px' }}>
                  <input type="text" placeholder="कोर्टाचे नाव लिहा" value={customCourtInput} onChange={(e) => setCustomCourtInput(e.target.value)} style={inputStyle} required />
                  <button type="button" onClick={() => { setIsCustomCourt(false); setCustomCourtInput(''); }} style={smallBtnStyle}>⬅️</button>
                </div>
              )}
            </div>

            <div>
              <label style={labelStyle}>न्यायाधीशांचे नाव:</label>
              <input 
                type="text" 
                list="form-judges-list"
                name="underJudicialOfficer"
                value={formData.underJudicialOfficer || ''} 
                onChange={handleChange}
                placeholder="नाव निवडा / टाईप करा"
                style={inputStyle}
              />
              <datalist id="form-judges-list">
                {uniqueJudges.map((judge, idx) => (
                  <option key={idx} value={judge} />
                ))}
              </datalist>
            </div>

            <div>
              <label style={labelStyle}>सेवेत रुजू दिनांक:</label>
              <input type="date" name="joiningDate" value={formData.joiningDate || ''} onChange={handleChange} style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>सध्याच्या ऑफिसमध्ये रुजू:</label>
              <input type="date" name="officeJoiningDate" value={formData.officeJoiningDate || ''} onChange={handleChange} style={inputStyle} />
            </div>
          </div>
        </div>

        {/* सबमिट बटन्स */}
        <div style={footerBtnContainerStyle}>
          {(formData.id || formData._id) && (
            <button type="button" onClick={onCancelEdit} style={cancelActionBtnStyle}>
              Cancel
            </button>
          )}
          <button type="submit" style={saveActionBtnStyle}>
            {(formData.id || formData._id) ? '💾 Update Record' : '💾 Save Record'}
          </button>
        </div>
      </form>
    </div>
  );
}

/* 🌟 नवीन आकर्षक आणि कॉम्पॅक्ट डिझाईनसाठी सीएसएस स्टाईल्स (स्क्रील कमी करणारी) */
const cardWrapperStyle = {
  background: '#ffffff',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
  border: '1px solid #e2e8f0',
  padding: '16px',
  maxWidth: '100%',
  fontFamily: 'sans-serif'
};

const cardHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '2px solid #f1f5f9',
  paddingBottom: '10px',
  marginBottom: '12px'
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
};

const sectionBoxStyle = {
  background: '#f8fafc',
  padding: '10px 12px',
  borderRadius: '6px',
  border: '1px solid #e2e8f0'
};

const sectionHeadingStyle = {
  color: '#334155',
  fontSize: '13px',
  fontWeight: 'bold',
  marginBottom: '8px',
  borderBottom: '1px dashed #cbd5e1',
  paddingBottom: '4px',
  marginTop: 0
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: '10px'
};

const labelStyle = {
  fontSize: '11px',
  fontWeight: '600',
  color: '#475569',
  marginBottom: '3px',
  display: 'block'
};

const inputStyle = {
  width: '100%',
  padding: '6px 8px',
  borderRadius: '4px',
  border: '1px solid #cbd5e1',
  boxSizing: 'border-box',
  background: '#fff',
  fontSize: '12px',
  color: '#1e293b'
};

const smallBtnStyle = {
  background: '#64748b',
  color: '#fff',
  border: 'none',
  padding: '0 8px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '11px'
};

const cancelBtnStyle = {
  background: '#64748b',
  color: '#fff',
  border: 'none',
  padding: '4px 10px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '12px',
  fontWeight: '600'
};

const footerBtnContainerStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '8px',
  marginTop: '5px'
};

const cancelActionBtnStyle = {
  padding: '8px 16px',
  background: '#64748b',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '13px'
};

const saveActionBtnStyle = {
  padding: '8px 20px',
  background: '#0ea5e9',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '13px',
  boxShadow: '0 2px 4px rgba(14, 165, 233, 0.2)'
};
      }, {});

      const sortedDates = Object.keys(dateGroups).sort((a, b) => 
        new Date(a.split('-').reverse().join('-')) - new Date(b.split('-').reverse().join('-'))
      );

      sortedDates.forEach((dateKey) => {
        const records = dateGroups[dateKey];
        const dateObj = records[0].nextDate;
        const dayName = dateObj.toLocaleDateString('en-GB', { weekday: 'long' });

        const stageGroups = { 'Judgment': [], 'Arguments': [], 'Hearing': [], 'Evidence': [], 'Evidence PH': [], 'Issues': [], 'Other': [] };
        records.forEach(r => {
          const cat = getStageCategory(r.purpose);
          stageGroups[cat].push(r.caseNum);
        });

        const maxRows = Math.max(...Object.values(stageGroups).map(arr => arr.length));
        
        // Safety check for page height (maxRows * rowHeight + headers + signature)
        if (currentY + (maxRows * 8) + 30 > 280) { doc.addPage(); currentY = 15; }

        doc.setFontSize(10).setFont("helvetica", "bold");
        doc.text(`DATE: ${dateKey} (${dayName.toUpperCase()}) - ${caseType.toUpperCase()}`, 14, currentY);
        currentY += 5;

        // 1. Added 'S.No' to the header
        let head = [['S.No', 'Judgment', 'Arguments', 'Hearing', 'Evidence', 'Evid. PH']];
        if (caseType === 'civil') head[0].push('Issues');
        head[0].push('Other');

        const body = [];
        for (let i = 0; i < maxRows; i++) {
          // 2. Added Row Index (i + 1) for Serial Number
          let row = [
            i + 1, 
            stageGroups['Judgment'][i] || '', 
            stageGroups['Arguments'][i] || '', 
            stageGroups['Hearing'][i] || '', 
            stageGroups['Evidence'][i] || '', 
            stageGroups['Evidence PH'][i] || ''
          ];
          if (caseType === 'civil') row.push(stageGroups['Issues'][i] || '');
          row.push(stageGroups['Other'][i] || '');
          body.push(row);
        }

        // 3. Added Footer Row for Total Cases
        const totalCases = records.length;
        const footerRow = [
          { content: `TOTAL CASES FOR THE DAY: ${totalCases}`, colSpan: head[0].length, styles: { halign: 'right', fontStyle: 'bold', fillColor: [245, 245, 245] } }
        ];
        body.push(footerRow);

        autoTable(doc, {
          startY: currentY,
          head: head,
          body: body,
          theme: 'grid',
          styles: { fontSize: 7, cellPadding: 1.5, halign: 'center' },
          headStyles: { fillColor: [230, 230, 230], textColor: 0, lineWidth: 0.1 },
          columnStyles: { 0: { cellWidth: 10 } }, // Keep S.No column narrow
          didDrawPage: (data) => { currentY = data.cursor.y; }
        });

        // 4. Presiding Officer Signature
        currentY += 8;
        doc.setFontSize(9).setFont("helvetica", "normal");
        doc.text("Signature of Presiding Officer: __________________________", 120, currentY);
        currentY += 15; 
      });

      doc.save(`Court_Diary_${caseType}.pdf`);
      setIsLoading(false);
    }, 100);
  };


  return (
    <div style={styles.container}>
      {isLoading && <div style={styles.loader}>Generating...</div>}
      <div style={styles.card}>
        <h2 style={{textAlign: 'center', fontSize: '20px'}}>Diary Book Generator</h2>
        
        <div style={styles.uploadArea}>
          <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
          {rawData.length > 0 && <p style={{color: 'green', margin: '5px 0 0 0'}}>✓ {rawData.length} cases loaded</p>}
        </div>

        {rawData.length > 0 && (
          <div style={{marginTop: '20px'}}>
            <div style={styles.radioGroup}>
              <label><input type="radio" checked={caseType === 'civil'} onChange={() => setCaseType('civil')} /> Civil</label>
              <label style={{marginLeft: '15px'}}><input type="radio" checked={caseType === 'criminal'} onChange={() => setCaseType('criminal')} /> Criminal</label>
            </div>

            <div style={{display: 'flex', gap: '5px', marginBottom: '10px'}}>
              <input type="date" style={styles.input} onChange={e => setSelection({...selection, start: e.target.value, all: false})} />
              <input type="date" style={styles.input} onChange={e => setSelection({...selection, end: e.target.value, all: false})} />
            </div>

            <button onClick={() => setSelection(prev => ({...prev, all: !prev.all}))} style={selection.all ? styles.btnActive : styles.btnSec}>
              {selection.all ? "Custom Date Range Mode" : "Select All Records"}
            </button>

            <div style={styles.statBox}>
              Records found: <b>{filteredData.length}</b>
            </div>

            <button onClick={generatePDF} disabled={filteredData.length === 0} style={styles.btnPrimary}>
              Download Compact PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { background: '#f0f2f5', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif' },
  card: { background: '#fff', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', width: '380px' },
  radioGroup: { display: 'flex', justifyContent: 'center', marginBottom: '15px', fontWeight: 'bold' },
  uploadArea: { border: '2px dashed #ccc', padding: '15px', textAlign: 'center', borderRadius: '5px' },
  input: { flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '4px' },
  btnPrimary: { width: '100%', padding: '12px', background: '#000', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
  btnSec: { width: '100%', padding: '10px', background: '#fff', border: '1px solid #ddd', borderRadius: '5px', marginBottom: '10px' },
  btnActive: { width: '100%', padding: '10px', background: '#eef', border: '1px solid #3498db', borderRadius: '5px', marginBottom: '10px' },
  statBox: { padding: '10px', background: '#f9f9f9', textAlign: 'center', marginBottom: '10px', borderRadius: '5px' },
  loader: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(255,255,255,0.8)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px' }
};
           
