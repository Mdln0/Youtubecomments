import { useState } from "react";

// @ts-ignore
const Papa = require("papaparse");

export default function Home() {
  const [ytUrl, setYtUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const extractVideoId = (url: string): string | null => {
    const regExp = /(?:v=|\/)([0-9A-Za-z_-]{11}).*/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const handleDownloadComments = async () => {
    const videoId = extractVideoId(ytUrl);

    if (!videoId) {
      setError("Invalid YouTube URL");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`/api/comments?videoId=${videoId}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Unknown error");

      const csv = Papa.unparse(data.comments.map((text: string) => ({ comment: text })));
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `comments-${videoId}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>YouTube Comments Downloader</h1>
      <input
        type="text"
        placeholder="Paste YouTube video URL"
        value={ytUrl}
        onChange={(e) => setYtUrl(e.target.value)}
        style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
      />
      <button onClick={handleDownloadComments} disabled={loading}>
        {loading ? "Fetching..." : "Download YouTube Comments"}
      </button>
      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
    </div>
  );
}
