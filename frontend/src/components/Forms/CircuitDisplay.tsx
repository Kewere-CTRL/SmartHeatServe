import React from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import {formatDateTime} from "../../utils/formatDateTime.ts";
import {FiClock} from "react-icons/fi";

interface MeasuringPoint {
    deviceActive: boolean | null;
    measuringPointLabel: string;
    measuringPointId: number;
}

interface Room {
    id: string;
    label: string;
    tempDev: number | null;
    temp: number | null;
    hum: number | null;
    dateTime: number | null;
    measuringPoints: MeasuringPoint[];
}

interface Circuit {
    R: Room[];
}

interface Floor {
    name: string;
    C: Circuit[];
}

interface Section {
    label: string;
    F: Floor[];
}

interface CircuitDisplayProps {
    sections: Section[];
    selectedRoomId: string | null;
    onRoomClick: (roomId: string) => void;
    onMeasuringPointClick: (measuringPointId: number) => void;
    getRoomStyle: (tempDev: number | null, measuringPoints: MeasuringPoint[]) => {
        backgroundColor: string;
        measuringPointIndicators: React.ReactNode;
    };
}

const CircuitDisplay: React.FC<CircuitDisplayProps> = ({ sections, selectedRoomId, onRoomClick, onMeasuringPointClick, getRoomStyle }) => {

    const getStatusColor = (status: boolean | null) => {
        const statusColors = {
            online: 'bg-green-500',
            offline: 'bg-red-500',
            unknown: 'bg-gray-500'
        };

        switch (status) {
            case true:
                return statusColors.online;
            case false:
                return statusColors.offline;
            default:
                return statusColors.unknown;
        }
    };

    const renderMeasuringPointIndicators = (measuringPoints: MeasuringPoint[]) => {
        if (measuringPoints.length === 0) {
            return <span className="text-gray-500">Нет</span>;
        }

        return (
            <div className="inline-flex items-center">
                {measuringPoints.map((point, index) => {
                    const color = getStatusColor(point.deviceActive);
                    return (
                        <OverlayTrigger
                            key={index}
                            placement="top"
                            overlay={
                                <Tooltip id={`tooltip-${index}`} className="bg-black text-white py-1 px-2 rounded">
                                    {point.measuringPointLabel}
                                </Tooltip>
                            }
                            delay={{ show: 250, hide: 400 }}
                        >
                        <span
                            className={`${color} rounded-full inline-block w-2 h-2 mx-1 cursor-pointer`}
                            onClick={() => onMeasuringPointClick(point.measuringPointId)}
                        ></span>
                        </OverlayTrigger>
                    );
                })}
            </div>
        );
    };



    return (
        <div className="flex justify-start items-start overflow-x-auto space-x-4">
            {sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="inline-block text-left p-2 border-2 border-black bg-gray-400">
                    <div className="p-2 text-center">
                        <p className="text-base text-white font-bold">{section.label}</p>
                    </div>
                    {section.F.map((floor, floorIndex) => (
                        <div key={floorIndex} className="my-2 p-2 border-2 border-black bg-gray-300">
                            <div className="p-2 text-center bg-gray-700 text-white">
                                <p className="font-bold">{floor.name} Этаж</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {floor.C.flatMap((circuit) =>
                                    circuit.R.map((room, roomIndex) => {
                                        const { backgroundColor } = getRoomStyle(room.tempDev, room.measuringPoints);

                                        return (
                                            <div
                                                key={roomIndex}
                                                className={`inline-block w-44 h-auto m-2 p-2 text-left border-2 border-black box-border ${backgroundColor} rounded-lg flex flex-col justify-between`}
                                            >
                                                <p className={`text-xs h-auto ${room.id === selectedRoomId ? 'font-bold' : ''}`}>
                                                    <a href="#" className="no-underline text-black hover:text-blue-500"
                                                       onClick={() => onRoomClick(room.id)}>
                                                        {room.label}
                                                    </a>
                                                </p>
                                                <div className="flex-grow"></div>

                                                <div>
                                                    {room.measuringPoints.length > 0 && room.measuringPoints.some(mp => mp.deviceActive) && (
                                                        <>
                                                            {room.temp !== null && (
                                                                <p className="text-black text-xs">
                                                                    T: <span className="font-bold">{room.temp}</span>
                                                                    <span className="font-bold">°C</span>
                                                                </p>
                                                            )}
                                                            {room.hum !== null && (
                                                                <p className="text-black text-xs">H: {room.hum}%</p>
                                                            )}
                                                            {!(formatDateTime(room.dateTime).date === '01.01.1970' && formatDateTime(room.dateTime).time === '03:00') &&
                                                                (formatDateTime(room.dateTime).date !== 'N/A' || formatDateTime(room.dateTime).time !== 'N/A') && (
                                                                    <p className="text-black text-xs flex items-center">
                                                                        <FiClock className="text-black" size={12}/>
                                                                        <span className="mr-1">:</span>
                                                                        <>
                                                                            {formatDateTime(room.dateTime).date || ''}{" "}
                                                                            {formatDateTime(room.dateTime).time || ''}
                                                                        </>
                                                                    </p>
                                                                )}
                                                        </>
                                                    )}
                                                    <p className="text-black text-xs">
                                                        ТИ: {renderMeasuringPointIndicators(room.measuringPoints)}
                                                    </p>
                                                </div>


                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default CircuitDisplay;
