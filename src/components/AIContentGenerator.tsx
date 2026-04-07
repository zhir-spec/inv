import React, { useState } from 'react';
import { generateMarketingContent } from '../services/aiService';
import { Check, Copy, Camera, Layout, MessageSquare, Play, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AIContentGenerator({ profile, referralLink }: { profile: any, referralLink: string }) {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<any>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await generateMarketingContent(profile?.displayName || 'Trader', referralLink);
      setContent(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8">
      {!content && !loading && (
        <div className="p-12 rounded-3xl bg-slate-900 border-2 border-dashed border-slate-800 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-gold-500/10 rounded-2xl flex items-center justify-center mb-6">
            <Sparkles className="w-8 h-8 text-gold-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Ready to go viral?</h3>
          <p className="text-slate-400 max-w-md mb-8">
            Our AI engine will generate personalized Instagram captions, TikTok scripts, and ad headlines using your unique referral link.
          </p>
          <button
            onClick={handleGenerate}
            className="flex items-center gap-2 px-8 py-4 bg-gold-500 hover:bg-gold-600 text-black rounded-xl font-bold transition-all shadow-lg shadow-gold-500/20 active:scale-95"
          >
            <Sparkles className="w-5 h-5" />
            Generate Marketing Content
          </button>
        </div>
      )}

      {loading && (
        <div className="p-12 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col items-center text-center">
          <div className="relative w-20 h-20 mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-gold-500/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-gold-500 border-t-transparent animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-gold-500 animate-pulse" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">AI is thinking...</h3>
          <p className="text-slate-400">Crafting high-converting content for your audience.</p>
        </div>
      )}

      <AnimatePresence>
        {content && !loading && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Image Section */}
            {content.imageUrl && (
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-gold-500 font-bold">
                    <Camera className="w-5 h-5" />
                    AI-Generated Marketing Image
                  </div>
                  <button 
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = content.imageUrl;
                      link.download = 'marketing-image.png';
                      link.click();
                    }}
                    className="text-xs font-bold text-slate-500 hover:text-white transition-colors"
                  >
                    Download Image
                  </button>
                </div>
                <div className="aspect-video rounded-2xl overflow-hidden border border-slate-800 bg-black">
                  <img 
                    src={content.imageUrl} 
                    alt="AI Generated Marketing" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Instagram Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gold-400 font-bold px-2">
                  <Camera className="w-5 h-5" />
                  Instagram Captions
                </div>
                {content.instagram.map((caption: string, i: number) => (
                  <ContentCard 
                    key={`ig-${i}`} 
                    text={caption} 
                    onCopy={() => copyToClipboard(caption, `ig-${i}`)}
                    isCopied={copiedId === `ig-${i}`}
                  />
                ))}
              </div>

              {/* TikTok Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-white font-bold px-2">
                  <Play className="w-5 h-5" />
                  TikTok Scripts
                </div>
                {content.tiktok.map((idea: any, i: number) => (
                  <div key={`tt-${i}`} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 group relative">
                    <div className="text-xs font-bold text-gold-500 uppercase mb-2">Idea: {idea.title}</div>
                    <p className="text-sm text-slate-300 leading-relaxed mb-4 italic">"{idea.script}"</p>
                    <button 
                      onClick={() => copyToClipboard(idea.script, `tt-${i}`)}
                      className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-white transition-colors"
                    >
                      {copiedId === `tt-${i}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copiedId === `tt-${i}` ? 'Copied' : 'Copy Script'}
                    </button>
                  </div>
                ))}
              </div>

              {/* Ads Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gold-600 font-bold px-2">
                  <Layout className="w-5 h-5" />
                  Ad Headlines
                </div>
                {content.ads.map((headline: string, i: number) => (
                  <ContentCard 
                    key={`ad-${i}`} 
                    text={headline} 
                    onCopy={() => copyToClipboard(headline, `ad-${i}`)}
                    isCopied={copiedId === `ad-${i}`}
                  />
                ))}
                
                <button
                  onClick={handleGenerate}
                  className="w-full mt-4 py-4 rounded-xl border border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-2 text-sm font-bold"
                >
                  <MessageSquare className="w-4 h-4" />
                  Regenerate New Ideas
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ContentCard({ text, onCopy, isCopied }: { text: string, onCopy: () => void, isCopied: boolean, key?: string }) {
  return (
    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 group relative hover:border-gold-500/20 transition-colors">
      <p className="text-sm text-slate-300 leading-relaxed mb-4">{text}</p>
      <button 
        onClick={onCopy}
        className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-white transition-colors"
      >
        {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
        {isCopied ? 'Copied' : 'Copy Text'}
      </button>
    </div>
  );
}
