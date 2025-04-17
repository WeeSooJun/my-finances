import { invoke } from "@tauri-apps/api/core";
import { Dispatch, SetStateAction, useState } from "react";

interface LoginProps {
  setShowEnterPassword: Dispatch<SetStateAction<boolean>>;
}

const Login = ({ setShowEnterPassword }: LoginProps) => {
  invoke("is_database_initialized").then((res: any) =>
    setHasPasswordBeenSet(res as boolean),
  );

  async function setPassphrase(passphrase: string) {
    const result = await invoke("set_database_passphrase", { passphrase });
    if (!result) {
      setShowPasswordError("Wrong password, please try again.");
      return;
    }
    setShowEnterPassword(false);
  }
  const [hasPasswordBeenSet, setHasPasswordBeenSet] = useState(true);
  const [showPasswordError, setShowPasswordError] = useState<string | null>(
    null,
  );
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <div className="w-full max-w-md rounded-lg bg-gray-800 p-8 shadow-lg">
        <h2 className="mb-8 text-center text-2xl font-bold text-white">
          My Finances
        </h2>

        <form
          className="space-y-6"
          onSubmit={async (e) => {
            e.preventDefault();

            const passwordInput = document.querySelector(
              "#password",
            ) as HTMLInputElement;
            const confirmPasswordInput = document.querySelector(
              "#confirm-password",
            ) as HTMLInputElement;
            if (
              !hasPasswordBeenSet &&
              passwordInput.value !== confirmPasswordInput.value
            ) {
              setShowPasswordError("The passwords do not match!");
              return;
            }
            await setPassphrase(passwordInput.value);
          }}
        >
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              Please {hasPasswordBeenSet ? "enter" : "set"} your password
            </label>
            <div className="flex">
              <input
                id="password"
                type="password"
                className="flex-1 rounded-l-md border border-gray-600 bg-gray-700 px-3 py-2 text-gray-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Password"
                autoFocus
              />
              <button
                type="submit"
                className="rounded-r-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-emerald-700"
              >
                Enter
              </button>
            </div>
          </div>

          {!hasPasswordBeenSet && (
            <div className="space-y-2">
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-300"
              >
                Confirm your password
              </label>
              <input
                id="confirm-password"
                type="password"
                className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-gray-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Confirm password"
              />
            </div>
          )}

          {showPasswordError && (
            <div className="mt-2 text-sm text-red-500">{showPasswordError}</div>
          )}
        </form>

        <div className="mt-8 text-center text-sm text-gray-400">
          <p>Secure access to your financial data</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
