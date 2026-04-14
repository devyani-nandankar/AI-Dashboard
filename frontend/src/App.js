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
  const [loading, setLoading] = useState(false);

  // Upload
  const upload = async () => {
    if (!file) return alert("Select file first");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await axios.post(`${BASE_URL}/upload`, formData);
      setColumns(res.data.columns);
    } catch {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
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
    <div style={styles.page}>

      {/* HEADER */}
      <div style={styles.header}>
        <h1 style={{ margin: 0 }}>📊 AI Analytics Dashboard</h1>
      </div>

      {/* UPLOAD */}
      <div style={styles.upload}>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={upload} style={styles.primaryBtn}>
          {loading ? "Uploading..." : "Upload CSV"}
        </button>
      </div>

      {/* KPI CARDS */}
      <div style={styles.cards}>
        <div style={styles.card}>📦 Records <br /><b>{chartData.length}</b></div>
        <div style={styles.card}>📊 Columns <br /><b>{columns.length}</b></div>
        <div style={styles.card}>🤖 AI Status <br /><b>Ready</b></div>
      </div>

      {/* MAIN LAYOUT */}
      <div style={styles.layout}>

        {/* LEFT PANEL */}
        <div style={styles.leftPanel}>
          <h3>Select Column</h3>

          <div style={styles.columnList}>
            {columns.map((c, i) => (
              <button key={i} onClick={() => getChart(c)} style={styles.columnBtn}>
                {c}
              </button>
            ))}
          </div>

          <div style={styles.chart}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={styles.rightPanel}>
          <h3>🤖 AI Insights</h3>

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about your data..."
            style={styles.input}
          />

          <button onClick={askAI} style={styles.primaryBtn}>
            Ask AI
          </button>

          <div style={styles.responseBox}>
            {response || "AI response will appear here..."}
          </div>
        </div>

      </div>
    </div>
  );
}

// 🎨 STYLES (PROFESSIONAL LOOK)
const styles = {
  page: {
    fontFamily: "Segoe UI",
    background: "#f1f5f9",
    minHeight: "100vh",
    padding: 20,
  },
  header: {
    textAlign: "center",
    marginBottom: 20,
  },
  upload: {
    display: "flex",
    gap: 10,
    justifyContent: "center",
    marginBottom: 20,
  },
  cards: {
    display: "flex",
    gap: 20,
    marginBottom: 20,
  },
  card: {
    flex: 1,
    background: "#ffffff",
    padding: 20,
    borderRadius: 10,
    textAlign: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  layout: {
    display: "flex",
    gap: 20,
  },
  leftPanel: {
    flex: 2,
    background: "#fff",
    padding: 20,
    borderRadius: 10,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  rightPanel: {
    flex: 1,
    background: "#fff",
    padding: 20,
    borderRadius: 10,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  columnList: {
    marginBottom: 10,
  },
  columnBtn: {
    margin: 5,
    padding: "6px 10px",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
  },
  chart: {
    height: 300,
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
  },
  responseBox: {
    background: "#e2e8f0",
    padding: 10,
    minHeight: 100,
    borderRadius: 5,
  },
  primaryBtn: {
    padding: "8px 12px",
    background: "#6366f1",
    color: "#fff",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
  },
};

export default App;