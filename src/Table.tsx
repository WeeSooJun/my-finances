import { PropsWithChildren } from "react";

interface TableProps extends PropsWithChildren {}

const Table = ({ children }: TableProps) => {
  // const [showDeleteModal, setDeleteModal] = createSignal<boolean>(false);
  return (
    <>
      <form
        className="row"
        onSubmit={async (e) => {
          e.preventDefault();
          // transactionsQueryResult.refetch();
        }}
      >
        {/* <Portal><div class="bg-black fixed left-0 top-0 overflow-auto w-full h-full bg-opacity-40 "><div class="bg-white ml-[25%] mr-[25%] mt-[25%] mb-[25%]">TEST</div></div></Portal> */}
        <table>
          <thead>
            <tr>
              <th>Date (DD/MM/YYYY)</th>
              <th>Name</th>
              <th>Category</th>
              <th>Type</th>
              <th>Bank</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
        <button
          style={{
            visibility: "hidden",
            width: 0,
            height: 0,
            position: "absolute",
          }}
          type="submit"
        />{" "}
        {/* I need this here in order for the enter button to work */}
      </form>
      <button>Load More</button>
    </>
  );
};

export default Table;
