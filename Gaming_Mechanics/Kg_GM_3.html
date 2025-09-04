import React, { useState, useEffect, useRef } from 'react';
import { Play, Target, Star, Zap, Trophy, Users, Book, Code, Palette, Music } from 'lucide-react';

const KnowledgeQuest = () => {
  const [gameState, setGameState] = useState('menu'); // 'menu', 'playing', 'completed'
  const [currentLevel, setCurrentLevel] = useState(1);
  const [playerPosition, setPlayerPosition] = useState('start');
  const [visitedNodes, setVisitedNodes] = useState(new Set(['start']));
  const [score, setScore] = useState(0);
  const [questProgress, setQuestProgress] = useState([]);
  const [animatingPath, setAnimatingPath] = useState(false);
  const canvasRef = useRef(null);

  // Game data structure - knowledge graph with different node types
  const gameData = {
    1: {
      title: "Data Flow Initialization",
      objective: "Navigate the neural pathways to reach the Core Hub",
      nodes: {
        start: { x: 100, y: 300, type: 'start', label: 'INIT', connections: ['design', 'code'] },
        design: { x: 250, y: 200, type: 'skill', label: 'DESIGN', connections: ['start', 'art', 'ux'], icon: Palette },
        code: { x: 250, y: 400, type: 'skill', label: 'CODE', connections: ['start', 'frontend', 'backend'], icon: Code },
        art: { x: 400, y: 150, type: 'knowledge', label: 'ART.SYS', connections: ['design', 'creative'], icon: Star },
        ux: { x: 400, y: 250, type: 'knowledge', label: 'UX.NET', connections: ['design', 'creative'], icon: Users },
        frontend: { x: 400, y: 350, type: 'knowledge', label: 'FRONT.EXE', connections: ['code', 'creative'], icon: Book },
        backend: { x: 400, y: 450, type: 'knowledge', label: 'BACK.DB', connections: ['code', 'data'], icon: Book },
        creative: { x: 550, y: 250, type: 'hub', label: 'CORE.HUB', connections: ['art', 'ux', 'frontend'], icon: Trophy },
        data: { x: 550, y: 400, type: 'hub', label: 'DATA.CORE', connections: ['backend'], icon: Trophy }
      },
      target: 'creative'
    },
    2: {
      title: "Neural Network Expansion",
      objective: "Establish connection to the Innovation Matrix",
      nodes: {
        start: { x: 80, y: 300, type: 'start', label: 'BOOT', connections: ['basics', 'theory'] },
        basics: { x: 200, y: 200, type: 'skill', label: 'BASE.SYS', connections: ['start', 'intermediate', 'practice'], icon: Book },
        theory: { x: 200, y: 400, type: 'skill', label: 'THEORY.NET', connections: ['start', 'research', 'analysis'], icon: Star },
        intermediate: { x: 320, y: 150, type: 'knowledge', label: 'MID.TIER', connections: ['basics', 'advanced'], icon: Zap },
        practice: { x: 320, y: 250, type: 'knowledge', label: 'EXEC.MOD', connections: ['basics', 'advanced'], icon: Target },
        research: { x: 320, y: 350, type: 'knowledge', label: 'R&D.LAB', connections: ['theory', 'innovation'], icon: Users },
        analysis: { x: 320, y: 450, type: 'knowledge', label: 'SCAN.ENG', connections: ['theory', 'innovation'], icon: Music },
        advanced: { x: 440, y: 200, type: 'hub', label: 'ADV.CORE', connections: ['intermediate', 'practice', 'innovation'], icon: Trophy },
        innovation: { x: 580, y: 300, type: 'target', label: 'MATRIX.PRIME', connections: ['advanced', 'research', 'analysis'], icon: Trophy }
      },
      target: 'innovation'
    }
  };

  const nodeColors = {
    start: '#00F5FF', // Cyan
    skill: '#8A2BE2', // Blue-Purple
    knowledge: '#DA70D6', // Magenta
    hub: '#FFD700', // Gold
    target: '#FF1493' // Deep Pink
  };

  const currentGame = gameData[currentLevel];

  // Canvas drawing function for circuit-board style connections
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || gameState !== 'playing') return;

    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections with circuit board style
    Object.entries(currentGame.nodes).forEach(([nodeId, node]) => {
      node.connections.forEach(connectedId => {
        if (currentGame.nodes[connectedId]) {
          const connected = currentGame.nodes[connectedId];
          
          // Determine line style based on visited status
          const isPathActive = visitedNodes.has(nodeId) && visitedNodes.has(connectedId);
          
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(connected.x, connected.y);
          
          if (isPathActive) {
            ctx.strokeStyle = '#00F5FF';
            ctx.lineWidth = 3;
            ctx.shadowColor = '#00F5FF';
            ctx.shadowBlur = 15;
            
            // Add animated pulse effect on active connections
            const gradient = ctx.createLinearGradient(node.x, node.y, connected.x, connected.y);
            gradient.addColorStop(0, '#00F5FF');
            gradient.addColorStop(0.5, '#8A2BE2');
            gradient.addColorStop(1, '#00F5FF');
            ctx.strokeStyle = gradient;
          } else {
            ctx.strokeStyle = '#2A4A52';
            ctx.lineWidth = 2;
            ctx.shadowBlur = 5;
            ctx.shadowColor = '#2A4A52';
          }
          
          ctx.stroke();
          
          // Add circuit nodes (small dots) along connections
          const midX = (node.x + connected.x) / 2;
          const midY = (node.y + connected.y) / 2;
          
          ctx.beginPath();
          ctx.arc(midX, midY, 3, 0, 2 * Math.PI);
          ctx.fillStyle = isPathActive ? '#00F5FF' : '#2A4A52';
          ctx.fill();
          
          if (isPathActive) {
            ctx.shadowColor = '#00F5FF';
            ctx.shadowBlur = 10;
            ctx.fill();
          }
        }
      });
    });
  }, [gameState, currentLevel, visitedNodes, currentGame]);

  const handleNodeClick = (nodeId) => {
    if (animatingPath) return;
    
    const currentNode = currentGame.nodes[playerPosition];
    const targetNode = currentGame.nodes[nodeId];
    
    // Check if the node is connected to current position
    if (currentNode.connections.includes(nodeId)) {
      setAnimatingPath(true);
      
      // Animate the movement
      setTimeout(() => {
        setPlayerPosition(nodeId);
        setVisitedNodes(prev => new Set([...prev, nodeId]));
        setScore(prev => prev + 10);
        setQuestProgress(prev => [...prev, nodeId]);
        
        // Check if reached target
        if (nodeId === currentGame.target) {
          setScore(prev => prev + 100);
          setTimeout(() => {
            if (currentLevel < Object.keys(gameData).length) {
              setCurrentLevel(prev => prev + 1);
              resetLevel();
            } else {
              setGameState('completed');
            }
          }, 1000);
        }
        
        setAnimatingPath(false);
      }, 500);
    }
  };

  const resetLevel = () => {
    setPlayerPosition('start');
    setVisitedNodes(new Set(['start']));
    setQuestProgress([]);
  };

  const startGame = () => {
    setGameState('playing');
    setCurrentLevel(1);
    setScore(0);
    resetLevel();
  };

  const renderNode = (nodeId, node) => {
    const isCurrentPosition = playerPosition === nodeId;
    const isVisited = visitedNodes.has(nodeId);
    const isTarget = nodeId === currentGame.target;
    const isConnectedToCurrent = currentGame.nodes[playerPosition]?.connections.includes(nodeId);
    
    const IconComponent = node.icon || Star;
    
    return (
      <div
        key={nodeId}
        className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ${
          isCurrentPosition ? 'scale-125 z-20' : 'scale-100 z-10'
        } ${isConnectedToCurrent && !isCurrentPosition ? 'hover:scale-110' : ''}`}
        style={{
          left: `${node.x}px`,
          top: `${node.y}px`,
        }}
        onClick={() => handleNodeClick(nodeId)}
      >
        {/* Hexagonal outer ring */}
        <div className="absolute inset-0 transform rotate-0">
          <svg width="80" height="80" className="absolute -top-2 -left-2">
            <polygon
              points="40,8 60,24 60,56 40,72 20,56 20,24"
              fill="none"
              stroke={nodeColors[node.type]}
              strokeWidth={isCurrentPosition ? "3" : "2"}
              className={isCurrentPosition ? "animate-pulse" : ""}
              style={{
                filter: isCurrentPosition ? `drop-shadow(0 0 15px ${nodeColors[node.type]})` : 'none'
              }}
            />
            {isCurrentPosition && (
              <polygon
                points="40,8 60,24 60,56 40,72 20,56 20,24"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="1"
                opacity="0.5"
                className="animate-pulse"
              />
            )}
          </svg>
        </div>

        {/* Node glow effect */}
        {isCurrentPosition && (
          <div
            className="absolute inset-0 rounded-full animate-pulse opacity-30"
            style={{
              backgroundColor: nodeColors[node.type],
              filter: 'blur(20px)',
              transform: 'scale(2)',
            }}
          />
        )}
        
        {/* Main node - hexagonal */}
        <div
          className={`w-16 h-16 flex items-center justify-center transition-all duration-300 relative`}
          style={{
            backgroundColor: isCurrentPosition ? nodeColors[node.type] : 'rgba(0,0,0,0.8)',
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            border: `2px solid ${nodeColors[node.type]}`,
            boxShadow: isCurrentPosition ? `0 0 25px ${nodeColors[node.type]}, inset 0 0 15px rgba(255,255,255,0.1)` : `0 0 10px ${nodeColors[node.type]}`,
          }}
        >
          <IconComponent 
            size={20} 
            className={`text-white z-10 ${isCurrentPosition ? 'animate-pulse' : ''}`} 
            style={{ filter: 'drop-shadow(0 0 3px rgba(0,0,0,0.8))' }}
          />
        </div>
        
        {/* Node label with cyberpunk styling */}
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 text-center">
          <div className={`text-xs font-mono font-bold px-3 py-1 border transition-all duration-300 ${
            isTarget ? 'bg-red-900/80 text-red-300 border-red-500 animate-pulse' : 
            isCurrentPosition ? 'bg-cyan-900/80 text-cyan-300 border-cyan-400' :
            'bg-gray-900/80 text-gray-300 border-gray-600'
          }`}
          style={{
            clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)',
            backdropFilter: 'blur(5px)'
          }}>
            {node.label}
          </div>
        </div>

        {/* Circuit details */}
        {isVisited && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-ping"
                style={{
                  left: `${25 + (i * 15)}%`,
                  top: `${25 + (i * 15)}%`,
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 flex items-center justify-center relative overflow-hidden">
        {/* Cyberpunk background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        {/* Circuit grid background */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(0,245,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,245,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className="text-center space-y-8 p-8 relative z-10">
          <div className="space-y-6">
            {/* Hexagonal logo */}
            <div className="mx-auto w-32 h-32 relative">
              <svg width="128" height="128" className="animate-spin" style={{animationDuration: '20s'}}>
                <polygon
                  points="64,16 96,32 96,96 64,112 32,96 32,32"
                  fill="none"
                  stroke="#00F5FF"
                  strokeWidth="3"
                  className="animate-pulse"
                  style={{filter: 'drop-shadow(0 0 20px #00F5FF)'}}
                />
                <polygon
                  points="64,24 88,36 88,92 64,104 40,92 40,36"
                  fill="none"
                  stroke="#8A2BE2"
                  strokeWidth="2"
                  className="animate-pulse"
                  style={{animationDelay: '0.5s', filter: 'drop-shadow(0 0 15px #8A2BE2)'}}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Code size={40} className="text-cyan-400 animate-pulse" />
              </div>
            </div>

            <h1 className="text-6xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 animate-pulse">
              DATA QUEST
            </h1>
            <p className="text-xl text-gray-300 font-mono tracking-wider">
              // Navigate neural pathways to reach system objectives
            </p>
          </div>
          
          <div className="space-y-4 text-gray-300 font-mono text-sm">
            <div className="flex items-center justify-center space-x-3 bg-gray-900/50 p-3 border border-cyan-500/30" style={{clipPath: 'polygon(5% 0%, 100% 0%, 95% 100%, 0% 100%)'}}>
              <Target className="text-cyan-400" size={16} />
              <span>&gt; Click connected nodes to establish data flow</span>
            </div>
            <div className="flex items-center justify-center space-x-3 bg-gray-900/50 p-3 border border-purple-500/30" style={{clipPath: 'polygon(5% 0%, 100% 0%, 95% 100%, 0% 100%)'}}>
              <Star className="text-purple-400" size={16} />
              <span>&gt; Accumulate processing cycles along pathways</span>
            </div>
            <div className="flex items-center justify-center space-x-3 bg-gray-900/50 p-3 border border-pink-500/30" style={{clipPath: 'polygon(5% 0%, 100% 0%, 95% 100%, 0% 100%)'}}>
              <Trophy className="text-pink-400" size={16} />
              <span>&gt; Execute protocols to complete system levels</span>
            </div>
          </div>

          <button
            onClick={startGame}
            className="relative bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white px-8 py-4 font-mono font-bold text-lg transition-all duration-300 transform hover:scale-105 border border-cyan-400/50 hover:border-cyan-400 group"
            style={{
              clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)',
              boxShadow: '0 0 20px rgba(0,245,255,0.3)'
            }}
          >
            <div className="flex items-center space-x-3">
              <Play size={24} />
              <span>&gt; INITIALIZE QUEST_</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'completed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 flex items-center justify-center relative overflow-hidden">
        {/* Success effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-green-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="text-center space-y-8 p-8 relative z-10">
          <div className="relative">
            <Trophy size={120} className="text-yellow-400 mx-auto animate-bounce drop-shadow-lg" style={{filter: 'drop-shadow(0 0 30px #FFD700)'}} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 border-4 border-cyan-400 rounded-full animate-spin opacity-50" style={{animationDuration: '3s'}}></div>
            </div>
          </div>
          
          <h1 className="text-5xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-cyan-400 to-yellow-400">
            SYSTEM_COMPLETE
          </h1>
          <div className="font-mono text-2xl text-gray-300 bg-gray-900/50 p-4 border border-green-500/30 inline-block" style={{clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)'}}>
            FINAL_SCORE: <span className="text-green-400">{score.toString().padStart(6, '0')}</span>
          </div>
          
          <button
            onClick={() => setGameState('menu')}
            className="bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-500 hover:to-cyan-500 text-white px-8 py-4 font-mono font-bold text-lg transition-all duration-300 transform hover:scale-105 border border-green-400/50"
            style={{
              clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)',
              boxShadow: '0 0 20px rgba(0,255,0,0.3)'
            }}
          >
            &gt; RESTART_PROTOCOL
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 relative overflow-hidden">
      {/* Cyberpunk grid background */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(rgba(0,245,255,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,245,255,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Ambient effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/6 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/6 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Game HUD */}
      <div className="absolute top-4 left-4 right-4 z-30">
        <div className="flex justify-between items-center bg-gray-900/90 backdrop-blur-sm border border-cyan-500/30 p-4 text-white font-mono" style={{clipPath: 'polygon(2% 0%, 100% 0%, 98% 100%, 0% 100%)'}}>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-cyan-400">{currentGame.title}</h2>
            <p className="text-sm text-gray-300">&gt; {currentGame.objective}</p>
          </div>
          
          <div className="flex items-center space-x-6 text-right">
            <div className="bg-gray-800/50 p-2 border border-blue-500/30" style={{clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)'}}>
              <div className="text-xs text-gray-400">LVL</div>
              <div className="text-2xl font-bold text-cyan-400">{currentLevel.toString().padStart(2, '0')}</div>
            </div>
            <div className="bg-gray-800/50 p-2 border border-green-500/30" style={{clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)'}}>
              <div className="text-xs text-gray-400">PTS</div>
              <div className="text-2xl font-bold text-green-400">{score.toString().padStart(4, '0')}</div>
            </div>
            <div className="bg-gray-800/50 p-2 border border-purple-500/30" style={{clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)'}}>
              <div className="text-xs text-gray-400">PROG</div>
              <div className="text-2xl font-bold text-purple-400">
                {visitedNodes.size}/{Object.keys(currentGame.nodes).length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="relative w-full h-screen pt-24">
        {/* Canvas for connections */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ top: '96px' }}
        />
        
        {/* Nodes */}
        <div className="relative w-full h-full">
          {Object.entries(currentGame.nodes).map(([nodeId, node]) =>
            renderNode(nodeId, node)
          )}
        </div>
        
        {/* Data particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
                boxShadow: '0 0 6px #00F5FF'
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Quest Progress */}
      <div className="absolute bottom-4 left-4 right-4 z-30">
        <div className="bg-gray-900/90 backdrop-blur-sm border border-cyan-500/30 p-4 font-mono" style={{clipPath: 'polygon(1% 0%, 100% 0%, 99% 100%, 0% 100%)'}}>
          <div className="text-cyan-400 text-sm mb-2">&gt; DATA_FLOW_PATH:</div>
          <div className="flex items-center space-x-2 flex-wrap">
            {questProgress.length === 0 ? (
              <span className="text-gray-500 text-sm">// Awaiting initial connection...</span>
            ) : (
              questProgress.map((nodeId, index) => (
                <React.Fragment key={index}>
                  <div
                    className="px-3 py-1 text-xs font-mono font-bold text-black border"
                    style={{ 
                      backgroundColor: nodeColors[currentGame.nodes[nodeId].type],
                      clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)',
                      borderColor: nodeColors[currentGame.nodes[nodeId].type],
                      textShadow: '0 0 3px rgba(0,0,0,0.8)'
                    }}
                  >
                    {currentGame.nodes[nodeId].label}
                  </div>
                  {index < questProgress.length - 1 && (
                    <div className="text-cyan-400 font-mono">&gt;</div>
                  )}
                </React.Fragment>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeQuest;