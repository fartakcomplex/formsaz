import { create } from 'zustand';

export type ViewType = 'landing' | 'builder' | 'dashboard' | 'fill' | 'results';

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

  // Form theme
  formTheme: FormTheme;
  setFormTheme: (theme: Partial<FormTheme>) => void;

  // Dashboard
  submissions: Submission[];
  setSubmissions: (submissions: Submission[]) => void;

  // Sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Navigation
  currentView: 'landing',
  setCurrentView: (view) => set({ previousView: get().currentView, currentView: view }),
  previousView: null,

  // Forms
  forms: [],
  setForms: (forms) => set({ forms }),
  currentForm: null,
  setCurrentForm: (form) => set({ currentForm: form, questions: form?.questions || [] }),
  fillForm: null,
  setFillForm: (form) => set({ fillForm: form }),

  // Builder state
  questions: [],
  setQuestions: (questions) => set({ questions }),
  selectedQuestionId: null,
  setSelectedQuestionId: (id) => set({ selectedQuestionId: id }),

  addQuestion: (question) =>
    set((state) => ({
      questions: [...state.questions, question],
      selectedQuestionId: question.id,
    })),

  updateQuestion: (id, updates) =>
    set((state) => ({
      questions: state.questions.map((q) => (q.id === id ? { ...q, ...updates } : q)),
    })),

  removeQuestion: (id) =>
    set((state) => ({
      questions: state.questions.filter((q) => q.id !== id),
      selectedQuestionId: state.selectedQuestionId === id ? null : state.selectedQuestionId,
    })),

  reorderQuestions: (questions) => set({ questions }),

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

  // Sidebar
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
