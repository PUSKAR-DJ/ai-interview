export default function Footer() {
  return (
    <footer className="border-t border-black/5 py-12 text-sm text-muted">
      <div className="max-w-6xl mx-auto px-6">
        © {new Date().getFullYear()} Company. All rights reserved.
      </div>
    </footer>
  );
}
