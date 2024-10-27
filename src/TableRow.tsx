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
  const [isDeleteModalVisible, setIsDeleteModalVisible] =
    useState<boolean>(false);
  const [hasMinWaitTimeElapsed, setHasMinWaitTimeElapsed] = useState<
    boolean | null
  >(null);

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

  useEffect(() => {
    if (isSuccess && hasMinWaitTimeElapsed) {
      setHasMinWaitTimeElapsed(null);
      setIsDeleteModalVisible(false);
      queryClient.invalidateQueries({ queryKey: ["transactionsData"] });
    }
  }, [isSuccess, hasMinWaitTimeElapsed]);

  // if (transactionInput?.id === 3636)
  //   console.log(
  //     `id: ${transactionInput?.id}, hasMinWaitTimeElapsed: ${hasMinWaitTimeElapsed}, time: ${dayjs().format("YYYY-MM-DDTHH:mm:ss")}`,
  //   );

  return (
    <>
      {!isEdit && transactionInput !== undefined && (
        <tr
          className="h-14"
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
              // className="opacity-1"
              className={
                // "rounded-lg border-solid border-transparent py-2.5 px-5" +
                `${isHover ? "opacity-1" : "opacity-0"}`
              }
              onClick={() => setIsDeleteModalVisible(true)}
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
