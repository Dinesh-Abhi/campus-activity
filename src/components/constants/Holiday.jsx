// src/Holidays.js

import React, { useEffect, useState } from 'react';
import HolidaysLib from 'date-holidays'; // Renamed to avoid conflict

const HolidaysComponent = () => {
  const [holidays, setHolidays] = useState([]);

  useEffect(() => {
    const hd = new HolidaysLib();
    console.log('Initializing Holidays Library', hd);
    // Adding India explicitly
    hd.init(); // Initializes with default countries
    const holidaysInIndia = hd.getHolidays(new Date().getFullYear(), 'IN'); // 'IN' for India
    console.log(holidaysInIndia); // Log to see the holidays fetched
    setHolidays(holidaysInIndia);
  }, []);

  return (
    <div className="Holidays">
      <h1>Indian Public Holidays</h1>
      {holidays.length > 0 ? (
        <ul>
          {holidays.map((holiday, index) => (
            <li key={index}>
              <strong>{holiday.date}</strong>: {holiday.name}
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading holidays...</p>
      )}
    </div>
  );
};

export default HolidaysComponent;
