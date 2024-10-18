"use server";

export async function handleSubmit(formData: FormData): Promise<string> {
  const data = {
    username: formData.get("username")?.toString(),
    email: formData.get("email")?.toString(),
    message: formData.get("message")?.toString(),
  };

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/whitelist`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Erro ao enviar a solicitação.");
    }

    return result.message || "Solicitação enviada com sucesso!";
  } catch (error) {
    throw new Error(`Erro ao enviar a solicitação. \n Reason: ${error}`);
  }
}
