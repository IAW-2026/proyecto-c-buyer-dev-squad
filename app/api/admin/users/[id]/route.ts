import { authenticateAdminApi } from "@/lib/admin-api-auth";
import { getUserByClerkId, updateUser, deleteUser } from "@/lib/services/User.service";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }): Promise<Response> {
  const authError = authenticateAdminApi(req);
  if (authError) return authError;

  try {
    const { id } = await context.params;
    const user = await getUserByClerkId(id);

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return Response.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }): Promise<Response> {
  const authError = authenticateAdminApi(req);
  if (authError) return authError;

  try {
    const { id } = await context.params;
    const body = await req.json();

    const user = await getUserByClerkId(id);
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const updatedUser = await updateUser(id, {
      firstName: body.firstName ?? null,
      lastName: body.lastName ?? null,
      email: body.email ?? user.email,
      createdAt: body.createdAt ? new Date(body.createdAt) : user.createdAt,
      orderCount: body.orderCount ?? 0,
    });

    return Response.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return Response.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }): Promise<Response> {
  const authError = authenticateAdminApi(req);
  if (authError) return authError;

  try {
    const { id } = await context.params;

    const user = await getUserByClerkId(id);
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    await deleteUser(id);
    return Response.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return Response.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
