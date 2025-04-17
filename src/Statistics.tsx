import StatisticsBox from "./StatisticsBox";

const data = {
  value: 87.5,
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

const Statistics = () => {
  return (
    <div className="flex flex-row justify-around">
      <StatisticsBox data={data} />
      <StatisticsBox data={data} />
    </div>
  );
};

export default Statistics;
