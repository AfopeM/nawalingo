import { createClient, User } from "@supabase/supabase-js";

interface AuthSuccess {
  user: User;
}
interface AuthFailure {
  error: string;
  status: number;
}

export type AuthResult = AuthSuccess | AuthFailure;

// Single Supabase service-role client reused across invocations.
const supabaseService = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: { autoRefreshToken: false, persistSession: false },
  },
);

/**
 * Extracts a bearer token from the request and fetches the associated Supabase user.
 * Returns `{ user }` on success, or `{ error, status }` on failure so callers can
 * easily pipe the result into NextResponse.
 */
export async function getAuthenticatedUser(
  request: Request,
): Promise<AuthResult> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return { error: "Unauthorized", status: 401 };
  }

  const token = authHeader.split(" ")[1];

  const {
    data: { user },
    error: userError,
  } = await supabaseService.auth.getUser(token);

  if (userError || !user) {
    return { error: "Unauthorized", status: 401 };
  }

  return { user };
}
