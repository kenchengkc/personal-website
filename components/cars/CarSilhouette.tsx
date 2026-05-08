import Image from "next/image";

type Props = {
  fill?: string;
  className?: string;
};

export function CarSilhouette({ className }: Props) {
  return (
    <Image
      src="/images/cars/redbull-real-car.png"
      alt=""
      width={1644}
      height={530}
      className={className}
      aria-hidden
      draggable={false}
      priority
      sizes="(max-width: 720px) 92vw, 560px"
    />
  );
}
