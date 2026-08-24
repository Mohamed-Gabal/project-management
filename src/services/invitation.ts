// Maps backend error responses to a clear actionable message for the user
function getFriendlyErrorMessage(status: number, fallbackMessage?: string) {
  switch (status) {
    case 401:
      return "Your session has expired. Please log in again.";
    case 403:
      return "You don't have permission to perform this action.";
    case 500:
      return "Something went wrong on our end. Please try again shortly.";
    default:
      return fallbackMessage || "Something went wrong. Please try again.";
  }
}

export async function inviteMember(email: string, projectId: string) {
  try {
    const response = await fetch("/api/invitations/invite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        projectId,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        ok: false,
        message: getFriendlyErrorMessage(response.status, result.message),
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

export async function acceptInvitation(token: string) {
  try {
    const response = await fetch("/api/invitations/accept", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        ok: false,
        message: getFriendlyErrorMessage(response.status, result.message),
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
