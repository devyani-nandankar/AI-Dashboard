import React, { useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

const BASE_URL = "http://127.0.0.1:8000";

function App() {
  const [file, setFile] = useState(null);
  const [columns, setColumns] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [stats, setStats] = useState({});

  // Upload
  const upload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post(`${BASE_URL}/upload`, formData);
    setColumns(res.data.columns);
  };

  // Chart
  const getChart = async (col) => {
    const res = await axios.get(`${BASE_URL}/chart`, {
      params: { column: col },
    });
    setChartData(res.data);
  };

  // AI
  const askAI = async () => {
    const res = await axios.post(`${BASE_URL}/chat`, null, {
      params: { query },
    });
    setResponse(res.data.response);
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial", background: "#f5f6fa" }}>

      {/* HEADER */}
      <h1 style={{ textAlign: "center" }}>📊 AI Data Dashboard</h1>

      {/* UPLOAD */}
      <div style={{ marginBottom: 20 }}>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={upload}>Upload CSV</button>
      </div>

      {/* KPI CARDS */}
      <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
        <div style={cardStyle}>Total Data: {chartData.length}</div>
        <div style={cardStyle}>Columns: {columns.length}</div>
        <div style={cardStyle}>AI Ready ✅</div>
      </div>

      {/* FILTER BUTTONS */}
      <div style={{ marginBottom: 20 }}>
        <h3>Select Column</h3>
        {columns.map((col, i) => (
          <button key={i} onClick={() => getChart(col)} style={btnStyle}>
            {col}
          </button>
        ))}
      </div>

      {/* CHART */}
      <div style={{ height: 300, background: "#fff", padding: 10 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* AI CHAT */}
      <div style={{ marginTop: 30 }}>
        <h2>🤖 AI Insights</h2>
        <input
          style={{ width: "70%", padding: 10 }}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask something..."
        />
        <button onClick={askAI} style={btnStyle}>Ask</button>

        <div style={{ marginTop: 10, background: "#fff", padding: 10 }}>
          {response}
        </div>
      </div>
    </div>
  );
}

// Styles
const cardStyle = {
  background: "#fff",
  padding: 20,
  borderRadius: 10,
  flex: 1,
  textAlign: "center",
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
};

const btnStyle = {
  margin: 5,
  padding: "8px 12px",
  border: "none",
  background: "#0984e3",
  color: "#fff",
  borderRadius: 5,
  cursor: "pointer",
};

export default App;