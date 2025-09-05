import React, { useState, useEffect } from 'react';
import { Zap, Skull, Heart, Eye, Wifi, MessageCircle, Users2, Trophy } from 'lucide-react';

const EliDashboard = () => {
  const [peerPressure, setPeerPressure] = useState(67);
  const [reputation, setReputation] = useState(42);
  const [mentalState, setMentalState] = useState(78);
  const [notifications, setNotifications] = useState([]);
  const [chatFeed, setChatFeed] = useState([
    { user: "sk8rboi2006", msg: "eli u coming to the party tonight?", time: "2m", mood: "pressure" },
    { user: "gamequeen", msg: "dont be lame again...", time: "5m", mood: "toxic" },
    { user: "your_mom", msg: "dinner in 20 mins", time: "12m", mood: "safe" }
  ]);
  const [glitchIntensity, setGlitchIntensity] = useState(0);
  const [currentTrack, setCurrentTrack] = useState("lo-fi beats to cry to");
  const [breathingPattern, setBreathingPattern] = useState(0);

  // Realistic teenage room ambiance
  useEffect(() => {
    const ambientTimer = setInterval(() => {
      setBreathingPattern(prev => (prev + 0.1) % (Math.PI * 2));
      
      // Peer pressure fluctuates like real anxiety
      setPeerPressure(prev => {
        const stress = Math.sin(Date.now() / 10000) * 15 + Math.random() * 10;
        return Math.max(0, Math.min(100, prev + stress - 5));
      });

      // Random glitch when stressed
      if (peerPressure > 80) {
        setGlitchIntensity(Math.random() * 3);
        setTimeout(() => setGlitchIntensity(0), 150);
      }
    }, 500);

    return () => clearInterval(ambientTimer);
  }, [peerPressure]);

  // Realistic social media pressure simulation
  useEffect(() => {
    const socialTimer = setInterval(() => {
      const toxicMessages = [
        { user: "popular_kid_87", msg: "everyone saw you eat lunch alone lmao", mood: "toxic" },
        { user: "coolest_person", msg: "why r u so weird eli", mood: "pressure" },
        { user: "that_one_friend", msg: "just come out tonight, what could go wrong?", mood: "pressure" },
        { user: "random_classmate", msg: "heard you're too scared to vape 💀", mood: "toxic" },
        { user: "fake_friend", msg: "my older brother can get us stuff", mood: "pressure" }
      ];

      if (Math.random() > 0.6) {
        const randomMsg = toxicMessages[Math.floor(Math.random() * toxicMessages.length)];
        setChatFeed(prev => [
          { ...randomMsg, time: "now" },
          ...prev.slice(0, 4)
        ]);
      }
    }, 12000);

    return () => clearInterval(socialTimer);
  }, []);

  const breathe = () => {
    setMentalState(prev => Math.min(100, prev + 10));
    setPeerPressure(prev => Math.max(0, prev - 20));
    
    const newNotif = {
      id: Date.now(),
      title: "+10 Self-Care",
      subtitle: "You took a moment to breathe",
      icon: "💙",
      color: "blue"
    };
    
    setNotifications(prev => [newNotif, ...prev.slice(0, 2)]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotif.id));
    }, 4000);
  };

  const ignoreEveryone = () => {
    setReputation(prev => Math.max(0, prev - 5));
    setPeerPressure(prev => Math.max(0, prev - 30));
    
    const newNotif = {
      id: Date.now(),
      title: "-5 Social Credit",
      subtitle: "But +30 Peace of Mind",
      icon: "🎧",
      color: "purple"
    };
    
    setNotifications(prev => [newNotif, ...prev.slice(0, 2)]);
  };

  const getMoodColor = (level) => {
    if (level < 30) return { bg: "bg-red-500", glow: "shadow-red-500/50" };
    if (level < 60) return { bg: "bg-yellow-500", glow: "shadow-yellow-500/50" };
    return { bg: "bg-emerald-500", glow: "shadow-emerald-500/50" };
  };

  const getVibeCheck = () => {
    if (peerPressure > 80) return { text: "OVERWHELMED", color: "text-red-400", emoji: "😰" };
    if (peerPressure > 60) return { text: "STRESSED", color: "text-orange-400", emoji: "😔" };
    if (peerPressure > 40) return { text: "CONFLICTED", color: "text-yellow-400", emoji: "😐" };
    return { text: "CHILL", color: "text-green-400", emoji: "😊" };
  };

  const currentVibe = getVibeCheck();

  return (
    <div className="min-h-screen bg-black relative overflow-hidden font-mono">
      {/* Dynamic background with breathing effect */}
      <div 
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center, 
            rgba(139, 69, 19, ${0.1 + Math.sin(breathingPattern) * 0.05}) 0%, 
            rgba(75, 0, 130, ${0.15 + Math.sin(breathingPattern) * 0.08}) 30%, 
            rgba(0, 0, 0, 0.9) 70%)`,
          transform: `scale(${1 + Math.sin(breathingPattern) * 0.02})`
        }}
      />

      {/* Glitch overlay */}
      {glitchIntensity > 0 && (
        <div 
          className="absolute inset-0 pointer-events-none mix-blend-difference"
          style={{
            background: `repeating-linear-gradient(
              ${Math.random() * 360}deg, 
              transparent, 
              rgba(255, 0, 100, ${glitchIntensity * 0.3}) 2px, 
              transparent 4px
            )`
          }}
        />
      )}

      {/* Header - teen bedroom vibe */}
      <div className="relative z-10 p-6 border-b border-purple-500/20">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1 flex items-center">
              <span className="text-purple-400 mr-2">◉</span>
              eli's space
              <span className="text-xs ml-3 text-gray-500">probably shouldn't be here</span>
            </h1>
            <div className="text-sm text-gray-400">
              🎵 {currentTrack} • volume: way too loud
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-400">3:47 AM</div>
            <div className="text-xs text-purple-400">parents asleep</div>
            <div className="flex items-center justify-end mt-1 text-xs">
              <Wifi className="w-3 h-3 mr-1" />
              <span>connected (barely)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Dashboard */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Vibe Check Display */}
          <div className="bg-gray-900/80 border border-gray-700 rounded-xl p-6 backdrop-blur-md">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <span className="text-3xl mr-3">{currentVibe.emoji}</span>
                <div>
                  <h2 className="text-xl font-bold text-white">current vibe</h2>
                  <p className={`text-lg font-semibold ${currentVibe.color}`}>
                    {currentVibe.text}
                  </p>
                </div>
              </div>
              
              <div className="text-right text-sm text-gray-400">
                <div>social battery: {reputation}%</div>
                <div>mental health: {Math.round(mentalState)}%</div>
              </div>
            </div>

            {/* Peer Pressure Visualization */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-purple-300">peer pressure intensity</span>
                <span className="text-white font-bold">{Math.round(peerPressure)}%</span>
              </div>
              
              <div className="relative h-6 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${getMoodColor(100 - peerPressure).bg} ${getMoodColor(100 - peerPressure).glow} shadow-lg`}
                  style={{ width: `${peerPressure}%` }}
                />
                {/* Stress spikes */}
                {peerPressure > 70 && (
                  <div className="absolute inset-0 bg-red-400/30 animate-pulse" />
                )}
              </div>
              
              <div className="flex justify-between text-xs mt-1 text-gray-500">
                <span>😌 zen mode</span>
                <span>😬 anxiety spike</span>
                <span>🔥 panic mode</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={breathe}
                className="bg-blue-600/80 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center backdrop-blur-sm hover:shadow-lg hover:shadow-blue-500/25"
              >
                <Heart className="mr-2 w-5 h-5" />
                take a breath
              </button>
              
              <button 
                onClick={ignoreEveryone}
                className="bg-purple-600/80 hover:bg-purple-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center backdrop-blur-sm hover:shadow-lg hover:shadow-purple-500/25"
              >
                <Eye className="mr-2 w-5 h-5" />
                ignore them all
              </button>
            </div>
          </div>

          {/* Achievement Notifications */}
          {notifications.length > 0 && (
            <div className="space-y-3">
              {notifications.map(notif => (
                <div 
                  key={notif.id}
                  className={`bg-gray-800/90 border-l-4 ${
                    notif.color === 'blue' ? 'border-blue-400' : 'border-purple-400'
                  } rounded-r-lg p-4 backdrop-blur-sm animate-slide-in-right shadow-lg`}
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{notif.icon}</span>
                    <div>
                      <div className="font-bold text-white">{notif.title}</div>
                      <div className="text-sm text-gray-300">{notif.subtitle}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          
          {/* Social Feed */}
          <div className="bg-gray-900/80 border border-gray-700 rounded-xl p-5 backdrop-blur-md">
            <div className="flex items-center mb-4">
              <MessageCircle className="w-5 h-5 text-purple-400 mr-2" />
              <h3 className="font-bold text-white">notifications</h3>
              <span className="ml-auto text-xs text-red-400">{chatFeed.length} unread</span>
            </div>
            
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {chatFeed.map((chat, idx) => (
                <div key={idx} className={`p-3 rounded-lg ${
                  chat.mood === 'toxic' ? 'bg-red-900/30 border border-red-500/20' :
                  chat.mood === 'pressure' ? 'bg-orange-900/30 border border-orange-500/20' :
                  'bg-green-900/30 border border-green-500/20'
                }`}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className={`font-semibold ${
                      chat.mood === 'toxic' ? 'text-red-400' :
                      chat.mood === 'pressure' ? 'text-orange-400' :
                      'text-green-400'
                    }`}>@{chat.user}</span>
                    <span className="text-gray-500">{chat.time}</span>
                  </div>
                  <div className="text-sm text-gray-300">{chat.msg}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-gray-900/80 border border-gray-700 rounded-xl p-5 backdrop-blur-md">
            <h3 className="font-bold text-white mb-4 flex items-center">
              <Trophy className="w-5 h-5 text-yellow-400 mr-2" />
              life stats
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">friends (real ones)</span>
                <span className="text-green-400 font-bold">3</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">homework done</span>
                <span className="text-red-400 font-bold">12%</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">hours of sleep</span>
                <span className="text-orange-400 font-bold">4.2</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">bad decisions avoided</span>
                <span className="text-purple-400 font-bold">{Math.max(0, 47 - Math.floor(peerPressure/2))}</span>
              </div>
            </div>
          </div>

          {/* Mood Playlist */}
          <div className="bg-gray-900/80 border border-gray-700 rounded-xl p-5 backdrop-blur-md">
            <h3 className="font-bold text-white mb-4">current playlist</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-purple-400">
                <span className="mr-2">🎵</span>
                <span>anxiety beats vol. 47</span>
              </div>
              <div className="text-gray-400 text-xs">
                next: "why does nobody understand me"
              </div>
              <div className="mt-3 bg-gray-800 rounded-full h-1">
                <div 
                  className="bg-purple-400 h-1 rounded-full transition-all duration-1000"
                  style={{ width: `${(Date.now() / 100) % 100}%` }}
                />
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default EliDashboard;