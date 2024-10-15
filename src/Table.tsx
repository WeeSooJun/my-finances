import { PropsWithChildren } from "react";

interface TableProps extends PropsWithChildren {
  onLoadMore: () => void;
}

const Table = ({ onLoadMore, children }: TableProps) => {
  // const [showDeleteModal, setDeleteModal] = createSignal<boolean>(false);
  return (
    <>
      <form
        className="row pl-24"
        onSubmit={async (e) => {
          e.preventDefault();
          // transactionsQueryResult.refetch();
        }}
      >
        {/* <Portal><div class="bg-black fixed left-0 top-0 overflow-auto w-full h-full bg-opacity-40 "><div class="bg-white ml-[25%] mr-[25%] mt-[25%] mb-[25%]">TEST</div></div></Portal> */}
        <table>
          <thead>
            <tr className="h-14">
              <th>Date(DD/MM/YYYY)</th>
              <th>Name</th>
              <th>Category</th>
              <th>Type</th>
              <th>Bank</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>{children}</tbody>
          <tfoot>
            <tr>
              <td colSpan={6}>
                <button className="w-full" onClick={onLoadMore}>
                  Load More
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
      </form>
    </>
  );
};

export default Table;
