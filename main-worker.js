export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    if (url.pathname === "/api/hosting/create" && request.method === "POST") {
      const { name, domain } = await request.json();
      const hostingId = `cp_${Date.now()}`;
      
      // Supabase 36개 버킷 할당 정보 저장
      const config = { name, domain, hostingId, status: 'active', php: '8.3' };
      await env.CACHE_KV.put(`hosting:${hostingId}`, JSON.stringify(config));
      
      return new Response(JSON.stringify({ success: true, hostingId }), {
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response("CloudPress API Central");
  }
};
