// components/Navbar.tsx
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { EmbedlyContext } from "@/context/contractContext";

export default function Navbar() {
  const { currentAccount, connectWallet } = useContext(EmbedlyContext);

  return (
    <nav className=" border-b shadow-sm fixed w-full h-16 pt-2 z-10 border-pink-200 bg-pink-50">
      <div className="container mx-auto flex justify-between items-center px-4 py-2">
        {/* Logo or Branding */}
        <div className="text-xl font-bold text-purple-800">Embedly</div>

        {/* Navigation Links */}
        <div className="flex space-x-6">
          <NavItem href="/" text="Home" />
          <NavItem href="/mytemplates" text="My Templates" />
          <NavItem href="/create" text="Create" />
        </div>

        {/* Additional Actions (Optional) */}
        {currentAccount ? (
          <span className="text-purple-800 text-sm font-semibold">
            {currentAccount.slice(0, 6) + "..." + currentAccount.slice(-4)}
          </span>
        ) : (
          <Button
            className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => {
              console.log("Connect Wallet", connectWallet);
              connectWallet();
            }}
          >
            Connect Wallet
          </Button>
        )}
      </div>
    </nav>
  );
}

const NavItem = ({ href, text }: { href: string; text: string }) => {
  return (
    <a
      href={href}
      className="border-transparent text-purple-800 hover:border-purple-300 hover:text-purple-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
    >
      {text}
    </a>
  );
};
