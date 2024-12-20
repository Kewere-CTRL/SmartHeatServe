import React, { useState, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { FaChevronDown, FaChevronUp, FaTimesCircle } from 'react-icons/fa';
import { ru } from 'date-fns/locale';
import Tooltip from "../Buttons/Tooltip.tsx";

interface GraphFilterProps {
    onFilterChange: (filters: {
        dateRange?: { start: Date | null; end: Date | null },
    }) => void;
    timeRange?: 'day' | 'week' | 'month';
}

const GraphFilter: React.FC<GraphFilterProps> = ({ onFilterChange, timeRange }) => {
    const [isDateOpen, setIsDateOpen] = useState(false);
    const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
    const [showDateTooltip, setShowDateTooltip] = useState(false);
    const dateRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (timeRange) {
            const now = new Date();
            let start: Date | null = null;
            let end: Date | null = null;

            switch (timeRange) {
                case 'day':
                    start = new Date(now.setHours(0, 0, 0, 0));
                    end = new Date(now.setHours(23, 59, 59, 999));
                    break;
                case 'week':
                    start = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
                    end = new Date();
                    break;
                case 'month':
                    start = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
                    end = new Date(); // Сегодня
                    break;
                default:
                    break;
            }

            setDateRange({ start, end });
            onFilterChange({ dateRange: { start, end } });
        }
    }, [timeRange, onFilterChange]);

    const toggleDateFilter = () => {
        setIsDateOpen(!isDateOpen);
        if (!isDateOpen) {
            setShowDateTooltip(false);
        }
    };

    const handleDateChange = (dates: [Date | null, Date | null]) => {
        const [start, end] = dates;
        setDateRange({ start, end });
        onFilterChange({ dateRange: { start, end } }); // передаем start и end без изменений
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dateRef.current && !dateRef.current.contains(event.target as Node)) {
                setIsDateOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div>
            <div className="flex flex-wrap space-x-4 ">
                <div className="relative" ref={dateRef}>
                    <button
                        onClick={toggleDateFilter}
                        className="flex items-center text-black px-4 py-1 rounded-full border border-black"
                    >
                        {"Дата"} {isDateOpen ? <FaChevronUp className="ml-1"/> :
                        <FaChevronDown className="ml-1"/>}
                    </button>
                    {isDateOpen && (
                        <div className="absolute z-10 bg-white p-4 mt-2 shadow-md rounded">
                            <Tooltip
                                message="Выберите диапазон дат или конкретную дату в которые хотите посмотреть значения."
                                isVisible={showDateTooltip}
                                toggleVisibility={() => setShowDateTooltip(!showDateTooltip)}
                            />
                            <div className="mb-4"></div>
                            <DatePicker
                                selected={dateRange.start ?? undefined} // используем undefined вместо null
                                onChange={handleDateChange}
                                startDate={dateRange.start ?? undefined} // используем undefined вместо null
                                endDate={dateRange.end ?? undefined} // используем undefined вместо null
                                selectsRange
                                inline
                                locale={ru}
                                dateFormat="dd.MM.yyyy"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/*<div className="flex space-x-2 mt-4 mb-2 items-center">*/}
            {/*    {dateRange.start && (*/}
            {/*        <div className="flex items-center bg-gray-300 text-black text-xs px-2 py-1 rounded-full">*/}
            {/*            {formatDateRange()} <FaTimesCircle className="ml-1 text-xs cursor-pointer"*/}
            {/*                                               onClick={handleResetAllFilters}/>*/}
            {/*        </div>*/}
            {/*    )}*/}

            {/*    {(dateRange.start || dateRange.end) && (*/}
            {/*        <button*/}
            {/*            onClick={handleResetAllFilters}*/}
            {/*            className="px-2 py-1 bg-gray-300 text-black text-xs rounded-full"*/}
            {/*        >*/}
            {/*            Сбросить все*/}
            {/*        </button>*/}
            {/*    )}*/}
            {/*</div>*/}
        </div>
    );
};

export default GraphFilter;
