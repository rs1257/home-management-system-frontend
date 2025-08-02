import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { type InputHTMLAttributes, useEffect, useState } from "react";
import { fuzzyFilter } from "@/util/table";

interface TableProps<T extends object> {
	data: T[];
	columns: ColumnDef<T, string>[];
	className?: string;
}

export function Table<T extends object>({
	data,
	columns,
	className,
}: TableProps<T>) {
	const [globalFilter, setGlobalFilter] = useState("");
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 25,
	});

	const table = useReactTable({
		data,
		columns,
		filterFns: {
			fuzzy: fuzzyFilter,
		},
		state: {
			globalFilter,
			pagination,
		},
		onGlobalFilterChange: setGlobalFilter,
		globalFilterFn: "fuzzy",
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onPaginationChange: setPagination,
		debugTable: true,
		debugHeaders: true,
		debugColumns: false,
	});

	return (
		<>
			<div>
				<DebouncedInput
					value={globalFilter ?? ""}
					onChange={(value) => setGlobalFilter(String(value))}
					className="w-full p-3 bg-primary text-white rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
					placeholder="Search all columns..."
				/>
			</div>
			<div className="h-4" />
			<div className="overflow-x-auto rounded-lg border border-gray-700">
				<table className="w-full text-sm text-text">
					<thead className="bg-primary text-text">
						{table.getHeaderGroups().map((headerGroup) => (
							<tr key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<th
											key={header.id}
											colSpan={header.colSpan}
											className="px-4 py-3 text-left"
										>
											{header.isPlaceholder ? null : (
												<div
													{...{
														className: header.column.getCanSort()
															? "cursor-pointer select-none hover:text-blue-400 transition-colors"
															: "",
														onClick: header.column.getToggleSortingHandler(),
													}}
												>
													{flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
													{{
														asc: " 🔼",
														desc: " 🔽",
													}[header.column.getIsSorted() as string] ?? null}
												</div>
											)}
										</th>
									);
								})}
							</tr>
						))}
					</thead>
					<tbody className="divide-y divide-gray-700">
						{table.getRowModel().rows.map((row) => {
							if ("threshold" in row.original && "quantity" in row.original) {
								const isLessThanThreshold =
									(row.original.quantity as number) <
									(row.original.threshold as number);
								const isEqualToThreshold =
									row.original.quantity === row.original.threshold;
								const violationClass = isLessThanThreshold
									? "bg-red-700 hover:bg-red-800 transition-colors text-white"
									: "bg-orange-400 hover:bg-orange-500 transition-colors text-white";

								className = !(isEqualToThreshold || isLessThanThreshold)
									? "hover:bg-gray-800 transition-colors hover:text-white"
									: violationClass;
							} else {
								className =
									"hover:bg-gray-800 transition-colors hover:text-white";
							}
							return (
								<tr key={row.id} className={className}>
									{row.getVisibleCells().map((cell) => {
										return (
											<td key={cell.id} className="px-4 py-3">
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext(),
												)}
											</td>
										);
									})}
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
			<div className="h-4" />
			<div className="flex flex-wrap items-center gap-2 text-text">
				<button
					type="button"
					className="px-3 py-1 bg-secondary rounded-md hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					{"<"}
				</button>
				<button
					type="button"
					className="px-3 py-1 bg-secondary rounded-md hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					{">"}
				</button>
				<span className="flex items-center gap-1">
					<div>Page</div>
					<strong>
						{table.getState().pagination.pageIndex + 1} of{" "}
						{table.getPageCount()}
					</strong>
				</span>
				<select
					value={table.getState().pagination.pageSize}
					onChange={(e) => {
						table.setPageSize(Number(e.target.value));
					}}
					className="px-2 py-1 bg-secondary rounded-md border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
				>
					{[25, 50, 75, 100].map((pageSize) => (
						<option key={pageSize} value={pageSize}>
							Show {pageSize}
						</option>
					))}
				</select>
				<span>of {table.getPrePaginationRowModel().rows.length} rows</span>
			</div>
		</>
	);
}

// A typical debounced input react component
function DebouncedInput({
	value: initialValue,
	onChange,
	debounce = 500,
	...props
}: {
	value: string | number;
	onChange: (value: string | number) => void;
	debounce?: number;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "onChange">) {
	const [value, setValue] = useState(initialValue);

	useEffect(() => {
		setValue(initialValue);
	}, [initialValue]);

	useEffect(() => {
		const timeout = setTimeout(() => {
			onChange(value);
		}, debounce);

		return () => clearTimeout(timeout);
	}, [value, debounce, onChange]);

	return (
		<input
			{...props}
			value={value}
			onChange={(e) => setValue(e.target.value)}
		/>
	);
}
