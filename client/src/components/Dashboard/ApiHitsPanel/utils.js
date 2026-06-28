export function getStatusStyle(status) {
  if (status >= 200 && status < 300)
    return { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" };
  if (status >= 300 && status < 400)
    return { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" };
  if (status >= 400 && status < 500)
    return { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" };
  if (status >= 500)
    return { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20" };
  return { bg: "bg-muted", text: "text-muted-foreground", border: "border-border" };
}
