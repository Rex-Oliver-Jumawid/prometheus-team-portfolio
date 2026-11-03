import ServiceDetailPage from "../../../../components/ServiceDetailPage";
import { servicePages } from "../../../../content/servicePages";
import { pageMetadata } from "../../../../lib/page-seo";
const page = servicePages["business-websites"];
export const metadata = pageMetadata(page.path, page.title, page.description);
export default function Page() { return <ServiceDetailPage service="business-websites" />; }
