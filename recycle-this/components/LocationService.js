// LocationService.js
import { useState, useEffect } from 'react';
import getLocation from '../utils/getLocation';

export const useLocationService = () => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const loc = await getLocation();
        setLocation(loc);
      } catch (error) {
        console.error('Error fetching location:', error);
        // Handle location error (e.g., permissions not granted)
      }
    };

    fetchLocation();
  }, []);

  return location;
};
