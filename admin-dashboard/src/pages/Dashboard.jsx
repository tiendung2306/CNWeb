import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import "./Dashboard.css"; // Import CSS của bạn

// Đăng ký các thành phần Chart.js cần thiết
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  // Dữ liệu giả lập cho số đơn hàng và doanh thu
  const dailyData = {
    labels: ['Ngày 1', 'Ngày 2', 'Ngày 3', 'Ngày 4', 'Ngày 5', 'Ngày 6', 'Ngày 7'],
    datasets: [
      {
        label: 'Số đơn hàng',
        data: [20, 35, 40, 50, 25, 60, 80],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Doanh thu',
        data: [1000000, 2000000, 1500000, 3000000, 2500000, 4000000, 5000000],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      }
    ]
  };

  const monthlyData = {
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7'],
    datasets: [
      {
        label: 'Số đơn hàng',
        data: [150, 200, 240, 300, 180, 250, 400],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Doanh thu',
        data: [5000000, 7000000, 9000000, 12000000, 8000000, 10000000, 15000000],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      }
    ]
  };

  const yearlyData = {
    labels: ['2021', '2022', '2023', '2024', '2025'],
    datasets: [
      {
        label: 'Số đơn hàng',
        data: [2000, 2500, 3000, 3500, 4000],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Doanh thu',
        data: [20000000, 25000000, 30000000, 35000000, 40000000],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      }
    ]
  };

  // State to store selected time period
  const [timePeriod, setTimePeriod] = useState('daily');
  const [chartData, setChartData] = useState(dailyData);

  // Handle time period change
  const handleTimePeriodChange = (event) => {
    const period = event.target.value;
    setTimePeriod(period);

    if (period === 'daily') {
      setChartData(dailyData);
    } else if (period === 'monthly') {
      setChartData(monthlyData);
    } else {
      setChartData(yearlyData);
    }
  };

  // Tùy chọn biểu đồ
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: `Số đơn hàng và Doanh thu theo ${timePeriod === 'daily' ? 'Ngày' : timePeriod === 'monthly' ? 'Tháng' : 'Năm'}`,
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return tooltipItem.datasetIndex === 0
              ? tooltipItem.raw + ' đơn'
              : tooltipItem.raw.toLocaleString() + '₫';
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: timePeriod === 'daily' ? 'Ngày' : timePeriod === 'monthly' ? 'Tháng' : 'Năm',
        }
      },
      y: {
        title: {
          display: true,
          text: 'Số lượng / Doanh thu'
        }
      }
    }
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Tổng quan</h2>
      <div className="cards-container">
        <div className="card">
          <h3 className="card-title">Sản phẩm</h3>
          <p className="card-value blue">120</p>
        </div>
        <div className="card">
          <h3 className="card-title">Đơn hàng</h3>
          <p className="card-value green">85</p>
        </div>
        <div className="card">
          <h3 className="card-title">Người dùng</h3>
          <p className="card-value purple">45</p>
        </div>
        <div className="card">
          <h3 className="card-title">Doanh thu</h3>
          <p className="card-value red">25.000.000₫</p>
        </div>
      </div>

      {/* Dropdown for selecting time period */}
      <div className="time-period-selector">
        <label htmlFor="timePeriod" className="mr-4">Chọn khoảng thời gian:</label>
        <select
          id="timePeriod"
          value={timePeriod}
          onChange={handleTimePeriodChange}
          className="p-2 border rounded-md"
        >
          <option value="daily">Ngày</option>
          <option value="monthly">Tháng</option>
          <option value="yearly">Năm</option>
        </select>
      </div>

      {/* Biểu đồ */}
      <div className="chart-container">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
