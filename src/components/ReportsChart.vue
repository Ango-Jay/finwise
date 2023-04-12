<script setup>
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import { Bar } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const props = defineProps({
    data: {
        type: Object,
        required: true
    }
})
const options = {
    responsive: true
}
const chartData = {
    ...props.data,
    fill: {
          target: 'origin',
          above: 'rgba(204, 204, 204, 0.1)'
        },
        tension: 0.4,
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#000',
        pointHoverBorderWidth: 4,
        borderColor: '#000',
        backgroundColor: 'fff',
        borderWidth: 1,
}
</script>
<template>
    
      <Bar
      :data="props.data"
      :options="options"
      />
</template>