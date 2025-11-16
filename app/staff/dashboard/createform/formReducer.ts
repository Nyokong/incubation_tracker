import { FormDraftType, OptionsType, QuestionsType } from "@/types/next-auth";

type Action =
  | {
      type: "SET_FORM_META";
      title?: string;
      description?: string;
    }
  | { type: "SET_FORMID"; formId?: string }
  | { type: "SET_CREATOR"; createdById?: string }
  | { type: "ADD_QUESTION"; question: QuestionsType; index?: number }
  | { type: "UPDATE_QUESTION"; id: string; patch: Partial<QuestionsType> }
  | { type: "REMOVE_QUESTION"; id: string }
  | { type: "REORDER_QUESTIONS"; from: number; to: number }
  | { type: "ADD_OPTION"; qid: string; option: OptionsType; index?: number }
  | {
      type: "UPDATE_OPTION";
      qid: string;
      oid: string;
      patch: Partial<OptionsType>;
    }
  | { type: "REMOVE_OPTION"; qid: string; oid: string }
  | { type: "SET_STATUS"; status: FormDraftType["status"] }
  | { type: "HYDRATE"; form: FormDraftType }
  | { type: "RESET_FORM" };

export function formReducer(
  state: FormDraftType,
  action: Action
): FormDraftType {
  switch (action.type) {
    case "SET_FORM_META": {
      return {
        ...state,
        title: action.title ?? state.title,
        description: action.description ?? state.description,
        updatedAt: Date.now(),
      };
    }
    case "SET_CREATOR": {
      return {
        ...state,
        createdById: action.createdById ?? state.createdById,
      };
    }
    case "ADD_QUESTION": {
      const next = [...state.questions];
      const at = action.index ?? next.length;
      next.splice(at, 0, action.question);
      return { ...state, questions: next, updatedAt: Date.now() };
    }
    case "UPDATE_QUESTION": {
      return {
        ...state,
        questions: state.questions.map((q) =>
          q.id === action.id ? { ...q, ...action.patch } : q
        ),
        updatedAt: Date.now(),
      };
    }
    case "REMOVE_QUESTION": {
      return {
        ...state,
        questions: state.questions.filter((q) => q.id !== action.id),
        updatedAt: Date.now(),
      };
    }
    case "REORDER_QUESTIONS": {
      const next = [...state.questions];
      const [moved] = next.splice(action.from, 1);
      next.splice(action.to, 0, moved);
      return { ...state, questions: next, updatedAt: Date.now() };
    }
    case "ADD_OPTION": {
      return {
        ...state,
        questions: state.questions.map((q) =>
          q.id === action.qid
            ? {
                ...q,
                options: insertOption(
                  q.options ?? [],
                  action.option,
                  action.index
                ),
              }
            : q
        ),
        updatedAt: Date.now(),
      };
    }
    case "UPDATE_OPTION": {
      return {
        ...state,
        questions: state.questions.map((q) =>
          q.id === action.qid
            ? {
                ...q,
                options: (q.options ?? []).map((o: any) =>
                  o.id === action.oid ? { ...o, ...action.patch } : o
                ),
              }
            : q
        ),
        updatedAt: Date.now(),
      };
    }
    case "REMOVE_OPTION": {
      return {
        ...state,
        questions: state.questions.map((q) =>
          q.id === action.qid
            ? {
                ...q,
                options: (q.options ?? []).filter(
                  (o: any) => o.id !== action.oid
                ),
              }
            : q
        ),
        updatedAt: Date.now(),
      };
    }
    case "SET_STATUS": {
      return { ...state, status: action.status, updatedAt: Date.now() };
    }
    case "HYDRATE": {
      return action.form;
    }
    case "RESET_FORM":
      return {
        formId: "",
        title: "",
        description: "",
        questions: [],
        createdById: "",
        status: "draft",
        updatedAt: Date.now(),
      };
    default:
      return state;
  }
}

function insertOption(
  list: OptionsType[],
  option: OptionsType,
  index?: number
) {
  const next = [...list];
  const at = index ?? next.length;
  next.splice(at, 0, option);
  return next;
}
