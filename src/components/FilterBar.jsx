const propertyTypes = ['all', 'house', 'apartment', 'land', 'commercial']
const propertyStatuses = ['all', 'for sale', 'for rent']
const bedroomOptions = ['all', '1', '2', '3', '4', '5+']

export default function FilterBar({
  filters,
  onChange,
  showSearch = false,
  showPrice = false,
  cities = [],
  compact = false,
  mode = 'default',
}) {
  const wrapperClasses = compact
    ? 'grid gap-3 rounded-[26px] border border-[var(--color-line)] bg-white p-4 shadow-[0_16px_45px_rgba(8,21,42,0.08)] sm:grid-cols-2'
    : 'grid gap-4 rounded-[30px] border border-[var(--color-line)] bg-white p-5 shadow-[0_18px_55px_rgba(8,21,42,0.08)] sm:grid-cols-2 xl:grid-cols-2'

  const rootClass =
    mode === 'sidebar' ? `${wrapperClasses} xl:gap-5` : wrapperClasses

  return (
    <div className={rootClass}>
      {showSearch && (
        <label className="field-shell sm:col-span-2">
          <span className="field-label">Search</span>
          <input
            type="text"
            className="field-input"
            placeholder="Search by title, city, or location"
            value={filters.search}
            onChange={(event) => onChange('search', event.target.value)}
          />
        </label>
      )}

      <label className="field-shell">
        <span className="field-label">Type</span>
        <select
          className="field-input"
          value={filters.type}
          onChange={(event) => onChange('type', event.target.value)}
        >
          {propertyTypes.map((type) => (
            <option key={type} value={type}>
              {type === 'all' ? 'All types' : type}
            </option>
          ))}
        </select>
      </label>

      <label className="field-shell">
        <span className="field-label">Status</span>
        <select
          className="field-input"
          value={filters.status}
          onChange={(event) => onChange('status', event.target.value)}
        >
          {propertyStatuses.map((status) => (
            <option key={status} value={status}>
              {status === 'all' ? 'All statuses' : status}
            </option>
          ))}
        </select>
      </label>

      <label className="field-shell">
        <span className="field-label">City</span>
        <select
          className="field-input"
          value={filters.city}
          onChange={(event) => onChange('city', event.target.value)}
        >
          <option value="all">All cities</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </label>

      <label className="field-shell">
        <span className="field-label">Bedrooms</span>
        <select
          className="field-input"
          value={filters.bedrooms}
          onChange={(event) => onChange('bedrooms', event.target.value)}
        >
          {bedroomOptions.map((value) => (
            <option key={value} value={value}>
              {value === 'all' ? 'Any bedrooms' : value}
            </option>
          ))}
        </select>
      </label>

      {showPrice && (
        <>
          <label className="field-shell sm:col-span-1">
            <span className="field-label">Min price</span>
            <input
              type="number"
              className="field-input"
              placeholder="0"
              value={filters.minPrice}
              onChange={(event) => onChange('minPrice', event.target.value)}
            />
          </label>
          <label className="field-shell sm:col-span-1">
            <span className="field-label">Max price</span>
            <input
              type="number"
              className="field-input"
              placeholder="500000"
              value={filters.maxPrice}
              onChange={(event) => onChange('maxPrice', event.target.value)}
            />
          </label>
        </>
      )}
    </div>
  )
}
