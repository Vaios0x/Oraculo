'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Lock, 
  Eye, 
  EyeOff, 
  Globe, 
  Code, 
  Zap, 
  Key,
  Cpu,
  Network,
  Database,
  Fingerprint,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Users,
  BookOpen,
  Quote,
  Mail,
  Calendar,
  ArrowRight,
  ArrowLeft,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

/**
 * 🔐 Eric Hughes Manifesto Component - Interactive Cypherpunk Manifesto
 * 
 * Component that displays the complete Eric Hughes Cypherpunk Manifesto
 * adapted for the Oráculo project and Shipyard MX Award
 * 
 * @author Blockchain & Web3 Developer Full Stack Senior
 * @version 1.0.0
 */

interface ManifestoSection {
  id: string;
  title: string;
  content: string;
  keyPoints: string[];
  relevance: string;
  icon: React.ReactNode;
  color: string;
}

const manifestoText = `A Cypherpunk's Manifesto

by Eric Hughes

Privacy is necessary for an open society in the electronic age. Privacy is not secrecy. A private matter is something one doesn't want the whole world to know, but a secret matter is something one doesn't want anybody to know. Privacy is the power to selectively reveal oneself to the world.

If two parties have some sort of dealings, then each has a memory of their interaction. Each party can speak about their own memory of this; how could anyone prevent it? One could pass laws against it, but the freedom of speech, even more than privacy, is fundamental to an open society; we seek not to restrict any speech at all. If many parties speak together in the same forum, each can speak to all the others and aggregate together knowledge about individuals and other parties. The power of electronic communications has enabled such group speech, and it will not go away merely because we might want it to.

Since we desire privacy, we must ensure that each party to a transaction have knowledge only of that which is directly necessary for that transaction. Since any information can be spoken of, we must ensure that we reveal as little as possible. In most cases personal identity is not salient. When I purchase a magazine at a store and hand cash to the clerk, there is no need to know who I am. When I ask my electronic mail provider to send and receive messages, my provider need not know to whom I am speaking or what I am saying or what others are saying to me; my provider only need know how to get the message there and how much I owe them in fees. When my identity is revealed by the underlying mechanism of the transaction, I have no privacy. I cannot here selectively reveal myself; I must always reveal myself.

Therefore, privacy in an open society requires anonymous transaction systems. Until now, cash has been the primary such system. An anonymous transaction system is not a secret transaction system. An anonymous system empowers individuals to reveal their identity when desired and only when desired; this is the essence of privacy.

Privacy in an open society also requires cryptography. If I say something, I want it heard only by those for whom I intend it. If the content of my speech is available to the world, I have no privacy. To encrypt is to indicate the desire for privacy, and to encrypt with weak cryptography is to indicate not too much desire for privacy. Furthermore, to reveal one's identity with assurance when the default is anonymity requires the cryptographic signature.

We cannot expect governments, corporations, or other large, faceless organizations to grant us privacy out of their beneficence. It is to their advantage to speak of us, and we should expect that they will speak. To try to prevent their speech is to fight against the realities of information. Information does not just want to be free, it longs to be free. Information expands to fill the available storage space. Information is Rumor's younger, stronger cousin; Information is fleeter of foot, has more eyes, knows more, and understands less than Rumor.

We must defend our own privacy if we expect to have any. We must come together and create systems which allow anonymous transactions to take place. People have been defending their own privacy for centuries with whispers, darkness, envelopes, closed doors, secret handshakes, and couriers. The technologies of the past did not allow for strong privacy, but electronic technologies do.

We the Cypherpunks are dedicated to building anonymous systems. We are defending our privacy with cryptography, with anonymous mail forwarding systems, with digital signatures, and with electronic money.

Cypherpunks write code. We know that someone has to write software to defend privacy, and since we can't get privacy unless we all do, we're going to write it. We publish our code so that our fellow Cypherpunks may practice and play with it. Our code is free for all to use, worldwide. We don't much care if you don't approve of the software we write. We know that software can't be destroyed and that a widely dispersed system can't be shut down.

Cypherpunks deplore regulations on cryptography, for encryption is fundamentally a private act. The act of encryption, in fact, removes information from the public realm. Even laws against cryptography reach only so far as a nation's border and the arm of its violence. Cryptography will ineluctably spread over the whole globe, and with it the anonymous transactions systems that it makes possible.

For privacy to be widespread it must be part of a social contract. People must come and together deploy these systems for the common good. Privacy only extends so far as the cooperation of one's fellows in society. We the Cypherpunks seek your questions and your concerns and hope we may engage you so that we do not deceive ourselves. We will not, however, be moved out of our course because some may disagree with our goals.

The Cypherpunks are actively engaged in making the networks safer for privacy. Let us proceed together apace.

Onward.

Eric Hughes <hughes@soda.berkeley.edu>

9 March 1993`;

