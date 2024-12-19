import { FaPlus } from 'react-icons/fa';

const AddButton = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="flex items-center p-2 text-white rounded-full hover:bg-gray-300 transition"
        >
            <FaPlus className="w-4 h-4 text-gray-700 mr-0.5 ml-0.5" />
        </button>
    );
};

export default AddButton;
