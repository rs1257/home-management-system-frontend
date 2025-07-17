import type { RankingInfo } from "@tanstack/match-sorter-utils";
import type { FilterFn } from "@tanstack/react-table";

declare module "@tanstack/react-table" {
	interface FilterFns {
		fuzzy: FilterFn<unknown>;
	}
	interface FilterMeta {
		itemRank: RankingInfo;
	}
}
