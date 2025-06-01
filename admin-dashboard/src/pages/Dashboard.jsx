import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./Dashboard.css"; // Import CSS của bạn
import axios from "axios";

// Đăng ký các thành phần Chart.js cần thiết
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [overview, setOverview] = useState({
    totalMenuItems: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });
  const [timePeriod, setTimePeriod] = useState("weekly");
  // Gọi API tổng quan để lấy dữ liệu cho các thẻ
  const fetchOverview = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/statistics/overview`,
        {
          headers: {
            "x-token": localStorage.getItem("token"),
          },
        }
      );

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

  useEffect(() => {
    fetchOverview();
    const { startDate, endDate } = calculateDateRange(timePeriod);
    fetchStatistics(startDate, endDate);
  }, []);

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  // Gọi API thống kê để lấy dữ liệu cho biểu đồ
  const fetchStatistics = async (startDate, endDate) => {
    console.log(
      "⏳ Đang gọi API với startDate:",
      startDate,
      "endDate:",
      endDate
    ); // Thêm log tại đây
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/statistics`,
        {
          params: { startDate, endDate },
          headers: {
            "x-token": localStorage.getItem("token"),
          },
        }
      );

      console.log("✅ Dữ liệu nhận từ API:", response.data); // Log dữ liệu trả về từ API
      if (response.data.success) {
        const data = response.data.data;
        console.log("✅ Dữ liệu thống kê nhận từ API:", data); // Log khi dữ liệu đã được xử lý

        // Lấy tên món ăn và số lượng đơn hàng
        const totalOrders = data.totalOrders;
        const totalRevenue = data.totalRevenue;

        setChartData({
          labels: ["Tổng quan"], // Dữ liệu chỉ có một label cho "Tổng quan"
          datasets: [
            {
              label: "Doanh thu",
              data: [totalRevenue],
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1,
              yAxisID: "y", // trục trái
            },
            {
              label: "Số đơn hàng",
              data: [totalOrders],
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
              yAxisID: "y1", // trục phải
            },
          ],
        });
      }
    } catch (error) {
      console.error(
        "❌ Lỗi khi gọi API thống kê:",
        error.response?.data || error.message
      );
    }
  };
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  const calculateDateRange = (period) => {
    const end = new Date();
    let start = new Date();
    if (period === "daily") {
      start.setDate(end.getDate() - 1); // 1 ngày gần nhất
    } else if (period === "weekly") {
      start.setDate(end.getDate() - 7); // 7 ngày gần nhất
    } else if (period === "monthly") {
      start.setMonth(end.getMonth() - 1); // 1 tháng gần nhất
    } else if (period === "yearly") {
      start.setFullYear(end.getFullYear() - 1); // 1 năm gần nhất
    }

    const format = (date) => date.toISOString().split("T")[0];
    return { startDate: format(start), endDate: format(end) };
  };

  const handleTimePeriodChange = (event) => {
    const period = event.target.value;
    setTimePeriod(period);

    if (period === "custom") {
      // Nếu người dùng chọn "Từ thời gian nào đến thời gian nào", không tự động tính toán ngày
      return;
    }

    const { startDate, endDate } = calculateDateRange(period);
    fetchStatistics(startDate, endDate);
  };

  useEffect(() => {
    if (timePeriod === "custom" && customStartDate && customEndDate) {
      fetchStatistics(customStartDate, customEndDate);
    }
  }, [customStartDate, customEndDate, timePeriod]);

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: `Số đơn hàng và Doanh thu theo ${
          timePeriod === "daily"
            ? "Ngày"
            : timePeriod === "weekly"
            ? "Tuần"
            : timePeriod === "monthly"
            ? "Tháng"
            : timePeriod === "yearly"
            ? "Năm"
            : "Tùy chọn"
        }`,
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return tooltipItem.datasetIndex === 0
              ? tooltipItem.raw + " đ"
              : tooltipItem.raw.toLocaleString() + " ₫ơn hàng";
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Tổng quan giữa doanh thu và đơn hàng",
        },
      },
      y: {
        type: "linear",
        position: "left",
        title: {
          display: true,
          text: "Doanh thu (VND)",
        },
        ticks: {
          callback: (value) => value.toLocaleString() + "₫",
        },
      },
      y1: {
        type: "linear",
        position: "right",
        title: {
          display: true,
          text: "Số đơn hàng",
        },
        grid: {
          drawOnChartArea: false, // tránh vẽ grid bên phải
        },
      },
    },
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
          <p className="card-value red">
            {overview.totalRevenue
              ? overview.totalRevenue.toLocaleString() + "₫"
              : "0₫"}
          </p>
        </div>
      </div>

      {/* Dropdown for selecting time period */}
      <div className="time-period-selector">
        <label htmlFor="timePeriod" className="mr-4">
          Chọn khoảng thời gian:
        </label>
        <select
          id="timePeriod"
          value={timePeriod}
          onChange={handleTimePeriodChange}
          className="p-2 border rounded-md"
        >
          <option value="daily">1 Ngày</option>
          <option value="weekly">1 Tuần</option>
          <option value="monthly">1 Tháng</option>
          <option value="yearly">1 Năm</option>
          <option value="custom">Từ thời gian nào đến thời gian nào</option>
        </select>
      </div>

      {/* Nếu người dùng chọn "Tùy chọn", cho phép nhập ngày bắt đầu và kết thúc */}
      {timePeriod === "custom" && (
        <div className="custom-date-selector">
          <label>Ngày bắt đầu:</label>
          <input
            type="date"
            value={customStartDate}
            onChange={(e) => setCustomStartDate(e.target.value)}
          />
          <label>Ngày kết thúc:</label>
          <input
            type="date"
            value={customEndDate}
            onChange={(e) => setCustomEndDate(e.target.value)}
          />
        </div>
      )}

      {/* Biểu đồ */}
      <div className="chart-container">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
