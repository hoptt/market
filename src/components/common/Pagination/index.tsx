type Props = {
  /** 현재 사용자가 보고 있는 페이지 */
  currentPage: number;
  /** 전체 항목의 갯수 */
  count: number;
  /** 페이지 변경 */
  handlePageChange: (pageNumber: number) => void;
};
const btnClassName =
  "border border-slate-300 px-2 py-2 flex justify-center items-center leading-none disabled:opacity-30 hover:bg-slate-200";
export default function Pagination({
  currentPage,
  count,
  handlePageChange,
}: Props) {
  const totalPage = Math.ceil(count / 10);
  const startPageIndex = Math.max(1, Math.min(totalPage - 4, currentPage - 2));
  const endPageIndex = Math.min(startPageIndex + 4, totalPage);
  return (
    <div className="flex gap-1 my-3">
      <button
        className={btnClassName}
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
      >
        이전
      </button>
      {Array.from({ length: endPageIndex - startPageIndex + 1 }).map(
        (_, idx) => {
          const pageIndex = startPageIndex + idx;
          return (
            <button
              key={pageIndex}
              className={btnClassName}
              disabled={currentPage === pageIndex}
              onClick={() => handlePageChange(pageIndex)}
            >
              {pageIndex}
            </button>
          );
        }
      )}
      <button
        className={btnClassName}
        disabled={currentPage === endPageIndex}
        onClick={() => handlePageChange(currentPage + 1)}
      >
        다음
      </button>
    </div>
  );
}
