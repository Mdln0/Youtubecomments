import { useState } from "react";
import Papa from "papaparse";

export default function Home() {
  const [ytUrl, setYtUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const extractVideoId = (url: string) => {
    // Simple regex for youtube video ID extraction
    const match = url.match(
      /(?:v=|\/videos\/|embed\/|youtu\.be\/|\/v\/|\/e\/|watch\?v=|watch\?.+&v=)([a-zA-Z0-9_-]{11})/
    );
    return match ? match[1] : null;
  };

  const downloadCSV = (data: any[]) => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "youtube-comments.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fetchComments = async () => {
    setError("");
    const videoId = extractVideoId(ytUrl);
    if (!videoId) {
      setError("Invalid YouTube URL");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/comments?videoId=${videoId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch comments");
      }
      const data = await res.json();
      if (data.comments.length === 0) {
        setError("No comments found or comments are disabled");
      } else {
        downloadCSV(data.comments);
      }
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-4">
      <h1 className="text-3xl font-bold mb-6">YouTube Comments Downloader</h1>
      <input
        type="text"
        placeholder="Paste YouTube video URL"
        value={ytUrl}
        onChange={(e) => setYtUrl(e.target.value)}
        className="border border-gray-300 p-2 rounded w-full max-w-md mb-4"
      />
      <button
        onClick={fetchComments}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-blue-300"
      >
        {loading ? "Fetching..." : "Download Comments CSV"}
      </button>
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
}
