type TopProduct = {
  name: string | null;
  image: string | null;
  price: number | null;
  totalSold: number;
};

interface TopProductsTableProps {
  products: TopProduct[];
}

export default function TopProductsTable({
  products,
}: TopProductsTableProps) {
  return (
    <div className="admin-section">

      <div className="admin-table-wrapper">
        {products.length === 0 ? (
          <p className="admin-empty">
            Sin datos de ventas aún.
          </p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Producto</th>
                <th className="hidden md:table-cell">
                  Precio
                </th>
                <th>Vendidos</th>
              </tr>
            </thead>

            <tbody>
              {products.map((p, i) => (
                <tr key={i}>
                  <td>
                    <span className="rank-badge">
                      {i + 1}
                    </span>
                  </td>

                  <td>
                    <div className="user-cell">
                      {p.image && (
                        <img
                          src={p.image}
                          alt={p.name ?? ""}
                          className="admin-product-thumb"
                        />
                      )}

                      <span>{p.name}</span>
                    </div>
                  </td>

                  <td className="text-muted hidden md:table-cell">
                    $
                    {p.price?.toLocaleString("es-AR") ??
                      "—"}
                  </td>

                  <td>
                    <div className="sold-bar-cell">
                      <span className="sold-count">
                        {p.totalSold}
                      </span>

                      <div className="sold-bar-track">
                        <div
                          className="sold-bar-fill"
                          style={{
                            width: `${Math.min(
                              100,
                              (p.totalSold /
                                (products[0]
                                  ?.totalSold || 1)) *
                                100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}