export default function Header() {
  return (
    <header className="relative bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white flex flex-col justify-center items-center p-4 sm:p-6 shadow-2xl transition-all duration-500 hover:shadow-black/50 overflow-hidden mb-5">
      <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
      <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-yellow-400/50 rounded-tl-lg"></div>
      <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-yellow-400/50 rounded-br-lg"></div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold animate-fade-in relative z-10">
        <span className="relative inline-block">
          <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 bg-clip-text text-transparent font-['Playfair_Display',serif] tracking-wide drop-shadow-[0_2px_10px_rgba(251,191,36,0.3)]">
            Saikrishna
          </span>
          <span className="text-gray-300 font-light ml-2 sm:ml-3 font-['Montserrat',sans-serif]">
            Agency
          </span>
          <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent rounded-full shadow-[0_0_8px_rgba(251,191,36,0.4)]"></span>
        </span>
      </h1>
      <p className="text-gray-400 text-xs sm:text-sm mt-3 font-['Montserrat',sans-serif] tracking-wider relative z-10">
        Professional Invoice Generation System
      </p>
      <div className="flex items-center gap-2 mt-2 relative z-10">
        <div className="w-6 h-px bg-gradient-to-r from-transparent to-yellow-400/50"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/70"></div>
        <div className="w-6 h-px bg-gradient-to-l from-transparent to-yellow-400/50"></div>
      </div>
    </header>
  );
}
