<script setup>
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Bar } from "vue-chartjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  labels: {
    type: Array,
    required: true,
  },
  legendLabel: {
    type: String,
    required: true,
  },
});
const options = {
  responsive: true,
};
const chartData = {
  labels: props.labels,
  datasets: [
    {
      data: props.data,
      label: props.legendLabel,
      fill: {
        target: "origin",
        above: "rgba(204, 204, 204, 0.1)",
      },
      tension: 0.4,
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "#000",
      pointHoverBorderWidth: 4,
      borderColor: "#D65A31",
      backgroundColor: "fff",
      borderWidth: 1,
    },
  ],
};
</script>
<template>
  <div class="flex w-full h-full items-center min-h-[300px]">
    <Bar
      id="report-chart"
      style="position: relative"
      :data="chartData"
      :options="options"
    />
  </div>
</template>
