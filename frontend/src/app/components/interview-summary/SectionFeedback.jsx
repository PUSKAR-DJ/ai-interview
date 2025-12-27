import { Card } from "../../../shared/ui";

const sections = [
  {
    title: "React Fundamentals",
    feedback:
      "Clear understanding of hooks, state management, and component lifecycles.",
  },
  {
    title: "Problem Solving",
    feedback:
      "Approached problems methodically and explained reasoning well.",
  },
  {
    title: "Communication",
    feedback:
      "Responses were structured and easy to follow.",
  },
];

export default function SectionFeedback() {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-medium">Detailed feedback</h2>

      {sections.map((item) => (
        <Card key={item.title}>
          <h3 className="font-medium">{item.title}</h3>
          <p className="mt-2 text-muted">{item.feedback}</p>
        </Card>
      ))}
    </section>
  );
}
