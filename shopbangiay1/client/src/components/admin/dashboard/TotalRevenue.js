import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useSelector } from "react-redux";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Biểu đồ các sản phẩm được",
    },
  },
};

export function TotalRevenue() {
  let { data: dulieu } = useSelector((state) => state.order);
  let listorder = dulieu?.orders;
  console.log(listorder);

  let dataOrder = [];
  for (let i = 0; i < listorder?.length; i++) {
    dataOrder = [...dataOrder, ...listorder[i].order_detail];
  }
  console.log(dataOrder);
  if (dataOrder.length !== 0) {
    for (let i = 0; i < dataOrder.length - 1; i++) {
      if (dataOrder[i].product._id === dataOrder[i + 1].product._id) {
        dataOrder[i].quantity += dataOrder[i + 1].quantity;
        dataOrder.splice(i + 1, 1);
      }
    }
  }
  const randomBetween = (min, max) =>
    min + Math.floor(Math.random() * (max - min + 1));

  const label = dataOrder?.map((item) => item.product.name);
  const values = dataOrder?.map((item) => item.quantity);
  const value2 = dataOrder?.map((item) => item.quantity * item.product.price);
  let backgorund = [];
  for (let i = 0; i < dataOrder?.length; i++) {
    const r = randomBetween(0, 255);
    const g = randomBetween(0, 255);
    const b = randomBetween(0, 255);
    backgorund.push(`rgba(${r},${g},${b},0.5)`);
  }
  const data1 = {
    labels: label,
    datasets: [
      {
        label: "Số lượng sản phẩm bán được",
        data: values,
        backgroundColor: backgorund,
      },
    ],
  };
  console.log(dataOrder);
  return <Bar options={options} data={data1} />;
}
