import { Loader } from "@/components/nowts/loader";

export default function RouteLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <Loader size={32} />
    </div>
  );
}
