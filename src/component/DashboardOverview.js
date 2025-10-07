

import React, { useState } from 'react';
import {
  BarChart2,
  ClipboardList,
  Calendar,
  Users,
  Gavel,
  ChevronDown,
  LogOut,
  Menu,
  UserCircle,
  Briefcase,
  FileText,
} from 'lucide-react';
import DashboardCard from './DashboardCard';
const DashboardOverview = () => {
    // न्यायालयाच्या कामकाजाशी संबंधित नमुना सांख्यिकी (Mock statistics)
    const stats = [
        { title: 'एकूण प्रलंबित खटले (Total Pending Cases)', value: '1,452', icon: <Briefcase size={28} />, bgColor: 'bg-indigo-600', textColor: 'white' },
        { title: 'आज दाखल झालेले नवीन खटले (New Cases Filed Today)', value: '17', icon: <FileText size={28} />, bgColor: 'bg-teal-600', textColor: 'white' },
        { title: 'पुढील ७ दिवसांतील सुनावण्या (Hearings in Next 7 Days)', value: '89', icon: <Calendar size={28} />, bgColor: 'bg-yellow-600', textColor: 'white' },
        { title: 'कर्मचारी उपस्थिती (Staff Attendance)', value: '92%', icon: <Users size={28} />, bgColor: 'bg-red-600', textColor: 'white' },
    ];
    
    const caseSplit = [
        { type: 'दिवाणी (Civil)', count: 580, color: '#3B82F6', percentage: '40%' },
        { type: 'फौजदारी (Criminal)', count: 872, color: '#EF4444', percentage: '60%' },
    ];

    return (
        <div className="space-y-8 p-4">
            {/* सांख्यिकी कार्ड्स (Statistics Cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <DashboardCard key={index} {...stat} />
                ))}
            </div>

            {/* खटला वितरण आणि वेळापत्रक (Case Distribution and Schedule) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* १. प्रलंबित खटला वितरण (Pending Case Distribution - Mock Chart) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-2xl border-l-8 border-indigo-500">
                    <h3 className="text-xl font-semibold text-gray-700 mb-8 flex items-center border-b pb-3">
                        <BarChart2 className="mr-2 text-indigo-500" size={20} />
                        खटला वितरण (Pending Case Distribution Ratio)
                    </h3>
                    <div className="h-64 flex flex-col justify-center items-center">
                        <div className="w-48 h-48 rounded-full bg-gray-100 flex items-center justify-center relative shadow-inner">
                            {/* नमुना पाई चार्ट (Mock Pie Chart) */}
                            <div 
                                className="absolute w-full h-full rounded-full"
                                style={{
                                    backgroundImage: 'conic-gradient(#3B82F6 0 40%, #EF4444 40% 100%)'
                                }}
                            ></div>
                            <div className="w-28 h-28 rounded-full bg-white shadow-lg flex flex-col items-center justify-center ring-4 ring-gray-100">
                                <span className="text-xl font-extrabold text-gray-800">१००%</span>
                                <span className="text-xs text-gray-500">एकूण</span>
                            </div>
                        </div>
                        <div className="mt-6 flex space-x-6">
                            {caseSplit.map((item, index) => (
                                <div key={index} className="flex items-center p-2 rounded-lg bg-gray-50">
                                    <span className={`w-3 h-3 rounded-full mr-2`} style={{ backgroundColor: item.color }}></span>
                                    <span className="text-sm text-gray-700">{item.type}: <span className="font-bold text-indigo-600">{item.percentage}</span></span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* २. आजचे सुनावणी वेळापत्रक (Today's Hearing Schedule - Mock) */}
                <div className="bg-white p-6 rounded-2xl shadow-2xl border-l-8 border-teal-500">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center border-b pb-3">
                        <Calendar className="mr-2 text-teal-500" size={20} />
                        आजची सुनावणी यादी
                    </h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                        {[
                            { time: 'स. १०:३०', case: 'RCC 145/2024', type: 'फौजदारी', judge: 'न्यायाधीश पाटील' },
                            { time: 'स. ११:००', case: 'SCC 22/2023', type: 'दिवाणी', judge: 'न्यायाधीश कुलकर्णी' },
                            { time: 'स. ११:३०', case: 'RCC 87/2024', type: 'फौजदारी', judge: 'न्यायाधीश पाटील' },
                            { time: 'दु. ०२:००', case: 'SCC 40/2024', type: 'दिवाणी', judge: 'न्यायाधीश कुलकर्णी' },
                            { time: 'दु. ०२:३०', case: 'MISC 12/2024', type: 'इतर', judge: 'न्यायाधीश पाटील' },
                            { time: 'दु. ०३:००', case: 'LCS 55/2023', type: 'दिवाणी', judge: 'न्यायाधीश कुलकर्णी' },
                        ].map((hearing, index) => (
                            <div key={index} className="p-3 bg-gray-50 rounded-lg border-l-4 border-indigo-400 hover:bg-indigo-50 transition transform hover:scale-[1.01] cursor-pointer">
                                <p className="text-lg font-bold text-gray-800">{hearing.time} - {hearing.case}</p>
                                <p className="text-sm text-gray-600 flex justify-between">
                                    <span className="font-medium text-teal-600">{hearing.type}</span> 
                                    <span>न्यायाधीश: <span className="font-semibold">{hearing.judge}</span></span>
                                </p>
                            </div>
                        ))}
                        <div className="text-center pt-3">
                            <button className="text-indigo-600 text-sm font-semibold hover:underline flex items-center justify-center mx-auto transition duration-150 p-2 rounded-lg hover:bg-indigo-50">
                                संपूर्ण वेळापत्रक पहा <ChevronDown size={16} className="ml-1" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default DashboardOverview