import { useState } from "react";

// @ts-ignore
const Papa = require("papaparse");

export default function Home() {
  const [ytUrl, setYtUrl] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSampleDownload = () => {
    const sampleData = [
      { name: "Alice", age: 25 },
      { name: "Bob", age: 30 },
    ];

    const csv = Papa.unparse(sampleData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "sample.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>YouTube Comments Downloader</h1>

      <input
        type="text"
        placeholder="Paste YouTube URL"
        value={ytUrl}
        onChange={(e) => setYtUrl(e.target.value)}
        style={{ width: "300px", padding: "0.5rem", marginBottom: "1rem" }}
      />

      <br />

      <button onClick={handleSampleDownload} style={{ padding: "0.5rem 1rem" }}>
        Download Sample CSV
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
