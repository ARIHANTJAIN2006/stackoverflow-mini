import { database } from "@/models/server/config";
import { db, questionCollection } from "@/models/name";
import { Particles } from "@/components/magicui/particles";
import { TracingBeam } from "@/components/ui/tracingbeam";
import FetchQuestions from "@/helpers/fetchQuestions"; // update the path if needed

export default async function QuestionsPage() {
  const response = await database.listDocuments(db, questionCollection,);
  const questions = response.documents;

  return (
    <TracingBeam className="container">
      <div className="relative overflow-hidden min-h-screen w-full bg-black">
        <Particles
          className="fixed inset-0 h-full w-full"
          quantity={500}
          ease={150}
          color="#ffffff"
          refresh
        />
        <FetchQuestions questions={questions} />
      </div>
    </TracingBeam>
  );
}
