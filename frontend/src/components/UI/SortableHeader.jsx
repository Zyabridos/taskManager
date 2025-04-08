'use client';

import React from 'react';

/**
 * A reusable sortable table header component.
 *
 * @param {string} label - Column label text
 * @param {string} field - Field name used for sorting
 * @param {string} currentSortField - Currently active sorting field
 * @param {'asc' | 'desc'} sortOrder - Current sort direction
 * @param {Function} onSort - Function to handle sorting change
 */

const SortableHeader = ({ label, field, currentSortField, sortOrder, onSort }) => {
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
