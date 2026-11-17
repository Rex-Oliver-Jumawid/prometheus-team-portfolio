import { permanentRedirect } from "next/navigation";

export default function PrometheusRedirect() {
  permanentRedirect("/");
}
