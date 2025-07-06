'use client';

import React, { useCallback, useState, memo, useMemo } from 'react';
import { KanbanBoard, KanbanColumn as KanbanColumnType, KanbanCard, KanbanStatus } from '@/types/kanban.type';
import { Card } from '@/components/ui/card';
import './kanban-board.css';

interface DraggableKanbanProps {
  board: KanbanBoard;
  onCardMove: (
    cardId: string, 
    sourceColumnId: KanbanStatus, 
    destinationColumnId: KanbanStatus,
    newIndex: number
  ) => void;
  onCardClick?: (card: KanbanCard) => void;
}

// Memoized individual card to prevent unnecessary re-renders
const MemoizedCard = memo(({ 
  card, 
  columnId, 
  isDragging, 
  onDragStart, 
  onClick 
}: { 
  card: KanbanCard; 
  columnId: KanbanStatus;
  isDragging: boolean;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, cardId: string, columnId: KanbanStatus) => void;
  onClick: (card: KanbanCard) => void;
}) => {
  // Get priority color for badge
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div
      key={card.id}
      draggable
      onDragStart={(e) => onDragStart(e, card.id, columnId)}
      onDragEnd={() => window.dispatchEvent(new CustomEvent('kanban:dragend'))}
      className={`transition-all duration-200 ${isDragging ? 'opacity-40 scale-95' : 'opacity-100'}`}
    >
      <Card
        className={`mb-2 p-3 bg-white shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing ${isDragging ? 'border border-dashed border-blue-300 bg-blue-50' : ''}`}
        onClick={() => onClick(card)}
      >
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-medium text-sm">{card.title}</h4>
          {card.priority && (
            <span className={`${getPriorityColor(card.priority)} text-xs px-2 py-0.5 rounded`}>
              {card.priority}
            </span>
          )}
        </div>
        
        {card.description && (
          <p className="text-gray-500 text-xs mt-1 line-clamp-2">{card.description}</p>
        )}
        
        <div className="flex justify-between mt-2">
          <div className="flex flex-wrap gap-1">
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
  );
});

MemoizedCard.displayName = 'MemoizedCard';

