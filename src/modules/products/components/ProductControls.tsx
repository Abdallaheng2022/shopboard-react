// ProductControls.tsx: the search box, and the category and sort selects.
import { ALL_CATEGORIES, isSortOrder } from "../modules/products/products.logic";
import type { Filters } from "../modules/products/products.types";

interface ProductControlsProps {
  filters: Filters;
  categories: readonly string[];
  // Turned off while loading, on error, and when the store is empty.
  disabled: boolean;
  onChange: (filters: Filters) => void;
}

export function ProductControls({ filters, categories, disabled, onChange }: ProductControlsProps) {
  return (
    <div className="filters">
      <div className="field">
        <label htmlFor="search">Search</label>
        <input
          id="search"
          type="search"
          placeholder="Product name"
          value={filters.query}
          disabled={disabled}
          onChange={(event) => onChange({ ...filters, query: event.target.value })}
        />
      </div>
      <div className="field">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          value={filters.category}
          disabled={disabled}
          onChange={(event) => onChange({ ...filters, category: event.target.value })}
        >
          <option value={ALL_CATEGORIES}>All categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="sort">Sort by price</label>
        <select
          id="sort"
          value={filters.sort}
          disabled={disabled}
          onChange={(event) => {
            const sort = event.target.value;
            if (isSortOrder(sort)) onChange({ ...filters, sort });
          }}
        >
          <option value="default">Default</option>
          <option value="price-asc">Low to high</option>
          <option value="price-desc">High to low</option>
        </select>
      </div>
    </div>
  );
}
