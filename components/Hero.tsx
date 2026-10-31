import HeroVideo from "./HeroVideo";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { prometheusHero } from "../content/prometheusHero";

const escapeHtml = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const pillArtwork = {
  "is-purple": ["68b04f2d1b2bf2aaede8546b_tag_icon-.svg", "68b04f2d4809843bd2954ca4_tag_icon--2.svg", "68b04f2d287d42bae4264281_tag_icon--4.svg"],
  "is-cyan": ["68b04f2d4b59b9f9721b3908_tag_icon--7.svg", "68b04f2d60272d7359aa5d6c_tag_icon--8.svg", "68b04f2d2e8445f3acc238d3_tag_icon--6.svg"],
} as const;
// Captured markup retained for baseline calibration; not the finished React implementation.
export default function Hero({ brand = "arounda" }: { brand?: "arounda" | "prometheus" }) {
 let html = readFileSync(join(process.cwd(), "reference/hero.html"), "utf8");
 if (brand === "prometheus") {
   html = html.replaceAll('href="https://arounda.agency/contact"', 'href="/contact"');
   let letterIndex = 0;
   const letterCount = prometheusHero.headline.reduce((count, part) => count + part.text.replace(/\s/g, "").length, 0);
   const revealText = (value: string) => value.split(/(\s+)/).map(word => /^\s+$/.test(word) ? word : `<span class="hero-reveal-word" aria-label="${escapeHtml(word)}">${Array.from(word).map(letter => `<span aria-hidden="true" class="hero-reveal-letter" style="--letter-delay:${(750 + 600 * letterIndex++ / Math.max(1, letterCount - 1)).toFixed(1)}ms">${escapeHtml(letter)}</span>`).join("")}</span>`).join("");
   const playMarkup = html.match(/<div class="home-hero-title-decor-play"[^>]*>[\s\S]*?<\/div>/)?.[0] ?? "";
   const inlinePlay = playMarkup.replace(/^<div\b[^>]*>/, '<button type="button" data-play-demo aria-label="Play our Furniture Odyssey demo" class="home-hero-title-decor-play prometheus-play-button">').replace(/<\/div>$/, "</button>");
   html = html.replace(/<h1 class="home-hero-subtitle">[\s\S]*?<\/h1>/,
     `<p class="home-hero-subtitle">${escapeHtml(prometheusHero.eyebrow)}</p>`);
   const headline = prometheusHero.headline.map(part => {
     const partDelay = 750 + 600 * letterIndex / Math.max(1, letterCount - 1);
     const text = revealText(part.text);
     if ("italic" in part) return `<em class="is-italic">${text}</em>`;
     if ("pill" in part) {
       const icons = pillArtwork[part.pill].map((file, index) => `<span aria-hidden="true" class="prometheus-pill-icon prometheus-pill-icon-${index + 1}"><span class="prometheus-icon-glyph" style="mask-image:url('/assets/${file}')"></span></span>`).join("");
       return `<a href="#services" class="homepage-h1-link prometheus-headline-pill ${part.pill}" style="--pill-delay:${partDelay.toFixed(1)}ms" aria-label="${escapeHtml(part.text)}"><span>${text}</span>${icons}</a>`;
     }
     return part.text === " with " ? ` <span class="prometheus-hero-with">${inlinePlay} ${text.trim()}</span> ` : text;
   }).join("");
   html = html.replace(/<div class="homepage_h1-wrapper">[\s\S]*?(?=<div class="home-hero_icons-wrapper">)/,
     `<div class="homepage_h1-wrapper"><h1 class="home-hero_h1 prometheus-hero-title" aria-label="${escapeHtml(prometheusHero.headline.map(part => part.text).join(""))}">${headline}</h1>`);
   // Captured icons were positioned against the entire old headline. Each new
   // pill owns its decorations, so line wrapping cannot detach them from a word.
   html = html.replace(/<div class="home-hero_icons-wrapper">[\s\S]*?(?=<div class="home-hero-title-decor-play")/, "");
   if (playMarkup) html = html.replace(playMarkup, "");
   prometheusHero.paragraphs.forEach((text, index) => {
     html = html.replace(new RegExp(`<p class="home-hero-quote_text home-hero-quote_text-${index + 1}">[\\s\\S]*?<\\/p>`),
       `<p class="home-hero-quote_text home-hero-quote_text-${index + 1}">${escapeHtml(text).replace(/([,.]) /g, "$1&#8194;")}</p>`);
   });
   const tags = prometheusHero.tags.map(text => `<a href="#services" class="link-white-text w-inline-block"><span class="hero_title-tag home-hero-tag">${escapeHtml(text)}</span></a>`).join("");
   html = html.replace(/<a\b[^>]*href="https:\/\/arounda.agency\/industries\/(saas|ai|web3)"[^>]*>[\s\S]*?<\/a>/g,
     (_, industry: string) => industry === "saas" ? tags : "");
   const partners = [
     { file: "furniture-odyssey-original.png", neutral: "furniture_odyssey_fff4ea.png", name: "Furniture Odyssey" },
     { file: "piercing-corner-original.png", neutral: "piercing_corner_fff4ea.png", name: "Piercing Corner" },
   ];
   html = html.replace(
     /<div class="trusted_logos">[\s\S]*?<\/div>/,
     `<div class="trusted_logos prometheus-partners">${partners.map(({ file, neutral, name }) =>
       `<div class="prometheus-partner" role="img" aria-label="${name}" tabindex="0"><img src="/partners/${neutral}" alt="" aria-hidden="true" class="prometheus-partner-logo prometheus-partner-neutral" loading="eager" decoding="async"><img src="/partners/${file}" alt="" aria-hidden="true" class="prometheus-partner-logo prometheus-partner-color" loading="eager" decoding="async"></div>`
     ).join("")}</div>`
   );
   html = html.replace("Partnering with enterprise platforms across global markets", "Clients we've worked with");
   // Keep the headline, supporting text and CTA in their own full-height screen.
   html = html.replace('class="hero_main"', 'class="prometheus-hero-layout"');
   html = html.replace(/(<div class="prometheus-hero-layout"[^>]*>)/, '$1<div class="hero_main prometheus-hero-screen">');
   html = html.replace(/(<div id="[^"]*" class="home-hero_logos-wrapper")/, '</div>$1');
 }
 const markup = <div dangerouslySetInnerHTML={{__html:html}} />;
 if (brand !== "prometheus") return markup;
 let videoSrc: string | null = null;
 try {
   const videos = readdirSync(join(process.cwd(), "public/videos")).filter(file => /\.(mp4|webm|ogv)$/i.test(file)).sort();
   const video = videos.find(file => /furniture.*odyssey/i.test(file)) ?? videos[0];
   if (video) videoSrc = `/videos/${encodeURIComponent(video)}`;
 } catch { /* Show a fallback if the demo asset is unavailable. */ }
 return <HeroVideo videoSrc={videoSrc}>{markup}</HeroVideo>;
}
