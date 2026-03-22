'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import styles from './ModelCard.module.css';

interface FavoriteButtonProps {
  modelId: string;
}

export default function FavoriteButton({ modelId }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = JSON.parse(localStorage.getItem('lumina_favorites') || '[]');
      if (Array.isArray(saved)) {
        setIsFavorite(saved.includes(modelId));
      }
    } catch {
      setIsFavorite(false);
    }
  }, [modelId]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const savedStr = localStorage.getItem('lumina_favorites');
      let saved = [];
      if (savedStr) {
        const parsed = JSON.parse(savedStr);
        if (Array.isArray(parsed)) saved = parsed;
      }
      
      let newSaved;
      if (isFavorite) {
        newSaved = saved.filter((id: string) => id !== modelId);
      } else {
        newSaved = [...saved, modelId];
      }
      
      localStorage.setItem('lumina_favorites', JSON.stringify(newSaved));
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error('Failed to update favorites', err);
    }
  };

  // Prevent hydration mismatch by returning a placeholder or empty heart before mount
  if (!mounted) {
    return (
      <button className={`${styles.actionBtn} ${styles.btnLike}`} title="Save to Favorites">
        <Heart size={20} color="currentColor" />
      </button>
    );
  }

  return (
    <button 
      onClick={toggleFavorite} 
      className={`${styles.actionBtn} ${styles.btnLike}`} 
      title={isFavorite ? "Remove from Favorites" : "Save to Favorites"}
    >
      <Heart 
        size={20} 
        fill={isFavorite ? "#ef4444" : "none"} 
        color={isFavorite ? "#ef4444" : "currentColor"} 
      />
    </button>
  );
}
