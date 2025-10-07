const DashboardCard = ({ title, value, icon, bgColor, textColor }) => (
    <div 
        className={`p-6 rounded-2xl shadow-xl transition-transform duration-300 hover:scale-[1.02] ${bgColor} text-${textColor} 
                   flex items-center justify-between border-b-4 border-opacity-70 border-white/50`}
    >
        <div>
            {/* शीर्षक (Title) */}
            <p className="text-sm font-semibold opacity-90">{title}</p>
            {/* मूल्य (Value) */}
            <h2 className="text-4xl font-extrabold mt-1">{value}</h2>
        </div>
        <div className={`p-3 rounded-full bg-white/30 text-${textColor}`}>
            {icon}
        </div>
    </div>
);
export default DashboardCard