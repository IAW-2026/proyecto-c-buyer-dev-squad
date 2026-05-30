import Loader from "@/app/components/Loader";

export default function OrdersLoading() {
  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div className="h-7 w-40 bg-surface animate-pulse rounded" />
        <div className="h-4 w-48 bg-surface animate-pulse rounded mt-1" />
      </div>

      <div className="status-filters">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-9 w-28 bg-surface animate-pulse rounded-lg" />
        ))}
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              {Array.from({ length: 5 }).map((_, i) => (
                <th key={i}>
                  <div className="h-3 w-16 bg-surface animate-pulse rounded" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                {Array.from({ length: 5 }).map((_, j) => (
                  <td key={j}>
                    <div className="h-4 w-full bg-surface animate-pulse rounded" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
