'use client';

import React, { useState } from 'react';
import { KanbanBoard, KanbanColumn as KanbanColumnType, KanbanCard, KanbanStatus } from '@/types/kanban.type';
import { Card } from '@/components/ui/card';

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

export const DraggableKanbanBoard = ({ board, onCardMove, onCardClick }: DraggableKanbanProps) => {
  const [draggingCardId, setDraggingCardId] = useState<string | null>(null);
  const [draggingColumnId, setDraggingColumnId] = useState<KanbanStatus | null>(null);
  
  // Start dragging a card
  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    cardId: string,
    columnId: KanbanStatus
  ) => {
    setDraggingCardId(cardId);
    setDraggingColumnId(columnId);
    
    // Set data to transfer
    e.dataTransfer.setData('application/json', JSON.stringify({
      cardId,
      sourceColumnId: columnId,
    }));
    
    // Set drag image and effect
    e.dataTransfer.effectAllowed = 'move';
  };
  
  // Handle drag over to enable dropping
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  
  // Handle dropping a card in a column
  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    destinationColumnId: KanbanStatus
  ) => {
    e.preventDefault();
    
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      const { cardId, sourceColumnId } = data;
      
      if (sourceColumnId === destinationColumnId) {
        return;
      }
      
      // Get the current column's cards
      const destinationColumn = board.columns.find(col => col.id === destinationColumnId);
      
      if (!destinationColumn) {
        return;
      }
      
      // Call the callback with the new position
      onCardMove(cardId, sourceColumnId as KanbanStatus, destinationColumnId, destinationColumn.cards.length);
      
      // Reset dragging state
      setDraggingCardId(null);
      setDraggingColumnId(null);
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };
  
  return (
    <div className="flex space-x-4 pb-4 min-w-full">
      {board.columns.map((column) => (
        <div
          key={column.id}
          className="flex-1 min-w-[250px] max-w-[350px] bg-gray-50 rounded-md p-3"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, column.id)}
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
          
          <div className="space-y-2 min-h-[150px]">
            {column.cards.map((card) => (
              <div
                key={card.id}
                draggable
                onDragStart={(e) => handleDragStart(e, card.id, column.id)}
                className={`
                  transition-opacity
                  ${draggingCardId === card.id ? 'opacity-50' : 'opacity-100'}
                `}
              >
                <Card
                  className="mb-2 p-3 bg-white shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing"
                  onClick={(e) => {
                    // Prevent drag and click conflicts
                    if (!draggingCardId) {
                      e.stopPropagation();
                      onCardClick && onCardClick(card);
                    }
                  }}
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
      ))}
    </div>
  );
};
