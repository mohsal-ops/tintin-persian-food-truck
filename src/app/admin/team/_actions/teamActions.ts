"use server";

import db from "@/db/db";
import { getCurrentAdmin } from "@/lib/getCurrentAdmin";
import { revalidatePath } from "next/cache";

export async function approveAdmin(adminId: string) {
  const currentAdmin = await getCurrentAdmin();
  if (!currentAdmin) throw new Error("Unauthorized");

  await db.admin.update({
    where: { id: adminId },
    data: {
      status: "APPROVED",
      approvedById: currentAdmin.id,
      approvedAt: new Date(),
    },
  });

  revalidatePath("/admin/team");
}

export async function rejectAdmin(adminId: string) {
  const currentAdmin = await getCurrentAdmin();
  if (!currentAdmin) throw new Error("Unauthorized");

  await db.admin.update({
    where: { id: adminId },
    data: { status: "REJECTED" },
  });

  revalidatePath("/admin/team");
}
