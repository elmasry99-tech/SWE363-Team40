import { ROLE_DESCRIPTIONS, ROLE_LABELS } from "@/lib/constants";

export const roles = Object.keys(ROLE_LABELS).map((id) => ({
  id,
  label: ROLE_LABELS[id],
  description: ROLE_DESCRIPTIONS[id],
}));
