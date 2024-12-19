import {AiOutlineBarChart} from "react-icons/ai";

const StatisticButton = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="flex items-center px-4 py-1 bg-gray-800 text-white rounded-full hover:bg-gray-600 transition ml-2 mb-1 "
        >
            <AiOutlineBarChart className=" text-white mr-0.5 ml-0.5"/>
            <span className="text-white">Статистика</span>
        </button>
    );
};

export default StatisticButton;
