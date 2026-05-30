import Loader from "../components/Loader";

export default function AdminLoading() {
  return (
    <div className="flex items-center justify-center py-20">
      <Loader size="lg" text="Cargando..." />
    </div>
  );
}
