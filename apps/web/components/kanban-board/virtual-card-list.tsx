'use client';

import React, { useRef, useState, useEffect, memo } from 'react';
import { KanbanCard } from '@/types/kanban.type';
import { Card } from '@/components/ui/card';

interface VirtualCardListProps {
  cards: KanbanCard[];
  onCardClick: (card: KanbanCard) => void;
}

// This component renders only the visible cards in the viewport
// to improve performance with large lists
export const VirtualCardList = memo(({ cards, onCardClick }: VirtualCardListProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 });
  const itemHeight = 120; // estimated height of a card in pixels
  const overscan = 5; // number of items to render before and after visible range
  
  // Update visible range on scroll
  const handleScroll = () => {
    if (!containerRef.current) return;
    
    const { scrollTop, clientHeight } = containerRef.current;
    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const end = Math.min(
      cards.length, 
      Math.ceil((scrollTop + clientHeight) / itemHeight) + overscan
    );
    
    setVisibleRange({ start, end });
  };
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    container.addEventListener('scroll', handleScroll);
    // Initial calculation
    handleScroll();
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [cards.length]);
  
  // Recalculate on window resize
  useEffect(() => {
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('resize', handleScroll);
    };
  }, []);
  
  // Get visible items
  const visibleCards = cards.slice(visibleRange.start, visibleRange.end);
  
  // Total height of all items
  const totalHeight = cards.length * itemHeight;
  
  // Calculate offset for virtual items
  const offsetY = visibleRange.start * itemHeight;
  
  return (
    <div 
      ref={containerRef} 
      className="virtual-list-container overflow-y-auto"
      style={{ height: '100%', maxHeight: '70vh' }}
    >
      <div 
        className="virtual-list-spacer" 
        style={{ height: totalHeight }}
      >
        <div 
          className="virtual-list-items"
          style={{ 
            position: 'absolute', 
            top: 0,
            transform: `translateY(${offsetY}px)` 
          }}
        >
          {visibleCards.map(card => (
            <div key={card.id} className="mb-2">
              <Card
                className="p-3 bg-white shadow-sm hover:shadow-md cursor-pointer"
                onClick={() => onCardClick(card)}
              >
                <h4 className="font-medium text-sm">{card.title}</h4>
                {card.description && (
                  <p className="text-gray-500 text-xs mt-1 line-clamp-2">{card.description}</p>
                )}
                
                <div className="flex justify-between mt-2">
                  <div className="flex space-x-1">
                    {card.tags && card.tags.map(tag => (
                      <span key={tag} className="bg-gray-100 text-xs px-2 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  {card.assignee && (
                    <div 
                      className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs"
                      title={card.assignee.name}
                    >
                      {card.assignee.name.charAt(0)}
                    </div>
                  )}
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

VirtualCardList.displayName = 'VirtualCardList';