const manifestoSections: ManifestoSection[] = [
  {
    id: 'privacy-necessity',
    title: 'Privacy is Necessary',
    content: 'Privacy is necessary for an open society in the electronic age. Privacy is not secrecy. A private matter is something one doesn\'t want the whole world to know, but a secret matter is something one doesn\'t want anybody to know. Privacy is the power to selectively reveal oneself to the world.',
    keyPoints: [
      'Privacy ≠ Secrecy',
      'Selective revelation power',
      'Fundamental for open society',
      'Electronic age requirement'
    ],
    relevance: 'Oráculo ensures complete privacy in prediction markets through anonymous Solana transactions and zero-knowledge proofs.',
    icon: <Shield className="w-8 h-8" />,
    color: 'text-green-400'
  },
  {
    id: 'transaction-privacy',
    title: 'Transaction Privacy',
    content: 'Since we desire privacy, we must ensure that each party to a transaction have knowledge only of that which is directly necessary for that transaction. Since any information can be spoken of, we must ensure that we reveal as little as possible.',
    keyPoints: [
      'Minimal data revelation',
      'Transaction-specific knowledge',
      'Information control',
      'Selective disclosure'
    ],
    relevance: 'Oráculo uses Solana\'s privacy features to ensure only necessary transaction data is revealed, maintaining user anonymity.',
    icon: <Lock className="w-8 h-8" />,
    color: 'text-blue-400'
  },
  {
    id: 'anonymous-systems',
    title: 'Anonymous Transaction Systems',
    content: 'Therefore, privacy in an open society requires anonymous transaction systems. Until now, cash has been the primary such system. An anonymous system empowers individuals to reveal their identity when desired and only when desired; this is the essence of privacy.',
    keyPoints: [
      'Anonymous transaction systems',
      'Digital cash equivalent',
      'Identity revelation control',
      'Privacy essence'
    ],
    relevance: 'Oráculo provides anonymous prediction market participation through decentralized Solana wallets and private key management.',
    icon: <EyeOff className="w-8 h-8" />,
    color: 'text-purple-400'
  },
  {
    id: 'cryptography-requirement',
    title: 'Cryptography is Required',
    content: 'Privacy in an open society also requires cryptography. If I say something, I want it heard only by those for whom I intend it. If the content of my speech is available to the world, I have no privacy.',
    keyPoints: [
      'Cryptography necessity',
      'Selective communication',
      'Content protection',
      'Privacy through encryption'
    ],
    relevance: 'Oráculo implements end-to-end encryption for all market data and user communications using Solana\'s cryptographic primitives.',
    icon: <Key className="w-8 h-8" />,
    color: 'text-yellow-400'
  },
  {
    id: 'defend-privacy',
    title: 'We Must Defend Our Privacy',
    content: 'We must defend our own privacy if we expect to have any. We must come together and create systems which allow anonymous transactions to take place. People have been defending their own privacy for centuries.',
    keyPoints: [
      'Self-defense of privacy',
      'Collective action needed',
      'Anonymous transaction systems',
      'Historical privacy defense'
    ],
    relevance: 'Oráculo represents the collective effort of the cypherpunk community to create truly private prediction markets on Solana.',
    icon: <Users className="w-8 h-8" />,
    color: 'text-red-400'
  },
  {
    id: 'cypherpunks-code',
    title: 'Cypherpunks Write Code',
    content: 'We the Cypherpunks are dedicated to building anonymous systems. We are defending our privacy with cryptography, with anonymous mail forwarding systems, with digital signatures, and with electronic money. Cypherpunks write code.',
    keyPoints: [
      'Code as activism',
      'Anonymous systems building',
      'Cryptography defense',
      'Open source philosophy'
    ],
    relevance: 'Oráculo is open source code that embodies cypherpunk values, freely available for all to use and improve.',
    icon: <Code className="w-8 h-8" />,
    color: 'text-cyan-400'
  }
];

