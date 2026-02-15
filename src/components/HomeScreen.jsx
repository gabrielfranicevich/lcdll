import { Users } from './Icons';
import smirkcat from '../assets/smirkcat.svg';

const HomeScreen = ({ setScreen }) => (
  <div className="flex-1 flex flex-col items-center justify-center p-8 relative z-10">
    <div className="mb-16 text-center">
      <div className="mb-6 relative group">
        <div className="absolute inset-0 bg-accent-toxic/20 blur-xl rounded-full group-hover:bg-accent-toxic/40 transition-all duration-500"></div>
        <img src={smirkcat} alt="Smirking cat" className="w-64 h-auto mx-auto relative z-10 drop-shadow-2xl grayscale-[70%] contrast-125 brightness-110" />
      </div>
      <h1 className="text-8xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
        LCDLL
      </h1>
      <p className="text-2xl font-bold text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
        Las Cartas De La Libertad
      </p>
    </div>

    <div className="w-full max-w-sm space-y-6">
      <button
        onClick={() => {
          setScreen('online_lobby');
          window.history.pushState(null, '', '/online');
        }}
        className="group w-full bg-primary text-black py-6 rounded-none font-bold text-2xl 
        shadow-brutal hover:shadow-brutal-hover hover:translate-x-[2px] hover:translate-y-[2px] 
        active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all 
        flex items-center justify-center gap-4 border-2 border-transparent hover:border-accent-toxic hover:text-accent-toxic hover:bg-black"
      >
        <Users size={32} className="group-hover:text-accent-toxic" />
        JUGAR
      </button>
    </div>
  </div>
);

export default HomeScreen;
