import { PropsWithChildren, ReactElement, useState } from "react";
import { TableRowProps } from "./TableRow";

interface NewRowToggleProps extends PropsWithChildren {
  tableRow: (props: Partial<TableRowProps>) => ReactElement;
}

const NewRowToggle = ({ tableRow }: NewRowToggleProps) => {
  const [showNewEntry, setShowNewEntry] = useState(false);
  const tableRowElement = tableRow({ showNewEntry, setShowNewEntry });
  return (
    <>
      {showNewEntry && tableRowElement}
      {!showNewEntry && (
        <tr
          className="h-14 cursor-pointer border-b border-gray-800 bg-gray-900 text-center transition-colors duration-200 hover:bg-gray-800"
          onClick={() => setShowNewEntry(true)}
        >
          <td colSpan={6} className="py-4">
            <div className="flex items-center justify-center text-sm text-gray-400 hover:text-emerald-500">
              {/* Simple plus icon using a span for complete offline compatibility */}
              <span className="mr-1.5 text-lg font-medium">+</span>
              add new row
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default NewRowToggle;
