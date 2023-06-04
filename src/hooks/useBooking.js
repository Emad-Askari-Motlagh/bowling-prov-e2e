import React, { useCallback, useEffect, useMemo, useState } from "react";

import axios from "axios";
const link = "http://localhost:5000";
export default function useBooking() {
  const [bookings, setBooking] = useState([]);
  useEffect(() => {
    async function getBooking() {
      const res = await axios.get(`${link}/api/cards`);
    }
    getBooking();
  }, []);
  async function addCard(cartItem) {
    try {
      const res = await axios.post(`${link}/api/cards/add`, { ...cartItem });
      setBooking(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  return {
    bookings,
    addCard,
  };
}
