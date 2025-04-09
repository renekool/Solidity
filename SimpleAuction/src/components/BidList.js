// src/components/BidList.js

import React, { useMemo } from 'react';
import { useTable } from 'react-table';
import '../css/BidList.css';

function BidList({ bids }) {
  const columns = useMemo(() => [
    { Header: 'Transaction Hash', accessor: 'transactionHash' },
    { Header: 'Address', accessor: 'address' },
    { Header: 'Oferta (ETH)', accessor: 'amount' },
    { Header: 'Status', accessor: 'status' },
  ], []);

  const data = useMemo(() => bids, [bids]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });

  return (
    <div className="bid-list-container">
      <h2>Lista de Ofertas</h2>
      {bids.length === 0 ? (
        <p>Sin ofertas</p>
      ) : (
        <table {...getTableProps()} className="bid-list-table">
          <thead>
            {headerGroups.map((headerGroup) => {
              const { key: headerKey, ...restHeaderGroupProps } = headerGroup.getHeaderGroupProps();
              return (
                <tr key={headerKey} {...restHeaderGroupProps}>
                  {headerGroup.headers.map((column) => {
                    const { key: columnKey, ...restColumnProps } = column.getHeaderProps();
                    return (
                      <th key={columnKey} {...restColumnProps}>
                        {column.render('Header')}
                      </th>
                    );
                  })}
                </tr>
              );
            })}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              const { key: rowKey, ...restRowProps } = row.getRowProps();
              return (
                <tr key={rowKey} {...restRowProps}>
                  {row.cells.map((cell) => {
                    const { key: cellKey, ...restCellProps } = cell.getCellProps();
                    return (
                      <td key={cellKey} {...restCellProps}>
                        {cell.render('Cell')}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default BidList;