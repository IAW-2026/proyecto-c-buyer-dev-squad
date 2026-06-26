import UsersTable from "@/app/components/UsersTable";
import { getUsers } from "@/lib/services/User.service";

export default async function UsersPage(props: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await props.searchParams;
  const result = await getUsers(search, 1, 6);

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Usuarios</h1>
        <p className="admin-page-subtitle">{result.pagination.totalItems} usuarios registrados</p>
      </div>

      <div className="admin-search-bar">
        <form method="GET">
          <input
            name="search"
            defaultValue={search}
            placeholder="Buscar por nombre o email..."
            className="admin-input"
          />
          <button type="submit" className="btn-primary px-4 py-2 rounded-lg text-sm font-medium">
            Buscar
          </button>
        </form>
      </div>

      <UsersTable key={search ?? ""} initialUsers={result.data} initialTotal={result.pagination.totalItems} search={search} />
    </div>
  );
}