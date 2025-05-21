import { useState } from "react";

// @ts-ignore
import Papa from "papaparse";

export default function Home() {
  const [ytUrl, setYtUrl] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dummy fetch comments function - replace with your API call
  async function fetchComments() {
    if (!ytUrl) {
      setError("Please enter a valid YouTube URL.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      // Example: fetch from your backend API endpoint
      const response = await fetch(`/api/comments?url=${encodeURIComponent(ytUrl)}`);
      if (!response.ok) throw new Error("Failed to fetch comments");
      const data = await response.json();

      setComments(data.comments || []);
    } catch (e: any) {
      setError(e.message || "Unknown error");
      setComments([]);
    } finally {
      setLoading(false);
    }
  }

  function downloadCsv() {
    if (comments.length === 0) {
      setError("No comments to download");
      return;
    }
    const csv = Papa.unparse(comments);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "comments.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <main style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>YouTube Comments Downloader</h1>
      <input
        type="text"
        placeholder="Paste YouTube video URL here"
        value={ytUrl}
        onChange={(e) => setYtUrl(e.target.value)}
        style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
      />
      <button onClick={fetchComments} disabled={loading} style={{ marginRight: "1rem" }}>
        {loading ? "Loading..." : "Fetch Comments"}
      </button>
      <button onClick={downloadCsv} disabled={comments.length === 0}>
        Download CSV
      </button>

      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}

      {comments.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h2>Fetched Comments ({comments.length})</h2>
          <ul style={{ maxHeight: "300px", overflowY: "auto", padding: 0, listStyle: "none" }}>
            {comments.slice(0, 20).map((comment, i) => (
              <li key={i} style={{ borderBottom: "1px solid #ddd", padding: "0.5rem 0" }}>
                {comment.text || JSON.stringify(comment)}
              </li>
            ))}
          </ul>
          {comments.length > 20 && <p>Showing first 20 comments...</p>}
        </div>
      )}
    </main>
  );
}
