import { Settings } from "lucide-react";

const Placeholder = ({ title }) => (
    <div className="p-8 bg-white rounded-2xl shadow-xl border-t-4 border-indigo-500 min-h-[50vh] flex flex-col items-center justify-center">
        <Settings size={64} className="text-indigo-400 mb-4 animate-pulse" />
        <h1 className="text-3xl font-bold text-gray-800 text-center">{title} (विकसित होत आहे...)</h1>
        <p className="mt-3 text-lg text-gray-600 text-center max-w-lg">
            हा विभाग सध्या विकसित होत आहे. नवीनतम कार्यक्षमता पाहण्यासाठी लवकरच तपासा.
        </p>
    </div>
);
export default Placeholder


// /frontend/src/App.js
