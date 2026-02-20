import { getBranchesBySeed, getBranchesByNest, getSubBranches, getBranch, createBranch } from "../_store.js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Content-Type": "application/json",
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: corsHeaders,
  });
}

export async function onRequest(context) {
  const request = context.request;

  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    // GET /api/branches?seedId=xxx or ?nestId=xxx or ?parentBranchId=xxx
    if (request.method === "GET") {
      const url = new URL(request.url);
      const seedId = url.searchParams.get("seedId");
      const nestId = url.searchParams.get("nestId");
      const parentBranchId = url.searchParams.get("parentBranchId");

      if (parentBranchId) {
        const branches = getSubBranches(parentBranchId);
        return jsonResponse({ success: true, data: branches });
      }

      if (nestId) {
        const branches = getBranchesByNest(nestId);
        return jsonResponse({ success: true, data: branches });
      }

      if (!seedId) {
        return jsonResponse({ success: false, error: "seedId, nestId, or parentBranchId is required" }, 400);
      }

      const branches = getBranchesBySeed(seedId);
      return jsonResponse({ success: true, data: branches });
    }

    // POST /api/branches
    if (request.method === "POST") {
      const body = await request.json();
      let { seedId, content, parentBranchId, title, nestId } = body;

      // If parentBranchId is provided, inherit seedId from parent
      if (parentBranchId && !seedId) {
        const parent = getBranch(parentBranchId);
        if (parent) {
          seedId = parent.seedId;
        }
      }

      // content can be empty string, just needs seedId
      if (!seedId) {
        return jsonResponse({ success: false, error: "seedId required (or parentBranchId with valid parent)" }, 400);
      }

      const branch = createBranch({ seedId, content: content || "", parentBranchId, title, nestId });
      return jsonResponse({ success: true, data: branch }, 201);
    }

    return jsonResponse({ success: false, error: "Method not allowed" }, 405);
  } catch (error) {
    return jsonResponse({ success: false, error: error.message || "Internal server error" }, 500);
  }
}
