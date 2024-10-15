import { invoke } from "@tauri-apps/api/core";
import { Dispatch, SetStateAction, useState } from "react";

interface LoginProps {
  setShowEnterPassword: Dispatch<SetStateAction<boolean>>;
}

const Login = ({ setShowEnterPassword }: LoginProps) => {
  invoke("is_database_initialized").then((res: any) =>
    setHasPasswordBeenSet(res as boolean)
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
    null
  );
  return (
    <>
      <form
        onSubmit={async (e) => {
          e.preventDefault();

          const passwordInput = document.querySelector(
            "#password"
          ) as HTMLInputElement;
          const confirmPasswordInput = document.querySelector(
            "#confirm-password"
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
        <div className="grid grid-cols-3 items-center">
          Please {hasPasswordBeenSet ? "enter" : "set"} your password
          <input id="password" type="password" />
          <button type="submit">Enter</button>
        </div>
        {!hasPasswordBeenSet && (
          <div className="grid grid-cols-3 items-center">
            Confirm your password
            <input id="confirm-password" type="password" />
          </div>
        )}
      </form>
      {showPasswordError && (
        <div style={{ color: "red" }}>{showPasswordError}</div>
      )}
    </>
  );
};

export default Login;
