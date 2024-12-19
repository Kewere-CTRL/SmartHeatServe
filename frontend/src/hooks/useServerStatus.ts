
import { useState, useEffect } from 'react';

const useServerStatus = (onConnectionRestored) => {
    const [serverConnected, setServerConnected] = useState(true);
    const [prevServerConnected, setPrevServerConnected] = useState(true);

    const checkServerConnection = async () => {
        try {
            setServerConnected(true);
        } catch (error) {
            setServerConnected(false);
        }
    };

    useEffect(() => {

        checkServerConnection();

        const intervalId = setInterval(() => {
            checkServerConnection();
        }, 20000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {

        if (!prevServerConnected && serverConnected) {
            onConnectionRestored();
        }


        if (!serverConnected) {
            const reloadInterval = setInterval(() => {
                window.location.reload();
            }, 20000);

            return () => clearInterval(reloadInterval);
        }

        setPrevServerConnected(serverConnected);
    }, [serverConnected, prevServerConnected, onConnectionRestored]);

    return { serverConnected, checkServerConnection };
};

export default useServerStatus;
