import { useState } from "react";

export default function Home() {
  const [ytUrl, setYtUrl] = useState("");
  const [comments, setComments] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError("");
      setComments([]);

      const videoId = extractVideoId(ytUrl);
      if (!videoId) {
        setError("Invalid YouTube URL");
        setLoading(false);
        return;
      }

      const res = await fetch(`/api/comments?videoId=${videoId}`);
      if (!res.ok) throw new Error("Failed to fetch comments");

      const data = await res.json();
      setComments(data.comments);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = async () => {
    const Papa = (await import("papaparse")).default;
    const csv = Papa.unparse(comments.map((text) => ({ comment: text })));

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "youtube_comments.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const extractVideoId = (url: string) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[7].length === 11 ? match[7] : null;
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>YouTube Comment Downloader</h1>
      <input
        type="text"
        placeholder="Paste YouTube video URL"
        value={ytUrl}
        onChange={(e) => setYtUrl(e.target.value)}
        style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
      />
      <button onClick={fetchComments} disabled={loading}>
        {loading ? "Fetching..." : "Fetch Comments"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {comments.length > 0 && (
        <>
          <p>{comments.length} comments loaded.</p>
          <button onClick={downloadCSV}>Download CSV</button>
        </>
      )}
    </div>
  );
}
