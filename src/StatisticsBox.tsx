import { DollarSign, TrendingDown } from "lucide-react";

const StatisticsBox = () => {
  const data = {
    average: 87.5,
    title: "Monthly Average Expense",
    trend: "-12.3%",
    period: "vs last month",
    categories: [
      { name: "Food", percentage: 35 },
      { name: "Transport", percentage: 25 },
      { name: "Shopping", percentage: 20 },
      { name: "Others", percentage: 20 },
    ],
  };
  return (
    <div className="h-64 w-96 rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-200">{data.title}</h3>
        <div className="rounded-full bg-emerald-900 p-2">
          <DollarSign size={20} className="text-emerald-400" />
        </div>
      </div>

      <div className="flex flex-col">
        <div className="mb-2 flex items-baseline">
          <span className="mr-2 text-sm text-gray-400">Average</span>
          <span className="text-3xl font-bold text-gray-100">
            ${data.average.toFixed(2)}
          </span>
        </div>

        <div className="mt-1 flex items-center">
          <TrendingDown size={16} className="mr-1 text-emerald-400" />
          <span className="font-medium text-emerald-400">{data.trend}</span>
          <span className="ml-1 text-sm text-gray-400">{data.period}</span>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-1 text-xs text-gray-400">Category Breakdown</div>
        <div className="flex h-2 overflow-hidden rounded-full">
          <div
            className="h-full bg-cyan-500"
            style={{ width: `${data.categories[0].percentage}%` }}
          ></div>
          <div
            className="h-full bg-emerald-500"
            style={{ width: `${data.categories[1].percentage}%` }}
          ></div>
          <div
            className="h-full bg-violet-500"
            style={{ width: `${data.categories[2].percentage}%` }}
          ></div>
          <div
            className="h-full bg-amber-500"
            style={{ width: `${data.categories[3].percentage}%` }}
          ></div>
        </div>

        <div className="mt-2 flex justify-between text-xs">
          <div className="flex items-center">
            <div className="mr-1 h-2 w-2 rounded-full bg-cyan-500"></div>
            <span className="text-gray-300">Food</span>
          </div>
          <div className="flex items-center">
            <div className="mr-1 h-2 w-2 rounded-full bg-emerald-500"></div>
            <span className="text-gray-300">Transport</span>
          </div>
          <div className="flex items-center">
            <div className="mr-1 h-2 w-2 rounded-full bg-violet-500"></div>
            <span className="text-gray-300">Shopping</span>
          </div>
          <div className="flex items-center">
            <div className="mr-1 h-2 w-2 rounded-full bg-amber-500"></div>
            <span className="text-gray-300">Others</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsBox;
