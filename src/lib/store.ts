import { create } from 'zustand';
import type { TemplateData } from './templates-data';

export type ViewType = 'landing' | 'builder' | 'dashboard' | 'fill' | 'results' | 'templates' | 'admin' | 'user-panel';

export interface QuestionOption {
  id: string;
  text: string;
}

export interface ImageOption {
  id: string;
  text: string;
  imageUrl: string;
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
  imageOptions?: ImageOption[];
  description?: string;
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
  welcomeMessage?: string;
  submitButtonText?: string;
  thankYouMessage?: string;
  progressStyle?: 'bar' | 'dots' | 'hidden';
  notificationEnabled?: boolean;
  notificationEmail?: string;
  dailySummary?: boolean;
  webhookUrl?: string;
  telegramNotification?: boolean;
  telegramChatId?: string;
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

export interface FormSection {
  id: string;
  title: string;
  description?: string;
  questionIds: string[];
}

export interface ActivityItem {
  id: string;
  type: 'create' | 'edit' | 'publish' | 'submit' | 'delete' | 'duplicate';
  formTitle: string;
  formId: string;
  timestamp: Date;
}

export interface FormTag {
  id: string;
  name: string;
  color: string; // Tailwind color classes like 'violet', 'emerald', 'amber', 'rose', 'cyan', 'blue'
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  type: 'info' | 'success' | 'warning';
  read: boolean;
  createdAt: Date;
}

export interface NotificationSettings {
  enabled: boolean;
  email: string;
  dailySummary: boolean;
  webhookUrl: string;
  telegramEnabled: boolean;
  telegramChatId: string;
}

export interface Submission {
  id: string;
  formId: string;
  respondent: string | null;
  createdAt: string;
  responses: { questionId: string; value: string }[];
}

interface AppState {
  // Notifications
  notifications: NotificationItem[];
  addNotification: (notification: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;

  // Quick search
  quickSearchOpen: boolean;
  setQuickSearchOpen: (open: boolean) => void;
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
  duplicateQuestion: (id: string) => void;
  moveQuestionUp: (id: string) => void;
  moveQuestionDown: (id: string) => void;

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

  // Sections
  sections: FormSection[];
  addSection: (title: string) => void;
  updateSection: (id: string, updates: Partial<FormSection>) => void;
  removeSection: (id: string) => void;
  moveQuestionToSection: (questionId: string, sectionId: string | null) => void;

  // Activity Log
  activityLog: ActivityItem[];
  addActivity: (item: Omit<ActivityItem, 'id' | 'timestamp'>) => void;

  // Dashboard
  submissions: Submission[];
  setSubmissions: (submissions: Submission[]) => void;
  deletedForms: Form[];
  addToDeletedForms: (form: Form) => void;

  // Sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;

  // Notifications
  notifications: NotificationItem[];
  addNotification: (notification: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;

  // Quick search
  quickSearchOpen: boolean;
  setQuickSearchOpen: (open: boolean) => void;

  // Favorites
  favoriteFormIds: string[];
  toggleFavoriteForm: (id: string) => void;

  // Form Tags
  tags: FormTag[];
  addTag: (name: string, color: string) => void;
  removeTag: (id: string) => void;
  formTagIds: Record<string, string[]>; // formId -> tagId[]
  toggleFormTag: (formId: string, tagId: string) => void;
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

  duplicateQuestion: (id) => {
    get().pushHistory();
    const state = get();
    const question = state.questions.find((q) => q.id === id);
    if (!question) return;
    const cloned: FormQuestion = {
      ...structuredClone(question),
      id: crypto.randomUUID(),
      title: question.title + ' (کپی)',
      config: {
        ...question.config,
        options: question.config.options?.map((o) => ({ ...o, id: crypto.randomUUID() })),
        imageOptions: question.config.imageOptions?.map((o) => ({ ...o, id: crypto.randomUUID() })),
      },
    };
    const idx = state.questions.findIndex((q) => q.id === id);
    const newQuestions = [...state.questions];
    newQuestions.splice(idx + 1, 0, cloned);
    const reordered = newQuestions.map((q, i) => ({ ...q, order: i }));
    set({ questions: reordered, selectedQuestionId: cloned.id });
  },

  moveQuestionUp: (id) => {
    const state = get();
    const idx = state.questions.findIndex((q) => q.id === id);
    if (idx <= 0) return;
    get().pushHistory();
    const newQuestions = [...state.questions];
    const temp = newQuestions[idx];
    newQuestions[idx] = newQuestions[idx - 1];
    newQuestions[idx - 1] = temp;
    const reordered = newQuestions.map((q, i) => ({ ...q, order: i }));
    set({ questions: reordered });
  },

  moveQuestionDown: (id) => {
    const state = get();
    const idx = state.questions.findIndex((q) => q.id === id);
    if (idx === -1 || idx >= state.questions.length - 1) return;
    get().pushHistory();
    const newQuestions = [...state.questions];
    const temp = newQuestions[idx];
    newQuestions[idx] = newQuestions[idx + 1];
    newQuestions[idx + 1] = temp;
    const reordered = newQuestions.map((q, i) => ({ ...q, order: i }));
    set({ questions: reordered });
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
    welcomeMessage: '',
    submitButtonText: 'ارسال پاسخ',
    thankYouMessage: '',
    progressStyle: 'bar',
  },
  setFormTheme: (theme) =>
    set((state) => ({
      formTheme: { ...state.formTheme, ...theme },
    })),

  // Sections
  sections: [],
  addSection: (title) => set((state) => ({
    sections: [...state.sections, { id: crypto.randomUUID(), title, description: '', questionIds: [] }],
  })),
  updateSection: (id, updates) => set((state) => ({
    sections: state.sections.map((s) => (s.id === id ? { ...s, ...updates } : s)),
  })),
  removeSection: (id) => set((state) => ({
    sections: state.sections.filter((s) => s.id !== id),
  })),
  moveQuestionToSection: (questionId, sectionId) => set((state) => ({
    sections: state.sections.map((s) => {
      const qids = s.questionIds.filter((qid) => qid !== questionId);
      if (s.id === sectionId) {
        return { ...s, questionIds: [...qids, questionId] };
      }
      return { ...s, questionIds: qids };
    }),
  })),

  // Activity Log
  activityLog: [],
  addActivity: (item) => set((state) => {
    const newLog = [
      { ...item, id: crypto.randomUUID(), timestamp: new Date() },
      ...state.activityLog,
    ];
    return { activityLog: newLog.slice(0, 20) };
  }),

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

  // Notifications
  notifications: [],
  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        {
          ...notification,
          id: crypto.randomUUID(),
          read: false,
          createdAt: new Date(),
        },
        ...state.notifications,
      ],
    })),
  markNotificationAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),
  clearAllNotifications: () => set({ notifications: [] }),

  // Quick search
  quickSearchOpen: false,
  setQuickSearchOpen: (open) => set({ quickSearchOpen: open }),

  // Favorites
  favoriteFormIds: [],
  toggleFavoriteForm: (id) =>
    set((state) => ({
      favoriteFormIds: state.favoriteFormIds.includes(id)
        ? state.favoriteFormIds.filter((fid) => fid !== id)
        : [...state.favoriteFormIds, id],
    })),

  // Form Tags
  tags: [
    { id: 'tag-1', name: 'مهم', color: 'rose' },
    { id: 'tag-2', name: 'در حال بررسی', color: 'amber' },
    { id: 'tag-3', name: 'تکمیل شده', color: 'emerald' },
    { id: 'tag-4', name: 'پروژه', color: 'violet' },
    { id: 'tag-5', name: 'شخصی', color: 'blue' },
    { id: 'tag-6', name: 'کاری', color: 'cyan' },
  ],
  addTag: (name, color) => set((state) => ({
    tags: [...state.tags, { id: crypto.randomUUID(), name, color }],
  })),
  removeTag: (id) => set((state) => ({
    tags: state.tags.filter((t) => t.id !== id),
    formTagIds: Object.fromEntries(
      Object.entries(state.formTagIds).map(([fid, tids]) => [fid, tids.filter((tid) => tid !== id)])
    ),
  })),
  formTagIds: {},
  toggleFormTag: (formId, tagId) => set((state) => {
    const current = state.formTagIds[formId] || [];
    const updated = current.includes(tagId)
      ? current.filter((tid) => tid !== tagId)
      : [...current, tagId];
    return { formTagIds: { ...state.formTagIds, [formId]: updated } };
  }),
}));
