import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PostPaginationProps {
  currentPage: number;
  totalPages: number;
  buildHref: (page: number) => string;
}

export function PostPagination({ currentPage, totalPages, buildHref }: PostPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <Pagination className="mt-12">
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious href={buildHref(currentPage - 1)} text="上一頁" />
          </PaginationItem>
        )}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
          const isNearCurrent = Math.abs(p - currentPage) <= 1;
          const isEdge = p === 1 || p === totalPages;
          if (!isNearCurrent && !isEdge) {
            if (p === 2 || p === totalPages - 1) {
              return (
                <PaginationItem key={p}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }
            return null;
          }
          return (
            <PaginationItem key={p}>
              <PaginationLink href={buildHref(p)} isActive={p === currentPage}>
                {p}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext href={buildHref(currentPage + 1)} text="下一頁" />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
