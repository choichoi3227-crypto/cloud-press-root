const RealtimeProgressBar = ({ hostingId }) => {
  const [status, setStatus] = React.useState({ status: 'IDLE', chunkIndex: 0, totalChunks: 100 });

  const progress = Math.round((status.chunkIndex / status.totalChunks) * 100);
  
  const messages = {
    'IDLE': '연결 대기 중...',
    'STARTING': '글로벌 인프라 구성을 시작합니다...',
    'PROGRESS': '전 세계 300여 개 엣지 노드로 데이터를 동기화 중입니다...',
    'COMPLETED': '동기화 완료! 사이트가 최상의 속도로 서빙됩니다.',
    'ERROR': '동기화 중 오류가 발생했습니다.'
  };

  return (
    <div class="bg-white p-8 rounded-3xl border border-blue-100 shadow-xl shadow-blue-50">
      <div class="flex justify-between items-end mb-6">
        <div>
          <h3 class="text-xl font-black text-slate-800 mb-1">인프라 델타 동기화</h3>
          <p class="text-slate-500 font-medium">{messages[status.status]}</p>
        </div>
        <span class="text-5xl font-black text-blue-600 italic">{progress}%</span>
      </div>
      <div class="w-full h-5 bg-slate-100 rounded-full overflow-hidden">
        <div class="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-1000 ease-out" style={{width: `${progress}%`}}></div>
      </div>
    </div>
  );
};
