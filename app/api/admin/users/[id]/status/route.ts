import { authenticateAdminApi } from "@/lib/admin-api-auth";
import { getUserById, suspendUser, activateUser } from "@/lib/services/User.service";

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }): Promise<Response> {
  const authError = authenticateAdminApi(req);
  if (authError) return authError;

  try {
    const { id } = await context.params;
    const body = await req.json();

    const user = await getUserById(id);
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const { status } = body;

    if (status === "SUSPENDED") {
      await suspendUser(id);
    } else if (status === "ACTIVE") {
      await activateUser(id);
    } else {
      return Response.json({ error: "Invalid status. Use SUSPENDED or ACTIVE" }, { status: 400 });
    }

    return Response.json({ success: true, status });
  } catch (error) {
    console.error("Error updating user status:", error);
    return Response.json({ error: "Failed to update user status" }, { status: 500 });
  }
}
