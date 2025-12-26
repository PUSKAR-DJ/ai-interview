import { Button } from "../../shared/ui";

export default function Navbar() {
    return (
        <header className="fixed top-0 inset-x-0 backdrop-blur-glass bg-white/70 border-b border-black/5 z-50">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                <span className="font-semibold">Company</span>
                <nav className="flex gap-6 text-sm text-muted">
                    <a href="#products"><Button variant="ghost" >Products</Button></a>
                    <a href="#company"><Button variant="ghost" >Company</Button></a>
                    <a href="/app" className="text-accent font-medium">
                        <Button className="text-sm">
                            Sign in
                        </Button>
                    </a>
                </nav>
            </div>
        </header>
    );
}
