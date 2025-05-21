import type { NextApiRequest, NextApiResponse } from "next";

type Comment = {
  author: string;
  text: string;
  likeCount: number;
  publishedAt: string;
};

type Data = {
  comments: Comment[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | { error: string }>
) {
  const { videoId } = req.query;
  if (!videoId || typeof videoId !== "string") {
    res.status(400).json({ error: "Missing or invalid videoId" });
    return;
  }

  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "API key not configured" });
    return;
  }

  try {
    const url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&key=${apiKey}&maxResults=100`;
    const response = await fetch(url);
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`YouTube API error: ${text}`);
    }
    const data = await response.json();

    const comments: Comment[] = data.items.map((item: any) => {
      const snippet = item.snippet.topLevelComment.snippet;
      return {
        author: snippet.authorDisplayName,
        text: snippet.textDisplay.replace(/(<([^>]+)>)/gi, ""), // strip HTML
        likeCount: snippet.likeCount,
        publishedAt: snippet.publishedAt,
      };
    });

    res.status(200).json({ comments });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
