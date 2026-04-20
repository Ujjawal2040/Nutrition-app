import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  X, 
  Mic, 
  MicOff, 
  Send, 
  Image as ImageIcon, 
  Sparkles,
  Volume2,
  VolumeX,
  Languages
} from 'lucide-react';
import axios from 'axios';
import useSpeech from '../../hooks/useSpeech';

const Assistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am Protus AI. How can I help you today? \n\nनमस्ते! मैं प्रोटस एआई हूँ। मैं आज आपकी कैसे मदद कर सकता हूँ?' }
  ]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('en-US'); // en-US or hi-IN
  const [imageFile, setImageFile] = useState(null);
  
  const scrollRef = useRef(null);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const { speak, stop, isPlaying } = useSpeech();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en-US' ? 'hi-IN' : 'en-US');
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() && !imageFile) return;

    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      let response;

      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        response = await axios.post('http://localhost:5000/api/chat/vision', formData, {
          headers: { 
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        setImageFile(null);
      } else {
        response = await axios.post('http://localhost:5000/api/chat', { message: userMessage }, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
      }

      const reply = response.data.reply;
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      
      // Voice reply back
      speak(reply, language);
      
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (e) => {
        audioChunks.current.push(e.data);
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        await handleAudioUpload(audioBlob);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Recording error:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  const handleAudioUpload = async (blob) => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const formData = new FormData();
      formData.append('audio', blob, 'voice.wav');

      const res = await axios.post('http://localhost:5000/api/chat/voice', formData, {
        headers: { 
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      const transcription = res.data.text || '';
      setInput(transcription);
      // Auto-send if transcription is good
      if (transcription.length > 2) {
         // This is a bit tricky with state, better to just let user review
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-20 right-0 w-[400px] h-[600px] glass-card flex flex-col shadow-2xl border-white/10 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/5 bg-primary-600/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
                  <Sparkles size={20} />
                </div>
                <div>
                   <h3 className="font-bold text-white text-sm">Protus Assistant</h3>
                   <span className="text-[10px] text-green-400 font-bold uppercase tracking-widest flex items-center gap-1">
                     <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> Online
                   </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={toggleLanguage} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 transition-all flex items-center gap-1">
                  <Languages size={18} />
                  <span className="text-[10px] uppercase font-bold">{language === 'en-US' ? 'EN' : 'HI'}</span>
                </button>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 transition-all">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Chat Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
                    msg.role === 'user' 
                    ? 'bg-primary-600 text-white rounded-tr-none shadow-lg' 
                    : 'bg-white/5 text-slate-300 border border-white/5 rounded-tl-none mr-2'
                  }`}>
                    {msg.content.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none animate-pulse flex gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/5 bg-black/20">
              {imageFile && (
                <div className="mb-4 flex items-center justify-between p-2 bg-primary-500/10 rounded-xl border border-primary-500/20">
                  <span className="text-xs text-primary-400 font-bold flex items-center gap-2">
                    <ImageIcon size={14} /> Image Selected
                  </span>
                  <button onClick={() => setImageFile(null)} className="text-red-400 hover:text-red-300">
                    <X size={14} />
                  </button>
                </div>
              )}
              
              <form onSubmit={handleSend} className="flex gap-2">
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={language === 'en-US' ? "Ask anything..." : "कुछ भी पूछें..."}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-10 text-sm text-white focus:outline-none focus:border-primary-500 transition-all"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <label className="p-1 px-2 hover:bg-white/10 rounded-lg cursor-pointer text-slate-400 transition-all">
                      <ImageIcon size={18} />
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => setImageFile(e.target.files[0])} 
                      />
                    </label>
                  </div>
                </div>
                
                <button 
                  type="button" 
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`p-3 rounded-xl transition-all ${
                    isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-white/5 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
                </button>

                <button 
                  type="submit" 
                  disabled={loading || (!input.trim() && !imageFile)}
                  className="p-3 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl transition-all shadow-lg"
                >
                  <Send size={20} />
                </button>
              </form>
              
              <div className="mt-2 flex items-center justify-between px-1">
                 <button onClick={() => isPlaying ? stop() : speak(messages[messages.length-1].content, language)} className="text-[10px] font-bold text-slate-500 hover:text-primary-500 flex items-center gap-1 transition-all">
                   {isPlaying ? <VolumeX size={12} /> : <Volume2 size={12} />}
                   {isPlaying ? 'STOP VOICE' : 'PLAY LAST REPLY'}
                 </button>
                 <span className="text-[9px] text-slate-600 uppercase font-black">AI by Groq</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-[0_0_30px_rgba(var(--primary-rgb),0.5)] border border-primary-400/30"
      >
        {isOpen ? <X size={28} /> : (
          <div className="relative">
            <MessageCircle size={32} />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-primary-600" />
          </div>
        )}
      </motion.button>
    </div>
  );
};

export default Assistant;
