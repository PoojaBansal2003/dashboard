import React, { useState, useEffect } from 'react';
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill } from 'react-icons/bs';
import { BarChart, PieChart, Pie, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line , Scatter, ScatterChart} from 'recharts';
import data from "../data/eve.json";

function Home() {
  const [jsonData, setJsonData] = useState([]);
  const [alertCategories, setAlertCategories] = useState([]);
  const [topSourceIPs, setTopSourceIPs] = useState([]);
  const [protocolCounts, setProtocolCounts] = useState({});
  const[timeSeries, setTimeSeriesData] = useState({});
  const [scatterData, setScatterData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulated fetch from local JSON data
        const response = data;
        console.log('Fetched data:', response);
        setJsonData(response);
      } catch (error) {
        console.error('Error fetching JSON data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (jsonData.length > 0) {
      const categories = {};
      const timeSeries = {};
      const sourceIPCounts = {};
      const counts = {};
      jsonData.forEach(item => {
        const sourceIP = item.src_ip;
        sourceIPCounts[sourceIP] = (sourceIPCounts[sourceIP] || 0) + 1;
        const category = item.alert ? item.alert.category ? item.alert.category : "" : "No category";
        const date = new Date(item.timestamp).toLocaleDateString();
        categories[category] = (categories[category] || 0) + 1;
        timeSeries[date] = (timeSeries[date] || 0) + 1;

        const protocol = item.proto || "Unknown";
        counts[protocol] = (counts[protocol] || 0) + 1;
      });

      const sortedSourceIPs = Object.keys(sourceIPCounts)
        .sort((a, b) => sourceIPCounts[b] - sourceIPCounts[a])
        .slice(0, 10);

      const topSourceIPData = sortedSourceIPs.map((sourceIP, index) => ({
        name: sourceIP,
        count: sourceIPCounts[sourceIP],
        fill: COLORS[index % COLORS.length], // Assigning colors dynamically
      }));

      const categoryData = Object.keys(categories).map(category => ({
        name: category,
        value: categories[category],
      }));

      const timeSeriesData = Object.keys(timeSeries).map(date => ({
        name: date,
        value: timeSeries[date],
      }));

      const extractedData = data.map((item) => ({
        x: item.src_port, // Using src_port as the x coordinate
        y: item.dest_port, // Using dest_port as the y coordinate
        color: getRandomColor(), // Generating random color for each point
      }));
  
      

      console.log('Alert categories:', categoryData);

      const processData = () => {
        // Initialize an object to store category counts
        const categoryCounts = {};
    
        // Iterate over the data array to count occurrences of each category
        data.forEach(item => {
          const category = item.alert?.category || 'Unknown'; // Assuming category is nested under 'alert' object
          categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        });
    
        // Convert category counts object to array of objects with name and count properties
        return Object.keys(categoryCounts).map(category => ({
          name: category,
          count: categoryCounts[category],
        }));
      };
    

      const chartData = processData();

      setAlertCategories(categoryData);
      setTopSourceIPs(topSourceIPData);
      setProtocolCounts(counts);
      setTimeSeriesData(timeSeriesData);
      setScatterData(extractedData);
    }
  }, [jsonData]);


  const categoryColors = {
    'Category1': '#8884d8',
    'Category2': '#82ca9d',
    'Category3': '#ffc658',
    // Add more colors as needed for additional categories
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF5733', '#33FF8C'];


  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const chartData = Object.keys(protocolCounts).map(protocol => ({
    name: protocol,
    count: protocolCounts[protocol],
  }));

  return (
    <main className='main-container'>
      <div className='main-title'>
        <h3>DASHBOARD</h3>
      </div>

      <div className='main-cards'>
        <div className='card'>
          <div className='card-inner'>
            <h3>PRODUCTS</h3>
            <BsFillArchiveFill className='card_icon' />
          </div>
          <h1>300</h1>
        </div>
        <div className='card'>
          <div className='card-inner'>
            <h3>CATEGORIES</h3>
            <BsFillGrid3X3GapFill className='card_icon' />
          </div>
          <h1>12</h1>
        </div>
        <div className='card'>
          <div className='card-inner'>
            <h3>CUSTOMERS</h3>
            <BsPeopleFill className='card_icon' />
          </div>
          <h1>33</h1>
        </div>
        <div className='card'>
          <div className='card-inner'>
            <h3>ALERTS</h3>
            <BsFillBellFill className='card_icon' />
          </div>
          <h1>42</h1>
        </div>
      </div>

      <div className='charts'>
       

<div className='chart-container'>
<h2>Protocol Usage Counts</h2>
<ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        
        {/* Render a separate <Bar> component for each category */}
        {Object.keys(categoryColors).map((category, index) => (
          <Bar key={index} dataKey="count" fill={categoryColors[category]} stackId="a" />
        ))}
      </BarChart>
    </ResponsiveContainer>

</div>

<div className='chart-container'>
    <h2>Source vs Destination Port Analysis</h2>
<ResponsiveContainer width="100%" height={400}>
      <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid />
        <XAxis type="number" dataKey="x" name="src_port" unit="" />
        <YAxis type="number" dataKey="y" name="dest_port" unit="" />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Legend />
        <Scatter name="Data" data={scatterData} fill="#8884d8" />
      </ScatterChart>
    </ResponsiveContainer>
    </div>

        <div className="chart-container">
          <h2>Alert Categories</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={alertCategories}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {alertCategories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      

        <div className="chart-container">
          <h2>Top Source IP Addresses with Highest Alerts</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={topSourceIPs}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count">
                {
                  topSourceIPs.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))
                }
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </main>
  );
}

export default Home;


