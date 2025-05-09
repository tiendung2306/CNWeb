import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import "./Dashboard.css"; // Import CSS của bạn
import axios from "axios";

// Đăng ký các thành phần Chart.js cần thiết
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {

  const [overview, setOverview] = useState({
    totalMenuitems: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });

  // Gọi API thống kê tổng quan
  const fetchOverview = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/statistics/overview`, {
        headers: {
          "x-token": localStorage.getItem("token"),
        },
      });

      if (response.data.success) {
        console.log("Dữ liệu tổng quan:", response.data.data);
        setOverview(response.data.data);
      } else {
        console.error("Lỗi khi tải tổng quan:", response.data.errorMessage);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API tổng quan:", error);
    }
  };

  // Gọi hàm fetchOverview khi component mount
  useEffect(() => {
    fetchOverview();
  }, []);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  
  const fetchStatistics = async (startDate, endDate) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/statistics`, {
        params: { startDate, endDate },
        headers: {
          "x-token": localStorage.getItem("token"),
        },
      });
  
      if (response.data.success) {
        const data = response.data.data;
  
        setChartData({
          labels: data.labels,
          datasets: [
            {
              label: "Số đơn hàng",
              data: data.orderCounts,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
            {
              label: "Doanh thu",
              data: data.revenues,
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
            }
          ]
        });
      }
    } catch (error) {
      console.error("Lỗi khi tải thống kê:", error);
    }
  };
  
  const [timePeriod, setTimePeriod] = useState("daily");


const calculateDateRange = (period) => {
  const end = new Date();
  let start = new Date();

  if (period === 'daily') {
    start.setDate(end.getDate() - 6); // 7 ngày gần nhất
  } else if (period === 'monthly') {
    start.setMonth(end.getMonth() - 6); // 7 tháng gần nhất
  } else if (period === 'yearly') {
    start.setFullYear(end.getFullYear() - 4); // 5 năm gần nhất
  }

  const format = (date) => date.toISOString().split('T')[0];
  return { startDate: format(start), endDate: format(end) };
};

const handleTimePeriodChange = (event) => {
  const period = event.target.value;
  setTimePeriod(period);

  const { startDate, endDate } = calculateDateRange(period);
  fetchStatistics(startDate, endDate);
};
useEffect(() => {
  
  const { startDate, endDate } = calculateDateRange(timePeriod);
  fetchStatistics(startDate, endDate);
}, []);


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
    <p className="card-value blue">{overview.totalMenuItems || 0}</p>
  </div>
  <div className="card">
    <h3 className="card-title">Đơn hàng</h3>
    <p className="card-value green">{overview.totalOrders || 0}</p>
  </div>
  <div className="card">
    <h3 className="card-title">Người dùng</h3>
    <p className="card-value purple">{overview.totalUsers || 0}</p>
  </div>
  <div className="card">
    <h3 className="card-title">Doanh thu</h3>
    <p className="card-value red">{overview.totalRevenue ? overview.totalRevenue.toLocaleString() + '₫' : '0₫'}</p>
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
