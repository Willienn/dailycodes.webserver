"use client";

import { Suspense, useState } from "react";
import ServerStatus from "@/components/server-status";
import { handleSubmit } from "@/lib/server-actions/whitelistrequest";

export default function Page() {
  const [notification, setNotification] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    try {
      const message = await handleSubmit(formData);
      setNotification(message);
    } catch (error) {
      setNotification(`Erro ao enviar a solicitação. 
 Motivo: ${error}`);
      console.log(error);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <Suspense>
        <ServerStatus />
      </Suspense>
      <header className="text-center mb-8">
        <h1 className="text-6xl font-extrabold tracking-wider">
          Dailycodes SMP
        </h1>
        <p className="mt-2 text-xl font-medium">
          Servidor oficial da comunidade Dailycodes
        </p>
      </header>

      <div className="bg-gray-800 p-8 rounded-lg shadow-lg border-4 border-gray-600 w-full max-w-lg">
        <h2 className="text-4xl font-bold mb-6 text-center text-red-500">
          Solicitação de Whitelist
        </h2>
        <p className="mb-6 text-center text-lg">
          Preencha o formulário abaixo para solicitar sua inclusão na whitelist
          do servidor.
        </p>

        {/* Using client-side handler to invoke the server action */}
        <form action={onSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="username" className="block text-sm font-semibold">
              Nome de Usuário
            </label>
            <input
              type="text"
              id="username"
              name="username"
              required
              className="mt-1 p-3 bg-gray-700 border-2 border-gray-600 rounded-md focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="email" className="block text-sm font-semibold">
              E-mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="mt-1 p-3 bg-gray-700 border-2 border-gray-600 rounded-md focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="message" className="block text-sm font-semibold">
              Mensagem (opcional)
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              className="mt-1 p-3 bg-gray-700 border-2 border-gray-600 rounded-md focus:outline-none focus:border-red-500"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            Solicitar Whitelist
          </button>
        </form>

        {/* Show notification message */}
        {notification && (
          <div className="mt-4 p-4 bg-gray-700 rounded-md text-center">
            <p>{notification}</p>
          </div>
        )}

        <p className="text-sm text-gray-400 mt-4 text-center">
          Após a solicitação, você receberá um e-mail de confirmação.
        </p>
      </div>

      <footer className="mt-8 text-center text-gray-500 text-sm">
        <p>
          © {new Date().getFullYear()} Dailycodes SMP. Todos os direitos
          reservados.
        </p>
      </footer>
    </div>
  );
}
