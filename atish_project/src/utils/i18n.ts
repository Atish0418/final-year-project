import { streamTranslations, departmentTranslations } from "../i18n/content";
import { streams } from "../data/streams";
import { departments } from "../data/departments";

export type Lang = "en" | "ta";

const findDepartment = (key: string) =>
  departments.find((d) => d.id === key || d.slug === key);

export const localizeStream = (id: string, lang: Lang) => {
  const base = streams.find((s) => s.id === id);
  if (!base) return null;
  if (lang === "en") return base;
  const tr = streamTranslations[id];
  return {
    ...base,
    title: tr?.title ?? base.title,
    summary: tr?.summary ?? base.summary,
    focus: tr?.focus ?? base.focus,
  };
};

export const localizeDepartment = (key: string, lang: Lang) => {
  const base = findDepartment(key);
  if (!base) return null;
  if (lang === "en") return base;
  const tr = departmentTranslations[base.id] ?? departmentTranslations[base.slug ?? ""] ?? {};
  return {
    ...base,
    name: base.tamilName ?? tr.name ?? base.name,
    overview: tr.overview ?? base.overview,
    bestFor: tr.bestFor ?? base.bestFor,
    avoidIf: tr.avoidIf ?? base.avoidIf,
    futureScope: tr.futureScope ?? base.futureScope,
  };
};
