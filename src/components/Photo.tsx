import Image from "next/image";
import type { CSSProperties } from "react";
import { Corners } from "./Corners";

type PhotoProps = {
  src?: string | null;
  alt: string;
  sizes: string;
  framed?: boolean;
  className?: string;
  style?: CSSProperties;
};

export function Photo({ src, alt, sizes, framed = false, className = "", style }: PhotoProps) {
  return (
    <figure className={`photo ${framed ? "blueprint" : "photo-bordered"} ${className}`} style={style}>
      <div className="photo-inner">
        {src ? (
          <Image src={src} alt={alt} fill sizes={sizes} style={{ objectFit: "cover" }} />
        ) : (
          <span className="photo-placeholder">{alt}</span>
        )}
      </div>
      {framed && <Corners />}
    </figure>
  );
}
