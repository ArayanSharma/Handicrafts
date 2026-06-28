// src/components/SortDropdown.jsx

export default function SortDropdown({
  sort,
  setSort,
}) {
  return (
    <select
      value={sort}
      onChange={(e) =>
        setSort(e.target.value)
      }
      className="border rounded-lg px-3 py-2 text-sm"
    >
      <option value="featured">
        Featured
      </option>

      <option value="low">
        Price Low to High
      </option>

      <option value="high">
        Price High to Low
      </option>
    </select>
  );
}