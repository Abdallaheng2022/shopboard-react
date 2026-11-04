// ProductFilters.tsx: the search box and the category and sort selects.
import { useId } from "react";
import { ALL_CATEGORIES, isSortOrder } from "../products.logic";
import type { Filters } from "../products.types";
import styles from "./ProductFilters.module.css";

interface ProductFiltersProps {
  filters: Filters;
  categories: readonly string[];
  // Turned off while loading, on error, and when the store is empty.
  disabled: boolean;
  onChange: (changes: Partial<Filters>) => void;
}

export function ProductFilters({ filters, categories, disabled, onChange }: ProductFiltersProps) {
  const id = useId();

  return (
    <div className={styles.controls}>
      <div className={styles.field}>
        <label htmlFor={`${id}-search`}>Search</label>
        <input
          id={`${id}-search`}
          type="search"
          placeholder="Product name"
          value={filters.query}
          disabled={disabled}
          onChange={(event) => onChange({ query: event.target.value })}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor={`${id}-category`}>Category</label>
        <select
          id={`${id}-category`}
          value={filters.category}
          disabled={disabled}
          onChange={(event) => onChange({ category: event.target.value })}
        >
          <option value={ALL_CATEGORIES}>All categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.field}>
        <label htmlFor={`${id}-sort`}>Sort by price</label>
        <select
          id={`${id}-sort`}
          value={filters.sort}
          disabled={disabled}
          onChange={(event) => {
            const sort = event.target.value;
            onChange({ sort: isSortOrder(sort) ? sort : "default" });
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
