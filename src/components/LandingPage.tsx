import React, { useState } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Brain, 
  Sparkles, 
  CheckCircle, 
  FileText, 
  HelpCircle, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp, 
  User, 
  Mic, 
  ArrowUpRight,
  Zap,
  Target
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

  const stats = [
    { label: "Syllabus Officiel Béninois", value: "Terminale D & C" },
    { label: "Matières Fondamentales", value: "Maths & Physique" },
    { label: "Chapitres Clés", value: `${totalChapters} Modules` },
    { label: "Votre Progression Actuelle", value: `${masteredCount} / ${totalChapters} Maîtrisés` }
  ];

  const features = [
    {
      icon: <BookOpen className="text-blue-400" size={24} />,
      title: "Fiches de Révision Ultra-Sélectives",
      description: "Des résumés synthétiques de cours sur l'électricité (circuits RC, RL, RLC), la mécanique de Newton, l'intégration, ou les nombres complexes, calqués sur le programme officiel béninois."
    },
    {
      icon: <Brain className="text-green-400" size={24} />,
      title: "QCM Interactifs d'Évaluation",
      description: "Testez vos connaissances instantanément sur chaque chapitre avec des corrections argumentées et une notation immédiate pour identifier vos angles morts."
    },
    {
      icon: <Target className="text-purple-400" size={24} />,
      title: "Mode Exercices Guidés par l'IA",
      description: "Soumettez vos énoncés de concours ou demandez des exercices types de test d'entrée. L'IA décompose les étapes sans vous donner bêtement la réponse."
    },
    {
      icon: <Mic className="text-rose-400" size={24} />,
      title: "Dictée Vocale Continue Stable",
      description: "Un chatbot d'explication directe et rapide. Dictée vocale continue de précision intégrée qui ne s'arrête pas pendant vos silences ou temps de réflexion de formulation."
    },
    {
      icon: <FileText className="text-amber-400" size={24} />,
      title: "PDF LaTeX Ultra-Légers & Haute Qualité",
      description: "Téléchargez en un clic les fiches de cours et corrigés au format PDF (JPEG optimisé, scale: 1.8). Les équations mathématiques KaTeX restent nettes et le fichier est divisé par 15 pour un partage instantané."
    },
    {
      icon: <Sparkles className="text-cyan-400" size={24} />,
      title: "Geste Retour & PWA Sécurisés",
      description: "Navigation optimisée pour les smartphones et PWA Android. Les gestes ou le bouton Retour ferment séquentiellement les fenêtres et le chatbot au lieu de quitter l'application brute."
    }
  ];

  const useCases = [
    {
      persona: "Auriol, élève en Terminale C à Cotonou",
      situation: "Prépare le concours d'entrée à l'EPAC (École Polytechnique d'Abomey-Calavi) en Mathématiques.",
      action: "Il utilise le mode exercice guidé sur les suites et l'intégration pour s'assurer de sa rapidité de calcul.",
      result: "Il exporte son bilan chaque semaine pour repérer les sous-thèmes d'intégration sur lesquels il bute encore."
    },
    {
      persona: "Sika, candidate en Terminale D à Porto-Novo",
      situation: "Souhaite intégrer la FAST (Faculté des Sciences et Techniques) pour s'orienter en Physique appliquée.",
      action: "Elle utilise la dictée vocale pour interroger le tuteur sur les lois de Newton et les circuits RLC pendant ses trajets.",
      result: "Bénéficie d'explications directes et sans détours cliniques, lui permettant de réviser deux fois plus vite."
    }
  ];

  const faqs = [
    {
      question: "Pourquoi l'IA répond-elle si directement sans civilités ?",
      answer: "L'efficacité est la clé lors de la préparation d'un concours. Les formules de politesse répétitives ('Bonjour !', 'Comment puis-je vous aider aujourd'hui ?') consomment du temps précieux et des ressources d'attention. Notre tuteur IA senior va droit au but avec une rigueur absolue."
    },
    {
      question: "Comment est structuré le programme de révision ?",
      answer: "Il couvre l'intégralité du programme officiel de Terminale D et C en Mathématiques (Suites, Limites, Intégration, Complexes, Probabilités, etc.) et en Physique (Mécanique, RLC, Optique, Physique Nucléaire, Thermodynamique), essentiels pour tous les grands concours d'entrée d'ingénieurs et de médecine."
    },
    {
      question: "La dictée vocale continue s'arrête-t-elle si je fais une pause ?",
      answer: "Non, nous avons stabilisé l'enregistrement vocal en mode continu. Vous pouvez réfléchir à haute voix et structurer de longues phrases complexes, le microphone ne se désactivera que lorsque vous cliquerez manuellement pour l'arrêter."
    },
    {
      question: "Pourquoi le téléchargement de fiches PDF peut-il sembler inactif ?",
      answer: "Si vous utilisez l'application au sein d'une iFrame (comme dans l'aperçu de la console de test de développement), les politiques de sécurité par bac à sable des iFrames des navigateurs internet bloquent parfois les téléchargements de fichiers générés localement. Pour que vos téléchargements PDF haute-fidélité s'exécutent instantanément de façon fluide, nous vous conseillons simplement d'ouvrir l'application dans son onglet autonome (bouton d'ouverture en haut à droite ou lien de partage direct)."
    },
    {
      question: "Que se passe-t-il si j'utilise le bouton Retour Android ou le geste de balayage ?",
      answer: "Nous avons implémenté un intercepteur de navigation mobile avancé. Sur smartphone, l'utilisation du bouton Retour physique ou virtuel ne rafraîchit pas la page et ne ferme pas l'application : l'action va d'abord fermer intelligemment le chatbot s'il est ouvert, ou fermer la modale d'exercice active si vous étiez en train de réviser. Un double appui rapide sur l'écran d'accueil avec un Toast d'aide est requis pour confirmer la fermeture de l'application."
    }
  ];

  return (
    <div className="space-y-16 py-4 animate-in fade-in duration-500">
      
      {/* SECTION HERO */}
      <section className="relative overflow-hidden rounded-3xl border border-gray-800 bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900/40 p-5 sm:p-12 lg:p-16">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-3xl space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] sm:text-xs font-semibold text-blue-400">
            <Sparkles size={14} className="animate-pulse" />
            L'Élite de la Préparation aux Concours Béninois
          </div>
          
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-sans leading-tight tracking-tight text-white">
            Dominez vos concours en <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-green-400">Maths & Physique</span>.
          </h1>
          
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 font-normal leading-relaxed">
            Un coach de haut niveau, sans filtres ni détours, conçu sur mesure pour propulser les lycéens de Terminale D/C vers les meilleures écoles d'ingénieurs et facultés scientifiques.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              onClick={onStartRevision}
              className="flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-900/30 transition-all transform hover:-translate-y-0.5 text-sm sm:text-base"
            >
              Accéder au Programme
              <ArrowRight size={18} />
            </button>
            <button 
              onClick={onOpenChat}
              className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-200 font-semibold rounded-xl transition-all text-sm sm:text-base"
            >
              Discuter avec le Tuteur IA
              <ArrowUpRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* STATS RAPIDES */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-gray-900/40 border border-gray-800/80 rounded-2xl p-4 sm:p-5 hover:border-gray-700 transition-all flex flex-col justify-between">
            <span className="text-[10px] sm:text-xs text-gray-500 font-bold tracking-wider uppercase leading-tight">{stat.label}</span>
            <span className="text-sm sm:text-lg lg:text-xl font-bold text-gray-100 mt-2 leading-tight">{stat.value}</span>
          </div>
        ))}
      </section>

      {/* PROPOSITION DE VALEUR */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <h2 className="text-3xl font-bold text-white tracking-tight">Transformer la Rigueur en Réussite</h2>
        <p className="text-gray-400 text-base leading-relaxed">
          Prépa Concours résout la solitude de la préparation des tests d'entrée sélectifs au Bénin (EPAC, FAST, IMSP, ENAM, etc.). Grâce à un modèle d'intelligence artificielle hautement calibré et une interface épurée, vous n'apprenez pas seulement des formules : vous apprenez à structurer votre pensée de futur ingénieur.
        </p>
      </section>

      {/* FONCTIONNALITÉS */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-white">Méthodologie Active et Complète</h3>
            <p className="text-sm text-gray-400">Cinq outils articulés pour un apprentissage complet, de l'assimilation à l'auto-évaluation.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, i) => (
            <div key={i} className="p-6 bg-gray-900/20 border border-gray-800/60 rounded-2xl space-y-4 hover:bg-gray-900/30 hover:border-gray-700 transition-all">
              <div className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center border border-gray-800/80">
                {feat.icon}
              </div>
              <h4 className="text-lg font-bold text-gray-100">{feat.title}</h4>
              <p className="text-sm text-gray-400 leading-relaxed">{feat.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CAS D'USAGE RÉELS */}
      <section className="bg-gray-900/20 border border-gray-800/50 rounded-2xl p-6 sm:p-8 space-y-8">
        <div>
          <h3 className="text-2xl font-bold text-white">Cas d'Usage Réels</h3>
          <p className="text-sm text-gray-400 mt-1">Comment les meilleurs Terminales abordent leurs révisions sur la plateforme.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {useCases.map((use, i) => (
            <div key={i} className="flex flex-col justify-between bg-gray-950/60 border border-gray-800 p-6 rounded-2xl shadow-inner">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center">
                    <User size={16} />
                  </div>
                  <span className="font-bold text-gray-100 text-sm">{use.persona}</span>
                </div>
                <p className="text-xs text-yellow-400/80 uppercase font-bold tracking-wider">Contexte : {use.situation}</p>
                <p className="text-sm text-gray-300"><strong>Démarche :</strong> {use.action}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-800/60">
                <p className="text-sm text-green-400 font-semibold flex items-center gap-2">
                  <CheckCircle size={16} />
                  Impact : {use.result}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* COMMENT CA MARCHE */}
      <section className="space-y-8">
        <h3 className="text-2xl font-bold text-white text-center">Un Parcours en 3 Étapes Clés</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500/20 via-green-500/20 to-blue-500/20 -z-10 hidden md:block" />
          
          <div className="bg-gray-900/10 border border-gray-800/80 p-6 rounded-2xl relative text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg mx-auto">1</div>
            <h4 className="font-bold text-gray-200">Enregistrez Votre Clé Gemini</h4>
            <p className="text-xs text-gray-400 leading-relaxed">Saisissez gratuitement une clé Google AI Studio. Elle reste loggée directement et localement pour vous garantir une autonomie totale sans bridage.</p>
          </div>

          <div className="bg-gray-900/10 border border-gray-800/80 p-6 rounded-2xl relative text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-lg mx-auto">2</div>
            <h4 className="font-bold text-gray-200 font-sans">Sélectionnez Votre Guide</h4>
            <p className="text-xs text-gray-400 leading-relaxed">Filtrez par Mathématiques ou Physique, ouvrez le chapitre ciblé, relisez la fiche synthèse et lancez une série de QCMs interactifs.</p>
          </div>

          <div className="bg-gray-900/10 border border-gray-800/80 p-6 rounded-2xl relative text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-lg mx-auto">3</div>
            <h4 className="font-bold text-gray-200 font-sans">Bâtissez Votre Bilan</h4>
            <p className="text-xs text-gray-400 leading-relaxed">Marquez les chapitres maîtrisés ou en cours d'acquisition. Téléchargez votre résumé offline et répétez.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="space-y-6 max-w-4xl mx-auto">
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold text-white">Questions Fréquentes</h3>
          <p className="text-sm text-gray-400">Tout savoir sur le fonctionnement technique et méthodologique de Prépa Concours.</p>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className="border border-gray-800 bg-gray-900/20 rounded-xl overflow-hidden transition-all duration-200"
            >
              <button 
                onClick={() => toggleFaq(idx)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-800/30 transition-colors"
              >
                <span className="font-semibold text-sm sm:text-base text-gray-200 flex items-center gap-2">
                  <HelpCircle size={16} className="text-blue-400 flex-shrink-0" />
                  {faq.question}
                </span>
                {openFaqIndex === idx ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
              </button>
              {openFaqIndex === idx && (
                <div className="px-6 pb-4 pt-2 text-xs sm:text-sm text-gray-400 leading-relaxed border-t border-gray-800/40">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* APPEL A L'ACTION FOOTER */}
      <section className="bg-gradient-to-r from-blue-900/20 to-green-900/10 border border-gray-800 rounded-3xl p-8 sm:p-12 text-center space-y-6">
        <h3 className="text-2xl sm:text-3xl font-black text-white">Prêt à décrocher votre admission ?</h3>
        <p className="text-gray-300 max-w-lg mx-auto text-sm sm:text-base">
          Des dizaines d'élèves révisent chaque jour les notions clés du secondaire pour intégrer d'éminentes institutions régionales. Prenez de l'avance dès aujourd'hui.
        </p>
        <button 
          onClick={onStartRevision}
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg transition-transform transform hover:-translate-y-0.5"
        >
          Lancer les entraînements de révision
          <ArrowRight size={20} />
        </button>
      </section>

    </div>
  );
};
