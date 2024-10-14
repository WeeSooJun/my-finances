import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { NewTransaction, Transaction } from "./Main";
import dayjs, { Dayjs } from "dayjs";
import { addNewTransaction, editTransaction } from "./api";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";

export interface TableRowProps {
  transactionInput?: Transaction;
  onDeleteClick?: (id: number) => Promise<void>;
  categoryList: string[];
  transactionTypeOptionsList: string[];
  banksList: string[];
  showNewEntry?: boolean;
  setShowNewEntry?: Dispatch<SetStateAction<boolean>>;
  refetchTransactions: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<Transaction[], Error>>;
}

const TableRow = ({
  transactionInput,
  onDeleteClick,
  categoryList,
  transactionTypeOptionsList,
  banksList,
  showNewEntry,
  setShowNewEntry,
  refetchTransactions,
}: TableRowProps) => {
  const emptyStringArray: string[] = [];
  const transaction = transactionInput
    ? transactionInput
    : {
        id: 0, // TODO: do something about this 0 later
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

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsEdit(false);
      setName(transaction.name);
      setDate(transaction.date);
      setCategory(transaction.category);
      setTransactionTypes(transaction.transactionTypes);
      setAmount(transaction.amount ? transaction.amount.toString() : null);
      setShowNewEntry && setShowNewEntry(false);
    }
  }, []);

  useEffect(() => {
    // attach the event listener
    document.addEventListener("keydown", handleKeyPress);

    // remove the event listener
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  console.log(
    "test tablerow id" +
      transaction.id +
      " " +
      dayjs().format("YYYY-MM-DDTHH:mm:ss"),
  );
  return (
    <>
      {!isEdit && transactionInput !== undefined && (
        <tr
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
          <td>{date.format("DD/MM/YYYY")}</td>
          <td>{name}</td>
          <td>{category}</td>
          <td>{transactionTypes.reduce((prev, curr) => `${prev}, ${curr}`)}</td>
          <td>{bank}</td>
          <td>{amount}</td>
          <td className="border-none">
            <button
              type="button"
              className={`${isHover ? "opacity-1" : "opacity-0"}`}
              onClick={() => onDeleteClick!(transaction.id)}
            >
              X
            </button>
          </td>
        </tr>
      )}
      {(isEdit || showNewEntry) && (
        <tr
          tabIndex={0}
          onKeyDown={async (event) => {
            if (event.key === "Escape") {
              // implementation of new and edit row is a bit convoluted now as
              // exit mechanism for edit is ESC but for create it's cancel button
              setIsEdit(false);
              setName(transaction.name);
              setDate(transaction.date);
              setCategory(transaction.category);
              setTransactionTypes(transaction.transactionTypes);
              setAmount(
                transaction.amount ? transaction.amount.toString() : null,
              );
              setShowNewEntry && setShowNewEntry(false);
            } else if (event.key === "Enter") {
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
              refetchTransactions();
            }
          }}
        >
          <td>
            <input
              type="date"
              value={(date as Dayjs).format("YYYY-MM-DD")}
              onChange={(e) => setDate(dayjs(e.target.value))}
            />
          </td>
          <td>
            <input
              type="string"
              value={name ? name : ""}
              onChange={(e) => setName(e.target.value)}
            />
          </td>
          <td>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categoryList.map(
                (
                  val, // TODO: deal with loading states later
                ) => (
                  <option key={val}>{val}</option>
                ),
              )}
            </select>
          </td>
          <td>
            <div>
              {transactionTypeOptionsList.map((val) => {
                // TODO: deal with loading states later
                return (
                  <div key={val}>
                    <input
                      type="checkbox"
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
                    />
                    <label htmlFor={val}>{val}</label>
                  </div>
                );
              })}
            </div>
          </td>
          <td>
            <select value={bank} onChange={(e) => setBank(e.target.value)}>
              {banksList.map(
                (
                  val, // TODO: deal with loading states later
                ) => (
                  <option key={val}>{val}</option>
                ),
              )}
            </select>
          </td>
          <td>
            <input
              onChange={(e) => {
                setAmount(e.target.value);
              }}
              value={amount !== null ? amount : ""}
            />
          </td>
        </tr>
      )}
    </>
  );
};

export default TableRow;
