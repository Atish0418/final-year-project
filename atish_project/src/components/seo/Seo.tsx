import { useEffect } from "react";
import { useLocation } from "react-router-dom";

type SeoProps = {
  title: string;
  description?: string;
  canonicalPath?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  noIndex?: boolean;
};

const SITE_NAME = "FuturePath 3D";
const DEFAULT_BASE_URL = "https://portfoliojayesh.netlify.app";
const DEFAULT_OG_IMAGE = "https://portfoliojayesh.netlify.app/og-image.png";
const AUTHOR = "Jayesh Pandey";

const buildAbsoluteUrl = (baseUrl: string, path: string) => {
  if (/^https?:\/\//i.test(path)) return path;
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
  return `${normalizedBase}/${normalizedPath}`;
};

export const Seo = ({
  title,
  description,
  canonicalPath,
  ogTitle,
  ogDescription,
  ogImage,
  ogType = "website",
  noIndex = false,
}: SeoProps) => {
  const location = useLocation();
  const baseUrl = (import.meta.env.VITE_SITE_URL as string | undefined) ?? DEFAULT_BASE_URL;
  const effectivePath = canonicalPath ?? `${location.pathname}${location.search}`;
  const canonicalUrl = buildAbsoluteUrl(baseUrl, effectivePath);

  const finalOgTitle = ogTitle ?? title;
  const finalOgDescription = ogDescription ?? description ?? "";
  const finalOgImage = ogImage ?? (import.meta.env.VITE_OG_IMAGE as string | undefined) ?? DEFAULT_OG_IMAGE;
  const ogUrl = canonicalUrl;

  useEffect(() => {
    const ensure = (selector: string, create: () => HTMLElement, apply: (el: HTMLElement) => void) => {
      let el = document.head.querySelector(selector) as HTMLElement | null;
      if (!el) {
        el = create();
        document.head.appendChild(el);
      }
      apply(el);
    };

    document.title = title;

    if (description) {
      ensure("meta[name='description']", () => {
        const m = document.createElement("meta");
        m.setAttribute("name", "description");
        return m;
      }, (el) => el.setAttribute("content", description));
    }

    ensure("meta[name='author']", () => {
      const m = document.createElement("meta");
      m.setAttribute("name", "author");
      return m;
    }, (el) => el.setAttribute("content", AUTHOR));

    ensure("link[rel='canonical']", () => {
      const l = document.createElement("link");
      l.setAttribute("rel", "canonical");
      return l;
    }, (el) => el.setAttribute("href", canonicalUrl));

    ensure("meta[property='og:site_name']", () => {
      const m = document.createElement("meta");
      m.setAttribute("property", "og:site_name");
      return m;
    }, (el) => el.setAttribute("content", SITE_NAME));

    ensure("meta[property='og:title']", () => {
      const m = document.createElement("meta");
      m.setAttribute("property", "og:title");
      return m;
    }, (el) => el.setAttribute("content", finalOgTitle));

    if (finalOgDescription) {
      ensure("meta[property='og:description']", () => {
        const m = document.createElement("meta");
        m.setAttribute("property", "og:description");
        return m;
      }, (el) => el.setAttribute("content", finalOgDescription));
    }

    ensure("meta[property='og:type']", () => {
      const m = document.createElement("meta");
      m.setAttribute("property", "og:type");
      return m;
    }, (el) => el.setAttribute("content", ogType));

    ensure("meta[property='og:url']", () => {
      const m = document.createElement("meta");
      m.setAttribute("property", "og:url");
      return m;
    }, (el) => el.setAttribute("content", ogUrl));

    ensure("meta[property='og:image']", () => {
      const m = document.createElement("meta");
      m.setAttribute("property", "og:image");
      return m;
    }, (el) => el.setAttribute("content", finalOgImage));

    ensure("meta[name='twitter:card']", () => {
      const m = document.createElement("meta");
      m.setAttribute("name", "twitter:card");
      return m;
    }, (el) => el.setAttribute("content", "summary_large_image"));

    ensure("meta[name='twitter:title']", () => {
      const m = document.createElement("meta");
      m.setAttribute("name", "twitter:title");
      return m;
    }, (el) => el.setAttribute("content", finalOgTitle));

    if (finalOgDescription) {
      ensure("meta[name='twitter:description']", () => {
        const m = document.createElement("meta");
        m.setAttribute("name", "twitter:description");
        return m;
      }, (el) => el.setAttribute("content", finalOgDescription));
    }

    ensure("meta[name='twitter:image']", () => {
      const m = document.createElement("meta");
      m.setAttribute("name", "twitter:image");
      return m;
    }, (el) => el.setAttribute("content", finalOgImage));

    if (noIndex) {
      ensure("meta[name='robots']", () => {
        const m = document.createElement("meta");
        m.setAttribute("name", "robots");
        return m;
      }, (el) => el.setAttribute("content", "noindex,nofollow"));
    }
  }, [title, description, canonicalUrl, finalOgTitle, finalOgDescription, ogType, ogUrl, finalOgImage, noIndex]);

  return null;
};

export default Seo;
