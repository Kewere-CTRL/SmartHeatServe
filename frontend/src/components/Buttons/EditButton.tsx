import { FaEdit } from 'react-icons/fa';

const EditButton = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className=" p-2 text-white rounded-full hover:bg-gray-300 transition"
        >
            <FaEdit className="w-5 h-5 text-gray-700 mr-0.5 ml-1" />

        </button>
    );
};

export default EditButton;
