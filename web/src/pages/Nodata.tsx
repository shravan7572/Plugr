import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";

export default function NoInternet() {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (online) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full rounded-[12px] border border-[#dcdee0] bg-white p-8 text-center space-y-6 shadow-md">
        
        {/* Offline Icon */}
        <div className="flex justify-center">
          <div className="h-12 w-12 rounded bg-[#f0f0f3] flex items-center justify-center text-[#171717]">
            <WifiOff className="w-6 h-6 text-[#171717]" />
          </div>
        </div>

        {/* Text Details */}
        <div className="space-y-2">
          <h1 className="text-xl font-bold tracking-tight text-[#171717]">Connection Lost</h1>
          <p className="text-xs text-[#60646c] leading-relaxed">
            You are currently offline. Plugr showcase interactive terminal templates require an active internet connection to download modules.
          </p>
        </div>

        {/* Retry CTA */}
        <div className="pt-2">
          <button 
            onClick={() => window.location.reload()}
            className="w-full h-10 bg-[#000000] text-white text-xs font-semibold rounded-[8px] hover:bg-[#1a1a1a] transition-all cursor-pointer shadow-xs"
          >
            Retry Connection
          </button>
        </div>

      </div>
    </div>
  );
}