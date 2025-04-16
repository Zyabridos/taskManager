'use client';

import { useState } from 'react';
import { get } from 'lodash';

type SortOrder = 'asc' | 'desc';

type UseSortableListResult<T> = {
  sortedList: T[];
  sortOrder: SortOrder;
  sortField: string;
  handleSort: (field: string) => void;
};

/**
 * A custom hook to sort a list of objects by a given field.
 * Handles both string and number fields, including nested fields.
 */
function useSortableList<T>(
  list: T[],
  defaultField: string = 'id',
  defaultOrder: SortOrder = 'asc'
): UseSortableListResult<T> {
  const [sortOrder, setSortOrder] = useState<SortOrder>(defaultOrder);
  const [sortField, setSortField] = useState<string>(defaultField);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedList = [...list].sort((a, b) => {
    const aValue = get(a, sortField);
    const bValue = get(b, sortField);

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    }

    const aStr = aValue?.toString().toLowerCase() ?? '';
    const bStr = bValue?.toString().toLowerCase() ?? '';

    return sortOrder === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
  });

  return { sortedList, sortOrder, sortField, handleSort };
}

export default useSortableList;
