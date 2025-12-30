import { useState } from "react";
import { Button } from "../../shared/ui";
import { Menu, X } from "lucide-react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="fixed top-0 inset-x-0 backdrop-blur-glass bg-white/70 border-b border-black/5 z-50">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                <span className="font-semibold text-lg tracking-tight">Company</span>

                {/* Desktop Nav */}
                <nav className="hidden md:flex gap-6 text-sm text-muted items-center">
                    <a href="#products"><Button variant="ghost">Products</Button></a>
                    <a href="#company"><Button variant="ghost">Company</Button></a>
                    <a href="/app" className="ml-4">
                        <Button className="text-sm px-6">
                            Sign in
                        </Button>
                    </a>
                </nav>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden p-2 text-muted"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Nav Overlay */}
            {isOpen && (
                <div className="md:hidden bg-white border-b border-black/5 p-6 animate-in slide-in-from-top duration-300">
                    <nav className="flex flex-col gap-4">
                        <a href="#products" onClick={() => setIsOpen(false)} className="text-muted font-medium py-2">Products</a>
                        <a href="#company" onClick={() => setIsOpen(false)} className="text-muted font-medium py-2">Company</a>
                        <div className="pt-4 border-t border-black/5">
                            <a href="/app">
                                <Button className="w-full justify-center">
                                    Sign in
                                </Button>
                            </a>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
