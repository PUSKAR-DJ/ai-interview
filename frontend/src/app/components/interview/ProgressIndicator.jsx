export default function ProgressIndicator({ current, total }) {
  const percent = (current / total) * 100;

  return (
    <div>
      <div className="h-1 rounded-full bg-black/10 overflow-hidden">
        <div
          className="h-full bg-accent transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>

      <p className="mt-2 text-xs text-muted">
        Progress: {current} / {total}
      </p>
    </div>
  );
}
