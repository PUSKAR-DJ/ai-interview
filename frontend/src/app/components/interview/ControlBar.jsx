import Button from "../../../shared/ui/Button";

export default function ControlBar({ onNext, onPrev, onSubmit, isFirst, isLast, submitting }) {
  return (
    <div className="flex items-center justify-between pt-4">
      {/* Previous Button */}
      <div className="w-32">
        {!isFirst && (
          <Button variant="outline" onClick={onPrev} className="w-full">
            Previous
          </Button>
        )}
      </div>

      {/* Next / Submit Button */}
      <div className="w-32">
        {isLast ? (
          <Button onClick={onSubmit} disabled={submitting} className="w-full bg-green-600 hover:bg-green-700">
            {submitting ? "..." : "Submit"}
          </Button>
        ) : (
          <Button onClick={onNext} className="w-full">
            Next
          </Button>
        )}
      </div>
    </div>
  );
}