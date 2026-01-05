import fetch from "node-fetch";

const DB_OWNER = "tianten125-gif";
const DB_REPO = "friends-gallery-db";
const GALLERIES_PATH = "galleries.json";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { inviteCode, owner, galleryName } = JSON.parse(event.body);

    if (!inviteCode || !owner || !galleryName) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing fields" }),
      };
    }

    const headers = {
      Authorization: `token ${process.env.GITHUB_TOKEN}`,
      "User-Agent": "netlify-function",
    };

    // Get galleries.json
    const getRes = await fetch(
      `https://api.github.com/repos/${DB_OWNER}/${DB_REPO}/contents/${GALLERIES_PATH}`,
      { headers }
    );

    const file = await getRes.json();
    const galleries = JSON.parse(
      Buffer.from(file.content, "base64").toString()
    );

    // Prevent duplicate owner
    for (const key in galleries) {
      if (galleries[key].owner === owner) {
        return {
          statusCode: 403,
          body: JSON.stringify({ error: "Gallery already exists" }),
        };
      }
    }

    // Save new gallery
    galleries[inviteCode] = {
      owner,
      galleryName,
      images: [],
    };

    // Push back to GitHub
    await fetch(
      `https://api.github.com/repos/${DB_OWNER}/${DB_REPO}/contents/${GALLERIES_PATH}`,
      {
        method: "PUT",
        headers,
        body: JSON.stringify({
          message: "Add new gallery",
          content: Buffer.from(JSON.stringify(galleries, null, 2)).toString(
            "base64"
          ),
          sha: file.sha,
        }),
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
