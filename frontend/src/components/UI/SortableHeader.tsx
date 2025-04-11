'use client';

import React from 'react';

/**
 * A reusable sortable table header component.
 *
 * @param label - Column label text
 * @param field - Field name used for sorting
 * @param currentSortField - Currently active sorting field
 * @param sortOrder - Current sort direction ('asc' or 'desc')
 * @param onSort - Function to handle sorting change
 */
interface SortableHeaderProps {
  label: string;
  field: string;
  currentSortField: string;
  sortOrder: 'asc' | 'desc';
  onSort: (field: string) => void;
}

const SortableHeader: React.FC<SortableHeaderProps> = ({ label, field, currentSortField, sortOrder, onSort }) => {
  const isActive = currentSortField === field;
  const arrow = isActive ? (sortOrder === 'asc' ? '↑' : '↓') : '';

  return (
    <th
      onClick={() => onSort(field)}
      className="cursor-pointer select-none px-6 py-3 text-left text-xs font-medium uppercase text-gray-700"
    >
      {label} {arrow}
    </th>
  );
};

export default SortableHeader;
