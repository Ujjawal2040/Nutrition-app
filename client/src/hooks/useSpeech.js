import { useState, useCallback } from 'react';

const useSpeech = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const speak = useCallback((text, lang = 'en-US') => {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Auto-detect Hindi if needed or use passed lang
    if (lang === 'hi-IN') {
      utterance.lang = 'hi-IN';
    } else {
      utterance.lang = 'en-US';
    }

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  }, []);

  return { speak, stop, isPlaying };
};

export default useSpeech;
