
const CulculateButton = ({ onClick,disabled }) => {
    return (
        <button
            onClick={onClick}
            className="flex items-center p-4 h-8 bg-gray-700 mt-3 text-white rounded-full hover:bg-gray-600 mb-2 transition"
            disabled = {disabled}
        >
            <span className="text-white">Рассчитать</span>
        </button>
    );
};

export default CulculateButton;
