import { Dispatch, SetStateAction, useState } from "react";
import { NewTransaction, Transaction } from "./Main";
import {
  addNewTransaction,
  deleteTransaction,
  editTransaction,
  getTransactions,
  getTypesForField,
} from "./api";
import dayjs, { Dayjs } from "dayjs";
import TableRow from "./TableRow";
import { useQuery } from "@tanstack/react-query";

interface TableProps {
  showNewEntry: boolean;
  setShowNewEntry: Dispatch<SetStateAction<boolean>>;
}

const MAX_INITIAL_ITEMS = 1000;

const Table = ({ showNewEntry, setShowNewEntry }: TableProps) => {
  const [editTransactionId, setEditTransactionId] = useState<number | null>(
    null
  );
  const [date, setDate] = useState<Dayjs>(dayjs());
  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [transactionTypes, setTransactionTypes] = useState<string[]>([]);
  const [bank, setBank] = useState<string>("");
  const [amount, setAmount] = useState<number | null>(null);
  // Seems to be some slowness, maybe can explore context
  const [hoverId, setHoverId] = useState<number | null>(null);
  // const [showDeleteModal, setDeleteModal] = createSignal<boolean>(false);

  const transactionsQueryResult = useQuery({
    queryKey: ["transactionsData"],
    queryFn: async () => {
      const response = await getTransactions(
        MAX_INITIAL_ITEMS,
        dayjs().format("YYYY-MM-DD")
      );
      return response;
    },
  });
  const categoriesQueryResult = useQuery({
    queryKey: ["categoriesData"],
    queryFn: async () => {
      const response = await getTypesForField("category");
      return response;
    },
  });
  const banksQueryResult = useQuery({
    queryKey: ["banksData"],
    queryFn: async () => {
      const response = await getTypesForField("bank");
      return response;
    },
  });
  const transactionTypeOptionsQueryResult = useQuery({
    queryKey: ["transactionTypeOptionsData"],
    queryFn: async () => {
      const response = await getTypesForField("transaction_type");
      return response;
    },
  });

  const onDeleteClick = async (id: number) => {
    // display popup to confirm delete

    await onDeleteSubmit(id);
  };

  const onDeleteSubmit = async (id: number) => {
    await deleteTransaction(id);
    await transactionsQueryResult.refetch();
  };

  return (
    <>
      <form
        className="row"
        onSubmit={async (e) => {
          e.preventDefault();
          // TODO: fix bug here and convert to controlled components for row input
          const transaction: NewTransaction = {
            date: date!,
            name: name,
            category: category,
            transactionTypes: transactionTypes,
            bank: bank,
            amount: amount!,
          };
          if (editTransactionId === null) {
            await addNewTransaction(transaction);
            setShowNewEntry(false);
          } else {
            const transactionToUpdate: Transaction = {
              id: editTransactionId as number, // SolidJS type guard cmi https://github.com/microsoft/TypeScript/issues/53178
              ...transaction,
            };
            await editTransaction(transactionToUpdate);
            setEditTransactionId(null);
          }
          transactionsQueryResult.refetch();
          setDate(dayjs());
          setName("");
          setCategory("");
          setTransactionTypes([]);
          setBank("");
          setAmount(null);
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
          <tbody>
            {showNewEntry &&
              TableRow({
                setDate,
                setName,
                setCategory,
                setTransactionTypes,
                setBank,
                setAmount,
                categoryList: categoriesQueryResult.data!,
                transactionTypeOptionsList:
                  transactionTypeOptionsQueryResult.data!,
                banksList: banksQueryResult.data!,
                hoverId,
                setHoverId,
              })}
            {transactionsQueryResult.data?.map((txn) =>
              TableRow({
                editTransactionId,
                setEditTransactionId,
                transactionInput: txn,
                onDeleteClick,
                setDate,
                setName,
                setCategory,
                setTransactionTypes,
                setBank,
                setAmount,
                categoryList: categoriesQueryResult.data!,
                transactionTypeOptionsList:
                  transactionTypeOptionsQueryResult.data!,
                banksList: banksQueryResult.data!,
                hoverId,
                setHoverId,
              })
            )}
          </tbody>
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
