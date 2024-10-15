import {
  addNewBank,
  addNewCategory,
  addNewTransactionType,
  getTypesForField,
  getTransactions,
  processXlsx,
  deleteTransaction,
} from "./api";
import dayjs, { Dayjs } from "dayjs";
import { open } from "@tauri-apps/plugin-dialog";
import Table from "./Table";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import NewFieldType from "./NewFieldType";
import TableRow, { TableRowProps } from "./TableRow";
import NewRowToggle from "./NewRowToggle";
import React from "react";

export type Transaction = {
  id: number;
  date: Dayjs;
  name: string;
  category: string;
  transactionTypes: string[];
  bank: string;
  amount: number;
};

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type NewTransaction = PartialBy<Transaction, "id">;

const MAX_INITIAL_ITEMS = 10;
const I32_MAX = 2_147_483_647;

const Main = () => {
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
  const transactionsQueryResult = useInfiniteQuery({
    queryKey: ["transactionsData"],
    queryFn: async ({ pageParam }) => {
      const response = await getTransactions(
        MAX_INITIAL_ITEMS,
        pageParam.date,
        pageParam.id
      );
      return response;
    },
    initialPageParam: {
      date: dayjs().format("YYYY-MM-DD"),
      id: I32_MAX,
    },
    getNextPageParam: (lastPage, _allPages) => {
      return {
        date: lastPage[lastPage.length - 1].date.format("YYYY-MM-DD"),
        id: lastPage[lastPage.length - 1].id,
      };
    },
  });

  const getTransactionsNextPage = async () => {
    await transactionsQueryResult.fetchNextPage();
  };

  const onDeleteClick = async (id: number) => {
    // display popup to confirm delete

    await onDeleteSubmit(id);
  };

  const onDeleteSubmit = async (id: number) => {
    await deleteTransaction(id);
    await transactionsQueryResult.refetch();
  };

  const onTransactionSubmit = async () => {
    await transactionsQueryResult.refetch();
  };

  return (
    <div className="flex flex-col justify-center text-center pt-10">
      <h1>My Finances!</h1>
      <div>
        <NewFieldType
          fieldName="category"
          fieldSubmit={async (e) => {
            addNewCategory(e);
            await categoriesQueryResult.refetch();
          }}
        />
        <NewFieldType
          fieldName="transactionType"
          fieldSubmit={async (e) => {
            addNewTransactionType(e);
            await transactionTypeOptionsQueryResult.refetch();
          }}
        />
        <NewFieldType
          fieldName="bank"
          fieldSubmit={async (e) => {
            addNewBank(e);
            await banksQueryResult.refetch();
          }}
        />
      </div>
      <div>
        <button
          onClick={async () => {
            const selectedFile = await open({
              multiple: false,
              filters: [
                {
                  name: "xlsx",
                  extensions: ["xlsx"],
                },
              ],
            });
            if (selectedFile !== null && !Array.isArray(selectedFile)) {
              await processXlsx(selectedFile);
              await transactionsQueryResult.refetch();
            } else {
              console.error("Error trying to send file name to rust backend");
            }
          }}
        >
          Import .xlsx
        </button>
      </div>
      <br />
      <Table onLoadMore={getTransactionsNextPage}>
        <NewRowToggle
          tableRow={(props: Partial<TableRowProps>) => (
            <TableRow
              {...{
                categoryList: categoriesQueryResult.data!,
                transactionTypeOptionsList:
                  transactionTypeOptionsQueryResult.data!,
                banksList: banksQueryResult.data!,
                onTransactionSubmit,
                onDeleteClick,
              }}
              {...props}
            />
          )}
        />
        {transactionsQueryResult.data?.pages.map((group, i) => (
          <React.Fragment key={i}>
            {group.map((txn) => (
              <TableRow
                key={txn.id}
                {...{
                  transactionInput: txn,
                  categoryList: categoriesQueryResult.data!,
                  transactionTypeOptionsList:
                    transactionTypeOptionsQueryResult.data!,
                  banksList: banksQueryResult.data!,
                  onTransactionSubmit,
                  onDeleteClick,
                }}
              />
            ))}
          </React.Fragment>
        ))}
      </Table>
    </div>
  );
};

export default Main;
