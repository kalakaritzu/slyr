// /proxy?u=<address> is the old way to reach the proxy; it now lives under /p/ (see functions/p/[[path]].js).
export function onRequest({ request }) {
  const here = new URL(request.url), raw = here.searchParams.get("u");
  let u;
  try { u = new URL(raw); } catch (e) { return new Response("Missing address.", { status: 400 }); }
  if (u.protocol !== "http:" && u.protocol !== "https:") return new Response("That address is not allowed.", { status: 403 });
  return Response.redirect(here.origin + "/p/" + u.protocol.slice(0, -1) + "/" + u.host + u.pathname + u.search, 307);
}
