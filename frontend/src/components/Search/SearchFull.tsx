// import React, { useState, useEffect, useRef } from 'react';
// import { transformRooms } from "../../models/Room.tsx";
// import { fetchAllRoom } from "../../api/requests/roomApi.ts";
// import { createUpdatedData } from "./Objects.tsx";
// import { FiClock, FiTrash2 } from "react-icons/fi";
// import {fetchSections} from "../../api/requests/sectionApi.ts";
// import {transformSections} from "../../models/Section.ts";
// import {transformDevices} from "../../models/Device.tsx";
// import {fetchDevices} from "../../api/requests/deviceApi.ts";
// import {fetchAllMeasuringPoints} from "../../api/requests/measuringPointApi.ts";
// import {transformMp} from "../../models/MeasuringPoint.tsx";
// import {fetchThermalCircuits} from "../../api/requests/thermalCircuitApi.ts";
// import {transformThermalCircuit} from "../../models/ThermalCircuit.ts";
//
// interface SearchFullProps {
//     onSearch: (query: string) => void;
// }
//
// export interface ObjectLink {
//     label: string;
//     hiddenField: string;
//     link: string;
// }
//
// const MAX_HISTORY = 5;
//
// const SearchFull: React.FC<SearchFullProps> = ({ onSearch }) => {
//     const [query, setQuery] = useState('');
//     const [isFocused, setIsFocused] = useState(false);
//     const [roomsWithLinks, setRoomsWithLinks] = useState<ObjectLink[]>([]);
//     const [history, setHistory] = useState<ObjectLink[]>([]);
//     const inputRef = useRef<HTMLInputElement | null>(null);
//     const [hoveredItem, setHoveredItem] = useState<string | null>(null);
//
//     const convertKeyboardLayout = (input: string, layout: 'toRussian' | 'toEnglish'): string => {
//         const toRussianMap: Record<string, string> = {
//             'q': 'й', 'w': 'ц', 'e': 'у', 'r': 'к', 't': 'е', 'y': 'н', 'u': 'г', 'i': 'ш', 'o': 'щ', 'p': 'з',
//             '[': 'х', ']': 'ъ', 'a': 'ф', 's': 'ы', 'd': 'в', 'f': 'а', 'g': 'п', 'h': 'р', 'j': 'о', 'k': 'л',
//             'l': 'д', ';': 'ж', '\'': 'э', 'z': 'я', 'x': 'ч', 'c': 'с', 'v': 'м', 'b': 'и', 'n': 'т', 'm': 'ь',
//             ',': 'б', '.': 'ю', '/': '.', ' ': ' '
//         };
//
//         const toEnglishMap: Record<string, string> = Object.fromEntries(
//             Object.entries(toRussianMap).map(([key, value]) => [value, key])
//         );
//
//         const layoutMap = layout === 'toRussian' ? toRussianMap : toEnglishMap;
//
//         return input.split('').map(char => layoutMap[char] || char).join('');
//     };
//
//     const fetchRoom = async () => {
//         try {
//             const [roomResponse, sectionResponse, devicesResponse, measuringPointsResponse, thermalCircuitsResponse] = await Promise.all([
//                 fetchAllRoom(),
//                 fetchSections(1),
//                 fetchDevices(),
//                 fetchAllMeasuringPoints(),
//                 fetchThermalCircuits(1),
//             ]);
//             const transformedRooms = transformRooms(roomResponse);
//             const transformedSections = transformSections(sectionResponse);
//             const transformedDevices = transformDevices(devicesResponse);
//             const transformedMP = transformMp(measuringPointsResponse);
//             const transformTC = transformThermalCircuit(thermalCircuitsResponse);
//
//             const objects = await createUpdatedData();
//             setRoomsWithLinks([
//                 ...transformedRooms,
//                 ...transformedSections,
//                 ...transformedDevices,
//                 ...transformedMP,
//                 ...transformTC,
//                 ...objects,
//             ]);
//         } catch (error) {
//             console.error('Ошибка при получении данных', error);
//         }
//     };
//
//     useEffect(() => {
//         fetchRoom();
//         loadHistory();
//     }, []);
//
//     useEffect(() => {
//         const handleClickOutside = (event: MouseEvent) => {
//             if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
//                 setIsFocused(false);
//                 setQuery("");
//             }
//         };
//
//         document.addEventListener("mousedown", handleClickOutside);
//
//         return () => {
//             document.removeEventListener("mousedown", handleClickOutside);
//         };
//     }, []);
//
//     const loadHistory = () => {
//         const storedHistory = localStorage.getItem("searchHistory");
//         if (storedHistory) {
//             setHistory(JSON.parse(storedHistory));
//         }
//     };
//
//     const saveToHistory = (room: ObjectLink) => {
//         const updatedHistory = [room, ...history.filter((item) => item.link !== room.link)].slice(0, MAX_HISTORY);
//         setHistory(updatedHistory);
//         localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
//     };
//
//     const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         const value = event.target.value;
//         setQuery(value);
//         onSearch(value);
//     };
//
//     const handleKeyDown = (event: KeyboardEvent) => {
//         if ((event.metaKey && event.key === 'k') || (event.ctrlKey && event.key === 'k')) {
//             event.preventDefault();
//             if (inputRef.current) {
//                 inputRef.current.focus();
//                 setIsFocused(true);
//             }
//         }
//         if (event.key === 'Escape') {
//             setQuery("")
//             event.preventDefault();
//             if (inputRef.current) {
//                 inputRef.current.blur();
//                 setIsFocused(false);
//             }
//         }
//         if (event.key === 'Enter' || event.key === 'Tab') {
//             event.preventDefault();
//             if (filteredRooms.length > 0) {
//                 const selectedRoom = filteredRooms[0];
//                 saveToHistory(selectedRoom);
//                 window.location.href = selectedRoom.link;
//             }
//         }
//     };
//     const handleSelectRoom = (room: ObjectLink, event: React.MouseEvent<HTMLLIElement>) => {
//         if (event.button === 1) {
//             event.preventDefault();
//             window.open(room.link, '_blank');
//         } else if (event.button === 0) {
//             saveToHistory(room);
//             window.location.href = room.link;
//         }
//     };
//     const removeSpecialChars = (str) => {
//         return str.replace(/[\s\-\.\,\&\^\%\$\#\№\@\(\)\{\}\[\]\\|\/§]/g, '').toLowerCase();
//     };
//
//     const filteredRooms = roomsWithLinks
//         .filter((room) => {
//             const queryProcessed = removeSpecialChars(query);
//             const convertedToRussian = convertKeyboardLayout(queryProcessed, 'toRussian');
//             const convertedToEnglish = convertKeyboardLayout(queryProcessed, 'toEnglish');
//
//             const labelProcessed = removeSpecialChars(room.label);
//             const hiddenFieldProcessed = room.hiddenField ? removeSpecialChars(room.hiddenField) : '';
//
//             return (
//                 labelProcessed.includes(queryProcessed) ||
//                 labelProcessed.includes(convertedToRussian) ||
//                 labelProcessed.includes(convertedToEnglish) ||
//                 hiddenFieldProcessed.includes(queryProcessed) ||
//                 hiddenFieldProcessed.includes(convertedToRussian) ||
//                 hiddenFieldProcessed.includes(convertedToEnglish)
//             );
//         })
//         .sort((a, b) => {
//             const queryProcessed = removeSpecialChars(query);
//             const aStartsWithQuery = removeSpecialChars(a.label).startsWith(queryProcessed);
//             const bStartsWithQuery = removeSpecialChars(b.label).startsWith(queryProcessed);
//
//             if (aStartsWithQuery && !bStartsWithQuery) return -1;
//             if (!aStartsWithQuery && bStartsWithQuery) return 1;
//
//             return removeSpecialChars(a.label) < removeSpecialChars(b.label) ? -1 : 1;
//         });
//
//
//
//     const removeFromHistory = (link: string) => {
//         const updatedHistory = history.filter(item => item.link !== link);
//         setHistory(updatedHistory);
//         localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
//     };
//
//     useEffect(() => {
//         window.addEventListener('keydown', handleKeyDown);
//         return () => {
//             window.removeEventListener('keydown', handleKeyDown);
//         };
//     }, [filteredRooms]);
//     const handleBlur = (e) => {
//         setTimeout(() => {
//             setIsFocused(false);
//
//         }, 100);
//     };
//     const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
//     const isWindows = /Win/.test(navigator.platform);
//
//     return (
//         <div>
//             {isFocused && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 z-10" onMouseDown={() => setIsFocused(false)}></div>
//             )}
//
//             <div className="relative flex items-center mr-4 z-20">
//                 <input
//                     ref={inputRef}
//                     type="text"
//                     value={query}
//                     onChange={handleChange}
//                     onFocus={() => setIsFocused(true)}
//                     onBlur={() => handleBlur}
//                     className={`px-4 py-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring focus:ring-gray-500 transition-all duration-300
//                         ${isFocused ? 'w-[400px]' : 'w-[300px]'} pr-12`}
//                     placeholder="Поиск..."
//                 />
//                 {!isFocused && (
//                     <div
//                         className="absolute right-4 px-[5px] border-[1.5px] border-white rounded top-1/2 transform -translate-y-1/2 flex items-center text-white">
//                         {isMac ? (
//                             <span>⌘</span>
//                         ) : isWindows ? (
//                             <div>
//                              <span>
//                                 Ctrl
//                             </span>
//                             <span className="inline-block ml-1 mb-[2px]">
//                                 +
//                             </span>
//                             </div>
//
//                         ) : null}
//                         <span className="ml-1">K</span>
//                     </div>
//                 )}
//
//                 {isFocused && (
//                     <ul
//                         className="absolute w-full bg-gray-700 text-white shadow-lg rounded mt-1 max-h-60 overflow-auto z-30"
//                         style={{ top: '100%', left: 0, right: 0 }}
//                     >
//                         {history
//                             .filter((item) => {
//                                 const queryLower = query.toLowerCase();
//                                 const convertedToRussian = convertKeyboardLayout(queryLower, 'toRussian');
//                                 const convertedToEnglish = convertKeyboardLayout(queryLower, 'toEnglish');
//
//                                 return (
//                                     query.length === 0 ||
//                                     item.label.toLowerCase().includes(queryLower) ||
//                                     item.label.toLowerCase().includes(convertedToRussian) ||
//                                     item.label.toLowerCase().includes(convertedToEnglish)
//                                 );
//                             })
//                             .map((item) => (
//                                 <li
//                                     key={`history-${item.link}`}
//                                     className="px-4 py-2 hover:bg-gray-600 cursor-pointer flex justify-between items-center relative"
//                                     onMouseDown={(event) => handleSelectRoom(item, event)}
//                                     onMouseEnter={() => setHoveredItem(item.link)}
//                                     onMouseLeave={() => setHoveredItem(null)}
//                                 >
//                                     <div className="flex items-center">
//                                         <FiClock className="mr-2 text-gray-400"/>
//
//                                         <span
//                                             className="text-ellipsis overflow-hidden whitespace-nowrap max-w-[230px]"
//                                             title={item.label}
//                                         >
//                                             {item.label}
//                                         </span>
//
//                                         <span className="text-gray-400 text-[13.5px] ml-2">{item.hiddenField}</span>
//                                     </div>
//
//                                     {hoveredItem === item.link && (
//                                         <span
//                                             onMouseDown={(e) => {
//                                                 e.stopPropagation();
//                                                 removeFromHistory(item.link);
//                                             }}
//                                             className="absolute right-4 top-1/2 transform -translate-y-1/2 ml-4 text-gray-400 cursor-pointer"
//                                         >
//                                         <FiTrash2 className="text-gray-400 hover:text-gray-300 cursor-pointer"/>
//                                     </span>
//                                     )}
//                                 </li>
//
//
//                             ))}
//
//                         {
//                             query &&
//                             filteredRooms
//                                 .filter((room) => !history.some((item) => item.link === room.link))
//                                 .map((room) => (
//                                     <li
//                                         key={room.link}
//                                         className="px-4 py-2 hover:bg-gray-600 cursor-pointer"
//                                         onMouseDown={(event) => handleSelectRoom(room, event)}
//                                     >
//                                         <span>{room.label}</span>
//                                         <span className="text-gray-400 text-[13.5px] ml-2">{room.hiddenField}</span>
//                                     </li>
//                                 ))
//
//                         }
//
//
//                         {query &&
//                             filteredRooms.length === 0 &&
//                             history.filter((item) => {
//                                 const queryLower = query.toLowerCase();
//                                 const convertedToRussian = convertKeyboardLayout(queryLower, 'toRussian');
//                                 const convertedToEnglish = convertKeyboardLayout(queryLower, 'toEnglish');
//
//                                 return (
//                                     query.length === 0 ||
//                                     item.label.toLowerCase().includes(queryLower) ||
//                                     item.label.toLowerCase().includes(convertedToRussian) ||
//                                     item.label.toLowerCase().includes(convertedToEnglish)
//                                 );
//                             }).length === 0 && (
//                                 <li className="px-4 py-2 text-gray-400">Нет результатов</li>
//                             )}
//                     </ul>
//                 )}
//             </div>
//         </div>
//     );
// };
//
// export default SearchFull;
