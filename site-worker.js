import { PhpWasmRuntime } from '/php-wasm-runtime.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // R2 대신 KV에서 PHP 바이너리 로드
    let wasmBinary = await env.CACHE_KV.get("RUNTIME_PHP_83", { type: "arrayBuffer" });
    
    if (!wasmBinary) {
      // KV에 없으면 외부 CDN에서 백업 로드 (최초 1회)
      const res = await fetch("https://cdn.cloudpress.io/php83.wasm");
      wasmBinary = await res.arrayBuffer();
      ctx.waitUntil(env.CACHE_KV.put("RUNTIME_PHP_83", wasmBinary));
    }

    const php = new PhpWasmRuntime(wasmBinary, env, ctx);
    return await php.run(request);
  }
};
