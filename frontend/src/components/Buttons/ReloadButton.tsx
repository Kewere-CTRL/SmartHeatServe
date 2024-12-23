import {TfiReload} from "react-icons/tfi";

const ReloadButton = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="flex items-center p-2 text-white rounded-full hover:bg-gray-300 transition"
        >
            <TfiReload className="w-5 h-5 text-gray-700 mr-0.5 ml-0.5" />
        </button>
    );
};

export default ReloadButton;
