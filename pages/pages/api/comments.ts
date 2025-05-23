import type { NextApiRequest, NextApiResponse } from "next";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Extract videoId safely
  const videoId = req.query?.videoId as string;

  if (!videoId) {
    return res.status(400).json({ error: "Missing videoId parameter" });
  }

  if (!YOUTUBE_API_KEY) {
    return res.status(500).json({ error: "Missing YOUTUBE_API_KEY in environment variables" });
  }

  try {
    const apiUrl = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=100&key=${YOUTUBE_API_KEY}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.statusText}`);
    }

    const data = await response.json();

    const comments = data.items.map((item: any) => {
      return item.snippet.topLevelComment.snippet.textDisplay;
    });

    res.status(200).json({ comments });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Unknown error" });
  }
}
