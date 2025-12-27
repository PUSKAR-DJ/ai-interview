import CandidateRow from "./CandidateRow";

const candidates = [
  {
    name: "Ankit Sharma",
    role: "Frontend Developer",
    status: "Interview completed",
  },
  {
    name: "Priya Verma",
    role: "Backend Developer",
    status: "Interview scheduled",
  },
  {
    name: "Rahul Das",
    role: "UI Designer",
    status: "Pending review",
  },
];

export default function CandidatesList() {
  return (
    <div className="rounded-xl border border-black/5 bg-white divide-y">
      {candidates.map((candidate) => (
        <CandidateRow
          key={candidate.name}
          candidate={candidate}
        />
      ))}
    </div>
  );
}
