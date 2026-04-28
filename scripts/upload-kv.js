const pLimit = require('p-limit');
const limit = pLimit(5);

async function syncToKV(manifest) {
    console.log("🚀 KV 델타 동기화 및 펜싱 토큰 생성을 시작합니다...");
    const fencingToken = Date.now();
    
    const tasks = manifest.files.map(file => limit(async () => {
        // Cloudflare KV Bulk API를 호출하여 파일 데이터 배포
        return await uploadFile(file, fencingToken);
    }));
    
    await Promise.all(tasks);
    console.log("✅ 동기화 완료! 버전:", fencingToken);
}
