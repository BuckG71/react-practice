import { useState, useEffect } from 'react';
import { fetchAllItems } from './api';

export const useItems = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const init = async () => {
      const data = await fetchAllItems();
      setItems(data);
    };
    init();
  }, []);

  return [items, setItems];
};