'use client';

import React, { useState, useCallback, memo } from 'react';
import { KanbanCard, KanbanStatus } from '@/types/kanban.type';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { BadgeCheck, Calendar, Tag, Users, X } from 'lucide-react';

interface KanbanCardFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (card: Partial<KanbanCard>) => void;
  initialData?: Partial<KanbanCard>;
  status: KanbanStatus;
}

// Memoized input component to prevent unnecessary re-renders
const MemoizedInput = memo(({ 
  label, 
  id,
  value,
  onChange,
  placeholder,
  required,
  className,
  type,
  name
}: { 
  label: string;
  id: string;
  value: string;
  name?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  type?: string;
}) => (
  <div className="grid gap-2">
    <Label htmlFor={id}>{label}</Label>
    <Input 
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={className}
      type={type}
      name={name}
    />
  </div>
));

MemoizedInput.displayName = 'MemoizedInput';

// Optimized KanbanCardForm component
export const OptimizedKanbanCardForm = ({
  open,
  onClose,
  onSubmit,
  initialData,
  status,
}: KanbanCardFormProps) => {
  // Use initialData to pre-populate form fields
  const [formData, setFormData] = useState<Partial<KanbanCard>>({
    id: initialData?.id || '',
    title: initialData?.title || '',
    description: initialData?.description || '',
    status: initialData?.status || status,
    priority: initialData?.priority || 'medium',
    dueDate: initialData?.dueDate || '',
    assignee: initialData?.assignee,
    tags: initialData?.tags || [],
  });

  const [tagInput, setTagInput] = useState('');

  // Memoized handlers to prevent recreating them on each render
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSelectChange = useCallback((name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleTagAdd = useCallback(() => {
    if (!tagInput.trim()) return;
    
    setFormData(prev => ({
      ...prev,
      tags: [...(prev.tags || []), tagInput.trim()]
    }));
    setTagInput('');
  }, [tagInput]);

  const handleTagDelete = useCallback((tagToDelete: string) => {
    setFormData(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(tag => tag !== tagToDelete)
    }));
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  }, [formData, onSubmit, onClose]);

  // Memoized components for better performance
  const priorityOptions = React.useMemo(() => (
    <Select 
      name="priority"
      value={formData.priority} 
      onValueChange={value => handleSelectChange('priority', value)}
    >
      <SelectTrigger id="priority">
        <SelectValue placeholder="Select priority" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="low">Low</SelectItem>
        <SelectItem value="medium">Medium</SelectItem>
        <SelectItem value="high">High</SelectItem>
        <SelectItem value="urgent">Urgent</SelectItem>
      </SelectContent>
    </Select>
  ), [formData.priority, handleSelectChange]);

  const statusOptions = React.useMemo(() => (
    <Select 
      name="status"
      value={formData.status} 
      onValueChange={value => handleSelectChange('status', value as KanbanStatus)}
    >
      <SelectTrigger id="status">
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="backlog">Backlog</SelectItem>
        <SelectItem value="todo">To Do</SelectItem>
        <SelectItem value="in-progress">In Progress</SelectItem>
        <SelectItem value="review">Review</SelectItem>
        <SelectItem value="done">Done</SelectItem>
      </SelectContent>
    </Select>
  ), [formData.status, handleSelectChange]);

  const tagsSection = React.useMemo(() => (
    <div className="grid gap-2">
      <Label htmlFor="tags">Tags</Label>
      <div className="flex flex-wrap gap-2 mb-2">
        {formData.tags?.map(tag => (
          <div 
            key={tag} 
            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center"
          >
            {tag}
            <Button 
              type="button"
              variant="ghost" 
              size="icon" 
              className="h-4 w-4 ml-1 hover:bg-blue-200 rounded-full"
              onClick={() => handleTagDelete(tag)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input 
          id="tags"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          placeholder="Add a tag..."
        />
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleTagAdd}
          disabled={!tagInput.trim()}
        >
          Add
        </Button>
      </div>
    </div>
  ), [formData.tags, tagInput, handleTagAdd, handleTagDelete]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{initialData ? 'Edit Task' : 'Create New Task'}</DialogTitle>
            <DialogDescription>
              {initialData 
                ? 'Make changes to the existing task.' 
                : 'Fill in the details for your new task.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <MemoizedInput 
              id="title"
              label="Title"
              value={formData.title || ''}
              onChange={handleChange}
              name="title"
              placeholder="Task title"
              required
            />
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                placeholder="Describe the task..."
                className="min-h-[100px]"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                {statusOptions}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                {priorityOptions}
              </div>
            </div>
            
            <MemoizedInput 
              id="dueDate"
              label="Due Date"
              type="date"
              value={formData.dueDate || ''}
              onChange={handleChange}
              name="dueDate"
            />
            
            {tagsSection}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {initialData ? 'Save Changes' : 'Create Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Export both versions for backward compatibility
export const KanbanCardForm = OptimizedKanbanCardForm;
