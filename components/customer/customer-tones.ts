export const customerTones = {
  page: "min-h-full bg-background",
  navActive:
    "border border-primary/20 bg-accent text-accent-foreground shadow-sm ring-1 ring-primary/10",
  navIdle:
    "text-foreground hover:bg-accent hover:text-accent-foreground",
  navSheetActive:
    "border border-primary/20 bg-accent text-accent-foreground shadow-sm",
  navSheetIdle:
    "text-foreground hover:bg-accent hover:text-accent-foreground",
  outlineAction:
    "border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-border dark:text-foreground dark:hover:bg-accent",
  statusPill: "bg-primary text-primary-foreground hover:bg-primary",
  icon: {
    blue: "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-200",
    emerald:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-200",
    orange:
      "bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-200",
    violet:
      "bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-200",
    teal: "bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-200",
    red: "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-200",
  },
  badge: {
    info: "bg-blue-50 text-blue-700 hover:bg-blue-50 dark:bg-blue-950/50 dark:text-blue-200 dark:hover:bg-blue-950/50",
    infoSolid:
      "bg-blue-600 text-white hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-700",
    success:
      "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-200 dark:hover:bg-emerald-950/50",
    status:
      "bg-teal-100 text-teal-800 hover:bg-teal-100 dark:bg-teal-950/50 dark:text-teal-100 dark:hover:bg-teal-950/50",
    warning:
      "bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-950/50 dark:text-amber-100 dark:hover:bg-amber-950/50",
    pending:
      "bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/50 dark:text-amber-200 dark:hover:bg-amber-950/50",
    muted:
      "bg-muted text-muted-foreground hover:bg-muted dark:bg-muted dark:text-muted-foreground",
  },
  surface: {
    warning:
      "rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/40",
    warningText: "font-medium text-amber-950 dark:text-amber-100",
    success:
      "border-emerald-200 bg-emerald-50 shadow-sm dark:border-emerald-800 dark:bg-emerald-950/40",
    danger:
      "border-red-200 bg-red-50 shadow-sm dark:border-red-800 dark:bg-red-950/40",
    info:
      "rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm text-blue-900 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-100",
    infoBlock:
      "grid gap-4 rounded-lg bg-blue-50 p-5 dark:bg-blue-950/40 md:grid-cols-2",
  },
  tabActive:
    "h-14 cursor-pointer rounded-none border-0 border-b-2 border-transparent bg-card shadow-none hover:bg-accent hover:text-accent-foreground data-[state=active]:border-primary data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-none",
  link: "text-blue-700 dark:text-blue-300",
} as const;
