import { rankItem } from "@tanstack/match-sorter-utils";
import type { FilterFn } from "@tanstack/react-table";

export const fuzzyFilter = <T>(
	row: Parameters<FilterFn<T>>[0],
	columnId: Parameters<FilterFn<T>>[1],
	value: Parameters<FilterFn<T>>[2],
	addMeta: Parameters<FilterFn<T>>[3],
) => {
	// Rank the item
	const itemRank = rankItem(row.getValue(columnId), value);

	// Store the itemRank info
	addMeta({
		itemRank,
	});

	// Return if the item should be filtered in/out
	return itemRank.passed;
};
