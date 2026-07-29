import type { LoginFormValues } from "@/lib/validations/login";
import type { SignUpFormValues } from "@/lib/validations/sign-up";

// Fetch Api For SignUp Component
export async function signUp(data: SignUpFormValues) {
  const apiUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!apiUrl || !anonKey) {
    return {
      ok: false,
      message: "Environment variables are not defined",
    };
  }

  try {
    const response = await fetch(`${apiUrl}/auth/v1/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: anonKey,
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        data: {
          name: data.name,
          job_title: data.jobTitle,
        },
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      return {
        ok: false,
        message: result.msg || "Something went wrong. Please try again.",
      };
    }

    return {
      ok: true,
      data: result,
    };
  } catch {
    return {
      ok: false,
      message: "Unable to connect. Please try again later.",
    };
  }
}

// Authenticate the user using email and password
export async function login(data: LoginFormValues) {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        ok: false,
        message: result.msg || "Invalid email or password.",
      };
    }

    return {
      ok: true,
      data: result,
    };
  } catch {
    return {
      ok: false,
      message: "Unable to connect. Please try again later.",
    };
  }
}

// Send password reset email
export async function requestPasswordReset(email: string) {
  const apiUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!apiUrl || !anonKey) {
    return {
      ok: false,
      message: "Environment variables are not defined",
    };
  }

  try {
    const response = await fetch(`${apiUrl}/auth/v1/recover`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: anonKey,
      },
      body: JSON.stringify({ email }),
    });

    const result = await response.json();

    if (response.status === 429) {
      return {
        ok: false,
        message: "Too many attempts. Please wait a few minutes.",
      };
    }

    if (!response.ok) {
      return {
        ok: false,
        message: result.msg || "Something went wrong. Please try again.",
      };
    }

    return {
      ok: true,
    };
  } catch {
    return {
      ok: false,
      message: "Unable to connect. Please try again later.",
    };
  }
}

// Fetch Api For ResetPassword Component
export async function resetPassword(accessToken: string, password: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/user`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
        }),
      },
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        ok: false,
        message: result.msg || "Failed to update password.",
      };
    }

    return {
      ok: true,
    };
  } catch {
    return {
      ok: false,
      message: "Unable to connect. Please try again later.",
    };
  }
}

// Fetch Api For Logout Component
export async function logout() {
  try {
    const response = await fetch("api/auth/logout", {
      method: "POST",
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        ok: false,
        message: result.msg || "Logout failed. Please try again.",
      };
    }

    return {
      ok: true,
      data: result,
    };
  } catch {
    return {
      ok: false,
      message: "Unable to connect. Please try again later.",
    };
  }
}
