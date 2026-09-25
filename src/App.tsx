import { useState, useEffect } from 'react';
import {
  CheckSquare,
  Compass,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Award,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Clock,
  Layers,
  HelpCircle,
  Check,
  X,
  Download,
  History,
  Trash2,
  Sun,
  Moon
} from 'lucide-react';
import {
  TestId,
  Question,
  testsMetadata,
  getQuestionsForTest,
  categoryRecommendations
} from './data/testsData';

// Bulletproof Storage Helper with in-memory fallback for sandboxed iframes
class SafeStorage {
  private memory = new Map<string, string>();

  getItem(key: string): string | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const val = window.localStorage.getItem(key);
        if (val !== null) return val;
      }
    } catch {
      // Storage access blocked or restricted in iframe
    }
    return this.memory.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch {
      // Storage access blocked or restricted in iframe
    }
    this.memory.set(key, value);
  }

  removeItem(key: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch {
      // Storage access blocked or restricted in iframe
    }
    this.memory.delete(key);
  }
}

const safeStorage = new SafeStorage();

interface TestHistoryRecord {
  id: string;
  testId: TestId;
  testTitle: string;
  date: string;
  timestamp: number;
  score: number;
  total: number;
  correctCount: number;
  incorrectCount: number;
  percentage: number;
}

