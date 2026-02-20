import { getNestById, connectBranchToNest } from "../../../_store.js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
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
  const { branchId, nestId } = context.params;

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return jsonResponse({ success: false, error: "Method not allowed" }, 405);
  }

  const nest = getNestById(nestId);
  if (!nest) {
    return jsonResponse({ success: false, error: "Nest not found" }, 404);
  }

  const updatedBranch = connectBranchToNest(branchId, nestId);
  if (!updatedBranch) {
    return jsonResponse({ success: false, error: "Branch not found" }, 404);
  }

  return jsonResponse({ success: true, data: updatedBranch });
}
