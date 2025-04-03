'use client';

import { useState } from 'react';
import getValue from '../utils/getValue';

/**
 * A custom hook to sort a list of objects by a given field, including nested fields.
 *
 * @param {Array} list - The original list of objects to be sorted.
 * @param {string} defaultField - The initial field to sort by (e.g., 'id', 'executor.firstName').
 * @param {'asc' | 'desc'} defaultOrder - Initial sorting order.
 * @returns {{
 *   sortedList: Array,
 *   sortOrder: 'asc' | 'desc',
 *   sortField: string,
 *   handleSort: (field: string) => void
 * }}
 */

const useSortableList = (list, defaultField = 'id', defaultOrder = 'asc') => {
  const [sortOrder, setSortOrder] = useState(defaultOrder);
  const [sortField, setSortField] = useState(defaultField);

  const handleSort = field => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedList = [...list].sort((a, b) => {
    const aValue = getValue(a, sortField).toString().toLowerCase();
    const bValue = getValue(b, sortField).toString().toLowerCase();

    if (sortOrder === 'asc') return aValue.localeCompare(bValue);
    return bValue.localeCompare(aValue);
  });

  return { sortedList, sortOrder, sortField, handleSort };
};

export default useSortableList;
