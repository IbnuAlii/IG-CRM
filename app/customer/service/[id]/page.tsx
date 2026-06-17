import { redirect } from "next/navigation";

export default async function CustomerServiceAliasPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/customer/ride/${id}`);
}
