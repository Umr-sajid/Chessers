import React, { useState, useEffect, useRef } from 'react';
import { Chess, Square, PieceSymbol, Color } from 'chess.js';
import { ChessBoard } from '../board/ChessBoard';
import { EvalBar } from '../board/EvalBar';
import { BoardControls } from '../board/BoardControls';
import { Clock } from './Clock';
import { CoachPanel } from '../coaching/CoachPanel';
import { COMPUTER_BOTS } from '../../data/bots';
import { BotPersonality, GameMode, MoveRecord, CoachLevel, AppSettings, GameHistoryEntry } from '../../types/chess';
import { soundFx } from '../../audio/soundEffects';
import { evaluatePosition } from '../../engine/evaluationEngine';
import { getBestBotMove } from '../../engine/minimaxEngine';
import { generateCoachExplanation } from '../../engine/coachingEngine';
import { reviewGame, GameReviewReport } from '../../engine/gameReviewEngine';
import { GameReviewModal } from './GameReviewModal';
import { addGameToHistory } from '../../utils/storage';
import { Users, Bot, RefreshCw, Award, Sparkles, Trophy, ChevronRight, Zap } from 'lucide-react';

interface PlayPageProps {
  settings: AppSettings;
}

export const PlayPage: React.FC<PlayPageProps> = ({ settings }) => {
  const [gameMode, setGameMode] = useState<GameMode>('vs_computer');
  const [selectedBot, setSelectedBot] = useState<BotPersonality>(COMPUTER_BOTS[3]); // Mateo 1000
  const [chess] = useState<Chess>(new Chess());
  const [, setFen] = useState<string>(chess.fen());

  const [userColor, setUserColor] = useState<Color>('w');
  const [boardOrientation, setBoardOrientation] = useState<Color>('w');

  const [moveHistory, setMoveHistory] = useState<MoveRecord[]>([]);
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null);

  // Clocks
  const [whiteTime, setWhiteTime] = useState<number>(600); // 10 mins
  const [blackTime, setBlackTime] = useState<number>(600);
  const [gameActive, setGameActive] = useState<boolean>(false);
  const [gameResult, setGameResult] = useState<string | null>(null);

  // Coach & Analysis
  const [coachLevel, setCoachLevel] = useState<CoachLevel>(settings.coachLevel);
  const [latestExplanation, setLatestExplanation] = useState<string>('');
  const [isBotThinking, setIsBotThinking] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<number>(0);

  // Review Modal
  const [reviewReport, setReviewReport] = useState<GameReviewReport | null>(null);
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);

  // Captured pieces
  const [capturedWhite, setCapturedWhite] = useState<string[]>([]);
  const [capturedBlack, setCapturedBlack] = useState<string[]>([]);

  // Clock Timer Ref
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameActive && !gameResult) {
      timer = setInterval(() => {
        const turn = chess.turn();
        if (turn === 'w') {
          setWhiteTime((prev) => {
            if (prev <= 1) {
              handleGameEnd('Black wins on time');
              return 0;
            }
            return prev - 1;
          });
        } else {
          setBlackTime((prev) => {
            if (prev <= 1) {
              handleGameEnd('White wins on time');
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameActive, gameResult, chess]);

  // Bot Turn Trigger
  useEffect(() => {
    if (gameMode === 'vs_computer' && gameActive && !gameResult && chess.turn() !== userColor && !isBotThinking) {
      triggerBotMove();
    }
  }, [gameActive, gameResult, chess.turn(), userColor, gameMode]);

  const handleStartGame = () => {
    chess.reset();
    setFen(chess.fen());
    setMoveHistory([]);
    setLastMove(null);
    setGameActive(true);
    setGameResult(null);
    setWhiteTime(600);
    setBlackTime(600);
    setCapturedWhite([]);
    setCapturedBlack([]);
    setEvaluation(0);
    setLatestExplanation('Game started! Good luck.');
    soundFx.playStart();
  };

  const handleMove = (from: Square, to: Square, promotion?: PieceSymbol) => {
    const chessBefore = new Chess(chess.fen());
    try {
      const move = chess.move({ from, to, promotion: promotion || 'q' });
      if (!move) return;

      const newFen = chess.fen();
      setFen(newFen);
      setLastMove({ from, to });

      // Update captured pieces
      if (move.captured) {
        if (move.color === 'w') {
          setCapturedBlack((prev) => [...prev, move.captured!]);
          soundFx.playCapture();
        } else {
          setCapturedWhite((prev) => [...prev, move.captured!]);
          soundFx.playCapture();
        }
      } else if (move.san === 'O-O' || move.san === 'O-O-O') {
        soundFx.playCastle();
      } else {
        soundFx.playMove();
      }

      // Check / Checkmate audio
      if (chess.isCheckmate()) {
        soundFx.playWin();
      } else if (chess.inCheck()) {
        soundFx.playCheck();
      }

      // Evaluate position
      const evalRes = evaluatePosition(chess);
      const newEval = evalRes.scoreCentipawns / 100;
      setEvaluation(newEval);

      // Generate Coach Explanation
      const explanation = generateCoachExplanation(
        chessBefore,
        chess,
        {
          san: move.san,
          from,
          to,
          piece: move.piece,
          captured: move.captured,
          promotion: move.promotion,
          isCheck: chess.inCheck(),
          isCheckmate: chess.isCheckmate(),
          evalBefore: evaluation,
          evalAfter: newEval,
        },
        coachLevel
      );
      setLatestExplanation(explanation);

      // Record move
      const record: MoveRecord = {
        san: move.san,
        from,
        to,
        piece: move.piece,
        color: move.color,
        captured: move.captured,
        promotion: move.promotion,
        fen: newFen,
      };
      setMoveHistory((prev) => [...prev, record]);

      // Check Game Over
      if (chess.isCheckmate()) {
        handleGameEnd(`Checkmate! ${move.color === 'w' ? 'White' : 'Black'} wins.`);
      } else if (chess.isDraw()) {
        handleGameEnd('Draw by stalemate or 50-move rule.');
      }
    } catch (e) {
      console.error('Invalid move attempted:', e);
    }
  };

  const triggerBotMove = () => {
    setIsBotThinking(true);
    const delay = Math.max(300, 1000 - selectedBot.rating / 4);

    setTimeout(() => {
      const moves = chess.moves({ verbose: true });
      if (moves.length === 0) {
        setIsBotThinking(false);
        return;
      }

      const chosenMove = getBestBotMove(chess, selectedBot.rating);
      if (chosenMove) {
        handleMove(chosenMove.from, chosenMove.to, chosenMove.promotion);
      }
      setIsBotThinking(false);
    }, delay);
  };

  const handleGameEnd = (reason: string) => {
    setGameActive(false);
    setGameResult(reason);

    // Save Game Record to history & run review
    const review = reviewGame(moveHistory);
    setReviewReport(review);

    const historyEntry: GameHistoryEntry = {
      id: `g_${Date.now()}`,
      date: new Date().toLocaleDateString(),
      opponentName: selectedBot.name,
      opponentRating: selectedBot.rating,
      userColor,
      result: chess.isCheckmate() ? (chess.turn() === userColor ? '0-1' : '1-0') : '1/2-1/2',
      winReason: reason,
      accuracyUser: userColor === 'w' ? review.accuracyWhite : review.accuracyBlack,
      accuracyOpponent: userColor === 'w' ? review.accuracyBlack : review.accuracyWhite,
      totalMoves: moveHistory.length,
      pgn: moveHistory.map((m, i) => `${i % 2 === 0 ? `${Math.floor(i / 2) + 1}. ` : ''}${m.san}`).join(' '),
      fenHistory: moveHistory.map((m) => m.fen),
    };

    addGameToHistory(historyEntry);
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-6">
      {/* Game Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-400">
            {gameMode === 'vs_computer' ? <Bot className="w-6 h-6" /> : <Users className="w-6 h-6" />}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">
              {gameMode === 'vs_computer' ? `Playing vs ${selectedBot.name}` : 'Pass & Play (Local Human)'}
            </h2>
            <p className="text-xs text-slate-400">
              {gameMode === 'vs_computer' ? `${selectedBot.title} • Rating ${selectedBot.rating}` : 'Take turns on the same screen'}
            </p>
          </div>
        </div>

        {/* Mode & Setup Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setGameMode(gameMode === 'vs_computer' ? 'vs_human' : 'vs_computer')}
            className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 text-xs font-semibold transition"
          >
            <RefreshCw className="w-4 h-4 text-slate-400" />
            <span>Switch Mode</span>
          </button>
          {!gameActive && (
            <button
              onClick={handleStartGame}
              className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/20 transition"
            >
              <Zap className="w-4 h-4" />
              <span>Start Match</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Arena Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Board & Clocks */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col items-center gap-4">
          <div className="w-full max-w-[600px] flex flex-col gap-2">
            {/* Opponent Clock */}
            <Clock
              timeSeconds={boardOrientation === 'w' ? blackTime : whiteTime}
              isActive={gameActive && chess.turn() !== boardOrientation}
              playerName={gameMode === 'vs_computer' ? selectedBot.name : 'Player 2'}
              rating={gameMode === 'vs_computer' ? selectedBot.rating : 1200}
              avatar={gameMode === 'vs_computer' ? selectedBot.avatar : undefined}
              capturedPieces={boardOrientation === 'w' ? capturedBlack : capturedWhite}
            />

            {/* Board and Eval Bar Container */}
            <div className="flex gap-3 items-center">
              {settings.showEvalBar && (
                <EvalBar evaluation={evaluation} orientation={boardOrientation} />
              )}
              <ChessBoard
                chess={chess}
                boardTheme={settings.boardTheme}
                pieceStyle={settings.pieceStyle}
                orientation={boardOrientation}
                showLegalMoves={settings.showLegalMoves}
                showCoordinates={settings.showCoordinates}
                onMove={handleMove}
                lastMove={lastMove}
                interactive={gameActive && !gameResult && (gameMode === 'vs_human' || chess.turn() === userColor)}
              />
            </div>

            {/* User Clock */}
            <Clock
              timeSeconds={boardOrientation === 'w' ? whiteTime : blackTime}
              isActive={gameActive && chess.turn() === boardOrientation}
              playerName="You"
              rating={1510}
              capturedPieces={boardOrientation === 'w' ? capturedWhite : capturedBlack}
            />

            {/* Board Controls Bar */}
            <BoardControls
              onFlip={() => setBoardOrientation((prev) => (prev === 'w' ? 'b' : 'w'))}
              soundEnabled={settings.soundEnabled}
              canUndo={moveHistory.length > 0}
              canRedo={false}
            />
          </div>
        </div>

        {/* Right Column: Bot Cards / Move Log / Coach */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-5">
          {/* Coach Advice Card */}
          <CoachPanel
            currentCoachLevel={coachLevel}
            onChangeCoachLevel={setCoachLevel}
            latestExplanation={latestExplanation}
            isBotThinking={isBotThinking}
          />

          {/* Move Log Panel */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col flex-1 min-h-[220px]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Move Notation History</h3>
            <div className="flex-1 max-h-[240px] overflow-y-auto font-mono text-xs text-slate-300 space-y-1 pr-1 border border-slate-800 rounded-xl p-3 bg-slate-950">
              {moveHistory.length === 0 ? (
                <span className="text-slate-500 italic">No moves played yet.</span>
              ) : (
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  {moveHistory.map((m, i) => (
                    <div key={i} className="flex items-center gap-2">
                      {i % 2 === 0 && <span className="text-slate-500">{Math.floor(i / 2) + 1}.</span>}
                      <span className={`font-semibold ${m.color === 'w' ? 'text-slate-200' : 'text-slate-400'}`}>
                        {m.san}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Review Game Action */}
            {reviewReport && (
              <button
                onClick={() => setShowReviewModal(true)}
                className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/20 transition"
              >
                <Award className="w-4 h-4" />
                <span>Open Game Review & Accuracy</span>
              </button>
            )}
          </div>

          {/* Computer Opponent Selector Carousel */}
          {gameMode === 'vs_computer' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col gap-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Opponent Bot</h3>
              <div className="grid grid-cols-2 gap-2 max-h-[180px] overflow-y-auto pr-1">
                {COMPUTER_BOTS.map((bot) => (
                  <button
                    key={bot.id}
                    onClick={() => setSelectedBot(bot)}
                    className={`flex items-center gap-2.5 p-2 rounded-xl border text-left transition ${
                      selectedBot.id === bot.id
                        ? 'bg-emerald-500/10 border-emerald-500/60 text-emerald-300'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <img src={bot.avatar} alt={bot.name} className="w-8 h-8 rounded-lg object-cover" />
                    <div className="truncate">
                      <div className="font-bold text-xs truncate">{bot.name}</div>
                      <div className="text-[10px] text-slate-400">Rating {bot.rating}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && reviewReport && (
        <GameReviewModal
          report={reviewReport}
          whiteName="You"
          blackName={selectedBot.name}
          onClose={() => setShowReviewModal(false)}
        />
      )}
    </div>
  );
};
