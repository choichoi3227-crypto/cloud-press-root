const RealtimeProgressBar = ({ hostingId }) => {
    const [status, setStatus] = React.useState({
        status: 'PROGRESS',
        chunkIndex: 45,
        totalChunks: 100
    });

    const progress = Math.round((status.chunkIndex / status.totalChunks) * 100);

    const statusMessages = {
        'STARTING': '글로벌 인프라 리소스를 프로비저닝 중입니다...',
        'PROGRESS': '전 세계 300여 개 엣지 노드로 데이터를 복제하고 있습니다...',
        'COMPLETED': '동기화 완료! 사이트가 Anycast 네트워크를 통해 활성화되었습니다.',
        'ERROR': '동기화 중 오류가 발생했습니다. 로그를 확인해 주세요.'
    };

    return (
        <div className="bg-white p-8 rounded-3xl border border-blue-100 shadow-xl shadow-blue-50">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h3 className="text-xl font-black text-slate-800 mb-1 italic">글로벌 델타 동기화</h3>
                    <p className="text-slate-500 font-medium text-sm">{statusMessages[status.status] || '연결 대기 중...'}</p>
                </div>
                <span className="text-5xl font-black text-blue-600">{progress}%</span>
            </div>
            <div className="w-full h-5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-1000 ease-out" 
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            <div className="mt-4 flex space-x-4">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                    Processed: {status.chunkIndex} / {status.totalChunks} Chunks
                </div>
            </div>
        </div>
    );
};

// 메인 렌더링
const root = ReactDOM.createRoot(document.getElementById('realtime-sync-status-root'));
root.render(<RealtimeProgressBar hostingId="current-site-id" />);
