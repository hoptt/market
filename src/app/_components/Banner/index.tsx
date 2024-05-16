"use client";

import Image from "next/image";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import banner1 from "../../../../public/banner-1.jpg";
import Link from "next/link";

export default function Banner() {
  const products = [
    {
      img: banner1,
      url: `/products/041b7ecb-f4c3-412c-ba91-0d6f4e9cb126`,
    },
  ];
  return (
    <Carousel
      className="my-8"
      infiniteLoop
      showThumbs={false}
      showStatus={false}
    >
      {products.map((product, idx) => (
        <Link
          key={idx}
          className="relative block"
          style={{ height: "330px" }}
          href={product.url}
        >
          <Image alt="" className="object-cover" src={product.img} fill />
        </Link>
      ))}
    </Carousel>
  );
}
