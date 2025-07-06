'use client';

import React, { useState, useEffect } from 'react';
import { 
  KanbanBoard as KanbanBoardType, 
  KanbanCard as KanbanCardType, 
  KanbanColumn as KanbanColumnType, 
  KanbanFilter,
  KanbanStatus
} from '@/types/kanban.type';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { 
  PlusCircle, 
  Search, 
  Filter, 
  ChevronDown,
  CalendarIcon,
  TagIcon,
  Paperclip,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { OptimizedKanbanBoard } from '@/components/kanban-board/optimized-kanban-board';
import { OptimizedKanbanCardForm } from '@/components/kanban-board/optimized-kanban-card-form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import KanbanService from '@/services/kanban';

// Mock data for initial board state
const MOCK_KANBAN_DATA: KanbanBoardType = {
  id: 'main-board',
  title: 'Project Tasks',
  columns: [
    {
      id: 'backlog',
      title: 'Backlog',
      color: '#E2E8F0',
      cards: [
        {
          id: 'card-1',
          title: 'Research competitors',
          description: 'Analyze top 5 competitors and prepare a report',
          status: 'backlog',
          priority: 'medium',
          dueDate: '2023-11-30',
          assignee: {
            id: 'user-1',
            name: 'Alex Johnson',
            avatar: '/avatars/alex.png'
          },
          tags: ['research', 'marketing'],
          attachments: 2,
          comments: 3,
          createdAt: '2023-11-15T10:30:00Z'
        },
        {
          id: 'card-2',
          title: 'Update user documentation',
          description: 'Update the user manual with new features',
          status: 'backlog',
          priority: 'low',
          dueDate: '2023-12-05',
          assignee: {
            id: 'user-2',
            name: 'Sarah Miller',
            avatar: '/avatars/sarah.png'
          },
          tags: ['documentation'],
          attachments: 1,
          comments: 0,
          createdAt: '2023-11-16T09:20:00Z'
        }
      ]
    },
    {
      id: 'todo',
      title: 'To Do',
      color: '#FEF9C3',
      cards: [
        {
          id: 'card-3',
          title: 'Design login page',
          description: 'Create wireframes and high-fidelity design for login page',
          status: 'todo',
          priority: 'high',
          dueDate: '2023-11-25',
          assignee: {
            id: 'user-3',
            name: 'Mike Chen',
            avatar: '/avatars/mike.png'
          },
          tags: ['design', 'ui'],
          attachments: 0,
          comments: 2,
          createdAt: '2023-11-17T11:45:00Z'
        }
      ]
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      color: '#BFDBFE',
      cards: [
        {
          id: 'card-4',
          title: 'Implement authentication',
          description: 'Integrate OAuth and JWT for user authentication',
          status: 'in-progress',
          priority: 'urgent',
          dueDate: '2023-11-20',
          assignee: {
            id: 'user-4',
            name: 'David Kim',
            avatar: '/avatars/david.png'
          },
          tags: ['backend', 'security'],
          attachments: 1,
          comments: 5,
          createdAt: '2023-11-10T08:15:00Z',
          updatedAt: '2023-11-18T14:30:00Z'
        }
      ]
    },
    {
      id: 'review',
      title: 'Review',
      color: '#D8B4FE',
      cards: [
        {
          id: 'card-5',
          title: 'Create analytics dashboard',
          description: 'Design and implement the analytics dashboard with charts',
          status: 'review',
          priority: 'high',
          dueDate: '2023-11-22',
          assignee: {
            id: 'user-5',
            name: 'Emily Wong',
            avatar: '/avatars/emily.png'
          },
          tags: ['frontend', 'analytics'],
          attachments: 3,
          comments: 2,
          createdAt: '2023-11-12T13:20:00Z',
          updatedAt: '2023-11-19T09:45:00Z'
        }
      ]
    },
    {
      id: 'done',
      title: 'Done',
      color: '#BBF7D0',
      cards: [
        {
          id: 'card-6',
          title: 'Setup CI/CD pipeline',
          description: 'Configure GitHub Actions for automated testing and deployment',
          status: 'done',
          priority: 'medium',
          dueDate: '2023-11-15',
          assignee: {
            id: 'user-6',
            name: 'James Taylor',
            avatar: '/avatars/james.png'
          },
          tags: ['devops', 'automation'],
          attachments: 0,
          comments: 1,
          createdAt: '2023-11-05T11:00:00Z',
          updatedAt: '2023-11-14T16:30:00Z'
        }
      ]
    }
  ],
  createdAt: '2023-11-01T09:00:00Z',
  updatedAt: '2023-11-19T10:00:00Z'
};

const priorityColors = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800'
};

