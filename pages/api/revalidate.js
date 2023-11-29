import getConfig from "next/config";

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let bodyChunks = [];
    req.on("end", () => {
      const rawBody = Buffer.concat(bodyChunks).toString("utf8");
      resolve(rawBody);
    });
    req.on("data", (chunk) => bodyChunks.push(chunk));
  });
}

export default async function handler(req, res) {
  const body = await getRawBody(req);
  if (!body) {
    res.status(400).send("Bad request (no body)");
    return;
  }

  const jsonBody = JSON.parse(body);
  // Check for secret to confirm this is a valid request
  if (req.query.secret !== getConfig().serverRuntimeConfig.ISR_TOKEN) {
    return res.status(401).json({ message: "Invalid token" });
  }
  const dataset = jsonBody.dataset;
  const groupName = jsonBody.group?.name;
  const org = jsonBody.org;

  try {
    // this should be the actual path not a rewritten path
    // e.g. for "/blog/[slug]" this should be "/blog/post-1"
    if (dataset && dataset.name && dataset.orgName) {
      console.log(
        `[Next.js] Revalidating /@${dataset.orgName}/${dataset.name}`
      );
      await res.revalidate(`/@${dataset.orgName}/${dataset.name}`);
      console.log(`[Next.js] Revalidating datasets`);
      await res.revalidate(`/`);
      console.log(`[Next.js] Revalidating the ${dataset.orgName}`);
      await res.revalidate(`/@${dataset.orgName}`);
      if (dataset.groups) {
        console.log(`[Next.js] Revalidating the ${dataset.name} groups`);
        await Promise.all(
          dataset.groups.map(async (group) =>
            res.revalidate(`/groups/${group}`)
          )
        );
      }
    }
    if (groupName) {
      console.log(`[Next.js] Revalidating groups`);
      await res.revalidate(`/groups`);
      console.log(`[Next.js] Revalidating /group/${groupName}`);
      await res.revalidate(`/groups/${groupName}`);
    }
    if (org && org.name) {
      console.log(`[Next.js] Revalidating /${org.name}`);
      await res.revalidate(`/@${org.name}`);
      console.log(`[Next.js] Revalidating orgs`);
      await res.revalidate(`/organizations`);
    }
    return res.json({ revalidated: true });
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send(err);
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
