import {FiPlus} from "react-icons/fi";

const AddButton = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="flex items-center p-2 text-white rounded-full hover:bg-gray-300 transition"
        >
            <FiPlus className="w-6 h-6 text-gray-700 mr-0.5 ml-0.5" />
        </button>
    );
};

export default AddButton;
