import { createContext, useEffect } from 'react';
import { io } from 'socket.io-client';

export const Store = createContext();

export const StoreProvider = (props) => {
  const socket = io('http://localhost:5000');
  console.log(socket);

  useEffect(() => {
    const getUsersData = async () => {
      try {
        const response = await fetch('http://geoplugin.net/json.gp');
        const result = await response.json();

        socket.emit('new_active_user', {
          ip: result.geoplugin_request || 'unknown',
          state: result.geoplugin_region || 'unknown',
          city: result.geoplugin_city || 'unknown',
          country: result.geoplugin_countryName || 'unknown',
          country_code: result.geoplugin_countryCode || 'unknown',
        });

        if (!response.ok) {
          throw new Error('Failed to Fetch Users Location');
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    getUsersData();
  }, [socket]);

  return <Store.Provider value={socket}>{props.children}</Store.Provider>;
};

export default Store;
