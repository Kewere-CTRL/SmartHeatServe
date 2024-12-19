import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

interface ObjectTableProps {
    title: string;
    data: { id: number; title: string; value: string }[];
    ButtonComponent: ({ onClick }: { onClick: (id: number) => void }) => JSX.Element;
    onRowClick: (id: number) => void;
}

const ObjectTable = ({ title, data, ButtonComponent, onRowClick }: ObjectTableProps) => {
    const [isCollapsed, setIsCollapsed] = useState(true);

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    const formatValue = (title: string, value: string): string => {
        const lowerTitle = title.toLowerCase();
        if (lowerTitle.includes('площадь')) {
            return `${title}, м²`;
        }
        if (lowerTitle.includes('объем') || lowerTitle.includes('емкость')) {
            return `${title}, м³`;
        }
        if (lowerTitle.includes('нагрузка'))  {
            return `${title}, Гкал/час`;
        }
        if (lowerTitle.includes('температура') && !lowerTitle.includes('температура включена в расчёт'))  {
            return `${title}, °C`;
        }
        if (lowerTitle.includes('влажность') && !lowerTitle.includes('влажность включена в расчёт')) {
            return `${title}, %`;
        }
        return title;
    };
    return (
        <div className="flex mt-2 z-10">
            <div className="w-[550px]">
                <div className="border border-gray-300 bg-gray-100 rounded-lg overflow-hidden">
                    <div className="flex justify-between items-center bg-gray-light border-b border-gray-300 p-2 text-black rounded-t-lg">
                        <span className="flex-1 text-lg font-bold">{title}</span>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={toggleCollapse}
                                className="focus:outline-none transition-transform duration-300"
                                style={{
                                    transform: isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)',
                                }}
                            >
                                <FaChevronDown />
                            </button>
                            <ButtonComponent onClick={(id) => onRowClick(id)} />
                        </div>
                    </div>
                    <div
                        className={`transition-all duration-300 ease-in-out overflow-hidden ${
                            isCollapsed ? 'max-h-10' : 'max-h-[1000px]'
                        }`}
                    >
                        {data.map((item) => (
                            <div key={item.id} className="flex items-center border-t border-gray-300">
                                <div className="w-1/2 p-2 text-black font-bold border-r border-gray-300">
                                    {formatValue(item.title, item.value)}
                                </div>
                                <div className="w-1 px-2 border-r border-gray-300"></div>
                                <div className="w-1/2 p-2 text-black">
                                    {item.value}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ObjectTable;
