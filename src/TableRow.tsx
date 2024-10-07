import { Dispatch, SetStateAction } from "react";
import { Transaction } from "./Main";
import dayjs, { Dayjs } from "dayjs";

interface TableRowProps {
  editTransactionId?: number | null;
  setEditTransactionId?: Dispatch<SetStateAction<number | null>>;
  transactionInput?: Transaction;
  onDeleteClick?: (id: number) => Promise<void>;
  setDate:  Dispatch<SetStateAction<Dayjs>>;
  setName:  Dispatch<SetStateAction<string>>;
  setCategory:  Dispatch<SetStateAction<string>>;
  setTransactionTypes:  Dispatch<SetStateAction<string[]>>;
  setBank:  Dispatch<SetStateAction<string>>;
  setAmount:  Dispatch<SetStateAction<number | null>>;
  categoryList: string[];
  transactionTypeOptionsList: string[];
  banksList: string[];
}


const TableRow = ({ editTransactionId, setEditTransactionId, transactionInput, onDeleteClick, setDate, setName, setCategory, setTransactionTypes, setBank, setAmount, categoryList, transactionTypeOptionsList, banksList }: TableRowProps) => {
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


  // console.log(!editTransactionId);

  return (
    <>
      {transactionInput !== undefined && editTransactionId! !== transaction.id && setEditTransactionId && onDeleteClick && (
        <tr
          key={transactionInput.id ?transactionInput.id : 0}
          // classList={{
          //   "hover-row": true,
          // }}
          // onMouseEnter={() => setIsHovered(true)}
          // onMouseLeave={() => setIsHovered(false)}
          onDoubleClick={() => {
            // hate this but SolidJS still has not type guard
            // already checked on top
            setEditTransactionId!(transactionInput!.id);
            setDate(transaction.date);
            setName(transaction.name);
            setCategory(transaction.category);
            setTransactionTypes(transaction.transactionTypes);
            setBank(transaction.bank);
            setAmount(transaction.amount);
          }}
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              // hate this but SolidJS still has not type guard
              // already checked on top
              setEditTransactionId!(null);
            }
          }}
        >
          <td>{transaction.date.format("DD/MM/YYYY")}</td>
          <td>{transaction.name}</td>
          <td>{transaction.category}</td>
          <td>{transaction.transactionTypes.reduce((prev, curr) => `${prev}, ${curr}`)}</td>
          <td>{transaction.bank}</td>
          <td>{transaction.amount}</td>
          <td className="border-none">
            <button
              type="button"
              // classList={{ "opacity-0": !isHovered, "opacity-1": isHovered }}
              onClick={() => onDeleteClick!(transaction.id)}
            >
              X
            </button>
          </td>
        </tr>
      )}
      {(transactionInput === undefined || editTransactionId! === transaction.id) && (
        <tr
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Escape" && setEditTransactionId !== undefined) {
              // implementation of new and edit row is a bit convoluted now as
              // exit mechanism for edit is ESC but for create it's cancel button
              setEditTransactionId(null);
            }
          }}
        >
          <td>
            <input type="date" value={(transaction.date as Dayjs).format("YYYY-MM-DD")} onChange={(e) => setDate(dayjs(e.target.value))} />
          </td>
          <td>
            <input type="string" value={transaction.name} onChange={(e) => setName(e.target.value)} />
          </td>
          <td>
            <select value={transaction.category} onChange={(e) => setCategory(e.target.value)}>
              {categoryList.map(
                (
                  val, // TODO: deal with loading states later
                ) => (
                  <option>{val}</option>
                ),
              )}
            </select>
          </td>
          <td>
            <div>
              {transactionTypeOptionsList.map((val) => {
                // TODO: deal with loading states later
                return (
                  <div>
                    <input
                      type="checkbox"
                      value={val}
                      checked={transaction.transactionTypes.includes(val)}
                      onChange={(e) =>
                        e.target.checked
                          ? setTransactionTypes((prev) => prev.concat([e.target.value]))
                          : setTransactionTypes((prev) => {
                              return prev.filter((ele) => e.target.value !== ele);
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
            <select value={transaction.bank} onChange={(e) => setBank(e.target.value)}>
              {banksList.map(
                (
                  val, // TODO: deal with loading states later
                ) => (
                  <option>{val}</option>
                ),
              )}
            </select>
          </td>
          <td>
            <input
              onChange={(e) => {
                setAmount(parseFloat(e.target.value));
              }}
              value={transaction.amount !== null ? (transaction.amount as number) : ""}
            />
          </td>
        </tr>
      )}
    </>
  );
};

export default TableRow;
