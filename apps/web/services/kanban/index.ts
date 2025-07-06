import { KanbanBoard, KanbanCard, KanbanStatus, } from "@/types/kanban.type";


// Utility function for debouncing
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function(this: any, ...args: Parameters<T>) {
    const context = this;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

// This is a mock service that simulates backend API calls
// In a real application, this would make HTTP requests to your API

class KanbanService {
  private static instance: KanbanService;
  // Debounced version of storage save to reduce write operations
  private debouncedSaveToStorage = debounce((boards: KanbanBoard[]) => {
    localStorage.setItem('kanban_boards', JSON.stringify(boards));
  }, 300); // 300ms debounce
  
  // Singleton pattern
  public static getInstance(): KanbanService {
    if (!KanbanService.instance) {
      KanbanService.instance = new KanbanService();
    }
    return KanbanService.instance;
  }
  
  // Get all boards (in a real app, this would be an API call)
  async getBoards(): Promise<KanbanBoard[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock data from localStorage or default data
    const savedBoards = localStorage.getItem('kanban_boards');
    if (savedBoards) {
      return JSON.parse(savedBoards);
    }
    
    return [this.getDefaultBoard()];
  }
  
  // Get a specific board by ID
  async getBoardById(boardId: string): Promise<KanbanBoard | null> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const boards = await this.getBoards();
    return boards.find(board => board.id === boardId) || null;
  }
  
  // Save a board (create or update)
  async saveBoard(board: KanbanBoard): Promise<KanbanBoard> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const boards = await this.getBoards();
    const index = boards.findIndex(b => b.id === board.id);
    
    if (index >= 0) {
      // Update existing board
      boards[index] = board;
    } else {
      // Create new board
      boards.push(board);
    }
    
    // Save to localStorage (in a real app, this would be an API call)
    this.debouncedSaveToStorage(boards);
    
    return board;
  }
  
  // Update a card's status
  async moveCard(
    boardId: string,
    cardId: string,
    sourceColumnId: KanbanStatus,
    destinationColumnId: KanbanStatus
  ): Promise<boolean> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const board = await this.getBoardById(boardId);
    if (!board) return false;
    
    // Find the source column
    const sourceColumnIndex = board.columns.findIndex(col => col.id === sourceColumnId);
    if (sourceColumnIndex < 0) return false;
    
    const sourceColumn = board.columns[sourceColumnIndex];
    if (!sourceColumn || !sourceColumn.cards) return false;
    
    // Find the card in the source column
    const cardIndex = sourceColumn.cards.findIndex(card => card.id === cardId);
    if (cardIndex < 0) return false;
    
    // Get the card
    const [movedCard] = sourceColumn.cards.splice(cardIndex, 1);
    if (!movedCard) return false;
    
    // Find the destination column
    const destColumnIndex = board.columns.findIndex(col => col.id === destinationColumnId);
    if (destColumnIndex < 0) {
      // Put the card back if destination column not found
      sourceColumn.cards.splice(cardIndex, 0, movedCard);
      return false;
    }
    
    const destColumn = board.columns[destColumnIndex];
    if (!destColumn || !destColumn.cards) {
      // Put the card back if destination column structure is invalid
      sourceColumn.cards.splice(cardIndex, 0, movedCard);
      return false;
    }
    
    // Update card status and timestamp
    movedCard.status = destinationColumnId;
    movedCard.updatedAt = new Date().toISOString();
    
    // Add the card to the destination column
    destColumn.cards.push(movedCard);
    
    // Update the board's timestamp
    board.updatedAt = new Date().toISOString();
    
    // Save the updated board
    await this.saveBoard(board);
    
    return true;
  }
  
  // Create or update a card
  async saveCard(boardId: string, card: KanbanCard): Promise<KanbanCard> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const board = await this.getBoardById(boardId);
    if (!board) throw new Error('Board not found');
    
    const isNewCard = !card.id;
    
    if (isNewCard) {
      // Create a new card with an ID
      const newCard: KanbanCard = {
        ...card,
        id: `card-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      
      // Find the column to add the card to
      const columnIndex = board.columns.findIndex(col => col.id === card.status);
      if (columnIndex < 0) throw new Error('Column not found');
      
      const column = board.columns[columnIndex];
      if (!column || !column.cards) throw new Error('Invalid column structure');
      
      // Add the card to the column
      column.cards.push(newCard);
      
      // Update the board
      board.updatedAt = new Date().toISOString();
      await this.saveBoard(board);
      
      return newCard;
    } else {
      // Update existing card
      const columnIndex = board.columns.findIndex(col => {
        return col.cards && col.cards.some(c => c.id === card.id);
      });
      
      if (columnIndex < 0) throw new Error('Card not found');
      
      const column = board.columns[columnIndex];
      if (!column || !column.cards) throw new Error('Invalid column structure');
      
      const cardIndex = column.cards.findIndex(c => c.id === card.id);
      if (cardIndex < 0) throw new Error('Card not found');
      
      // If the status has changed, we need to move the card to another column
      if (column.id !== card.status) {
        // Remove from current column
        const [removedCard] = column.cards.splice(cardIndex, 1);
        
        // Find new column
        const newColumnIndex = board.columns.findIndex(col => col.id === card.status);
        if (newColumnIndex < 0) throw new Error('Destination column not found');
        
        const newColumn = board.columns[newColumnIndex];
        if (!newColumn || !newColumn.cards) throw new Error('Invalid destination column structure');
        
        // Update the card
        const updatedCard: KanbanCard = {
          ...removedCard,
          ...card,
          updatedAt: new Date().toISOString(),
        };
        
        // Add to new column
        newColumn.cards.push(updatedCard);
      } else {
        // Just update the card in its current column
        const currentCard = column.cards[cardIndex];
        column.cards[cardIndex] = {
          ...currentCard,
          ...card,
          updatedAt: new Date().toISOString(),
        };
      }
      
      // Update the board
      board.updatedAt = new Date().toISOString();
      await this.saveBoard(board);
      
      return card;
    }
  }
  
  // Delete a card
  async deleteCard(boardId: string, cardId: string): Promise<boolean> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const board = await this.getBoardById(boardId);
    if (!board) return false;
    
    // Find the column containing the card
    let found = false;
    
    for (const column of board.columns) {
      const cardIndex = column.cards.findIndex(card => card.id === cardId);
      if (cardIndex >= 0) {
        // Remove the card
        column.cards.splice(cardIndex, 1);
        found = true;
        break;
      }
    }
    
    if (found) {
      // Update the board
      board.updatedAt = new Date().toISOString();
      await this.saveBoard(board);
    }
    
    return found;
  }
  
  // Default board data for new users
  private getDefaultBoard(): KanbanBoard {
    return {
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
  }
}

export default KanbanService.getInstance();
