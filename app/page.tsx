import MessageField from "@/components/ui/MessageField";
import { authOptions } from "@/lib/config";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session) {
    console.log("No session, redirecting to signin");
    return redirect("/signin");
  }
  return <MessageField session={session} />;
}
