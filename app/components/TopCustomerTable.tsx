type TopSeller = {
  firstName: string | null;
  lastName: string | null;
  email: string;
  totalOrders: number;
  totalSpent: number;
};

interface TopCustomersTableProps {
  sellers: TopSeller[];
}

export default function TopCustomersTable({
  sellers,
}: TopCustomersTableProps) {
  return (
    <div className="admin-section">

      <div className="admin-table-wrapper">
        {sellers.length === 0 ? (
          <p className="admin-empty">
            Sin datos de clientes aún.
          </p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Cliente</th>
                <th>Pedidos</th>
                <th className="hidden md:table-cell">
                  Total
                </th>
              </tr>
            </thead>

            <tbody>
              {sellers.map((s, i) => {
                const initials =
                  `${s.firstName?.[0] ?? ""}${
                    s.lastName?.[0] ?? ""
                  }`.toUpperCase();

                return (
                  <tr key={i}>
                    <td>
                      <span className="rank-badge">
                        {i + 1}
                      </span>
                    </td>

                    <td>
                      <div className="user-cell">
                        <div className="user-avatar">
                          {initials || "?"}
                        </div>

                        <div>
                          <div className="customer-name">
                            {s.firstName} {s.lastName}
                          </div>

                          <div className="customer-email">
                            {s.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="admin-badge badge-info">
                        {s.totalOrders}
                      </span>
                    </td>

                    <td className="customer-total hidden md:table-cell">
                      $
                      {s.totalSpent.toLocaleString(
                        "es-AR"
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}