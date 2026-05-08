import { CarSilhouette } from "@/components/cars/CarSilhouette";

export function FinishLine() {
  return (
    <section className="v2-finish" aria-hidden>
      <div className="v2-finish-grid" />
      <div className="v2-finish-car">
        <CarSilhouette />
      </div>
      <div className="v2-finish-checkers" />
      <span className="v2-mono v2-finish-label">CHEQUERED FLAG</span>
    </section>
  );
}