export function EricHughesManifesto() {
  const [currentSection, setCurrentSection] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showFullText, setShowFullText] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentSection((prev) => (prev + 1) % manifestoSections.length);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const nextSection = () => {
    setCurrentSection((prev) => (prev + 1) % manifestoSections.length);
  };

  const prevSection = () => {
    setCurrentSection((prev) => (prev - 1 + manifestoSections.length) % manifestoSections.length);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const resetToBeginning = () => {
    setCurrentSection(0);
    setIsPlaying(false);
  };

  const currentManifestoSection = manifestoSections[currentSection];

  return (
    <div className="matrix-card-enhanced p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="text-center space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3">
          <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-green-400 matrix-glow flex-shrink-0" />
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold matrix-text-green">
            📜 A Cypherpunk's Manifesto
          </h2>
        </div>
        <p className="text-sm sm:text-base lg:text-xl matrix-text-white">
          by Eric Hughes - Adapted for Oráculo & Shipyard MX Award
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm matrix-text-green">
          <Calendar className="w-4 h-4" />
          <span>March 9, 1993</span>
          <Mail className="w-4 h-4" />
          <span>hughes@soda.berkeley.edu</span>
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
        <button
          onClick={prevSection}
          className="matrix-button-enhanced px-3 py-2 text-sm"
          disabled={currentSection === 0}
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        
        <button
          onClick={togglePlay}
          className="matrix-button-enhanced px-4 py-2 text-sm"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span className="ml-2">{isPlaying ? 'Pause' : 'Play'}</span>
        </button>
        
        <button
          onClick={nextSection}
          className="matrix-button-enhanced px-3 py-2 text-sm"
          disabled={currentSection === manifestoSections.length - 1}
        >
          <ArrowRight className="w-4 h-4" />
        </button>
        
        <button
          onClick={resetToBeginning}
          className="matrix-button-enhanced px-3 py-2 text-sm"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center space-x-2">
        {manifestoSections.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSection(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSection 
                ? 'bg-green-400 matrix-glow' 
                : 'bg-gray-600 hover:bg-gray-500'
            }`}
          />
        ))}
      </div>

      {/* Current Section Display */}
      <div className={`transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <div className="matrix-card-enhanced p-6 sm:p-8 space-y-6">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-3">
              <div className={`${currentManifestoSection.color} matrix-glow`}>
                {currentManifestoSection.icon}
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold matrix-text-white">
                  {currentManifestoSection.title}
                </h3>
                <p className="text-sm matrix-text-green">
                  Section {currentSection + 1} of {manifestoSections.length}
                </p>
              </div>
            </div>
            <Quote className="w-6 h-6 text-gray-400" />
          </div>

          {/* Section Content */}
          <div className="space-y-4">
            <p className="text-sm sm:text-base lg:text-lg matrix-text-white leading-relaxed italic">
              "{currentManifestoSection.content}"
            </p>

            {/* Key Points */}
            <div className="space-y-3">
              <h4 className="text-lg font-semibold matrix-text-green">
                🔑 Key Points
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentManifestoSection.keyPoints.map((point, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0" />
                    <span className="text-sm matrix-text-white">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Oráculo Relevance */}
            <div className="matrix-card-enhanced p-4 space-y-3">
              <h4 className="text-lg font-semibold matrix-text-cyan">
                🚀 Oráculo Implementation
              </h4>
              <p className="text-sm matrix-text-white">
                {currentManifestoSection.relevance}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Full Manifesto Toggle */}
      <div className="text-center">
        <button
          onClick={() => setShowFullText(!showFullText)}
          className="matrix-button-enhanced px-6 py-3"
        >
          <BookOpen className="w-5 h-5 mr-2" />
          {showFullText ? 'Hide Full Text' : 'Show Full Manifesto'}
        </button>
      </div>

      {/* Full Manifesto Text */}
      {showFullText && (
        <div className="matrix-card-enhanced p-6 space-y-4">
          <h3 className="text-xl font-bold matrix-text-green text-center">
            Complete Manifesto Text
          </h3>
          <div className="prose prose-invert max-w-none">
            <pre className="text-xs sm:text-sm matrix-text-white whitespace-pre-wrap leading-relaxed font-mono">
              {manifestoText}
            </pre>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center space-y-4">
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-sm matrix-text-green">
          <span>🔐 Privacy First</span>
          <span>🌍 Decentralized</span>
          <span>👁️ Transparent</span>
          <span>⚡ Code is Law</span>
          <span>🇲🇽 Shipyard MX</span>
        </div>
        <p className="text-xs matrix-text-white opacity-60">
          "Cypherpunks write code. We know that someone has to write software to defend privacy, and since we can't get privacy unless we all do, we're going to write it."
        </p>
        <p className="text-xs matrix-text-white opacity-40">
          Oráculo - Prediction Markets on Solana | Built for Shipyard MX Award
        </p>
      </div>
    </div>
  );
}

export default EricHughesManifesto;
