import React, { useState, useMemo } from 'react';

// Lucide React Icons for a professional look
import { 
    Menu, BarChart2, Calendar, FileText, Users, Briefcase, ChevronDown, 
    ClipboardList, LogOut, Settings, UserCircle, 
    Gavel
} from 'lucide-react'; 
import SummonsFormInput from './component/SummonsFormInput';
import Placeholder from './component/Placeholder';
import DashboardOverview from './component/DashboardOverview';


const App = () => {
    // नेव्हिगेशनसाठी स्थिती व्यवस्थापन (State management for navigation)
    const [currentPage, setCurrentPage] = useState('dashboard'); 
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // नेव्हिगेशन लिंक्स (Navigation Links) - मराठीमध्ये सुधारित
    const navItems = [
        { id: 'dashboard', name: 'मुख्य डॅशबोर्ड (Dashboard)', icon: <BarChart2 size={20} /> },
        { id: 'applications', name: 'अर्ज व्यवस्थापन (Applications)', icon: <ClipboardList size={20} /> },
        { id: 'schedule', name: 'सुनावणी वेळापत्रक (Schedule)', icon: <Calendar size={20} /> },
        { id: 'stats', name: 'खटला सांख्यिकी (Statistics)', icon: <BarChart2 size={20} /> },
        { id: 'staff', name: 'कर्मचारी व्यवस्थापन (Staff)', icon: <Users size={20} /> },
    ];

    // अर्ज उप-मेनू (Applications Sub-menu)
    const applicationForms = [
        { id: 'summons', name: 'समन्स अर्ज (Summons Application)', component: SummonsFormInput },
        { id: 'warrant', name: 'वॉरंट अर्ज (Warrant Application)', component: Placeholder },
    ];

    // वर्तमान पृष्ठानुसार सामग्री प्रस्तुत करण्यासाठी फंक्शन (Function to render content)
    const renderContent = () => {
        // जर अर्ज उप-मेनूमध्ये असेल, तर तो घटक रेंडर करा
        const appForm = applicationForms.find(form => form.id === currentPage);
        if (appForm) {
            const FormComponent = appForm.component;
            // Placeholders are given the title via prop
            const titleProp = appForm.id !== 'summons' ? { title: appForm.name } : {};
            return <FormComponent {...titleProp} />;
        }
        
        // इतर मुख्य पृष्ठांसाठी
        switch (currentPage) {
            case 'dashboard':
                return <DashboardOverview />;
            case 'schedule':
                return <Placeholder title="सुनावणी वेळापत्रक (Hearing Schedule)" />;
            case 'stats':
                return <Placeholder title="खटला सांख्यिकी (Case Statistics)" />;
            case 'staff':
                return <Placeholder title="कर्मचारी व्यवस्थापन (Staff Management)" />;
            default:
                return <DashboardOverview />;
        }
    };

    return (
        // मुख्य कंटेनर आणि लेआउट (Main container and layout)
        <div className="bg-gray-100 min-h-screen font-sans flex text-gray-800"> 
            
            {/* 🚨 प्रिंट CSS: हे सुनिश्चित करते की फक्त A4 पृष्ठ प्रिंट होईल, संपूर्ण विंडो नाही. */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Tinos:ital,wght@0,400;0,700;1,400&display=swap');
                
                body { font-family: 'Inter', sans-serif; }
                .summons-content { font-family: 'Tinos', serif; } /* Use a serif font for formal documents */
                
                .a4-page {
                    width: 210mm; 
                    box-sizing: border-box;
                    transition: transform 0.3s ease-in-out;
                }
                .a4-page:hover {
                    transform: translateY(-5px); 
                }
                .indent-8 {
                    text-indent: 2rem;
                }
                .a4-page-preview {
                    border: 3px dashed #3182CE; 
                    box-shadow: 0 0 15px rgba(0, 0, 0, 0.4); 
                }
                /* Print Styles - Hides the entire dashboard structure except the A4 content */
                @media print {
                    @page { 
                        size: A4; 
                        margin: 15mm; 
                    }
                    body {
                        -webkit-print-color-adjust: exact !important; 
                        color-adjust: exact !important; 
                        background-color: white !important; 
                        font-size: 11pt; 
                        margin: 0 !important;
                        padding: 0 !important;
                    }
                    /* साइडबार आणि इनपुट फॉर्म लपवते */
                    .no-print, .fixed, .lg\\:relative, header { 
                        display: none !important;
                    }
                    /* प्रिंटसाठी मुख्य सामग्री क्षेत्राला पूर्ण रुंदीवर रीसेट करते */
                    .flex-1 {
                        flex: 1 1 100% !important; 
                        max-width: 100% !important;
                    }
                    .print-preview {
                        width: 100% !important;
                        justify-content: flex-start !important;
                        padding: 0 !important;
                        margin: 0 !important;
                    }
                    /* अंतिम A4 दस्तऐवज रीसेट */
                    .a4-page {
                        box-shadow: none !important;
                        min-height: auto !important;
                        margin: 0 !important;
                        border: none !important;
                        padding: 0 !important; 
                        width: 100% !important;
                        height: auto !important;
                    }
                    .a4-page-preview {
                        border: none !important;
                        box-shadow: none !important;
                    }
                    .signature-margin {
                        margin-top: 100pt; 
                    }
                }
            `}</style>

            {/* १. साइडबार - नेव्हिगेशन */}
            <div 
                className={`fixed lg:relative w-64 min-h-screen bg-indigo-800 text-white z-20 
                    transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                    lg:translate-x-0 shadow-2xl`}
            >
                {/* लोगो/शीर्षक (Logo/Title) */}
                <div className="p-6 text-2xl font-extrabold border-b border-indigo-700 tracking-wider flex items-center bg-indigo-900">
                    <Gavel className="mr-3 text-teal-400" size={28} />
                    मनमाड न्यायालयीन कार्यालय
                </div>

                {/* नेव्हिगेशन लिंक्स (Navigation Links) */}
                <nav className="p-4 space-y-2">
                    {navItems.map(item => (
                        <React.Fragment key={item.id}>
                            <button
                                onClick={() => {
                                    // 'Applications' वर क्लिक केल्यास, डीफॉल्टनुसार 'summons' उघडा किंवा थेट पृष्ठावर जा
                                    if (item.id === 'applications') {
                                        setCurrentPage('summons');
                                    } else {
                                        setCurrentPage(item.id);
                                    }
                                    setIsSidebarOpen(false);
                                }}
                                className={`w-full flex items-center p-3 rounded-xl transition duration-200 text-left 
                                    ${(currentPage === item.id && item.id !== 'applications') || (item.id === 'applications' && applicationForms.some(form => form.id === currentPage))
                                        ? 'bg-teal-500 text-white shadow-lg font-bold' 
                                        : 'hover:bg-indigo-700 text-indigo-100 hover:text-white'}`
                                }
                            >
                                {item.icon}
                                <span className="ml-3 text-lg">{item.name}</span>
                                {item.id === 'applications' && <ChevronDown size={16} className="ml-auto" />}
                            </button>
                            
                            {/* अर्ज उप-मेनू (Sub-menu for Applications) */}
                            {item.id === 'applications' && applicationForms.some(form => form.id === currentPage) && (
                                <div className="ml-6 mt-1 border-l-2 border-indigo-500 space-y-1">
                                    {applicationForms.map(form => (
                                        <button
                                            key={form.id}
                                            onClick={() => {
                                                setCurrentPage(form.id);
                                                setIsSidebarOpen(false);
                                            }}
                                            className={`w-full text-left p-2 rounded-r-lg transition duration-200 text-base 
                                                ${currentPage === form.id 
                                                    ? 'bg-indigo-600 text-yellow-300 font-semibold' 
                                                    : 'hover:bg-indigo-700 text-indigo-200'}`
                                            }
                                        >
                                            <span className="ml-1">- {form.name}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                    <div className="absolute bottom-4 w-full p-4">
                         <button className="w-full flex items-center p-3 rounded-xl transition duration-200 text-left hover:bg-indigo-700 text-indigo-200">
                             <LogOut size={20} />
                             <span className="ml-3 text-lg">बाहेर पडा (Logout)</span>
                         </button>
                    </div>
                </nav>
            </div>

            {/* २. मुख्य सामग्री (Main Content) */}
            <div className="flex-1 flex flex-col overflow-y-auto">
                
                {/* शीर्षलेख (Header) */}
                <header className="bg-white shadow-lg p-4 sticky top-0 z-10 flex items-center justify-between no-print border-b border-gray-200">
                    
                    {/* हॅम्बर्गर बटण (Hamburger Button - Mobile Menu) */}
                    <button 
                        className="lg:hidden p-2 rounded-lg text-indigo-600 hover:bg-gray-100 transition"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        <Menu size={28} />
                    </button>
                    
                    {/* वर्तमान शीर्षक (Current Title) */}
                    <h2 className="text-2xl font-bold text-gray-700 sm:ml-4">
                        {/* वर्तमान पृष्ठाचे नाव दाखवा */}
                        {navItems.find(item => item.id === currentPage)?.name || 
                         applicationForms.find(form => form.id === currentPage)?.name || 
                         'मनमाड कोर्ट डॅशबोर्ड'}
                    </h2>

                    {/* वापरकर्ता प्रोफाइल (User Profile Mock) */}
                    <div className="flex items-center space-x-3 cursor-pointer p-2 rounded-full hover:bg-gray-100 transition">
                        <UserCircle size={28} className="text-indigo-500" />
                        <span className="text-sm font-medium text-gray-700 hidden sm:inline">उपयोगकर्ता (User ID)</span>
                    </div>
                </header>

                {/* सामग्री रेंडर क्षेत्र (Content Rendering Area) */}
                <main className="flex-1 p-4 md:p-8">
                    {renderContent()}
                </main>
                
                {/* फूट्टर (Footer) */}
                <footer className="bg-white text-center p-3 text-xs text-gray-400 border-t mt-auto no-print">
                    न्यायालयीन व्यवस्थापन प्रणाली &copy; {new Date().getFullYear()} | मनमाड न्यायिक जिल्हा.
                </footer>
            </div>
            
            {/* मोबाईलसाठी बॅकड्रॉप (Mobile Backdrop) */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black opacity-50 z-10 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}
        </div>
    );
};

export default App;