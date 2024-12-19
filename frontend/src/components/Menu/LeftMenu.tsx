import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    FaUser,
    FaTools,
    FaChevronDown,
    FaBug,
    FaCogs,
    FaExclamationTriangle,
    FaMicrochip,
    FaBars,
    FaThermometerHalf,
    FaBell, FaFire, FaCog, FaListAlt
} from 'react-icons/fa';


const LeftMenu: React.FC = () => {
    const [isDevicesOpen, setIsDevicesOpen] = useState(false);
    const [isSectionsOpen, setIsSectionsOpen] = useState(false);
    const [isThermalCircuitsOpen, setIsThermalCircuitsOpen] = useState(false);
    const [isIncidentsOpen, setIsIncidentsOpen] = useState(false);
    const [sections, setSections] = useState<any[]>([]);
    const [thermalCircuits, setThermalCircuits] = useState<any[]>([]);
    const [menuWidth, setMenuWidth] = useState(240);
    const [activeIncidents, setActiveIncidents] = useState(0);

    const sectionsRef = useRef<HTMLUListElement>(null);
    const thermalCircuitsRef = useRef<HTMLUListElement>(null);
    const devicesRef = useRef<HTMLUListElement>(null);
    const incidentsRef = useRef<HTMLUListElement>(null);
    const buildingId = 1;

    const [hasUpdates, setHasUpdates] = useState(false);
    const [isSwinging, setIsSwinging] = useState(false);


    const calculateWidth = (element: HTMLUListElement | null): number => {
        if (element) {
            const items = Array.from(element.children) as HTMLElement[];
            const paddingLeft = 50;
            const maxWidth = items.reduce((max, item) => {
                const styles = window.getComputedStyle(item);
                const paddingLeftItem = parseFloat(styles.paddingLeft);
                const paddingRightItem = parseFloat(styles.paddingRight);
                const marginLeft = parseFloat(styles.marginLeft);
                const marginRight = parseFloat(styles.marginRight);
                const width = item.scrollWidth + paddingLeftItem + paddingRightItem + marginLeft + marginRight;
                return Math.max(max, width);
            }, 0);
            return Math.max(maxWidth  + paddingLeft, 240);
        }
        return 240;
    };

    const updateWidth = () => {
        let newWidth = 240;
        if (isThermalCircuitsOpen) {
            newWidth = Math.max(calculateWidth(thermalCircuitsRef.current), newWidth);
        }
        if (isDevicesOpen) {
            newWidth = Math.max(calculateWidth(devicesRef.current), newWidth);
        }
        if (isSectionsOpen) {
            newWidth = Math.max(calculateWidth(sectionsRef.current), newWidth);
        }
        if (isIncidentsOpen) {
            newWidth = Math.max(calculateWidth(incidentsRef.current), newWidth);
        }

        const maxAllowedWidth = 450;
        setMenuWidth(Math.min(newWidth, maxAllowedWidth));
    };

    useEffect(() => {
        updateWidth();
    }, [isThermalCircuitsOpen, isDevicesOpen, isSectionsOpen, isIncidentsOpen]);

    const handleToggleDevices = () => {
        setIsDevicesOpen(!isDevicesOpen);
    };

    const handleToggleIncidents = () => setIsIncidentsOpen(!isIncidentsOpen);

    const handleToggleSections = () => {
        setIsSectionsOpen(!isSectionsOpen);
    };

    const handleToggleThermalCircuits = () => {
        setIsThermalCircuitsOpen(!isThermalCircuitsOpen);
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            setIsSwinging(true);

            setTimeout(() => setIsSwinging(false), 1000);
        }, 2000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="bg-gray-800 text-white z-10 " style={{ maxWidth: `${menuWidth}px`, transition: 'max-width 0.3s ease' }}>
            <div className="flex flex-col flex-grow p-4 h-full">
                <div className="mb-6">
                    <h1 className="text-xl font-bold whitespace-nowrap">SmartHeat</h1>
                </div>
                <nav className="flex-1 overflow-y-auto overflow-x-hidden mb-6">
                    <ul className="space-y-2">
                        <li>
                            <button
                                className={`flex items-center p-2 rounded-lg hover:bg-gray-700 text-left`}
                                style={{width: `${menuWidth - 35}px`}}
                                onClick={handleToggleSections}
                            >
                                <FaBars className="mr-2"/>
                                Секции
                                <FaChevronDown
                                    className={`ml-2 transition-transform duration-300 ${isSectionsOpen ? 'rotate-180' : ''} text-xs`}/>
                            </button>

                        </li>

                        <li>
                            <button
                                className="flex items-center w-auto p-2 rounded-lg hover:bg-gray-700 text-left"
                                style={{width: `${menuWidth - 35}px`}}
                                onClick={handleToggleThermalCircuits}
                            >
                                <FaThermometerHalf className="mr-2"/>
                                Тепловые контуры
                                <FaChevronDown
                                    className={`ml-2 transition-transform duration-300 ${isThermalCircuitsOpen ? 'rotate-180' : ''} text-xs`}/>
                            </button>
                        </li>

                        <li>
                            <button
                                className="flex items-center p-2 rounded-lg hover:bg-gray-700 text-left"
                                style={{width: `${menuWidth - 35}px`}}
                                onClick={handleToggleDevices}
                            >
                                <FaTools className="mr-2"/>
                                Устройства
                                <FaChevronDown
                                    className={`ml-2 transition-transform duration-300 ${isDevicesOpen ? 'rotate-180' : ''} text-xs`}/>
                            </button>
                        </li>


                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default LeftMenu;