export default function App() {
  // Theme state: Only Light and Dark (no 'sistema'), safely initialized
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const savedTheme = safeStorage.getItem('avanzasmart_theme');
      if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
      if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch {
      // Fallback if matchMedia fails
    }
    return 'light';
  });

  const [selectedTestId, setSelectedTestId] = useState<TestId | null>(null);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [categoryScores, setCategoryScores] = useState<Record<string, number>>({});
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Test history safely loaded from safeStorage
  const [history, setHistory] = useState<TestHistoryRecord[]>(() => {
    try {
      const saved = safeStorage.getItem('avanzasmart_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Apply theme to document element safely
  useEffect(() => {
    try {
      if (typeof document !== 'undefined') {
        const root = document.documentElement;
        root.setAttribute('data-theme', theme);
      }
      safeStorage.setItem('avanzasmart_theme', theme);
    } catch {
      // ignore
    }
  }, [theme]);

  // Persist history to safeStorage
  const saveHistoryRecord = (record: TestHistoryRecord) => {
    try {
      setHistory(prev => {
        const updated = [record, ...prev].slice(0, 30);
        safeStorage.setItem('avanzasmart_history', JSON.stringify(updated));
        return updated;
      });
    } catch (e) {
      console.warn('Error saving test history', e);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    safeStorage.removeItem('avanzasmart_history');
    setIsConfirmingClear(false);
    setShowHistoryModal(false);
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const startTest = (testId: TestId) => {
    const rawQuestions = getQuestionsForTest(testId);

    // Fisher-Yates shuffle for options so correct answer is randomly distributed
    const shuffledQuestions = rawQuestions.map(q => {
      const optionsWithIndex = q.options.map((opt, index) => ({ opt, index }));

      for (let i = optionsWithIndex.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [optionsWithIndex[i], optionsWithIndex[j]] = [optionsWithIndex[j], optionsWithIndex[i]];
      }

      const newAnswerIndex = optionsWithIndex.findIndex(item => item.index === q.answer);

      return {
        ...q,
        options: optionsWithIndex.map(item => item.opt),
        answer: newAnswerIndex
      };
    });

    setSelectedTestId(testId);
    setActiveQuestions(shuffledQuestions);
    setCurrentQ(0);
    setScore(0);
    setShowResult(false);
    setSelected(null);
    setCategoryScores({});
    setUserAnswers([]);
  };

  const handleNext = () => {
    if (selected === null) return;

    const currentQuestion = activeQuestions[currentQ];
    const isCorrect = selected === currentQuestion.answer;

    const newAnswers = [...userAnswers];
    newAnswers[currentQ] = selected;
    setUserAnswers(newAnswers);

    let nextScore = score;
    const nextCategoryScores = { ...categoryScores };

    if (isCorrect) {
      nextScore = score + 1;
      setScore(nextScore);
      nextCategoryScores[currentQuestion.category] = (nextCategoryScores[currentQuestion.category] || 0) + 1;
      setCategoryScores(nextCategoryScores);
    } else {
      nextCategoryScores[currentQuestion.category] = nextCategoryScores[currentQuestion.category] || 0;
      setCategoryScores(nextCategoryScores);
    }

    if (currentQ < activeQuestions.length - 1) {
      setCurrentQ(prev => prev + 1);
      setSelected(null);
    } else {
      setShowResult(true);

      // Save to memory
      if (selectedTestId) {
        const totalQ = activeQuestions.length;
        const correctCount = nextScore;
        const incorrectCount = totalQ - nextScore;
        const percentage = Math.round((correctCount / totalQ) * 100);
        const meta = testsMetadata[selectedTestId];

        const record: TestHistoryRecord = {
          id: Date.now().toString(),
          testId: selectedTestId,
          testTitle: meta.title,
          date: new Date().toLocaleDateString('es-CL', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          timestamp: Date.now(),
          score: nextScore,
          total: totalQ,
          correctCount,
          incorrectCount,
          percentage
        };

        saveHistoryRecord(record);
      }
    }
  };

  const restartCurrentTest = () => {
    if (selectedTestId) {
      startTest(selectedTestId);
    }
  };

  const returnToHub = () => {
    setSelectedTestId(null);
    setActiveQuestions([]);
    setCurrentQ(0);
    setScore(0);
    setShowResult(false);
    setSelected(null);
    setCategoryScores({});
    setUserAnswers([]);
  };

  // Calculations for results view (Correcta vs Incorrecta, non-dichotomous percentage)
  const categoryTotals = activeQuestions.reduce((acc, q) => {
    acc[q.category] = (acc[q.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const breakdownData = Object.keys(categoryTotals).map(cat => {
    const total = categoryTotals[cat];
    const correct = categoryScores[cat] || 0;
    const isFullyCorrect = correct === total;
    return {
      category: cat,
      total,
      correct,
      incorrect: total - correct,
      isCorrect: isFullyCorrect
    };
  });

  const areasToImprove = breakdownData.filter(d => !d.isCorrect);
  const totalPercentage = activeQuestions.length > 0 ? Math.round((score / activeQuestions.length) * 100) : 0;
  const currentTestMeta = selectedTestId ? testsMetadata[selectedTestId] : null;

  // Find last attempt for each test in history
  const getLastAttempt = (testId: TestId) => {
    return history.find(h => h.testId === testId);
  };

  // Helper to draw rounded rectangle safely in any canvas context
  const drawCardRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ) => {
    if (typeof (ctx as any).roundRect === 'function') {
      (ctx as any).roundRect(x, y, w, h, r);
    } else {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    }
  };

  // Generate and download image of the diagnostic scorecard
  const downloadScorecardImage = () => {
    if (!currentTestMeta) return;
    setIsDownloading(true);

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = 1080;
      const height = 1350;
      canvas.width = width;
      canvas.height = height;

      const isDark = theme === 'dark';
      const bgColor = isDark ? '#1a1a1a' : '#ffffff';
      const cardBg = isDark ? '#242424' : '#f8f8f8';
      const textColor = isDark ? '#e8e8e8' : '#333333';
      const textMuted = isDark ? '#aaaaaa' : '#6b6b6b';

      // Background
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);

      // Header Gradient
      const grad = ctx.createLinearGradient(0, 0, width, 240);
      grad.addColorStop(0, '#ff851d');
      grad.addColorStop(0.5, '#f34551');
      grad.addColorStop(1, '#ef375c');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, 230);

      // Brand Logo
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px "Ubuntu", sans-serif';
      ctx.fillText('AvanzaSmart', 60, 80);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = 'bold 16px "Arimo", sans-serif';
      ctx.fillText('DIAGNÓSTICO ESTRATÉGICO Y OPERATIVO', 60, 115);

      // Test Title in Header
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 32px "Ubuntu", sans-serif';
      ctx.fillText(currentTestMeta.title, 60, 180);

      // Card with main result
      ctx.fillStyle = cardBg;
      ctx.beginPath();
      drawCardRect(ctx, 60, 270, width - 120, 240, 24);
      ctx.fill();

      // Score Stat Box - Correctas
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 64px "Ubuntu", sans-serif';
      ctx.fillText(`${score}`, 100, 370);
      ctx.font = 'bold 18px "Arimo", sans-serif';
      ctx.fillText('RESPUESTAS CORRECTAS', 100, 410);

      // Score Stat Box - Incorrectas
      ctx.fillStyle = score === activeQuestions.length ? '#10b981' : '#f34551';
      ctx.font = 'bold 64px "Ubuntu", sans-serif';
      ctx.fillText(`${activeQuestions.length - score}`, 450, 370);
      ctx.font = 'bold 18px "Arimo", sans-serif';
      ctx.fillText('RESPUESTAS INCORRECTAS', 450, 410);

      // Score Stat Box - Porcentaje General
      ctx.fillStyle = '#ff851d';
      ctx.font = 'bold 64px "Ubuntu", sans-serif';
      ctx.fillText(`${totalPercentage}%`, 780, 370);
      ctx.font = 'bold 18px "Arimo", sans-serif';
      ctx.fillText('LOGRO GENERAL', 780, 410);

      // Subtitle for Breakdown
      ctx.fillStyle = textColor;
      ctx.font = 'bold 26px "Ubuntu", sans-serif';
      ctx.fillText('Desglose de Áreas Evaluadas', 60, 560);

      // List evaluated categories
      let y = 610;
      breakdownData.slice(0, 7).forEach((item) => {
        ctx.fillStyle = cardBg;
        ctx.beginPath();
        drawCardRect(ctx, 60, y, width - 120, 70, 14);
        ctx.fill();

        // Status badge
        if (item.isCorrect) {
          ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
          ctx.beginPath();
          drawCardRect(ctx, 80, y + 15, 130, 40, 20);
          ctx.fill();

          ctx.fillStyle = '#059669';
          ctx.font = 'bold 14px "Ubuntu", sans-serif';
          ctx.fillText('✓ CORRECTA', 98, y + 40);
        } else {
          ctx.fillStyle = 'rgba(243, 69, 81, 0.15)';
          ctx.beginPath();
          drawCardRect(ctx, 80, y + 15, 140, 40, 20);
          ctx.fill();

          ctx.fillStyle = '#dc2626';
          ctx.font = 'bold 14px "Ubuntu", sans-serif';
          ctx.fillText('✗ INCORRECTA', 96, y + 40);
        }

        // Category name
        ctx.fillStyle = textColor;
        ctx.font = 'bold 20px "Arimo", sans-serif';
        ctx.fillText(item.category, 240, y + 42);

        // Counter
        ctx.fillStyle = textMuted;
        ctx.font = '16px "Arimo", sans-serif';
        ctx.fillText(`${item.correct} de ${item.total} aciertos`, width - 260, y + 42);

        y += 85;
      });

      // Key recommendation box
      if (areasToImprove.length > 0) {
        ctx.fillStyle = isDark ? '#2e2518' : '#fff7ed';
        ctx.beginPath();
        drawCardRect(ctx, 60, y + 20, width - 120, 110, 16);
        ctx.fill();

        ctx.strokeStyle = '#fed7aa';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#c2410c';
        ctx.font = 'bold 15px "Ubuntu", sans-serif';
        ctx.fillText('ÁREA PRINCIPAL A REFORZAR:', 85, y + 55);

        const recText = categoryRecommendations[areasToImprove[0].category] || 'Repasar los fundamentos de la metodología.';
        ctx.fillStyle = textColor;
        ctx.font = '15px "Arimo", sans-serif';
        ctx.fillText(recText.slice(0, 100) + '...', 85, y + 90);
      }

      // Footer
      const now = new Date().toLocaleDateString('es-CL', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
      ctx.fillStyle = textMuted;
      ctx.font = '14px "Arimo", sans-serif';
      ctx.fillText(`Evaluación registrada el ${now} • AvanzaSmart Standard`, 60, height - 50);

      // Download trigger
      const link = document.createElement('a');
      link.download = `Resultado-${currentTestMeta.shortTitle.replace(/\s+/g, '_')}-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Error generating scorecard image', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-subtle)] text-[var(--text)] flex flex-col justify-between py-6 px-4 sm:px-6 transition-colors duration-200">
      
      {/* Top Bar with Brand, History and Direct Light/Dark Toggle (No "Sistema") */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between pb-4">
        <div className="flex items-center gap-2 cursor-pointer" onClick={returnToHub}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-sm" style={{ background: 'var(--gradient-primary)' }}>
            <span className="font-bold text-xs font-['Ubuntu']">A</span>
          </div>
          <span className="font-['Ubuntu'] font-bold text-lg tracking-tight text-[var(--gray)] dark:text-[var(--text)]">
            Avanza<span className="gradient-text">Smart</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* History button if memory exists */}
          {history.length > 0 && (
            <button
              onClick={() => setShowHistoryModal(true)}
              className="inline-flex items-center gap-1.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-full px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] shadow-sm hover:shadow-md transition-all cursor-pointer"
              title="Ver memoria de tests realizados"
            >
              <History className="w-3.5 h-3.5 text-[var(--orange)]" />
              <span className="hidden sm:inline">Historial</span>
              <span className="px-1.5 py-0.2 rounded-full bg-[var(--gradient-soft)] text-[var(--red)] font-bold text-[10px]">
                {history.length}
              </span>
            </button>
          )}

          {/* Toggle Light / Dark ONLY (no 'sistema') */}
          <button
            onClick={toggleTheme}
            className="inline-flex items-center gap-1.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-full px-3.5 py-1.5 text-xs font-semibold text-[var(--text-secondary)] shadow-sm hover:shadow-md transition-all cursor-pointer"
            aria-label="Cambiar tema claro u oscuro"
          >
            {theme === 'light' ? (
              <>
                <Moon className="w-3.5 h-3.5 text-[var(--gray)]" />
                <span>Modo Oscuro</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-[var(--orange)]" />
                <span>Modo Claro</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className={`w-full mx-auto my-auto ${
        selectedTestId === null 
          ? 'max-w-5xl' 
          : showResult 
            ? 'max-w-5xl' 
            : 'max-w-4xl'
      } bg-[var(--bg-card)] rounded-[var(--radius-lg)] shadow-[var(--shadow-card)] border border-[var(--border)] p-6 md:p-10 transition-all duration-300`}>

        {/* ======================================================== */}
        {/* PANTALLA 1: HUB PRINCIPAL (CON MEMORIA EN NAVEGADOR)     */}
        {/* ======================================================== */}
        {selectedTestId === null && (
          <div className="flex flex-col h-full justify-between flex-grow">
            
            {/* Header del Hub */}
            <div className="text-center max-w-2xl mx-auto mb-8 md:mb-12">
              <div className="inline-block bg-[var(--gradient-primary)] text-white text-[10px] font-bold tracking-[0.1em] uppercase px-3.5 py-1.5 rounded-full mb-4 shadow-[var(--shadow-btn)]">
                Plataforma de Diagnóstico
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-['Ubuntu'] font-bold text-[var(--gray)] dark:text-[var(--text)] tracking-tight mb-3">
                Diagnóstico y <span className="gradient-text">Simulación</span>
              </h1>

              <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed font-['Arimo']">
                Evalúa tu alineación operativa con la metodología diaria, cultura de equipo y técnicas de ventas. Tus resultados se guardan automáticamente en tu navegador.
              </p>
            </div>

            {/* Grid con las 4 Tarjetas estilo AvanzaSmart */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              
              {/* Tarjeta 1: ClickUp */}
              <div className="group rounded-[var(--radius-lg)] bg-[var(--bg-card)] border border-[var(--border)] shadow-[var(--shadow-card)] overflow-hidden flex flex-col justify-between hover:shadow-[var(--shadow-lg)] hover:-translate-y-1 transition-all duration-200">
                <div>
                  <div
                    className="h-24 relative flex items-center justify-between px-5"
                    style={{ background: 'var(--gradient-sunset)' }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-sm">
                      <CheckSquare className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/90 text-[var(--red)] shadow-sm">
                      {testsMetadata.clickup.badge}
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="font-['Ubuntu'] font-bold text-lg text-[var(--gray)] dark:text-[var(--text)] mb-1 group-hover:text-[var(--red)] transition-colors">
                      {testsMetadata.clickup.title}
                    </h3>
                    <p className="text-xs font-semibold text-[var(--orange)] mb-2.5">
                      {testsMetadata.clickup.tagline}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
                      {testsMetadata.clickup.description}
                    </p>

                    {/* Memoria de último intento guardado */}
                    {getLastAttempt('clickup') ? (
                      <div className="p-2.5 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border)] mb-3 flex items-center justify-between text-xs">
                        <span className="text-[var(--text-muted)]">Último resultado:</span>
                        <span className="font-bold text-[var(--red)]">
                          {getLastAttempt('clickup')?.correctCount}/{getLastAttempt('clickup')?.total} Correctas ({getLastAttempt('clickup')?.percentage}%)
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2 text-[11px] font-medium text-[var(--text-muted)] mb-3">
                        <span className="flex items-center gap-1 bg-[var(--bg-subtle)] px-2.5 py-1 rounded-full border border-[var(--border)]">
                          <Clock className="w-3 h-3 text-[var(--orange)]" /> {testsMetadata.clickup.estimatedTime}
                        </span>
                        <span className="flex items-center gap-1 bg-[var(--bg-subtle)] px-2.5 py-1 rounded-full border border-[var(--border)]">
                          <Layers className="w-3 h-3 text-[var(--red)]" /> 10 preguntas
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => startTest('clickup')}
                    className="w-full py-3 px-4 avanza-btn-primary flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer"
                  >
                    <span>{getLastAttempt('clickup') ? 'Repetir Test' : 'Comenzar Test'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Tarjeta 2: Valores Medulares */}
              <div className="group rounded-[var(--radius-lg)] bg-[var(--bg-card)] border border-[var(--border)] shadow-[var(--shadow-card)] overflow-hidden flex flex-col justify-between hover:shadow-[var(--shadow-lg)] hover:-translate-y-1 transition-all duration-200">
                <div>
                  <div
                    className="h-24 relative flex items-center justify-between px-5"
                    style={{ background: 'var(--gradient-hot)' }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-sm">
                      <Compass className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/90 text-[var(--pink)] shadow-sm">
                      {testsMetadata.core_values.badge}
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="font-['Ubuntu'] font-bold text-lg text-[var(--gray)] dark:text-[var(--text)] mb-1 group-hover:text-[var(--pink)] transition-colors">
                      {testsMetadata.core_values.title}
                    </h3>
                    <p className="text-xs font-semibold text-[var(--pink)] mb-2.5">
                      {testsMetadata.core_values.tagline}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
                      {testsMetadata.core_values.description}
                    </p>

                    {/* Memoria de último intento guardado */}
                    {getLastAttempt('core_values') ? (
                      <div className="p-2.5 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border)] mb-3 flex items-center justify-between text-xs">
                        <span className="text-[var(--text-muted)]">Último resultado:</span>
                        <span className="font-bold text-[var(--pink)]">
                          {getLastAttempt('core_values')?.correctCount}/{getLastAttempt('core_values')?.total} Correctas ({getLastAttempt('core_values')?.percentage}%)
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2 text-[11px] font-medium text-[var(--text-muted)] mb-3">
                        <span className="flex items-center gap-1 bg-[var(--bg-subtle)] px-2.5 py-1 rounded-full border border-[var(--border)]">
                          <Clock className="w-3 h-3 text-[var(--red)]" /> {testsMetadata.core_values.estimatedTime}
                        </span>
                        <span className="flex items-center gap-1 bg-[var(--bg-subtle)] px-2.5 py-1 rounded-full border border-[var(--border)]">
                          <Layers className="w-3 h-3 text-[var(--pink)]" /> 10 preguntas
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => startTest('core_values')}
                    className="w-full py-3 px-4 avanza-btn-primary flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer"
                  >
                    <span>{getLastAttempt('core_values') ? 'Repetir Test' : 'Comenzar Test'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Tarjeta 4: Metodología de Trabajo */}
              <div className="group rounded-[var(--radius-lg)] bg-[var(--bg-card)] border border-[var(--border)] shadow-[var(--shadow-card)] overflow-hidden flex flex-col justify-between hover:shadow-[var(--shadow-lg)] hover:-translate-y-1 transition-all duration-200">
                <div>
                  <div
                    className="h-24 relative flex items-center justify-between px-5"
                    style={{ background: 'linear-gradient(135deg, #6366f1 0%, #ef375c 100%)' }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-sm">
                      <Layers className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/90 text-[var(--red)] shadow-sm">
                      {testsMetadata.work_methodology.badge}
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="font-['Ubuntu'] font-bold text-lg text-[var(--gray)] dark:text-[var(--text)] mb-1 group-hover:text-[var(--red)] transition-colors">
                      {testsMetadata.work_methodology.title}
                    </h3>
                    <p className="text-xs font-semibold mb-2.5" style={{ color: '#6366f1' }}>
                      {testsMetadata.work_methodology.tagline}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
                      {testsMetadata.work_methodology.description}
                    </p>

                    {getLastAttempt('work_methodology') ? (
                      <div className="p-2.5 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border)] mb-3 flex items-center justify-between text-xs">
                        <span className="text-[var(--text-muted)]">Último resultado:</span>
                        <span className="font-bold text-[var(--red)]">
                          {getLastAttempt('work_methodology')?.correctCount}/{getLastAttempt('work_methodology')?.total} Correctas ({getLastAttempt('work_methodology')?.percentage}%)
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2 text-[11px] font-medium text-[var(--text-muted)] mb-3">
                        <span className="flex items-center gap-1 bg-[var(--bg-subtle)] px-2.5 py-1 rounded-full border border-[var(--border)]">
                          <Clock className="w-3 h-3" style={{ color: '#6366f1' }} /> {testsMetadata.work_methodology.estimatedTime}
                        </span>
                        <span className="flex items-center gap-1 bg-[var(--bg-subtle)] px-2.5 py-1 rounded-full border border-[var(--border)]">
                          <Layers className="w-3 h-3 text-[var(--red)]" /> 10 preguntas
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => startTest('work_methodology')}
                    className="w-full py-3 px-4 avanza-btn-primary flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer"
                  >
                    <span>{getLastAttempt('work_methodology') ? 'Repetir Test' : 'Comenzar Test'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Tarjeta 3: Ventas por WhatsApp */}
              <div className="group rounded-[var(--radius-lg)] bg-[var(--bg-card)] border border-[var(--border)] shadow-[var(--shadow-card)] overflow-hidden flex flex-col justify-between hover:shadow-[var(--shadow-lg)] hover:-translate-y-1 transition-all duration-200">
                <div>
                  <div
                    className="h-24 relative flex items-center justify-between px-5"
                    style={{ background: 'var(--gradient-primary)' }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-sm">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/90 text-[var(--red)] shadow-sm">
                      {testsMetadata.sales.badge}
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="font-['Ubuntu'] font-bold text-lg text-[var(--gray)] dark:text-[var(--text)] mb-1 group-hover:text-[var(--red)] transition-colors">
                      {testsMetadata.sales.title}
                    </h3>
                    <p className="text-xs font-semibold text-[var(--orange)] mb-2.5">
                      {testsMetadata.sales.tagline}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
                      {testsMetadata.sales.description}
                    </p>

                    {/* Memoria de último intento guardado */}
                    {getLastAttempt('sales') ? (
                      <div className="p-2.5 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border)] mb-3 flex items-center justify-between text-xs">
                        <span className="text-[var(--text-muted)]">Último resultado:</span>
                        <span className="font-bold text-[var(--orange)]">
                          {getLastAttempt('sales')?.correctCount}/{getLastAttempt('sales')?.total} Correctas ({getLastAttempt('sales')?.percentage}%)
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2 text-[11px] font-medium text-[var(--text-muted)] mb-3">
                        <span className="flex items-center gap-1 bg-[var(--bg-subtle)] px-2.5 py-1 rounded-full border border-[var(--border)]">
                          <Clock className="w-3 h-3 text-[var(--orange)]" /> {testsMetadata.sales.estimatedTime}
                        </span>
                        <span className="flex items-center gap-1 bg-[var(--bg-subtle)] px-2.5 py-1 rounded-full border border-[var(--border)]">
                          <Layers className="w-3 h-3 text-[var(--red)]" /> 10 preguntas
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => startTest('sales')}
                    className="w-full py-3 px-4 avanza-btn-primary flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer"
                  >
                    <span>{getLastAttempt('sales') ? 'Repetir Test' : 'Comenzar Test'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

            {/* Banner de Memoria en el Navegador */}
            {history.length > 0 && (
              <div className="p-4 rounded-[var(--radius-md)] bg-[var(--bg-subtle)] border border-[var(--border)] flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                  <History className="w-4 h-4 text-[var(--orange)]" />
                  <span>Tienes <strong>{history.length} evaluaciones</strong> registradas en la memoria de este navegador.</span>
                </div>
                <button
                  onClick={() => setShowHistoryModal(true)}
                  className="text-xs font-bold text-[var(--red)] hover:underline cursor-pointer"
                >
                  Ver Historial
                </button>
              </div>
            )}

          </div>
        )}

        {/* ======================================================== */}
        {/* PANTALLA 2: EJECUCIÓN DEL TEST (PREGUNTAS)              */}
        {/* ======================================================== */}
        {selectedTestId !== null && !showResult && activeQuestions.length > 0 && (
          <div className="flex flex-col h-full justify-between flex-grow">
            
            {/* Header del Test */}
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--border)]">
                <button
                  onClick={returnToHub}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--red)] transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Volver al Selector</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[var(--bg-subtle)] text-[var(--red)] border border-[var(--border)]">
                    {currentTestMeta?.shortTitle}
                  </span>
                </div>
              </div>

              {/* Barra de Progreso */}
              <div className="mb-6">
                <div className="flex justify-between items-center text-xs font-bold mb-2">
                  <span className="text-[var(--text-muted)] uppercase tracking-wider text-[10px]">
                    Pregunta {currentQ + 1} de {activeQuestions.length}
                  </span>
                  <span className="font-['Ubuntu'] font-bold text-[var(--text)]">
                    {Math.round(((currentQ + 1) / activeQuestions.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-[var(--bg-subtle)] h-2 rounded-full overflow-hidden border border-[var(--border)]">
                  <div
                    className="h-full transition-all duration-300 rounded-full"
                    style={{
                      width: `${((currentQ + 1) / activeQuestions.length) * 100}%`,
                      background: 'var(--gradient-primary)'
                    }}
                  />
                </div>
              </div>

              {/* Categoría & Pregunta */}
              <div className="mb-6">
                <p className="text-[10px] font-bold tracking-[0.1em] uppercase gradient-text mb-2 font-['Ubuntu'] flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-[var(--orange)]" />
                  {activeQuestions[currentQ].category}
                </p>

                <h2 className="text-xl sm:text-2xl md:text-[25px] font-['Ubuntu'] font-bold text-[var(--gray)] dark:text-[var(--text)] leading-snug">
                  {activeQuestions[currentQ].question}
                </h2>
              </div>
            </div>

            {/* Opciones de Respuesta */}
            <div className="space-y-3 my-3">
              {activeQuestions[currentQ].options.map((option, idx) => {
                const isSelected = selected === idx;
                const letter = String.fromCharCode(65 + idx);

                return (
                  <button
                    key={idx}
                    onClick={() => setSelected(idx)}
                    className={`w-full text-left p-4 sm:p-5 rounded-[var(--radius-md)] border transition-all flex items-start gap-4 cursor-pointer ${
                      isSelected
                        ? 'border-[var(--red)] bg-[var(--gradient-soft)] shadow-[var(--shadow-glow)]'
                        : 'border-[var(--border)] bg-[var(--bg-card)] hover:border-[rgba(239,55,92,0.3)] hover:bg-[var(--bg-subtle)]'
                    }`}
                  >
                    <span
                      className={`flex-shrink-0 w-8 h-8 rounded-full font-['Ubuntu'] font-bold flex items-center justify-center text-xs transition-colors ${
                        isSelected
                          ? 'bg-[var(--gradient-primary)] text-white shadow-sm'
                          : 'bg-[var(--bg-subtle)] border border-[var(--border)] text-[var(--text-secondary)]'
                      }`}
                    >
                      {letter}
                    </span>
                    <span
                      className={`text-sm sm:text-base leading-relaxed pt-0.5 font-['Arimo'] ${
                        isSelected
                          ? 'text-[var(--gray)] dark:text-[var(--text)] font-bold'
                          : 'text-[var(--text)]'
                      }`}
                    >
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Footer con Botón Siguiente */}
            <div className="pt-6 mt-4 border-t border-[var(--border)] flex items-center justify-between">
              <span className="text-xs text-[var(--text-muted)] hidden sm:inline">
                {selected !== null ? 'Opción seleccionada • Pulsa para continuar' : 'Selecciona una respuesta para continuar'}
              </span>

              <button
                disabled={selected === null}
                onClick={handleNext}
                className={`w-full sm:w-auto ml-auto py-3 px-8 rounded-full font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  selected === null
                    ? 'opacity-40 bg-[var(--bg-subtle)] text-[var(--text-muted)] border border-[var(--border)] cursor-not-allowed'
                    : 'avanza-btn-primary'
                }`}
              >
                <span>{currentQ < activeQuestions.length - 1 ? 'Siguiente Pregunta' : 'Finalizar y Ver Diagnóstico'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* PANTALLA 3: RESULTADOS (CORRECTA / INCORRECTA Y DESCARGA) */}
        {/* ======================================================== */}
        {selectedTestId !== null && showResult && (
          <div className="flex flex-col h-full flex-grow">
            
            {/* Header del Resultado */}
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border)] mb-6">
              <button
                onClick={returnToHub}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--red)] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Selector de Tests</span>
              </button>

              <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[var(--gradient-soft)] text-[var(--red)] border border-[var(--border)]">
                {currentTestMeta?.title}
              </span>
            </div>

            {/* Resumen Principal de Logro estilo AvanzaSmart Hero */}
            <div className="relative rounded-[var(--radius-lg)] p-6 sm:p-8 text-center mb-8 overflow-hidden text-white shadow-[var(--shadow-lg)]" style={{ background: 'var(--gradient-sunset)' }}>
              <div className="relative z-10 max-w-xl mx-auto">
                <div className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest text-white mb-3 border border-white/30">
                  Diagnóstico Guardado en Memoria
                </div>

                <h2 className="text-2xl sm:text-3xl font-['Ubuntu'] font-bold mb-4">
                  {totalPercentage === 100
                    ? '¡Dominio Metodológico Total!'
                    : totalPercentage >= 80
                      ? '¡Desempeño Destacado!'
                      : totalPercentage >= 60
                        ? 'En Proceso de Alineación'
                        : 'Requiere Refuerzo Metodológico'}
                </h2>

                {/* Score Cards no dicotómicos: Muestra Correctas e Incorrectas claramente */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4">
                  <div className="p-3.5 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20">
                    <div className="font-['Ubuntu'] font-bold text-3xl sm:text-4xl text-white">
                      {score}
                    </div>
                    <div className="text-[11px] uppercase tracking-wider font-semibold text-white/90 mt-1">
                      Correctas
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20">
                    <div className="font-['Ubuntu'] font-bold text-3xl sm:text-4xl text-white">
                      {activeQuestions.length - score}
                    </div>
                    <div className="text-[11px] uppercase tracking-wider font-semibold text-white/90 mt-1">
                      Incorrectas
                    </div>
                  </div>

                  <div className="col-span-2 sm:col-span-1 p-3.5 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20">
                    <div className="font-['Ubuntu'] font-bold text-3xl sm:text-4xl text-white">
                      {totalPercentage}%
                    </div>
                    <div className="text-[11px] uppercase tracking-wider font-semibold text-white/90 mt-1">
                      Logro Total
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-white/90 mt-2">
                  Tu resultado ha quedado registrado en tu navegador para comparar tu progreso.
                </p>
              </div>
            </div>

            {/* Desglose de Áreas: Se muestra como "Correcta" o "Incorrecta" (sin porcentajes dicotómicos 0%/100%) */}
            <div className="bg-[var(--bg-subtle)] rounded-[var(--radius-lg)] p-6 sm:p-8 mb-8 border border-[var(--border)] shadow-[var(--shadow-sm)]">
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-[var(--orange)]" />
                  <h3 className="font-['Ubuntu'] font-bold text-base sm:text-lg text-[var(--gray)] dark:text-[var(--text)]">
                    Estado por Área Evaluada
                  </h3>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider gradient-text font-['Ubuntu']">
                  Diagnóstico Cualitativo
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {breakdownData.map((item, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-[var(--radius-md)] border flex items-center justify-between transition-all ${
                      item.isCorrect
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40'
                        : 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/40'
                    }`}
                  >
                    <div>
                      <span className="font-['Ubuntu'] font-bold text-sm text-[var(--gray)] dark:text-[var(--text)] block mb-0.5">
                        {item.category}
                      </span>
                      <span className="text-xs text-[var(--text-muted)] font-['Arimo']">
                        {item.correct} de {item.total} aciertos en este bloque
                      </span>
                    </div>

                    <div>
                      {item.isCorrect ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                          <Check className="w-3.5 h-3.5 text-emerald-600" /> Correcta
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300">
                          <X className="w-3.5 h-3.5 text-rose-600" /> Incorrecta
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Botón directo de Repetir justo debajo del estado */}
              <div className="mt-6 pt-5 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-[var(--text-secondary)]">
                  ¿Deseas mejorar las respuestas incorrectas de este test?
                </span>
                <button
                  onClick={restartCurrentTest}
                  className="py-2.5 px-6 avanza-btn-warm text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Repetir este Test Ahora</span>
                </button>
              </div>
            </div>

            {/* Diagnóstico y Recomendaciones Tácticas */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-[var(--orange)]" />
                <h3 className="font-['Ubuntu'] font-bold text-base sm:text-lg text-[var(--gray)] dark:text-[var(--text)]">
                  Recomendaciones para las Respuestas Incorrectas
                </h3>
              </div>

              {areasToImprove.length === 0 ? (
                <div className="p-5 rounded-[var(--radius-md)] bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-['Ubuntu'] font-bold text-sm text-emerald-900 dark:text-emerald-300 mb-1">
                      ¡100% de Aciertos!
                    </h4>
                    <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-400 leading-relaxed font-['Arimo']">
                      No tienes ninguna respuesta incorrecta. Tu comprensión de este módulo es sólida y precisa.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {areasToImprove.map((item, index) => {
                    const rec = categoryRecommendations[item.category] || "Refuerza los principios fundamentales repasando el contenido metodológico.";
                    return (
                      <div
                        key={index}
                        className="p-5 rounded-[var(--radius-md)] bg-[var(--bg-card)] border border-[var(--border)] shadow-[var(--shadow-card)] flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--red)] font-['Ubuntu']">
                              Área a Reforzar: {item.category}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300">
                              Incorrecta
                            </span>
                          </div>
                          <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-['Arimo']">
                            {rec}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Revisión detallada de Errores */}
            {score < activeQuestions.length && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-[var(--red)]" />
                  <h3 className="font-['Ubuntu'] font-bold text-base sm:text-lg text-[var(--gray)] dark:text-[var(--text)]">
                    Revisión de Respuestas Incorrectas y Fundamento
                  </h3>
                </div>

                <div className="space-y-4">
                  {activeQuestions.map((q, qIndex) => {
                    const userChoice = userAnswers[qIndex];
                    if (userChoice === q.answer) return null;

                    return (
                      <div
                        key={qIndex}
                        className="p-5 rounded-[var(--radius-md)] bg-[var(--bg-card)] border border-[rgba(243,69,81,0.25)] shadow-[var(--shadow-sm)] space-y-3"
                      >
                        <div className="flex items-center gap-2 text-xs font-bold text-[var(--red)]">
                          <X className="w-4 h-4" />
                          <span>Pregunta {qIndex + 1} • {q.category}</span>
                        </div>

                        <h4 className="text-sm sm:text-base font-['Ubuntu'] font-bold text-[var(--gray)] dark:text-[var(--text)]">
                          {q.question}
                        </h4>

                        <div className="space-y-2 text-xs sm:text-sm font-['Arimo']">
                          <div className="p-3 rounded-lg bg-[rgba(243,69,81,0.06)] border border-[rgba(243,69,81,0.15)] text-[var(--red)]">
                            <strong>Tu respuesta:</strong> {userChoice !== null && userChoice !== undefined ? q.options[userChoice] : 'Sin responder'}
                          </div>

                          <div className="p-3 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-300">
                            <div className="flex items-center gap-1.5 font-bold mb-1">
                              <Check className="w-4 h-4 text-emerald-600" />
                              <span>Respuesta correcta:</span>
                            </div>
                            <p className="mb-2 font-semibold">{q.options[q.answer]}</p>
                            <div className="text-xs text-emerald-800 dark:text-emerald-400/90 pt-2 border-t border-emerald-200/60 dark:border-emerald-800/40 leading-relaxed">
                              <strong>Fundamento:</strong> {q.recommendation}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Botones de Acción al Final (Descargar Imagen, Repetir y Volver) */}
            <div className="pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={returnToHub}
                className="w-full sm:w-auto py-3 px-6 rounded-full font-bold text-xs uppercase tracking-wider avanza-btn-ghost border border-[var(--border)] flex items-center justify-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Elegir otro Test</span>
              </button>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                {/* Botón Descargar Imagen */}
                <button
                  disabled={isDownloading}
                  onClick={downloadScorecardImage}
                  className="w-full sm:w-auto py-3 px-6 rounded-full font-bold text-xs uppercase tracking-wider avanza-btn-outline flex items-center justify-center gap-2 cursor-pointer hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>{isDownloading ? 'Generando...' : 'Descargar en Imagen'}</span>
                </button>

                {/* Botón Repetir Test */}
                <button
                  onClick={restartCurrentTest}
                  className="w-full sm:w-auto py-3 px-8 avanza-btn-primary flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Repetir este Test</span>
                </button>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Modal de Historial en Memoria del Navegador */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--bg-card)] rounded-[var(--radius-lg)] border border-[var(--border)] shadow-[var(--shadow-lg)] max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="p-5 border-b border-[var(--border)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-[var(--orange)]" />
                <h3 className="font-['Ubuntu'] font-bold text-lg text-[var(--gray)] dark:text-[var(--text)]">
                  Historial Guardado en Navegador
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowHistoryModal(false);
                  setIsConfirmingClear(false);
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[var(--bg-subtle)] text-[var(--text-muted)] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-3 flex-grow">
              {history.length === 0 ? (
                <p className="text-center text-xs text-[var(--text-muted)] py-8">
                  No hay evaluaciones guardadas en este dispositivo.
                </p>
              ) : (
                history.map((record) => (
                  <div
                    key={record.id}
                    className="p-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border)] flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-['Ubuntu'] font-bold text-sm text-[var(--gray)] dark:text-[var(--text)]">
                        {record.testTitle}
                      </h4>
                      <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                        {record.date}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="font-['Ubuntu'] font-bold text-sm text-[var(--red)] block">
                        {record.correctCount}/{record.total} Correctas
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--gradient-soft)] text-[var(--red)]">
                        {record.percentage}% Logro
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-[var(--border)] bg-[var(--bg-subtle)] flex items-center justify-between">
              {history.length > 0 && !isConfirmingClear && (
                <button
                  onClick={() => setIsConfirmingClear(true)}
                  className="inline-flex items-center gap-1.5 text-xs text-rose-500 hover:text-rose-700 font-medium cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Borrar memoria</span>
                </button>
              )}

              {isConfirmingClear && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[var(--red)] font-semibold">¿Seguro?</span>
                  <button
                    onClick={handleClearHistory}
                    className="px-2.5 py-1 text-xs bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-700 cursor-pointer"
                  >
                    Sí, borrar
                  </button>
                  <button
                    onClick={() => setIsConfirmingClear(false)}
                    className="px-2.5 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              )}

              <button
                onClick={() => {
                  setShowHistoryModal(false);
                  setIsConfirmingClear(false);
                }}
                className="py-2 px-5 avanza-btn-ghost border border-[var(--border)] text-xs font-bold rounded-full ml-auto cursor-pointer"
              >
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Footer AvanzaSmart (Sin la frase 'guia de estilo light and dark') */}
      <footer className="text-center py-6">
        <p className="text-xs text-[var(--text-muted)] font-['Arimo']">
          <span className="font-['Ubuntu'] font-bold text-[var(--gray)] dark:text-[var(--text)]">Avanza<span className="gradient-text">Smart</span></span> · Diagnóstico Estratégico y Simulación
        </p>
      </footer>

    </div>
  );
}
