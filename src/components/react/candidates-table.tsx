import * as React from 'react'
import {
  type SortDirection,
  type SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { z } from 'zod'
import type { candidateDataSchema } from '#utils/types'

type CandidateData = z.infer<typeof candidateDataSchema>

export function CandidatesTable({ data }: { data: CandidateData[] }) {
  const columnHelper = createColumnHelper<CandidateData>()
  const columns = [
    columnHelper.accessor('Office', {
      header: 'Office',
    }),
    columnHelper.accessor('Type', {
      header: 'Type',
    }),
    columnHelper.accessor('Dist', {
      header: 'District',
      enableSorting: true,
    }),
    columnHelper.accessor('Party', {
      header: 'Party',
      enableSorting: true,
    }),
    columnHelper.accessor('FirstName', {
      header: 'first',
    }),
    columnHelper.accessor('LastName', {
      header: 'last',
    }),
    columnHelper.accessor(row => `${row.FirstName} ${row.LastName}`, {
      id: 'fullName',
      header: 'Candidate',
      enableSorting: true,
    }),
    columnHelper.display({
      id: 'ballotpedia',
      header: 'Ballotpedia',
      cell: ({ row }) => row.original.ballotpedia ? <a className="text-blue-500 underline" href={row.original.ballotpedia}>Ballotpedia page</a> : null,
    }),
    columnHelper.display({
      id: 'website',
      header: 'Campaign website',
      cell: ({ row }) => row.original.ballotpedia ? <a className="text-blue-500 underline" href={row.original.ballotpedia}>Campaign website</a> : null,
    }),
    columnHelper.display({
      id: 'comparison',
      header: 'Comparison',
      cell: ({ row }) => row.original.comparison ? <a className="text-blue-500 underline" href={row.original.comparison}>{row.original.comparison_text}</a> : null,
    }),
  ]

  const [sorting, setSorting] = React.useState<SortingState>([{
    id: 'fullName',
    desc: false,
  }])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
    isMultiSortEvent: () => true,
  })

  return (
    <table className="w-full">
      <thead>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th className="p-2 text-left first:pl-0 last:pr-0" key={header.id}>
                <div
                  onClick={header.column.getToggleSortingHandler()}
                  className={
                          header.column.getCanSort()
                            ? 'cursor-pointer select-none'
                            : ''
                        }
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  <SortIcon sortDir={header.column.getIsSorted()} />
                </div>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map(row => (
          <tr key={row.id}>
            {row.getVisibleCells().map(cell => (
              <td className="border-b p-2 text-left first:pl-0 last:pr-0" key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function SortIcon({ sortDir }: { sortDir: false | SortDirection }) {
  return sortDir === 'asc' ? ' 🔼' : sortDir === 'desc' ? ' 🔽' : null
}
