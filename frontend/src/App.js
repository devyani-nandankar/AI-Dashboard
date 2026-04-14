import React, { useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

const BASE_URL = "https://ai-dashboard-backend.onrender.com";

function App() {
  const [file, setFile] = useState(null);
  const [columns, setColumns] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Upload
  const upload = async () => {
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const res = await axios.post(`${BASE_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Upload response:", res.data);

      if (res.data.columns) {
        setColumns(res.data.columns);
      } else {
        alert("Upload failed: No columns returned");
      }

    } catch (error) {
      console.error("Upload error:", error.response || error);
      alert("Upload failed. Backend not responding.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Chart
  const getChart = async (col) => {
    try {
      const res = await axios.get(`${BASE_URL}/chart`, {
        params: { column: col },
      });
      setChartData(res.data);
    } catch (error) {
      console.error("Chart error:", error);
      alert("Chart failed");
    }
  };

  // ✅ AI Chat
  const askAI = async () => {
    if (!query) return alert("Enter question");

    try {
      const res = await axios.post(`${BASE_URL}/chat`, null, {
        params: { query },
      });
      setResponse(res.data.response);
    } catch (error) {
      console.error("AI error:", error);
      setResponse("AI error. Check backend.");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>AI Dashboard</h1>

      {/* Upload */}
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={upload}>
        {loading ? "Uploading..." : "Upload"}
      </button>

      {/* Columns */}
      <h3>Columns</h3>
      {columns.length === 0 && <p>No data uploaded</p>}
      {columns.map((c, i) => (
        <button key={i} onClick={() => getChart(c)}>
          {c}
        </button>
      ))}

      {/* Chart */}
      <BarChart width={500} height={300} data={chartData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" />
      </BarChart>

      {/* AI */}
      <h2>Ask AI</h2>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask something..."
      />
      <button onClick={askAI}>Ask</button>

      <p>{response}</p>
    </div>
  );
}

export default App;