// components/Navbar.tsx
import { cn } from "@/lib/utils"; // Utility function for conditional classNames
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { EmbedlyContext } from "@/context/contractContext";

export const Navbar = () => {
  const { currentAccount, connectWallet } = useContext(EmbedlyContext);

  return (
    <nav className="bg-white border-b shadow-sm fixed w-full h-16 pt-2">
      <div className="container mx-auto flex justify-between items-center px-4 py-2">
        {/* Logo or Branding */}
        <div className="text-xl font-bold text-gray-800">Embedly</div>

        {/* Navigation Links */}
        <div className="flex space-x-6">
          <NavItem href="/" text="Home" />
          <NavItem href="/templates" text="My Templates" />
          <NavItem href="/create" text="Create" />
        </div>

        {/* Additional Actions (Optional) */}
        {currentAccount ? (
          currentAccount.slice(0, 6) + "..." + currentAccount.slice(-4)
        ) : (
          <Button
            variant="default"
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
};

const NavItem = ({ href, text }: { href: string; text: string }) => {
  return (
    <a
      href={href}
      className={cn(
        "text-gray-600 hover:text-gray-900 transition-colors",
        "font-medium"
      )}
    >
      {text}
    </a>
  );
};