const KanbanCard = ({ card, onClick }: { card: KanbanCardType; onClick?: () => void }) => {
  return (
    <Card 
      className="mb-3 p-3 bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-sm">{card.title}</h4>
        <Badge 
          className={`${priorityColors[card.priority]} text-xs px-2 py-0.5 rounded`}
        >
          {card.priority}
        </Badge>
      </div>
      
      {card.description && (
        <p className="text-gray-600 text-xs mb-2 line-clamp-2">{card.description}</p>
      )}
      
      <div className="flex items-center justify-between mt-3">
        {card.assignee && (
          <div className="flex items-center">
            <Avatar className="h-6 w-6">
              <img 
                src={card.assignee.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(card.assignee.name)}`} 
                alt={card.assignee.name} 
              />
            </Avatar>
          </div>
        )}
        
        <div className="flex space-x-2 text-gray-500">
          {card.dueDate && (
            <div className="flex items-center text-xs">
              <CalendarIcon className="h-3 w-3 mr-1" />
              {new Date(card.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
          )}
          
          {(card.attachments && card.attachments > 0) && (
            <div className="flex items-center text-xs">
              <Paperclip className="h-3 w-3 mr-1" />
              {card.attachments}
            </div>
          )}
          
          {(card.comments && card.comments > 0) && (
            <div className="flex items-center text-xs">
              <MessageSquare className="h-3 w-3 mr-1" />
              {card.comments}
            </div>
          )}
        </div>
      </div>
      
      {card.tags && card.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {card.tags.map((tag) => (
            <span 
              key={tag} 
              className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Card>
  );
};

const KanbanColumn = ({ 
  column, 
  onAddCard 
}: { 
  column: KanbanColumnType; 
  onAddCard: (status: KanbanStatus, card?: KanbanCardType) => void;
}) => {
  return (
    <div className="flex-1 min-w-[250px] max-w-[350px] bg-gray-50 rounded-md p-3">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <div 
            className="w-3 h-3 rounded-full mr-2" 
            style={{ backgroundColor: column.color }}
          ></div>
          <h3 className="font-medium">{column.title}</h3>
          <Badge className="ml-2 bg-gray-200 text-gray-800 text-xs">
            {column.cards.length}
          </Badge>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          onClick={() => onAddCard(column.id)}
        >
          <PlusCircle className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-2">
        {column.cards.map((card) => (
          <KanbanCard 
            key={card.id} 
            card={card} 
            onClick={() => onAddCard && onAddCard(card.status, card)}
          />
        ))}
      </div>
    </div>
  );
};

export default function KanbanBoardPage() {
  const [board, setBoard] = useState<KanbanBoardType | null>(null);
  const [filters, setFilters] = useState<KanbanFilter>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [isCardFormOpen, setIsCardFormOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<KanbanCardType | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<KanbanStatus>('todo');

  // Load board data from the service
  useEffect(() => {
    const loadBoard = async () => {
      try {
        // In a real app, you might have multiple boards and select one
        const boards = await KanbanService.getBoards();
        if (boards && boards.length > 0 && boards[0]) {
          setBoard(boards[0]);
        }
      } catch (error) {
        console.error("Failed to load kanban board:", error);
        // Fallback to mock data if API fails
        setBoard(MOCK_KANBAN_DATA);
      }
    };
    
    loadBoard();
  }, []);

  // Handle adding or editing a card
  const handleCardSubmit = async (cardData: Partial<KanbanCardType>) => {
    if (!board) return;
    
    try {
      // Ensure required fields for a KanbanCard
      const validCardData: KanbanCardType = {
        id: cardData.id || `card-${Date.now()}`,
        title: cardData.title || 'Untitled Task',
        status: cardData.status || 'todo',
        priority: cardData.priority || 'medium',
        createdAt: cardData.createdAt || new Date().toISOString(),
        ...cardData
      };
      
      // Save card via service
      await KanbanService.saveCard(board.id, validCardData);
      
      // Refresh the board
      const updatedBoard = await KanbanService.getBoardById(board.id);
      if (updatedBoard) {
        setBoard(updatedBoard);
      }
      
      setSelectedCard(null);
    } catch (error) {
      console.error("Failed to save card:", error);
      
      // Fallback to local update if service fails
      const updatedBoard = { ...board };
      
      if (selectedCard) {
        // Edit existing card
        const columnIndex = updatedBoard.columns.findIndex(
          col => col.id === selectedCard.status
        );
        
        if (columnIndex >= 0 && updatedBoard.columns[columnIndex]?.cards) {
          const cardIndex = updatedBoard.columns[columnIndex].cards.findIndex(
            c => c.id === selectedCard.id
          );
          
          if (cardIndex >= 0) {
            // If the status changed, we need to move the card
            if (selectedCard.status !== cardData.status && cardData.status) {
              // Remove from current column
              const [movedCard] = updatedBoard.columns[columnIndex].cards.splice(cardIndex, 1);
              
              if (movedCard) {
                // Add to new column
                const newColumnIndex = updatedBoard.columns.findIndex(
                  col => col.id === cardData.status
                );
                
                if (newColumnIndex >= 0 && updatedBoard.columns[newColumnIndex]?.cards) {
                  const updatedCard: KanbanCardType = {
                    ...movedCard,
                    ...(cardData as Partial<KanbanCardType>),
                    status: cardData.status,
                    updatedAt: new Date().toISOString()
                  };
                  updatedBoard.columns[newColumnIndex].cards.push(updatedCard);
                }
              }
            } else {
              // Just update the card in place
              const currentCard = updatedBoard.columns[columnIndex].cards[cardIndex];
              if (currentCard) {
                const updatedCard: KanbanCardType = {
                  ...currentCard,
                  ...(cardData as Partial<KanbanCardType>),
                  // Ensure required fields are present
                  id: currentCard.id,
                  title: cardData.title || currentCard.title,
                  status: cardData.status || currentCard.status,
                  priority: cardData.priority || currentCard.priority,
                  createdAt: currentCard.createdAt,
                  updatedAt: new Date().toISOString()
                };
                updatedBoard.columns[columnIndex].cards[cardIndex] = updatedCard;
              }
            }
          }
        }
      } else {
        // Add new card
        const columnIndex = updatedBoard.columns.findIndex(
          col => col.id === cardData.status
        );
        
        if (columnIndex >= 0 && updatedBoard.columns[columnIndex]?.cards) {
          // Ensure it's a complete KanbanCard
          const newCard: KanbanCardType = {
            id: `card-${Date.now()}`,
            title: cardData.title || 'Untitled Task',
            status: cardData.status || 'todo',
            priority: cardData.priority || 'medium',
            createdAt: new Date().toISOString(),
            ...cardData as Partial<KanbanCardType>
          };
          
          updatedBoard.columns[columnIndex].cards.push(newCard);
        }
      }
      
      // Update the board state
      updatedBoard.updatedAt = new Date().toISOString();
      setBoard(updatedBoard);
      setSelectedCard(null);
    }
  };

  // Handle card movement between columns - optimized version
  const handleCardMove = async (
    cardId: string,
    sourceColumnId: KanbanStatus,
    destinationColumnId: KanbanStatus,
    newIndex: number
  ) => {
    if (!board) return;
    
    // Create an optimistic update for immediate UI feedback
    const optimisticUpdate = (currentBoard: KanbanBoardType): KanbanBoardType => {
      // Create shallow copies to avoid mutating the original state
      const updatedBoard = { 
        ...currentBoard,
        updatedAt: new Date().toISOString()
      };
      
      // Create shallow copies of columns array
      updatedBoard.columns = [...currentBoard.columns];
      
      // Find source column and create a shallow copy of it
      const sourceColumnIndex = updatedBoard.columns.findIndex(col => col.id === sourceColumnId);
      if (sourceColumnIndex < 0) return currentBoard;
      
      const sourceColumnOriginal = updatedBoard.columns[sourceColumnIndex];
      if (!sourceColumnOriginal) return currentBoard;
      
      updatedBoard.columns[sourceColumnIndex] = {
        id: sourceColumnOriginal.id,
        title: sourceColumnOriginal.title,
        color: sourceColumnOriginal.color,
        cards: [...sourceColumnOriginal.cards]
      };
      
      const sourceColumn = updatedBoard.columns[sourceColumnIndex];
      
      // Find card index
      const cardIndex = sourceColumn.cards.findIndex(card => card.id === cardId);
      if (cardIndex < 0) return currentBoard;
      
      // Get the card to move
      const [movedCard] = sourceColumn.cards.splice(cardIndex, 1);
      if (!movedCard) return currentBoard;
      
      // Find destination column and create a shallow copy
      const destColumnIndex = updatedBoard.columns.findIndex(col => col.id === destinationColumnId);
      if (destColumnIndex < 0) return currentBoard;
      
      const destColumnOriginal = updatedBoard.columns[destColumnIndex];
      if (!destColumnOriginal) return currentBoard;
      
      updatedBoard.columns[destColumnIndex] = {
        id: destColumnOriginal.id,
        title: destColumnOriginal.title,
        color: destColumnOriginal.color,
        cards: [...destColumnOriginal.cards]
      };
      
      const destColumn = updatedBoard.columns[destColumnIndex];
      
      // Update the card and add to destination
      const updatedCard = {
        ...movedCard,
        status: destinationColumnId,
        updatedAt: new Date().toISOString()
      };
      
      // Add to specific position or end
      if (newIndex >= 0 && newIndex <= destColumn.cards.length) {
        destColumn.cards.splice(newIndex, 0, updatedCard);
      } else {
        destColumn.cards.push(updatedCard);
      }
      
      return updatedBoard;
    };
    
    // Apply optimistic update immediately
    setBoard(currentBoard => {
      if (!currentBoard) return null;
      return optimisticUpdate(currentBoard);
    });
    
    try {
      // Try to update via service in the background
      await KanbanService.moveCard(
        board.id,
        cardId,
        sourceColumnId,
        destinationColumnId
      );
    } catch (error) {
      console.error("Failed to move card via service:", error);
      // No need to revert the optimistic update since it's already applied
    }
  };

  // Filter cards based on search query - optimized with useMemo
  const getFilteredBoard = React.useMemo(() => {
    if (!board || !searchQuery.trim()) return board;
    
    // Convert search query to lowercase once for performance
    const lowerSearchQuery = searchQuery.toLowerCase();
    
    const filteredBoard: KanbanBoardType = {
      ...board,
      columns: board.columns.map(column => ({
        ...column,
        cards: column.cards.filter(card => {
          // Check title
          if (card.title.toLowerCase().includes(lowerSearchQuery)) {
            return true;
          }
          
          // Check description if exists
          if (card.description && card.description.toLowerCase().includes(lowerSearchQuery)) {
            return true;
          }
          
          // Check tags if exist
          if (card.tags && card.tags.some(tag => tag.toLowerCase().includes(lowerSearchQuery))) {
            return true;
          }
          
          return false;
        })
      }))
    };
    
    return filteredBoard;
  }, [board, searchQuery]);

  // Open new card form or edit existing card
  const handleAddCard = (status: KanbanStatus, card?: KanbanCardType) => {
    setSelectedStatus(status);
    setSelectedCard(card || null);
    setIsCardFormOpen(true);
  };

  if (!board) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  const filteredBoard = getFilteredBoard;

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{board.title}</h1>
          <p className="text-gray-500">
            Last updated: {new Date(board.updatedAt || board.createdAt).toLocaleDateString()}
          </p>
        </div>
        
        <Button onClick={() => handleAddCard('todo')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>
      
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search tasks..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              Filter
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Filter by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <span>Priority</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span>Assignee</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span>Tags</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span>Due Date</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <Alert className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Tip</AlertTitle>
        <AlertDescription>
          Drag and drop cards between columns to update their status. Click on a card to edit its details.
        </AlertDescription>
      </Alert>
      
      <div className="overflow-x-auto pb-4">
        {filteredBoard && (
          <OptimizedKanbanBoard
            board={filteredBoard}
            onCardMove={handleCardMove}
            onCardClick={(card) => handleAddCard(card.status, card)}
          />
        )}
      </div>
      
      {isCardFormOpen && (
        <OptimizedKanbanCardForm
          open={isCardFormOpen}
          onClose={() => setIsCardFormOpen(false)}
          onSubmit={handleCardSubmit}
          initialData={selectedCard || undefined}
          status={selectedStatus}
        />
      )}
    </div>
  );
}
