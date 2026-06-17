import { redirect } from "next/navigation";

export default function LegacyEarningsRedirectPage() {
  redirect("/driver/performance");
}
