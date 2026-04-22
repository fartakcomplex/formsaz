import { create } from 'zustand';
import type { TemplateData } from './templates-data';

export type ViewType = 'landing' | 'builder' | 'dashboard' | 'fill' | 'results' | 'templates';

export interface QuestionOption {
  id: string;
  text: string;
}

export interface QuestionConfig {
  placeholder?: string;
  options?: QuestionOption[];
  min?: number;
  max?: number;
  scaleMin?: number;
  scaleMax?: number;
  scaleMinLabel?: string;
  scaleMaxLabel?: string;
  matrixRows?: string[];
  matrixCols?: string[];
  multiple?: boolean;
  allowOther?: boolean;
  step?: number;
  maxLength?: number;
  pattern?: string;
}

export interface ConditionRule {
  questionId: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'is_answered' | 'is_not_answered';
  value?: string;
}

export interface QuestionLogic {
  enabled: boolean;
  action: 'show' | 'hide';
  conditions: ConditionRule[];
}

export interface FormQuestion {
  id: string;
  type: string;
  title: string;
  required: boolean;
  order: number;
  config: QuestionConfig;
  logic?: QuestionLogic;
}

export interface FormTheme {
  primaryColor: string;
  backgroundColor: string;
  fontFamily: string;
  borderRadius: number;
}

export interface Form {
  id: string;
  title: string;
  description: string | null;
  theme: string;
  status: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  expiresAt: string | null;
  questions: FormQuestion[];
  _count?: {
    submissions: number;
  };
}

export interface Submission {
  id: string;
  formId: string;
  respondent: string | null;
  createdAt: string;
  responses: { questionId: string; value: string }[];
}

interface AppState {
  // Navigation
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  previousView: ViewType | null;

  // Forms
  forms: Form[];
  setForms: (forms: Form[]) => void;
  currentForm: Form | null;
  setCurrentForm: (form: Form | null) => void;
  fillForm: Form | null;
  setFillForm: (form: Form | null) => void;

  // Builder state
  questions: FormQuestion[];
  setQuestions: (questions: FormQuestion[]) => void;
  selectedQuestionId: string | null;
  setSelectedQuestionId: (id: string | null) => void;
  addQuestion: (question: FormQuestion) => void;
  updateQuestion: (id: string, updates: Partial<FormQuestion>) => void;
  removeQuestion: (id: string) => void;
  reorderQuestions: (questions: FormQuestion[]) => void;

  // History (undo/redo)
  history: FormQuestion[][];
  historyIndex: number;
  canUndo: boolean;
  canRedo: boolean;
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
  initHistory: (questions: FormQuestion[]) => void;

  // Form theme
  formTheme: FormTheme;
  setFormTheme: (theme: Partial<FormTheme>) => void;

  // Dashboard
  submissions: Submission[];
  setSubmissions: (submissions: Submission[]) => void;
  deletedForms: Form[];
  addToDeletedForms: (form: Form) => void;

  // Sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

// Module-level debounce state for updateQuestion history
let updateDebounceTimer: ReturnType<typeof setTimeout> | null = null;
let preUpdateSnapshot: FormQuestion[] | null = null;

const MAX_HISTORY_SIZE = 50;

export const useAppStore = create<AppState>((set, get) => ({
  // Navigation
  currentView: 'landing',
  setCurrentView: (view) => set({ previousView: get().currentView, currentView: view }),
  previousView: null,

  // Forms
  forms: [],
  setForms: (forms) => set({ forms }),
  currentForm: null,
  setCurrentForm: (form) => {
    const questions = form?.questions || [];
    const snapshot = JSON.parse(JSON.stringify(questions));
    set({
      currentForm: form,
      questions,
      history: [snapshot],
      historyIndex: 0,
      canUndo: false,
      canRedo: false,
    });
  },
  fillForm: null,
  setFillForm: (form) => set({ fillForm: form }),

  // Builder state
  questions: [],
  setQuestions: (questions) => {
    const snapshot = JSON.parse(JSON.stringify(questions));
    set({
      questions,
      history: [snapshot],
      historyIndex: 0,
      canUndo: false,
      canRedo: false,
    });
  },
  selectedQuestionId: null,
  setSelectedQuestionId: (id) => set({ selectedQuestionId: id }),

  addQuestion: (question) => {
    get().pushHistory();
    set((state) => ({
      questions: [...state.questions, question],
      selectedQuestionId: question.id,
    }));
  },

  updateQuestion: (id, updates) => {
    // Save a snapshot on the first update in a debounce cycle
    if (!updateDebounceTimer) {
      preUpdateSnapshot = JSON.parse(JSON.stringify(get().questions));
    }

    // Clear existing debounce timer
    if (updateDebounceTimer) {
      clearTimeout(updateDebounceTimer);
    }

    // Perform the mutation immediately
    set((state) => ({
      questions: state.questions.map((q) => (q.id === id ? { ...q, ...updates } : q)),
    }));

    // Debounce: push snapshot to history after 300ms of no changes
    updateDebounceTimer = setTimeout(() => {
      if (preUpdateSnapshot) {
        const state = get();
        const newHistory = state.history.slice(0, state.historyIndex + 1);
        newHistory.push(preUpdateSnapshot);
        if (newHistory.length > MAX_HISTORY_SIZE) newHistory.shift();
        const newIndex = newHistory.length - 1;
        set({
          history: newHistory,
          historyIndex: newIndex,
          canUndo: newIndex > 0,
          canRedo: false,
        });
        preUpdateSnapshot = null;
      }
      updateDebounceTimer = null;
    }, 300);
  },

  removeQuestion: (id) => {
    get().pushHistory();
    set((state) => ({
      questions: state.questions.filter((q) => q.id !== id),
      selectedQuestionId: state.selectedQuestionId === id ? null : state.selectedQuestionId,
    }));
  },

  reorderQuestions: (questions) => {
    get().pushHistory();
    set({ questions });
  },

  // History (undo/redo)
  history: [],
  historyIndex: -1,
  canUndo: false,
  canRedo: false,

  pushHistory: () => {
    // Flush any pending debounced update first
    if (updateDebounceTimer) {
      clearTimeout(updateDebounceTimer);
      updateDebounceTimer = null;
      if (preUpdateSnapshot) {
        const state = get();
        const newHistory = state.history.slice(0, state.historyIndex + 1);
        newHistory.push(preUpdateSnapshot);
        if (newHistory.length > MAX_HISTORY_SIZE) newHistory.shift();
        const newIndex = newHistory.length - 1;
        set({
          history: newHistory,
          historyIndex: newIndex,
          canUndo: newIndex > 0,
          canRedo: false,
        });
        preUpdateSnapshot = null;
      }
    }

    // Push the current state to history
    const state = get();
    const snapshot = JSON.parse(JSON.stringify(state.questions));
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push(snapshot);
    if (newHistory.length > MAX_HISTORY_SIZE) newHistory.shift();
    const newIndex = newHistory.length - 1;
    set({
      history: newHistory,
      historyIndex: newIndex,
      canUndo: newIndex > 0,
      canRedo: false,
    });
  },

  undo: () => {
    const state = get();
    if (state.historyIndex > 0) {
      const newIndex = state.historyIndex - 1;
      const restoredQuestions = JSON.parse(JSON.stringify(state.history[newIndex]));
      const selectedExists = restoredQuestions.some((q) => q.id === state.selectedQuestionId);
      set({
        questions: restoredQuestions,
        historyIndex: newIndex,
        canUndo: newIndex > 0,
        canRedo: true,
        selectedQuestionId: selectedExists ? state.selectedQuestionId : null,
      });
    }
  },

  redo: () => {
    const state = get();
    if (state.historyIndex < state.history.length - 1) {
      const newIndex = state.historyIndex + 1;
      const restoredQuestions = JSON.parse(JSON.stringify(state.history[newIndex]));
      const selectedExists = restoredQuestions.some((q) => q.id === state.selectedQuestionId);
      set({
        questions: restoredQuestions,
        historyIndex: newIndex,
        canUndo: true,
        canRedo: newIndex < state.history.length - 1,
        selectedQuestionId: selectedExists ? state.selectedQuestionId : null,
      });
    }
  },

  initHistory: (questions) => {
    const snapshot = JSON.parse(JSON.stringify(questions));
    set({
      history: [snapshot],
      historyIndex: 0,
      canUndo: false,
      canRedo: false,
    });
  },

  // Form theme
  formTheme: {
    primaryColor: '#6366f1',
    backgroundColor: '#ffffff',
    fontFamily: 'Vazirmatn',
    borderRadius: 8,
  },
  setFormTheme: (theme) =>
    set((state) => ({
      formTheme: { ...state.formTheme, ...theme },
    })),

  // Dashboard
  submissions: [],
  setSubmissions: (submissions) => set({ submissions }),
  deletedForms: [],
  addToDeletedForms: (form) =>
    set((state) => ({
      deletedForms: [...state.deletedForms, form],
    })),

  // Sidebar
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
