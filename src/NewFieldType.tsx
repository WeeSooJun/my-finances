import { useState } from "react";

interface NewFieldTypeProps {
  fieldName: string;
  fieldSubmit: (name: string) => void;
}

function convertCamelCaseToView(str: string) {
  let result = "";
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (char.toUpperCase() === char && result !== "") {
      result += " " + char;
    } else {
      result += char;
    }
  }
  return result.charAt(0).toUpperCase() + result.slice(1);
}

const NewFieldType = ({ fieldName, fieldSubmit }: NewFieldTypeProps) => {
  const [showNewTypeInput, setShowNewTypeInput] = useState(false);

  return (
    <div className="flex justify-center px-1 py-2">
      {!showNewTypeInput ? (
        <button
          onClick={() => setShowNewTypeInput(true)}
          className="mx-auto flex max-w-xs items-center rounded-md bg-emerald-600 px-6 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-emerald-700"
        >
          <span className="flex-1">
            Create {convertCamelCaseToView(fieldName)}
          </span>
        </button>
      ) : (
        <div className="flex w-full max-w-lg items-center space-x-2">
          <form
            className="flex flex-1 space-x-2"
            onSubmit={async (e) => {
              e.preventDefault();
              const newTypeInput = document.querySelector(
                `#newTypeInput-${fieldName}`,
              ) as HTMLInputElement;
              await fieldSubmit(newTypeInput.value);
              setShowNewTypeInput(false);
            }}
          >
            <input
              id={`newTypeInput-${fieldName}`}
              className="flex-1 rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-gray-200 placeholder-gray-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder={`Enter new ${convertCamelCaseToView(fieldName).toLowerCase()}...`}
              autoFocus
            />
            <button
              type="submit"
              className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-emerald-700"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setShowNewTypeInput(false)}
              className="rounded-md bg-gray-700 px-3 py-2 text-sm text-white transition-colors duration-200 hover:bg-gray-600"
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default NewFieldType;
