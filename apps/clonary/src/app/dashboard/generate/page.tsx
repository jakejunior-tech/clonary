"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import GenerateForm from "./form";

export default async function GeneratePage() {
  const session = await requireAuth();
  const userId = session.sub as string;

  const voices = await prisma.clonedVoice.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Generate Speech</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Create speech from text using your cloned voice
        </p>
      </div>

      <GenerateForm voices={voices} />
    </div>
  );
}
