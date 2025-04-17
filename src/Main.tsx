import {
  addNewBank,
  addNewCategory,
  addNewTransactionType,
  getTypesForField,
  getTransactions,
  processXlsx,
} from "./api";
import dayjs, { Dayjs } from "dayjs";
import { open } from "@tauri-apps/plugin-dialog";
import Table from "./Table";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import NewFieldType from "./NewFieldType";
import TableRow, { TableRowProps } from "./TableRow";
import NewRowToggle from "./NewRowToggle";
import React from "react";
import Statistics from "./Statistics";

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
        pageParam.id,
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

  const onTransactionSubmit = async () => {
    await transactionsQueryResult.refetch();
  };

  return (
    <div className="min-h-screen bg-gray-900 px-4 text-gray-100 md:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="py-10 text-center">
          <h1 className="mb-8 text-4xl font-bold text-white">My Finances</h1>
          <Statistics />
        </header>

        <div className="my-6 flex flex-row justify-center">
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

        <div className="my-6 flex justify-center">
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
            className="rounded-md bg-gray-800 px-6 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-gray-700"
          >
            Import .xlsx
          </button>
        </div>

        <div className="mb-12 mt-6 overflow-hidden rounded-lg border border-gray-800">
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
                    }}
                  />
                ))}
              </React.Fragment>
            ))}
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Main;
