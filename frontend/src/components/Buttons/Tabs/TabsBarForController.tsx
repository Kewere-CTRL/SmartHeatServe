import { FaStar } from 'react-icons/fa';

interface TabBarForControllerProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const TabBarForController: React.FC<TabBarForControllerProps> = ({ activeTab, onTabChange }) => {
    return (
        <div>
            <div className="tabs-container flex space-x-2 mb-3">
                <button
                    className={`tab px-3 py-1 rounded-md border border-black text-black ${activeTab === 'all' ? 'bg-gray-200 ' : 'bg-white '} `}
                    onClick={() => onTabChange('all')}
                >
                    Все
                </button>


                <button
                    className={`tab px-3 py-1 rounded-md border border-black text-black flex items-center ${activeTab === 'favorites' ? 'bg-gray-200' : 'bg-white'}`}
                    onClick={() => onTabChange('favorites')}
                >
                    <FaStar className="mr-1 text-gray-700"/>
                    Избранное
                </button>

                <button
                    className={`tab px-3 py-1 rounded-md border border-black text-black ${activeTab === 'settings' ? 'bg-gray-200' : 'bg-white'}`}
                    onClick={() => onTabChange('settings')}
                >
                    Уставки
                </button>

                <button
                    className={`tab px-3 py-1 rounded-md border border-black text-black ${activeTab === 'inputs' ? 'bg-gray-200' : 'bg-white'}`}
                    onClick={() => onTabChange('inputs')}
                >
                    Входы
                </button>

                <button
                    className={`tab px-3 py-1 rounded-md border border-black text-black ${activeTab === 'outputs' ? 'bg-gray-200' : 'bg-white'}`}
                    onClick={() => onTabChange('outputs')}
                >
                    Выходы
                </button>
            </div>

            <div className="tabs-container space-x-2 flex mb-3 mt-2">
                <button
                    className={`tab px-3 py-1 rounded-md border border-black text-black ${activeTab === 'control' ? 'bg-gray-200' : 'bg-white'}`}
                    onClick={() => onTabChange('control')}
                >
                    Настройки
                </button>

                <button
                    className={`tab px-3 py-1 rounded-md border border-black text-black ${activeTab === 'accidents' ? 'bg-gray-200' : 'bg-white'}`}
                    onClick={() => onTabChange('accidents')}
                >
                    Аварии
                </button>
                <button
                    className={`tab px-3 py-1 rounded-md border border-black text-black ${activeTab === 'values' ? 'bg-gray-200' : 'bg-white'}`}
                    onClick={() => onTabChange('values')}
                >
                    Текущие значения
                </button>

                <button
                    className={`tab px-3 py-1 rounded-md border border-black text-black ${activeTab === 'input_node' ? 'bg-gray-200' : 'bg-white'}`}
                    onClick={() => onTabChange('input_node')}
                >
                    Узел ввода
                </button>
            </div>
        </div>
    );
};

export default TabBarForController;
