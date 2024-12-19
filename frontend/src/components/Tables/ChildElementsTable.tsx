import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaTrash } from 'react-icons/fa';

interface ChildElementsTableProps {
    infoData: { id: number; title: string; properties: string; delete: string; to: string }[];
    tableTitle: string;
    ButtonComponent: () => JSX.Element;
    LinkComponent: (props: { to: string; text: string; className?: string; onClick?: () => void }) => JSX.Element;
    onDelete: (id: number) => void;
}

const ChildElementsTable: React.FC<ChildElementsTableProps> = ({ infoData, tableTitle, ButtonComponent, LinkComponent, onDelete }) => {
    const [deletedItems, setDeletedItems] = useState<Set<number>>(new Set());
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [showAll, setShowAll] = useState(false);

    const handleDelete = (id: number) => {
        setDeletedItems(prev => new Set(prev.add(id)));

        onDelete(id);

        setTimeout(() => {
            setDeletedItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(id);
                return newSet;
            });
        }, 300);
    };

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    const toggleShowAll = () => {
        setShowAll(!showAll);
    };

    const displayedData = showAll ? infoData : infoData.slice(0, 3);

    return (
        <div className="flex mt-2 z-10">
            <div className="w-auto mb-3">
                <div className="border border-gray-300 bg-gray-100 rounded-lg overflow-hidden">
                    <div className="flex justify-between  min-w-[450px] items-center bg-gray-light border-b border-gray-300 p-2 text-black rounded-t-lg">
                        <span className="flex-1 text-lg font-bold">{tableTitle}</span>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={toggleCollapse}
                                className="focus:outline-none transition-transform duration-300"
                                style={{
                                    transform: isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)'
                                }}
                            >
                                <FaChevronDown />
                            </button>
                            <ButtonComponent />
                        </div>
                    </div>
                    <div
                        className={`transition-all duration-300 ease-in-out overflow-hidden ${
                            isCollapsed ? 'max-h-0' : 'max-h-[1000px]'
                        }`}
                    >
                        <div className="table w-full">
                            {displayedData.map((item) => (
                                <div
                                    key={item.id}
                                    className={`table-row transition-all duration-300 ease-in-out`}
                                >
                                    <div className="table-cell min-w-[300px] p-2 text-black font-bold text-nowrap border-b border-gray-300">
                                        {item.title}
                                    </div>
                                    <div className="table-cell border-l border-gray-300 h-auto mx-2"></div>
                                    <div className="w-[200px] p-2 flex justify-between items-center  border-b border-gray-300">
                                        <LinkComponent
                                            to={item.to}
                                            text={item.properties}
                                            className="text-gray-800 ml-1 underline"
                                        />
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="text-red-600 relative group"
                                        >
                                            <div className="flex items-center justify-center p-2 rounded-full transition-colors duration-200 group-hover:bg-gray-300">
                                                <FaTrash className="w-4 h-4" />
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {infoData.length > 3 && !showAll && (
                                <div
                                    className="w-auto p-2 flex justify-between items-center  border-gray-300 text-black"
                                    onClick={toggleShowAll}
                                >
                                    <div className="table-cell  cursor-pointer  p-2">Показать больше</div>
                                    <div className="table-cell border-l border-gray-300 h-auto mx-2"></div>
                                </div>

                            )}
                            {showAll && infoData.length > 3 && (
                                <div
                                    className="w-auto p-2 flex justify-between items-center  border-gray-300 text-black"
                                    onClick={toggleShowAll}
                                >
                                    <div className="table-cell  cursor-pointer p-2">Скрыть</div>
                                    <div className="table-cell border-l border-gray-300 h-auto mx-2"></div>
                                </div>

                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChildElementsTable;