// Memoized column to prevent unnecessary re-renders
const MemoizedColumn = memo(({ 
  column, 
  draggingCardId,
  onDragStart,
  onDragOver,
  onDrop,
  onCardClick
}: { 
  column: KanbanColumnType;
  draggingCardId: string | null;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, cardId: string, columnId: KanbanStatus) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, destinationColumnId: KanbanStatus) => void;
  onCardClick: (card: KanbanCard) => void;
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isDragOver) {
      setIsDragOver(true);
    }
    onDragOver(e);
  };
  
  const handleDragLeave = () => {
    setIsDragOver(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragOver(false);
    onDrop(e, column.id);
  };
  
  // Count cards not being dragged for visual indicator
  const visibleCardCount = column.cards.filter(card => card.id !== draggingCardId).length;
  
  return (
    <div
      key={column.id}
      className={`flex-1 min-w-[250px] max-w-[350px] rounded-md p-3 transition-all duration-200
        ${isDragOver ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <div 
            className="w-3 h-3 rounded-full mr-2" 
            style={{ backgroundColor: column.color }}
          ></div>
          <h3 className="font-medium">{column.title}</h3>
          <span className="ml-2 bg-gray-200 text-gray-800 text-xs px-2 py-0.5 rounded">
            {column.cards.length}
          </span>
        </div>
      </div>
      
      <div 
        className={`space-y-2 min-h-[150px] rounded-md transition-colors
          ${isDragOver ? 'bg-blue-50' : ''}`}
      >
        {column.cards.map((card) => (
          <MemoizedCard
            key={card.id}
            card={card}
            columnId={column.id}
            isDragging={draggingCardId === card.id}
            onDragStart={onDragStart}
            onClick={onCardClick}
          />
        ))}
        
        {/* Drop placeholder shown when dragging over an empty column */}
        {isDragOver && visibleCardCount === 0 && (
          <div className="border-2 border-dashed border-blue-300 bg-blue-50 rounded-md p-3 my-2 h-24 flex items-center justify-center">
            <p className="text-blue-500 text-sm">Drop card here</p>
          </div>
        )}
      </div>
    </div>
  );
});

MemoizedColumn.displayName = 'MemoizedColumn';

export const OptimizedKanbanBoard = ({ board, onCardMove, onCardClick }: DraggableKanbanProps) => {
  const [draggingCardId, setDraggingCardId] = useState<string | null>(null);
  const [draggingColumnId, setDraggingColumnId] = useState<KanbanStatus | null>(null);
  
  // Listen for custom drag end event
  React.useEffect(() => {
    const handleGlobalDragEnd = () => {
      setDraggingCardId(null);
      setDraggingColumnId(null);
    };
    
    window.addEventListener('kanban:dragend', handleGlobalDragEnd);
    return () => {
      window.removeEventListener('kanban:dragend', handleGlobalDragEnd);
    };
  }, []);
  
  // Memoize handlers to prevent recreating them on every render
  const handleDragStart = useCallback((
    e: React.DragEvent<HTMLDivElement>,
    cardId: string,
    columnId: KanbanStatus
  ) => {
    setDraggingCardId(cardId);
    setDraggingColumnId(columnId);
    
    // Find the card data
    const cardData = board.columns
      .find(col => col.id === columnId)?.cards
      .find(card => card.id === cardId);
    
    if (!cardData) return;
    
    // Create a custom drag image that looks like the card
    const dragImg = document.createElement('div');
    dragImg.className = 'card-drag-image';
    dragImg.style.width = '250px';
    dragImg.style.padding = '12px';
    dragImg.style.backgroundColor = 'white';
    dragImg.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    dragImg.style.borderRadius = '6px';
    dragImg.style.opacity = '0.8';
    dragImg.style.pointerEvents = 'none';
    dragImg.style.position = 'absolute';
    dragImg.style.zIndex = '9999';
    dragImg.style.left = '-1000px';
    dragImg.style.top = '-1000px';
    
    // Add content to the drag image
    dragImg.innerHTML = `
      <div style="font-weight: 500; font-size: 14px; margin-bottom: 6px;">${cardData.title}</div>
      ${cardData.description ? `<div style="color: #666; font-size: 12px;">${cardData.description.substring(0, 60)}${cardData.description.length > 60 ? '...' : ''}</div>` : ''}
      <div style="margin-top: 8px; display: flex; justify-content: space-between;">
        <div>
          ${cardData.tags?.slice(0, 2).map(tag => `<span style="background: #f1f5f9; font-size: 10px; padding: 2px 6px; border-radius: 10px; margin-right: 4px;">${tag}</span>`).join('') || ''}
        </div>
        ${cardData.priority ? `<span style="background: ${cardData.priority === 'high' ? '#fee2e2' : cardData.priority === 'medium' ? '#fef3c7' : '#dbeafe'}; font-size: 10px; padding: 2px 6px; border-radius: 10px;">${cardData.priority}</span>` : ''}
      </div>
    `;
    
    // Add to DOM to make it available for drag image
    document.body.appendChild(dragImg);
    
    // Set data to transfer
    e.dataTransfer.setData('text/plain', JSON.stringify({ cardId, sourceColumnId: columnId }));
    
    // Set custom drag image
    try {
      e.dataTransfer.setDragImage(dragImg, 125, 30);
    } catch (err) {
      console.error('Error setting drag image:', err);
    }
    e.dataTransfer.effectAllowed = 'move';
    
    // Cleanup created element after a small delay
    setTimeout(() => {
      document.body.removeChild(dragImg);
    }, 0);
  }, [board.columns]);
  
  // Handle drag over to enable dropping with improved visuals
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);
  
  // Handle drag end (cleanup even if drop wasn't successful)
  const handleDragEnd = useCallback(() => {
    setDraggingCardId(null);
    setDraggingColumnId(null);
  }, []);
  
  // Handle dropping a card in a column with improved feedback
  const handleDrop = useCallback((
    e: React.DragEvent<HTMLDivElement>,
    destinationColumnId: KanbanStatus
  ) => {
    e.preventDefault();
    
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      const { cardId, sourceColumnId } = data;
      
      if (sourceColumnId === destinationColumnId) {
        // Reset state even when dropping in the same column
        setDraggingCardId(null);
        setDraggingColumnId(null);
        return;
      }
      
      // Get the current column's cards
      const destinationColumn = board.columns.find(col => col.id === destinationColumnId);
      
      if (!destinationColumn) {
        setDraggingCardId(null);
        setDraggingColumnId(null);
        return;
      }
      
      // Call the callback with the new position
      onCardMove(cardId, sourceColumnId as KanbanStatus, destinationColumnId, destinationColumn.cards.length);
      
      // Reset dragging state
      setDraggingCardId(null);
      setDraggingColumnId(null);
    } catch (error) {
      console.error('Error handling drop:', error);
      // Always reset state even if an error occurs
      setDraggingCardId(null);
      setDraggingColumnId(null);
    }
  }, [board.columns, onCardMove]);
  
  // Safely handle card click without interfering with drag operation
  const handleCardClick = useCallback((card: KanbanCard) => {
    if (!draggingCardId && onCardClick) {
      onCardClick(card);
    }
  }, [draggingCardId, onCardClick]);
  
  // Memoize board columns to prevent unnecessary re-renders
  const memoizedColumns = useMemo(() => {
    return board.columns.map(column => (
      <MemoizedColumn
        key={column.id}
        column={column}
        draggingCardId={draggingCardId}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onCardClick={handleCardClick}
      />
    ));
  }, [board.columns, draggingCardId, handleDragStart, handleDragOver, handleDrop, handleCardClick]);
  
  return (
    <div className="flex space-x-4 pb-4 min-w-full">
      {memoizedColumns}
    </div>
  );
};
