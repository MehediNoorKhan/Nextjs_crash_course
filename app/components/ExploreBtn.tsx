"use client";

import Image from "next/image";
import Link from "next/link";
import exploreimg from "../../public/icons/arrow-down.svg";

const ExploreBtn = () => {
  return (
    <Link
      href="#event"
      id="explore-btn"
      className="mt-7 mx-auto inline-flex items-center gap-2"
      onClick={() => console.log("This is explore button")}
    >
      Explore Events
      <Image src={exploreimg} alt="Arrow down" height={24} width={24} />
    </Link>
  );
};

export default ExploreBtn;
