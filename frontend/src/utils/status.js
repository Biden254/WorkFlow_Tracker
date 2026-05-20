import { STATUSES } from "../types/application";

export const statusClassNames = {
  [STATUSES.DRAFT]: "bg-slate-200 text-slate-700",
  [STATUSES.SUBMITTED]: "bg-blue-100 text-blue-700",
  [STATUSES.UNDER_REVIEW]: "bg-amber-100 text-amber-800",
  [STATUSES.NEED_MORE_INFORMATION]: "bg-orange-100 text-orange-700",
  [STATUSES.APPROVED]: "bg-emerald-100 text-emerald-700",
  [STATUSES.REJECTED]: "bg-rose-100 text-rose-700",
};

