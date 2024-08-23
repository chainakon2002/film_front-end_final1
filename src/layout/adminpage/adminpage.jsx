import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

// Register Chart.js components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const Dashboard = () => {
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopSellingProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8889/auth/getorder', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const paymentData = response.data;

        // Calculate top-selling products and total revenue
        const productSales = paymentData.reduce((acc, payment) => {
          if (acc[payment.productname]) {
            acc[payment.productname].totalAmount += payment.price; // Use price instead of amount
            acc[payment.productname].quantity += 1;
          } else {
            acc[payment.productname] = {
              totalAmount: payment.price, // Use price instead of amount
              quantity: 1,
            };
          }
          return acc;
        }, {});

        const sortedProducts = Object.entries(productSales)
          .map(([productName, { totalAmount, quantity }]) => ({ productName, totalAmount, quantity }))
          .sort((a, b) => b.totalAmount - a.totalAmount);

        const totalRevenue = sortedProducts.reduce((acc, product) => acc + product.totalAmount, 0);

        setTopSellingProducts(sortedProducts);
        setTotalRevenue(totalRevenue);
      } catch (err) {
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchTopSellingProducts();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  // Generate random colors for each bar
  const generateColors = (count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const color = `rgba(${Math.floor(Math.random() * 128)}, ${Math.floor(Math.random() * 128)}, ${Math.floor(Math.random() * 128)}, 0.8)`;
      colors.push(color);
    }
    return colors;
  };

  // Prepare data for the chart
  const chartData = {
    labels: topSellingProducts.map(product => product.productName),
    datasets: [
      {
        label: 'ยอดขายรวม',
        data: topSellingProducts.map(product => product.totalAmount),
        backgroundColor: generateColors(topSellingProducts.length),
        borderColor: generateColors(topSellingProducts.length).map(color => color.replace('0.8', '1')),
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'rgba(0, 0, 0, 0.7)', // Set legend text color to dark
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const product = topSellingProducts[context.dataIndex];
            return `ยอดขายรวม: ฿${context.raw.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}, จำนวน: ${product.quantity}`;
          },
        },
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Tooltip background color
        titleColor: '#000', // Tooltip title color
        bodyColor: '#000', // Tooltip body color
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          color: 'rgba(0, 0, 0, 0.7)', // X-axis labels color to dark
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)', // X-axis grid lines color
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return `฿${value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
          },
          color: 'rgba(0, 0, 0, 0.7)', // Y-axis labels color to dark
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)', // Y-axis grid lines color
        },
      },
    },
  };

  return (
    <div className="flex flex-col items-center mt-8 p-4 rounded-lg shadow-lg bg-white">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">สินค้าที่ขายดีที่สุด</h1>
      <h2 className="text-xl mb-4 text-gray-600">รายได้รวม: ฿{totalRevenue.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</h2>
      <div className="w-full md:w-3/4 lg:w-1/2">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default Dashboard;
