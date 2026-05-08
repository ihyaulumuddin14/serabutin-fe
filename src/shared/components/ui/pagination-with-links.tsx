import { type MouseEvent, type ReactNode, useCallback } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { cn } from "@/shared/lib/utils";

export interface PaginationWithLinksProps {
  pageSizeSelectOptions?: {
    pageSizeSearchParam?: string;
    pageSizeOptions: number[];
  };
  totalCount: number;
  pageSize: number;
  page: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

/**
 * Controlled pagination with state handlers
 * 
 * @example
 * ```
 * // Controlled pagination
 * <PaginationWithLinks
    page={1}
    pageSize={20}
    totalCount={500}
    onPageChange={setPage}
  />
 * ```
 */
export function PaginationWithLinks({
  pageSizeSelectOptions,
  pageSize,
  totalCount,
  page,
  onPageChange,
  onPageSizeChange,
}: PaginationWithLinksProps) {
  const totalPageCount = Math.max(1, Math.ceil(totalCount / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPageCount);
  const navigateToPage = useCallback(
    (newPage: number) => {
      const nextPage = Math.min(Math.max(1, newPage), totalPageCount);
      onPageChange(nextPage);
    },
    [onPageChange, totalPageCount],
  );

  const navToPageSize = useCallback(
    (newPageSize: number) => {
      if (onPageSizeChange) {
        onPageSizeChange(newPageSize);
      }
    },
    [onPageSizeChange],
  );

  const renderPageNumbers = () => {
    const items: ReactNode[] = [];
    const maxVisiblePages = 5;

    const createPageItem = (pageNum: number) => {
      return (
        <PaginationItem key={pageNum}>
          <PaginationLink
            href="#"
            onClick={(event: MouseEvent<HTMLAnchorElement>) => {
              event.preventDefault();
              navigateToPage(pageNum);
            }}
            isActive={currentPage === pageNum}
            className={cn("cursor-pointer")}
          >
            {pageNum}
          </PaginationLink>
        </PaginationItem>
      );
    };

    if (totalPageCount <= maxVisiblePages) {
      for (let i = 1; i <= totalPageCount; i++) {
        items.push(createPageItem(i));
      }
    } else {
      items.push(createPageItem(1));

      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPageCount - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        items.push(createPageItem(i));
      }

      if (currentPage < totalPageCount - 2) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }

      items.push(createPageItem(totalPageCount));
    }

    return items;
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-3 w-full">
      {pageSizeSelectOptions && (
        <div className="flex flex-col gap-4 flex-1">
          <SelectRowsPerPage
            options={pageSizeSelectOptions.pageSizeOptions}
            setPageSize={navToPageSize}
            pageSize={pageSize}
          />
        </div>
      )}
      <Pagination className={cn({ "md:justify-end": pageSizeSelectOptions })}>
        <PaginationContent className="max-sm:gap-0">
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(event: MouseEvent<HTMLAnchorElement>) => {
                event.preventDefault();
                navigateToPage(Math.max(currentPage - 1, 1));
              }}
              aria-disabled={currentPage === 1}
              tabIndex={currentPage === 1 ? -1 : undefined}
              className={cn(
                currentPage === 1
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer",
              )}
            />
          </PaginationItem>
          {renderPageNumbers()}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(event: MouseEvent<HTMLAnchorElement>) => {
                event.preventDefault();
                navigateToPage(Math.min(currentPage + 1, totalPageCount));
              }}
              aria-disabled={currentPage === totalPageCount}
              tabIndex={currentPage === totalPageCount ? -1 : undefined}
              className={cn(
                currentPage === totalPageCount
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer",
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

function SelectRowsPerPage({
  options,
  setPageSize,
  pageSize,
}: {
  options: number[];
  setPageSize: (newSize: number) => void;
  pageSize: number;
}) {
  return (
    <div className="flex items-center gap-4">
      <span className="whitespace-nowrap text-sm">Rows per page</span>

      <Select
        value={String(pageSize)}
        onValueChange={(value) => setPageSize(Number(value))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select page size">
            {String(pageSize)}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option}
              value={String(option)}
            >
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
