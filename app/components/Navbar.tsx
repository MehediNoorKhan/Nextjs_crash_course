import { Link } from "lucide-react";
import logo from "../../public/icons/logo.png";
import Image from "next/image";

const Navbar = () => {
  return (
    <header>
      <nav>
        <Link href="/" className="logo">
          <Image src={logo} alt="logo" height={24} width={24} />
          <p>DevEvent</p>
        </Link>
      </nav>
      <ul>
        <Link href="/">Home</Link>
        <Link href="/">Events</Link>
        <Link href="/">Create Event</Link>
        <Link href="/"></Link>
      </ul>
    </header>
  );
};

export default Navbar;
