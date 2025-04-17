import { PropsWithChildren } from "react";

interface TableProps extends PropsWithChildren {
  onLoadMore: () => void;
}

const Table = ({ onLoadMore, children }: TableProps) => {
  return (
    <div className="w-full overflow-x-auto rounded-lg bg-gray-900 shadow-xl">
      <form
        className="w-full"
        onSubmit={async (e) => {
          e.preventDefault();
          // transactionsQueryResult.refetch();
        }}
      >
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-700 bg-gray-800 text-left">
              <th className="p-4 font-medium text-gray-300">Date</th>
              <th className="p-4 font-medium text-gray-300">Name</th>
              <th className="p-4 font-medium text-gray-300">Category</th>
              <th className="p-4 font-medium text-gray-300">Type</th>
              <th className="p-4 font-medium text-gray-300">Bank</th>
              <th className="p-4 text-right font-medium text-gray-300">
                Amount
              </th>
              {/* Action column header is transparent */}
              <th className="border-none bg-transparent p-4 text-transparent"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">{children}</tbody>
          <tfoot>
            <tr>
              <td colSpan={7} className="border-none p-2">
                <button
                  className="w-full rounded-md bg-gray-800 p-3 text-gray-300 transition-colors hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={onLoadMore}
                >
                  Load More
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
      </form>
    </div>
  );
};

export default Table;
