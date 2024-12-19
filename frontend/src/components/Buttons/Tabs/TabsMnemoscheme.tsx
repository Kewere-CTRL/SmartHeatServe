import {AiOutlineTable} from 'react-icons/ai';
import {FaRegObjectGroup} from "react-icons/fa";

interface TabProps {
    tabIndex: number;
    setTabIndex: (index: number) => void;
}

const TabsButtonForAdmin: React.FC<TabProps> = ({ tabIndex, setTabIndex }) => {
    return (
        <div className="tabs inline-flex border-b border-gray-700 justify-center">

            <button
                className={`tab py-2 px-4 text-sm font-medium  text-nowrap border-b-2 flex items-center gap-2 ${
                    tabIndex === 2 ? 'border-gray-800 text-gray-700' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
                onClick={() => setTabIndex(2)}
            >
                <FaRegObjectGroup size={20}/>
                Монитор диспетчера
            </button>
            <button
                className={`tab py-2 px-4 text-sm font-medium text-nowrap border-b-2 flex items-center gap-2 ${
                    tabIndex === 1 ? 'border-gray-800 text-gray-700' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
                onClick={() => setTabIndex(1)}
            >
                <AiOutlineTable size={20}/>
                Настройки
            </button>
        </div>
    );
};

export default TabsButtonForAdmin;
