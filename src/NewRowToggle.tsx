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
        <tr className="h-14" onClick={() => setShowNewEntry(true)}>
          <td colSpan={6}>add new row</td>
        </tr>
      )}
    </>
  );
};

export default NewRowToggle;
