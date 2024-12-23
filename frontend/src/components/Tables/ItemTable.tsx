import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import { applyCellColor } from '../../utils/getTableCellColors';
import { TiArrowSortedUp, TiArrowSortedDown } from 'react-icons/ti';
import { FaSort, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

interface ItemTableProps {
    headers: Record<string, React.ReactNode>;
    data: Array<Record<string, any>>;
    nonSortableColumns?: string[];
    mainTableStyles?: string;
    tableStyles?: string;
    headerStyles?: string;
    rowStyles?: string;
    cellStyles?: string;
    highlightText?: string;
}

const ItemTable = ({
                       headers,
                       data,
                       nonSortableColumns = [],
                       mainTableStyles = 'overflow-x-auto',
                       tableStyles = 'table-auto border-collapse w-full relative',
                       headerStyles = 'bg-gray-light text-black whitespace-nowrap',
                       rowStyles = 'border-b border-gray-200 text-black',
                       cellStyles = 'p-1.5 border border-gray-300 whitespace-nowrap',
                       highlightText,
                   }: ItemTableProps) => {
    const [tableData, setTableData] = useState(data.slice(0, 200));
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' }>({
        key: 'date',
        direction: 'descending',
    });
    const [visibleRows, setVisibleRows] = useState(200);

    const tableRef = useRef<HTMLDivElement | null>(null);
    const lastRowRef = useRef<HTMLTableRowElement | null>(null);
    useEffect(() => {
        sortData();
    }, [data, sortConfig]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (entry.isIntersecting && visibleRows < data.length) {
                    setVisibleRows((prev) => Math.min(prev + 200, data.length));
                }
            },
            {
                root: tableRef.current,
                rootMargin: '0px',
                threshold: 1.0,
            }
        );

        if (lastRowRef.current) {
            observer.observe(lastRowRef.current);
        }

        return () => {
            if (lastRowRef.current) {
                observer.unobserve(lastRowRef.current);
            }
        };
    }, [visibleRows, data.length]);

    const sortData = () => {
        const { key, direction } = sortConfig;
        const sortedData = [...data].sort((a, b) => {
            if (key === 'date' || key === 'time') {
                const dateA = moment(`${a['date']} ${a['time']}`, 'DD.MM.YYYY HH:mm');
                const dateB = moment(`${b['date']} ${b['time']}`, 'DD.MM.YYYY HH:mm');
                return dateA.isBefore(dateB)
                    ? direction === 'ascending' ? -1 : 1
                    : direction === 'ascending' ? 1 : -1;
            } else if (['calculated_temperature', 'calculated_humidity', 'deviation_temperature', 'deviation_humidity'].includes(key)) {
                return direction === 'ascending'
                    ? a[key] - b[key]
                    : b[key] - a[key];
            } else {
                return direction === 'ascending'
                    ? a[key].toString().localeCompare(b[key].toString())
                    : b[key].toString().localeCompare(a[key].toString());
            }
        });

        setTableData(sortedData.slice(0, visibleRows));
    };

    const toggleSortDirection = () => {
        setSortConfig(prevConfig => ({
            key: prevConfig.key,
            direction: prevConfig.direction === 'ascending' ? 'descending' : 'ascending',
        }));
    };

    const handleSort = (key: string) => {
        if (sortConfig.key === key) {
            toggleSortDirection();
        } else {
            setSortConfig({ key, direction: 'ascending' });
        }
    };

    const getSortIcon = (header: string) => {
        if (nonSortableColumns.includes(header)) {
            return null;
        }
        if (['Дата', 'Время', 'Температура', 'Влажность', 'Отклонение t°', 'Отклонение h'].includes(header)) {
            if (sortConfig.key === headers[header]) {
                return sortConfig.direction === 'ascending' ? (
                    <TiArrowSortedUp className="inline" />
                ) : (
                    <TiArrowSortedDown className="inline" />
                );
            }
            return <FaSort className="inline text-gray-400" />;
        }
        return null;
    };


    const getCellContent = (value: any, columnName: string) => {
        if (columnName === 'status') {
            switch (value) {
                case 'Активен':
                    return (
                        <>
                            <FaCheckCircle className="text-green-500 mr-1 inline" />
                            <span className="text-green-500 ">{value}</span>
                        </>
                    );
                case 'Неактивен':
                    return (
                        <>
                            <FaExclamationTriangle className="text-red-500 mr-1 inline" />
                            <span className="text-red-500 ">{value}</span>
                        </>
                    );
                default:
                    return value;
            }
        }

        return value;
    };


    const getRowClassName = (row: Record<string, any>) => {
        if (highlightText) {
            const highlightLower = highlightText.trim().toLowerCase();
            const isHighlighted = Object.values(row).some(value => {
                if (value != null) {
                    if (typeof value === 'string') {
                        return value.toLowerCase().includes(highlightLower);
                    } else if (typeof value === 'number') {
                        return value.toString().includes(highlightLower);
                    } else if (typeof value === 'object' && 'props' in value) {
                        const labelText = value.props?.text || '';
                        return labelText.toLowerCase().includes(highlightLower);
                    }
                }
                return false;
            });
            return isHighlighted ? 'animate-pulseOnce' : '';
        }
        return '';
    };


    const loadMoreRows = () => {
        if (visibleRows < data.length) {
            const newRows = data.slice(visibleRows, visibleRows + 200);
            setTableData((prevData) => [...prevData, ...newRows]);
            setVisibleRows(prev => Math.min(prev + 200, data.length));
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (entry.isIntersecting) {
                    loadMoreRows();
                }
            },
            {
                root: tableRef.current,
                rootMargin: '0px',
                threshold: 1.0,
            }
        );

        if (lastRowRef.current) {
            observer.observe(lastRowRef.current);
        }

        return () => {
            if (lastRowRef.current) {
                observer.unobserve(lastRowRef.current);
            }
        };
    }, [visibleRows, data.length]);

    return (
        <div
            className={mainTableStyles}
            ref={tableRef}
        >
            <table className={tableStyles}>
                <thead className={`${headerStyles} sticky top-0 z-10`}>
                <tr>
                    {Object.keys(headers)
                        .filter(header => headers[header] !== 'id')
                        .map((header, index) => (
                            <th
                                key={index}
                                className="p-2 border border-gray-300 text-left "
                                onClick={() =>
                                    !nonSortableColumns.includes(header) &&
                                    ['Дата', 'Время', 'Температура', 'Влажность', 'Отклонение t°', 'Отклонение h'].includes(header) &&
                                    handleSort(headers[header])
                                }
                            >
                                {header} {getSortIcon(header)}
                            </th>
                        ))}
                </tr>
                </thead>
                <tbody>
                {tableData.length > 0 ? (
                    tableData.map((item, rowIndex) => {
                        const isHighlighted = getRowClassName(item) === 'animate-pulseOnce';
                        return (
                            <tr
                                key={rowIndex}
                                className={`${rowStyles} ${getRowClassName(item)}`}
                                ref={rowIndex === tableData.length - 1 ? lastRowRef : null}
                            >
                                {Object.keys(headers)
                                    .filter(header => headers[header] !== 'id')
                                    .map((header) => (
                                        <td
                                            key={header}
                                            className={cellStyles}
                                            style={applyCellColor(item[headers[header]], headers[header])}
                                        >
                                            {getCellContent(item[headers[header]], headers[header])}
                                        </td>
                                    ))}
                            </tr>
                        );
                    })
                ) : (
                    <tr>
                        <td className={cellStyles} colSpan={Object.keys(headers).length - 1}>
                            <h1 className="text-black items-center justify-center flex">Нет данных</h1>
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default ItemTable;
