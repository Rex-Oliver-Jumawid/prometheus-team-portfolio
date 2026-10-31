import "./captured.css";
import "./inline.css";
import "./fonts.css";
import type { ReactNode } from "react";
import { homepageUrl } from "../lib/seo";
export const metadata = { ...(homepageUrl ? { metadataBase: new URL(homepageUrl.origin) } : {}), title: "Arounda — private reference study", robots: { index: false, follow: false } };
export default function Layout({children}:{children:ReactNode}) { return <html lang="en" data-wf-page="68908308beafa140584457bf" data-wf-site="65647bbe0d57c8abad78e939"><body className="body">{children}</body></html>; }
