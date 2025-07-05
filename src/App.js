import { useState, useEffect } from 'react';
import { Plus, Trash2, Trophy, Flag, DollarSign } from 'lucide-react';

const RacingGame = () => {
  const [competitors, setCompetitors] = useState([
    { id: 1, name: 'Alfredo', color: '#FF4444', value: 0 }
  ]);
  
  const [targetValue, setTargetValue] = useState(1000);
  const [raceStarted, setRaceStarted] = useState(false);
  const [winner, setWinner] = useState(null);

  const colors = [
    '#FF4444', '#44FF44', '#4444FF', '#FF44FF', '#FFFF44', '#44FFFF',
    '#FF8844', '#88FF44', '#4488FF', '#FF4488', '#88FFFF', '#FFFF88',
    '#AA44FF', '#FF44AA', '#44AAFF', '#AAFF44', '#FF8888', '#88FF88',
    '#8888FF', '#FFAA44'
  ];

  const formatValue = (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k`;
    }
    return value.toLocaleString('pt-BR');
  };

  const addCompetitor = () => {
    if (competitors.length < 20) {
      const newId = Math.max(...competitors.map(c => c.id), 0) + 1;
      const availableColor = colors.find(color => 
        !competitors.some(c => c.color === color)
      ) || colors[competitors.length % colors.length];
      
      setCompetitors([...competitors, {
        id: newId,
        name: `Competidor ${newId}`,
        color: availableColor,
        value: 0
      }]);
    }
  };

  const removeCompetitor = (id) => {
    setCompetitors(competitors.filter(c => c.id !== id));
  };

  const updateCompetitor = (id, field, value) => {
    setCompetitors(competitors.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  const maxValue = Math.max(...competitors.map(c => c.value), 1);

  useEffect(() => {
    const hasWinner = competitors.some(c => c.value >= targetValue);
    if (hasWinner && !winner) {
      const winnerCompetitor = competitors
        .filter(c => c.value >= targetValue)
        .sort((a, b) => b.value - a.value)[0];
      setWinner(winnerCompetitor);
    }
  }, [competitors, targetValue, winner]);

  // Reset winner when target value changes
  useEffect(() => {
    setWinner(null);
  }, [targetValue]);

  const resetRace = () => {
    setRaceStarted(false);
    setWinner(null);
    setTargetValue(1000);
    setCompetitors(competitors.map(c => ({ ...c, value: 0 })));
  };

  const CarIcon = ({ color, position, isWinner, progress }) => (
    <div 
      className={`transition-all duration-500 ease-out ${isWinner ? 'animate-bounce' : ''} ${progress >= 100 ? 'z-30' : 'z-20'}`}
    >
      <div 
        className={`w-8 h-6 rounded-lg shadow-lg relative ${
          progress >= 120 ? 'ring-2 ring-purple-400' : 
          progress >= 100 ? 'ring-2 ring-yellow-400' : ''
        }`}
        style={{ backgroundColor: color }}
      >
        <div className="absolute -top-1 left-1 w-2 h-2 bg-black rounded-full"></div>
        <div className="absolute -top-1 right-1 w-2 h-2 bg-black rounded-full"></div>
        <div className="absolute -bottom-1 left-0 w-2 h-2 bg-black rounded-full"></div>
        <div className="absolute -bottom-1 right-0 w-2 h-2 bg-black rounded-full"></div>
        
        {isWinner && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <Trophy className="w-4 h-4 text-yellow-400 animate-bounce" />
          </div>
        )}
        
        {progress >= 120 && (
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-purple-400 text-xs font-bold animate-pulse">
            🚀ULTRA
          </div>
        )}
        {progress >= 100 && progress < 120 && (
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-green-400 text-xs font-bold animate-pulse">
            ✨META
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            🏁 Corrida Interativa
          </h1>
          <p className="text-xl text-blue-200 mb-4">
            Competição de Vendas
          </p>
          
          {/* Meta Configuration */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 max-w-md mx-auto">
            <label className="block text-sm text-blue-200 mb-2">
              🎯 Meta da Corrida (R$):
            </label>
            <div className="relative mb-3">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/70" />
              <input
                type="number"
                value={targetValue}
                onChange={(e) => setTargetValue(Math.max(1, parseFloat(e.target.value) || 1))}
                className="w-full bg-white/20 text-white text-center text-xl font-bold rounded-lg pl-10 pr-3 py-3 placeholder-white/50"
                placeholder="1000000"
                min="1"
                max="10000000"
                step="1000"
              />
            </div>
            
            {/* Quick Meta Buttons */}
            <div className="grid grid-cols-5 gap-2 mb-3">
              {[1000, 5000, 10000, 50000, 100000].map(value => (
                <button
                  key={value}
                  onClick={() => setTargetValue(value)}
                  className={`px-2 py-1 rounded text-xs transition-colors ${
                    targetValue === value 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white/20 text-blue-200 hover:bg-white/30'
                  }`}
                >
                  {value >= 1000 ? `${value/1000}k` : value}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[250000, 500000, 1000000].map(value => (
                <button
                  key={value}
                  onClick={() => setTargetValue(value)}
                  className={`px-2 py-1 rounded text-xs transition-colors ${
                    targetValue === value 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white/20 text-blue-200 hover:bg-white/30'
                  }`}
                >
                  {value >= 1000000 ? `${value/1000000}M` : `${value/1000}k`}
                </button>
              ))}
            </div>
            
            <p className="text-sm text-blue-300">
              Meta atual: R$ {targetValue.toLocaleString('pt-BR')}
              {targetValue >= 1000000 && (
                <span className="ml-2 text-yellow-300 font-bold">
                  💰 {formatValue(targetValue)}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Winner Banner */}
        {winner && (
          <div className={`bg-gradient-to-r ${winner.value >= 1000000 ? 'from-yellow-400 via-orange-500 to-red-500' : 'from-yellow-400 to-orange-500'} rounded-2xl p-6 mb-8 text-center shadow-2xl ${winner.value >= 1000000 ? 'animate-pulse' : ''}`}>
            <Trophy className="w-16 h-16 mx-auto mb-4 text-white" />
            <h2 className="text-3xl font-bold text-white mb-2">
              🎉 VENCEDOR! 🎉
              {winner.value >= 1000000 && <div className="text-4xl mt-2">💰👑 MILIONÁRIO! 👑💰</div>}
            </h2>
            <p className="text-xl text-white">
              {winner.name} • R$ {winner.value.toLocaleString('pt-BR')}
              {winner.value >= 1000000 && (
                <span className="block text-2xl font-bold text-yellow-200 mt-2">
                  {formatValue(winner.value)} em vendas! 🚀
                </span>
              )}
            </p>
          </div>
        )}

        {/* Race Track */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              🏁 Pista de Corrida
            </h2>
            <div className="flex items-center gap-4">
              <div className="text-white text-sm">
                🎯 Meta: R$ {targetValue >= 1000000 ? formatValue(targetValue) : targetValue.toLocaleString('pt-BR')}
              </div>
              <button
                onClick={resetRace}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
          
          <div className="relative overflow-x-auto">
            {/* Track Lines */}
            <div className="space-y-4" style={{ minWidth: '520px' }}>
              {competitors.map((competitor, index) => {
                // Progresso baseado no valor vs meta
                const progress = (competitor.value / targetValue) * 100;
                const progressCapped = Math.min(progress, 100); // Para barras visuais
                
                // O carrinho deve estar na ponta da barra de progresso
                // Largura da pista: 500px menos margens (16px total)
                const trackWidth = 484;
                // Posição do carrinho = posição final da barra de progresso
                const position = (progressCapped / 100) * trackWidth;
                const isCurrentWinner = winner && winner.id === competitor.id;
                
                return (
                  <div key={competitor.id} className="relative">
                    {/* Track */}
                    <div className="h-12 bg-gray-800 rounded-lg relative overflow-visible mx-2" style={{ minWidth: '500px' }}>
                      {/* Progress Bar - sempre acompanha o carrinho */}
                      <div 
                        className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-500 opacity-60 rounded-lg relative"
                        style={{ width: `${progressCapped}%` }}
                      >
                        {/* Carrinho na ponta da barra quando <= 100% */}
                        {progress <= 100 && (
                          <div className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1/2">
                            <CarIcon 
                              color={competitor.color} 
                              position={0}
                              isWinner={isCurrentWinner}
                              progress={progress}
                            />
                          </div>
                        )}
                      </div>
                      
                      {/* Carrinho além da meta (>100%) */}
                      {progress > 100 && (
                        <div 
                          className="absolute top-1/2 transform -translate-y-1/2"
                          style={{ left: `${100 + Math.min((progress - 100) * 0.5, 20)}%` }}
                        >
                          <CarIcon 
                            color={competitor.color} 
                            position={0}
                            isWinner={isCurrentWinner}
                            progress={progress}
                          />
                        </div>
                      )}
                      
                      {/* Barra overtime roxa (quando ultrapassa 100%) */}
                      {progress > 100 && (
                        <div 
                          className="absolute top-0 h-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-40 rounded-r-lg transition-all duration-500"
                          style={{ 
                            left: '100%',
                            width: `${Math.min((progress - 100) * 0.5, 20)}%`
                          }}
                        />
                      )}
                      
                      {/* Progress Indicators */}
                      {progressCapped >= 75 && progressCapped < 100 && (
                        <div className="absolute left-3/4 top-0 h-full w-0.5 bg-yellow-400 z-10">
                          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-yellow-400 text-xs font-bold">
                            75%
                          </div>
                        </div>
                      )}
                      {progressCapped >= 90 && progressCapped < 100 && (
                        <div className="absolute right-2 top-0 h-full w-0.5 bg-orange-400 z-10">
                          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-orange-400 text-xs font-bold">
                            90%
                          </div>
                        </div>
                      )}
                      
                      {/* Start Line */}
                      <div className="absolute left-1 top-1 h-10 w-1 bg-white z-10"></div>
                      <div className="absolute left-0 top-0 text-white text-xs font-bold z-10">🏁</div>
                      
                      {/* Finish Line (Meta) */}
                      <div className="absolute right-1 top-1 h-10 w-2 bg-red-500 shadow-lg z-10">
                        <div className="absolute -top-2 -left-1 text-red-500 text-xs font-bold">META</div>
                      </div>
                      <Flag className="absolute right-0 top-1/2 transform -translate-y-1/2 w-6 h-6 text-red-500 z-10" />
                      
                      {/* Carrinho inicial quando não há progresso */}
                      {progressCapped === 0 && (
                        <div className="absolute top-1/2 left-2 transform -translate-y-1/2">
                          <CarIcon 
                            color={competitor.color} 
                            position={0}
                            isWinner={isCurrentWinner}
                            progress={progress}
                          />
                        </div>
                      )}
                    </div>
                    
                    {/* Competitor Info */}
                    <div className="flex items-center justify-between mt-2 text-white">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: competitor.color }}
                        ></div>
                        <span className="font-semibold">{competitor.name}</span>
                        {progressCapped >= 90 && progressCapped < 100 && (
                          <span className="text-yellow-400 text-sm animate-pulse">🔥 Quase lá!</span>
                        )}
                        {progress >= 100 && (
                          <span className="text-green-400 text-sm animate-bounce">
                            🏆 META ATINGIDA!
                            {competitor.value >= 1000000 && <span className="text-yellow-400 ml-1">💰 MILIONÁRIO!</span>}
                            {progress > 120 && <span className="text-purple-400 ml-1">🚀 SUPEROU!</span>}
                          </span>
                        )}
                      </div>
                      <div className="text-sm">
                        R$ {competitor.value.toLocaleString('pt-BR')} ({progress.toFixed(1)}%)
                        {progress > 100 && (
                          <span className="text-purple-400 ml-1 font-bold">
                            +{(progress - 100).toFixed(1)}% além da meta! 🚀
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Competitors Panel */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              👥 Competidores ({competitors.length}/20)
            </h2>
            <button
              onClick={addCompetitor}
              disabled={competitors.length >= 20}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-500 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Adicionar
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {competitors.map((competitor) => (
              <div 
                key={competitor.id}
                className="bg-white/20 rounded-xl p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-6 h-6 rounded"
                      style={{ backgroundColor: competitor.color }}
                    ></div>
                    <span className="text-white font-semibold">
                      Carrinho #{competitor.id}
                    </span>
                  </div>
                  <button
                    onClick={() => removeCompetitor(competitor.id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <label className="block text-sm text-blue-200 mb-1">
                    Nome do Vendedor:
                  </label>
                  <input
                    type="text"
                    value={competitor.name}
                    onChange={(e) => updateCompetitor(competitor.id, 'name', e.target.value)}
                    className="w-full bg-white/20 text-white rounded-lg px-3 py-2 placeholder-white/50"
                    placeholder="Nome do vendedor"
                  />
                </div>

                <div>
                  <label className="block text-sm text-blue-200 mb-1">
                    💰 Valor em Reais:
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/70" />
                    <input
                      type="number"
                      value={competitor.value}
                      onChange={(e) => updateCompetitor(competitor.id, 'value', Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full bg-white/20 text-white rounded-lg pl-10 pr-3 py-2 placeholder-white/50"
                      placeholder="0"
                      min="0"
                      max="10000000"
                      step="100"
                    />
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-lg font-bold text-white">
                    R$ {competitor.value.toLocaleString('pt-BR')}
                  </div>
                  <div className="text-sm text-blue-200">
                    {((competitor.value / targetValue) * 100).toFixed(1)}% da meta
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mt-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            🏆 Ranking
          </h2>
          <div className="space-y-2">
            {competitors
              .sort((a, b) => b.value - a.value)
              .map((competitor, index) => (
                <div 
                  key={competitor.id}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    index === 0 ? 'bg-yellow-500/20' : 
                    index === 1 ? 'bg-gray-400/20' : 
                    index === 2 ? 'bg-orange-600/20' : 'bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}º`}
                    </div>
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: competitor.color }}
                    ></div>
                    <span className="text-white font-semibold">{competitor.name}</span>
                  </div>
                  <div className="text-white font-bold">
                    R$ {competitor.value.toLocaleString('pt-BR')}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RacingGame;