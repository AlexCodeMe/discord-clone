import InitialModal from "@/components/modals/initial-modal";
import { ModeToggle } from "@/components/mode-toggle";
import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import { UserButton } from "@clerk/nextjs";
import { Profile } from "@prisma/client";
import { redirect } from "next/navigation";

export default async function Home() {
  const profile = await initialProfile() as Profile

  console.log('Hello', profile.id)

  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id
        }
      }
    }
  })

  if (server) return redirect(`/servers/${server.id}`)

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <UserButton afterSignOutUrl="/" />
      Creata a server
      <ModeToggle />
      <InitialModal />
    </main>
  );
}
