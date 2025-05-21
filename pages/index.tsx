import { useState } from "react";
import * as Papa from "papaparse";

export default function Home() {
  const [ytUrl, setYtUrl] = useState("");

  const handleParse = () => {
    const csv = `name,age
Alice,25
Bob,30`;
    const result = Papa.parse(csv, { header: true });
    console.log(result.data);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>YouTube Comments Downloader</h1>
      <input
        type="text"
        placeholder="Enter YouTube URL"
        value={ytUrl}
        onChange={(e) => setYtUrl(e.target.value)}
        style={{ width: "300px", marginRight: "1rem" }}
      />
      <button onClick={handleParse}>Parse Sample CSV</button>
    </div>
  );
}
