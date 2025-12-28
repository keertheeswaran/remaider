import { useState } from "react";

interface SearchableSelectProps {
  options: string[];
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

function SearchableSelect({
  options,
  value,
  placeholder = "Select option",
  onChange,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="searchable-select">
      <div className="select-box" onClick={() => setOpen((prev) => !prev)}>
        {value || placeholder}
      </div>

      {open && (
        <div className="select-dropdown">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="select-search"
          />

          <ul>
            {filteredOptions.length === 0 ? (
              <li className="no-option">No results</li>
            ) : (
              filteredOptions.map((opt) => (
                <li
                  key={opt}
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                    setSearch("");
                  }}
                >
                  {opt}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SearchableSelect;
