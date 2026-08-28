import React, { useState } from 'react';
import { 
  BookOpen, 
  Brain, 
  HelpCircle, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp, 
  ArrowUpRight,
  CheckCircle,
  GraduationCap
} from 'lucide-react';

interface LandingPageProps {
  onStartRevision: () => void;
  onOpenChat: () => void;
  masteredCount: number;
  totalChapters: number;
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onStartRevision, 
  onOpenChat,
  masteredCount,
  totalChapters
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const progressPercentage = totalChapters > 0 ? Math.round((masteredCount / totalChapters) * 100) : 0;

  const faqs = [
    {
      question: "Pourquoi le tuteur socratique est-il si direct et sans civilités ?",
      answer: "L'efficacité et la rigueur scientifique sont privilégiées. Les formules de politesse répétitives ('bonjour', 'comment puis-je vous aider aujourd'hui') sont désactivées pour se concentrer exclusivement sur la structure logique de votre démarche et vous guider pas à pas sans distraction."
    },
    {
      question: "Où sont stockées ma progression et ma clé API ?",
      answer: "Toutes vos données (le statut de maîtrise des chapitres, vos réponses aux QCM et votre clé d'API Gemini) sont sauvegardées localement et en toute confidentialité dans le stockage interne de votre propre navigateur (localStorage). Aucun serveur externe ne conserve vos informations."
    },
    {
      question: "Pourquoi l'exportation de fiches PDF peut-elle échouer dans l'iFrame ?",
      answer: "Si vous utilisez l'application au sein de la console de test de développement, la politique de sécurité de l'iFrame navigateur bloque parfois les téléchargements de fichiers PDF générés localement. Pour que les fiches se téléchargent instantanément sans aucune entrave, ouvrez simplement l'application dans son propre onglet autonome."
    },
    {
      question: "Comment fonctionne l'intercepteur de navigation mobile ?",
      answer: "Sur smartphone et en mode PWA, l'utilisation du bouton physique ou du geste 'Retour' ne ferme pas brutalement l'application. Le système fermera séquentiellement le chatbot d'explication ou l'exercice de révision actif afin de protéger vos progrès en cours."
    }
  ];

  return (
    <div className="space-y-12 py-4 animate-in fade-in duration-500">
      
      {/* SECTION EN-TÊTE ÉPURÉE */}
      <section className="relative overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-b from-gray-900 to-gray-950 p-6 sm:p-10">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-2xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400">
            <GraduationCap size={14} />
            Espace d'entraînement privé
          </div>
          
          <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight">
            Plateforme de Révision &amp; d'Auto-évaluation
          </h1>
          
          <p className="text-sm sm:text-base text-gray-400 font-normal leading-relaxed">
            Un outil épuré et autonome conçu sur mesure pour s'entraîner sur le syllabus officiel de Terminale D et C en Mathématiques et Physique, soutenu par un tuteur d'intelligence artificielle hautement calibré.
          </p>
        </div>
      </section>

      {/* BILAN DE PROGRESSION IMMÉDIAT */}
      <section className="border border-gray-800 bg-gray-900/10 rounded-xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Votre avancement global</h3>
            <p className="text-xs text-gray-500 mt-0.5">Pourcentage calculé sur l'ensemble des modules obligatoires du programme.</p>
          </div>
          <span className="text-base sm:text-lg font-bold text-gray-100 flex-shrink-0">
            {masteredCount} / {totalChapters} chapitres maîtrisés
          </span>
        </div>
        
        <div className="space-y-2">
          <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-green-500 rounded-full transition-all duration-500" 
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>0%</span>
            <span className="text-blue-400 font-medium">{progressPercentage}% complété</span>
            <span>100%</span>
          </div>
        </div>
      </section>

      {/* ACCÈS DIRECTS COMPACTS */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button 
          onClick={onStartRevision}
          className="group text-left p-6 bg-gray-900/20 border border-gray-800 rounded-xl hover:border-blue-500/50 hover:bg-gray-900/30 transition-all space-y-3 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20 group-hover:bg-blue-500/20 transition-all">
            <BookOpen size={20} />
          </div>
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-100 group-hover:text-blue-400 transition-colors">Consulter le programme d'exercices</h3>
            <ArrowRight size={16} className="text-gray-500 group-hover:text-blue-400 transition-all group-hover:translate-x-1" />
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            Accédez aux chapitres clés du Bénin en mathématiques et physique. Consultez les résumés de cours, démarrez des QCM interactifs ou lancez des entraînements d'examens.
          </p>
        </button>

        <button 
          onClick={onOpenChat}
          className="group text-left p-6 bg-gray-900/20 border border-gray-800 rounded-xl hover:border-green-500/50 hover:bg-gray-900/30 transition-all space-y-3 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-lg bg-green-500/10 text-green-400 flex items-center justify-center border border-green-500/20 group-hover:bg-green-500/20 transition-all">
            <Brain size={20} />
          </div>
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-100 group-hover:text-green-400 transition-colors">Activer le tuteur IA</h3>
            <ArrowUpRight size={16} className="text-gray-500 group-hover:text-green-400 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            Interrogez le tuteur socratique à tout moment par écrit ou par dictée vocale continue. Il vous guidera pour résoudre vos énoncés de physique ou de mathématiques sans donner la réponse brute.
          </p>
        </button>
      </section>

      {/* INSTRUCTIONS & CONSEILS PRATIQUES */}
      <section className="space-y-6">
        <div className="border-b border-gray-800 pb-3">
          <h2 className="text-lg font-bold text-gray-200">Conseils d'utilisation &amp; FAQ technique</h2>
          <p className="text-xs text-gray-500 mt-1">Fonctionnalités et comportements optimisés pour l'usage autonome de l'application.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className="p-5 border border-gray-800/80 bg-gray-900/10 rounded-xl space-y-2 hover:border-gray-700 transition-colors"
            >
              <h4 className="font-semibold text-sm text-gray-200 flex items-start gap-2 leading-tight">
                <HelpCircle size={15} className="text-blue-500 flex-shrink-0 mt-0.5" />
                {faq.question}
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed pl-5">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* METRIC COMPACT CARD */}
      <footer className="text-center py-6 border-t border-gray-900 text-gray-600 text-[10px] tracking-wide uppercase">
        Prépa Concours Bénin • Plateforme d'auto-formation privée libre de publicité
      </footer>

    </div>
  );
};
