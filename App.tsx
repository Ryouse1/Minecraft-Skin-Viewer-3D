
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, Environment, PerspectiveCamera, Grid } from '@react-three/drei';
import { Upload, User, Zap, Info, Layers, RefreshCw, Smartphone, Monitor } from 'lucide-react';
import MinecraftCharacter from './components/MinecraftCharacter';
import { ModelType } from './types';

const App: React.FC = () => {
  const [skinImage, setSkinImage] = useState<string | null>(null);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [modelType, setModelType] = useState<ModelType>('classic');
  const [showOuter, setShowOuter] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        if (img.width !== 64 || (img.height !== 64 && img.height !== 32)) {
          setError('Minecraftスキンは64x64または64x32である必要があります。');
          setLoading(false);
          return;
        }

        const cvs = document.createElement('canvas');
        cvs.width = 64;
        cvs.height = 64;
        const ctx = cvs.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          // If legacy 64x32, we should ideally mirror parts, but for simplicity we'll just show what's there
          setCanvas(cvs);
          setSkinImage(dataUrl);
        }
        setLoading(false);
      };
      img.onerror = () => {
        setError('画像の読み込みに失敗しました。');
        setLoading(false);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-900 text-white font-sans overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-slate-800/50 backdrop-blur-md border-b border-white/10 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center shadow-lg shadow-green-500/20">
            <User className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Minecraft Skin Viewer 3D</h1>
            <p className="text-xs text-slate-400 font-medium">展開図を3Dでプレビュー</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
           <button 
            onClick={triggerFileInput}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-500 transition-colors px-4 py-2 rounded-full text-sm font-semibold"
          >
            <Upload size={18} />
            スキンをアップロード
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept="image/png" 
            className="hidden" 
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative flex">
        {/* Left Sidebar - Controls */}
        <aside className="w-80 bg-slate-800/30 backdrop-blur-sm border-r border-white/5 p-6 flex flex-col gap-8 z-10 overflow-y-auto">
          {/* Preview Section */}
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">プレビュー情報</h2>
            <div className="bg-slate-900/50 rounded-xl p-4 border border-white/5">
              {skinImage ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-24 h-24 bg-slate-800 rounded-lg overflow-hidden border-2 border-white/10">
                    <img src={skinImage} alt="Uploaded Skin" className="w-full h-full pixel-art object-contain" />
                  </div>
                  <span className="text-xs font-mono text-slate-400">64 x 64px</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 text-slate-500 py-4">
                  <Info size={32} />
                  <p className="text-xs text-center">スキンをアップロードして<br/>表示を開始してください</p>
                </div>
              )}
            </div>
          </section>

          {/* Model Type Section */}
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">モデルタイプ</h2>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => setModelType('classic')}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${modelType === 'classic' ? 'bg-green-600/20 border-green-500 text-green-400' : 'bg-slate-800/40 border-transparent text-slate-400 hover:bg-slate-700/50'}`}
              >
                <Monitor size={20} />
                <span className="text-xs font-bold">Classic (Steve)</span>
              </button>
              <button 
                onClick={() => setModelType('slim')}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${modelType === 'slim' ? 'bg-green-600/20 border-green-500 text-green-400' : 'bg-slate-800/40 border-transparent text-slate-400 hover:bg-slate-700/50'}`}
              >
                <Smartphone size={20} />
                <span className="text-xs font-bold">Slim (Alex)</span>
              </button>
            </div>
          </section>

          {/* Overlay Toggle Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">レイヤー設定</h2>
              <Layers size={16} className="text-slate-500" />
            </div>
            <button 
              onClick={() => setShowOuter(!showOuter)}
              className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${showOuter ? 'bg-slate-700 text-white border-white/10' : 'bg-slate-800/40 border-transparent text-slate-500'}`}
            >
              <span className="text-xs font-bold">アウターレイヤーを表示</span>
              <div className={`w-8 h-4 rounded-full relative transition-colors ${showOuter ? 'bg-green-500' : 'bg-slate-600'}`}>
                <div className={`absolute top-1 w-2 h-2 rounded-full bg-white transition-all ${showOuter ? 'left-5' : 'left-1'}`} />
              </div>
            </button>
          </section>

          {/* Tips Section */}
          <section className="mt-auto">
             <div className="p-4 bg-blue-900/20 rounded-xl border border-blue-500/20">
                <div className="flex gap-3 text-blue-400 mb-2">
                  <Zap size={18} />
                  <span className="text-xs font-bold uppercase">Tips</span>
                </div>
                <p className="text-[11px] text-blue-200/70 leading-relaxed">
                  ドラッグで回転、スクロールでズームが可能です。スキンは透過レイヤーにも対応しています。
                </p>
             </div>
          </section>
        </aside>

        {/* 3D Canvas Container */}
        <div className="flex-1 relative bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800 to-slate-950">
          {error && (
            <div className="absolute top-10 left-1/2 -translate-x-1/2 z-20 bg-red-500/90 backdrop-blur-md px-6 py-3 rounded-full flex items-center gap-3 shadow-xl">
              <span className="text-sm font-bold">{error}</span>
              <button onClick={() => setError(null)} className="hover:text-white/80"><RefreshCw size={16} /></button>
            </div>
          )}

          <Canvas shadows>
            <PerspectiveCamera makeDefault position={[0, 5, 40]} fov={50} />
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
            <pointLight position={[-10, -10, -10]} intensity={0.5} />
            
            <Stage environment="city" intensity={0.6} contactShadow={{ opacity: 0.4, blur: 2 }}>
              <MinecraftCharacter canvas={canvas} modelType={modelType} showOuter={showOuter} />
            </Stage>

            <Grid
              infiniteGrid
              fadeDistance={50}
              fadeStrength={5}
              cellSize={2}
              sectionSize={10}
              sectionThickness={1}
              sectionColor="#1e293b"
              cellColor="#0f172a"
            />

            <OrbitControls 
              enablePan={false} 
              minDistance={10} 
              maxDistance={80} 
              makeDefault
              autoRotate={!skinImage} // Auto rotate only when idle/no skin
              autoRotateSpeed={0.5}
            />
          </Canvas>

          {!skinImage && !loading && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-slate-900/60 backdrop-blur-xl p-8 rounded-3xl border border-white/10 flex flex-col items-center gap-4 text-center">
                <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center animate-bounce">
                  <Upload className="text-green-400" size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">スキンを表示しましょう</h3>
                  <p className="text-slate-400 text-sm">Minecraftのスキンファイル(.png)を選択してください</p>
                </div>
                <button 
                  onClick={triggerFileInput}
                  className="mt-2 pointer-events-auto bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-8 rounded-2xl transition-all shadow-lg shadow-green-500/20 active:scale-95"
                >
                  ファイルを選択
                </button>
              </div>
            </div>
          )}

          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm z-30">
               <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-lg font-bold">レンダリング中...</span>
               </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer / Status Bar */}
      <footer className="px-6 py-2 bg-slate-900 border-t border-white/5 flex justify-between items-center text-[10px] text-slate-500 uppercase font-bold tracking-tighter">
        <div className="flex gap-4">
          <span>WebGL Rendering</span>
          <span>Three.js (React Three Fiber)</span>
        </div>
        <div className="flex gap-4">
          <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /> System Ready</span>
          <span>V 1.0.0</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
