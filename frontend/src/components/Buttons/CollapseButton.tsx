

const CollapseButton = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="flex items-center p-2 h-7 bg-gray-700 mt-5 text-white rounded-full hover:bg-gray-600 transition"
        >
            <span className="text-white">Свернуть все</span>
        </button>
    );
};

export default CollapseButton;
