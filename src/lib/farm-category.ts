export const FARM_CATEGORY_OPTIONS = [
  { value: "company_organization", label: "Company/Organization Farm" },
  { value: "school", label: "School Farm" },
  { value: "family_personal", label: "Family/Personal Farm" },
] as const;

export type FarmCategory = (typeof FARM_CATEGORY_OPTIONS)[number]["value"];

export function farmCategoryLabel(category: string): string {
  return FARM_CATEGORY_OPTIONS.find((opt) => opt.value === category)?.label ?? category;
}
