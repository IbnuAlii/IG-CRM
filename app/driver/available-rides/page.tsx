import { redirect } from "next/navigation";

export default function LegacyAvailableRidesRedirectPage() {
  redirect("/driver/route");
}
