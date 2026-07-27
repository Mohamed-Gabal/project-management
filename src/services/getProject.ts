export async function getProjects() {
  const response = await fetch("/api/getProject");

  const result = await response.json();

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      message: result.message,
      code: result.code,
    };
  }

  return {
    status: response.status,
    ok: true,
    data: result,
  };
}
