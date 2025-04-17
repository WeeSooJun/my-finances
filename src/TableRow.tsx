import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { NewTransaction, Transaction } from "./Main";
import dayjs, { Dayjs } from "dayjs";
import { addNewTransaction, deleteTransaction, editTransaction } from "./api";
import Modal from "./Modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const MIN_WAIT_TIME = 750;
const TRANSACTION_TYPES_PER_PAGE = 4;

export interface TableRowProps {
  transactionInput?: Transaction;
  onDeleteClick?: (id: number) => Promise<void>;
  categoryList: string[];
  transactionTypeOptionsList: string[];
  banksList: string[];
  showNewEntry?: boolean;
  setShowNewEntry?: Dispatch<SetStateAction<boolean>>;
  onTransactionSubmit: () => Promise<void>;
}

const TableRow = ({
  transactionInput,
  categoryList,
  transactionTypeOptionsList,
  banksList,
  showNewEntry,
  setShowNewEntry,
  onTransactionSubmit,
}: TableRowProps) => {
  const emptyStringArray: string[] = [];
  const transaction = transactionInput
    ? transactionInput
    : {
        id: 0,
        date: dayjs(),
        name: "",
        category: "",
        transactionTypes: emptyStringArray,
        bank: "",
        amount: null,
      };
  const [date, setDate] = useState<Dayjs>(transaction.date);
  const [name, setName] = useState<string>(transaction.name);
  const [category, setCategory] = useState<string>(transaction.category);
  const [transactionTypes, setTransactionTypes] = useState<string[]>(
    transaction.transactionTypes,
  );
  const [bank, setBank] = useState<string>(transaction.bank);
  const [amount, setAmount] = useState<string | null>(
    transaction.amount ? transaction.amount.toString() : null,
  );
  const [isHover, setIsHover] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] =
    useState<boolean>(false);
  const [hasMinWaitTimeElapsed, setHasMinWaitTimeElapsed] = useState<
    boolean | null
  >(null);
  const [transactionTypePage, setTransactionTypePage] = useState<number>(1);

  const queryClient = useQueryClient();

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: (id: number) => {
      return deleteTransaction(id);
    },
  });

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsEdit(false);
      setName(transaction.name);
      setDate(transaction.date);
      setCategory(transaction.category);
      setTransactionTypes(transaction.transactionTypes);
      setAmount(transaction.amount ? transaction.amount.toString() : null);
      setBank(transaction.bank);
      setShowNewEntry && setShowNewEntry(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  useEffect(() => {
    if (isSuccess && hasMinWaitTimeElapsed) {
      setHasMinWaitTimeElapsed(null);
      setIsDeleteModalVisible(false);
      queryClient.invalidateQueries({ queryKey: ["transactionsData"] });
    }
  }, [isSuccess, hasMinWaitTimeElapsed]);

  const inputClasses =
    "w-full bg-gray-800 text-gray-200 rounded px-3 py-2 border border-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";
  const selectClasses =
    "w-full bg-gray-800 text-gray-200 rounded px-3 py-2 border border-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

  return (
    <>
      {!isEdit && transactionInput !== undefined && (
        <tr
          className="border-none text-gray-300 transition-colors hover:bg-gray-800"
          key={transactionInput.id ? transactionInput.id : 0}
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          onDoubleClick={() => {
            setIsEdit(true);
            setDate(date);
            setName(name);
            setCategory(category);
            setTransactionTypes(transactionTypes);
            setBank(bank);
            setAmount(amount);
          }}
          tabIndex={0}
        >
          <td className="p-4">{date.format("DD/MM/YYYY")}</td>
          <td className="p-4">{name}</td>
          <td className="p-4">{category}</td>
          <td className="p-4">{transactionTypes.join(", ")}</td>
          <td className="p-4">{bank}</td>
          <td className="p-4 text-right font-medium">
            {parseFloat(amount || "0") < 0 ? (
              <span className="text-red-400">{amount}</span>
            ) : (
              <span className="text-green-400">{amount}</span>
            )}
          </td>
          {/* Delete button column with transparent background */}
          <td className="w-16 border-none bg-transparent p-0 text-center">
            <button
              type="button"
              className={`rounded p-1 transition-all duration-200 ${
                isHover ? "opacity-100" : "opacity-0"
              } hover:bg-red-900 focus:opacity-100 focus:outline-none focus:ring-1 focus:ring-red-500`}
              onClick={() => setIsDeleteModalVisible(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </td>
        </tr>
      )}
      {(isEdit || showNewEntry) && (
        <tr
          className="bg-gray-800"
          tabIndex={0}
          onKeyDown={async (event) => {
            if (event.key === "Enter") {
              if (transaction.id === 0) {
                const newTransaction: NewTransaction = {
                  date: date!,
                  name: name,
                  category: category!,
                  transactionTypes: transactionTypes,
                  bank: bank!,
                  amount: parseFloat(amount!),
                };
                await addNewTransaction(newTransaction);
                setShowNewEntry && setShowNewEntry(false);
              } else {
                const transactionToEdit: Transaction = {
                  id: transaction.id,
                  date: date!,
                  name: name,
                  category: category!,
                  transactionTypes: transactionTypes,
                  bank: bank!,
                  amount: parseFloat(amount!),
                };
                await editTransaction(transactionToEdit);
                setIsEdit(false);
              }
              onTransactionSubmit();
            }
          }}
        >
          <td className="p-3">
            <input
              type="date"
              value={(date as Dayjs).format("YYYY-MM-DD")}
              onChange={(e) => setDate(dayjs(e.target.value))}
              className={inputClasses}
            />
          </td>
          <td className="p-3">
            <input
              type="text"
              value={name ? name : ""}
              onChange={(e) => setName(e.target.value)}
              className={inputClasses}
              placeholder="Transaction name"
            />
          </td>
          <td className="p-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={selectClasses}
            >
              <option value="" disabled>
                Select category
              </option>
              {categoryList.map((val) => (
                <option key={val}>{val}</option>
              ))}
            </select>
          </td>
          <td className="p-3">
            <div className="transaction-type h-[240px] max-w-[118px] rounded-lg border border-gray-700 bg-gray-900 p-3">
              <div className="mb-3 h-[120px]">
                {transactionTypeOptionsList
                  .slice(
                    (transactionTypePage - 1) * TRANSACTION_TYPES_PER_PAGE,
                    (transactionTypePage - 1) * TRANSACTION_TYPES_PER_PAGE +
                      TRANSACTION_TYPES_PER_PAGE,
                  )
                  .map((val) => {
                    return (
                      <div key={val} className="mb-2 flex items-center">
                        <input
                          type="checkbox"
                          id={val}
                          value={val}
                          checked={transactionTypes.includes(val)}
                          onChange={(e) =>
                            e.target.checked
                              ? setTransactionTypes((prev) =>
                                  prev.concat([e.target.value]),
                                )
                              : setTransactionTypes((prev) => {
                                  return prev.filter(
                                    (ele) => e.target.value !== ele,
                                  );
                                })
                          }
                          className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                        />
                        <label
                          htmlFor={val}
                          className="ml-2 text-sm text-gray-300"
                        >
                          {val}
                        </label>
                      </div>
                    );
                  })}
              </div>
              <div className="selected-types mb-2 rounded bg-gray-800 px-2 py-1 text-xs text-gray-300">
                <span className="font-medium">Selected:</span>{" "}
                {transactionTypes.length ? transactionTypes.join(", ") : "None"}
              </div>
              <div className="transaction-types-buttons flex justify-between">
                <button
                  type="button"
                  onClick={() =>
                    setTransactionTypePage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={transactionTypePage <= 1}
                  className="rounded bg-gray-800 px-2 py-1 text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                >
                  &lt;
                </button>
                <span className="text-xs text-gray-400">
                  Page {transactionTypePage}/
                  {Math.max(
                    1,
                    Math.ceil(
                      transactionTypeOptionsList.length /
                        TRANSACTION_TYPES_PER_PAGE,
                    ),
                  )}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setTransactionTypePage((prev) =>
                      Math.min(
                        prev + 1,
                        Math.ceil(
                          transactionTypeOptionsList.length /
                            TRANSACTION_TYPES_PER_PAGE,
                        ),
                      ),
                    )
                  }
                  disabled={
                    transactionTypePage >=
                    Math.ceil(
                      transactionTypeOptionsList.length /
                        TRANSACTION_TYPES_PER_PAGE,
                    )
                  }
                  className="rounded bg-gray-800 px-2 py-1 text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                >
                  &gt;
                </button>
              </div>
            </div>
          </td>
          <td className="p-3">
            <select
              value={bank}
              onChange={(e) => setBank(e.target.value)}
              className={selectClasses}
            >
              <option value="" disabled>
                Select bank
              </option>
              {banksList.map((val) => (
                <option key={val}>{val}</option>
              ))}
            </select>
          </td>
          <td className="p-3">
            <input
              onChange={(e) => {
                setAmount(e.target.value);
              }}
              value={amount !== null ? amount : ""}
              placeholder="0.00"
              className={inputClasses}
              type="number"
              step="0.01"
            />
          </td>
          {/* Cancel button with transparent background */}
          <td className="w-16 border-none bg-transparent p-3">
            <button
              type="button"
              className="rounded p-1 text-gray-400 hover:bg-gray-700 hover:text-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-500"
              onClick={() => {
                setIsEdit(false);
                setShowNewEntry && setShowNewEntry(false);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </td>
        </tr>
      )}
      {transactionInput && (
        <Modal
          isVisible={isDeleteModalVisible}
          isLoading={isPending || hasMinWaitTimeElapsed === false}
          confirmAction={() => {
            setHasMinWaitTimeElapsed(false);
            mutate(transactionInput.id);
            setTimeout(() => {
              setHasMinWaitTimeElapsed(true);
            }, MIN_WAIT_TIME);
          }}
          cancelAction={() => setIsDeleteModalVisible(false)}
        />
      )}
    </>
  );
};

export default TableRow;
