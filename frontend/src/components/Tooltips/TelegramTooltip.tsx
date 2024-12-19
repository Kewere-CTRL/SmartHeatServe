import React, { useState } from "react";
import { Tooltip } from "react-tooltip";
import {FaTelegramPlane} from "react-icons/fa";

const TelegramTooltip = ({onClick}) => {
    const botLink = "https://t.me/creatus_alerts_bot";
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(botLink);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="relative flex items-center">
            <a
                href="#"
                data-tooltip-id="telegram-tooltip"
                className="text-gray-500 underline text-sm"
            >
                Как привязать Telegram?
            </a>
            <Tooltip
                id="telegram-tooltip"
                place="top"
                interactive

                clickable
                style={{
                    backgroundColor: "#000",
                    color: "#fff",
                    padding: "10px",
                    borderRadius: "8px",
                    whiteSpace: "normal",
                    maxWidth: "350px",
                }}
            >
                <div>
                    <p className="mb-2 text-sm">
                        1. Добавьте ответственное лицо и укажите его номер телефона, привязанный к Telegram.<br/>
                        2. Отправьте ответственному лицу
                        <a href={botLink} target="_blank" rel="noopener noreferrer"
                           className="text-blue-400 underline"> ссылку
                            на Telegram-бота.</a>
                        <button
                            onClick={handleCopy}
                            className="bg-gray-800 text-white px-2 py-1 rounded text-xs ml-2"
                        >
                            {isCopied ? "Скопировано!" : "Скопировать"}
                        </button>
                        <br/>
                        3. Ответственное лицо должно подтвердить свой номер телефона в боте.<br/>
                        4. После подтверждения ответственное лицо будет получать уведомления об инцидентах.
                    </p>
                    <button
                        onClick={onClick}
                        className="flex items-center px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-700 transition ml-1 text-xs"
                    >
                        <FaTelegramPlane className="text-white mr-0.5 ml-0.5"/>
                        <span className="text-white">Проверить привязку Telegram</span>
                    </button>


                </div>
            </Tooltip>
        </div>
    );
};

export default TelegramTooltip;
