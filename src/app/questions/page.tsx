import { database } from "@/models/server/config";
import { db, questionCollection } from "@/models/name";
import { Particles } from "@/components/magicui/particles";
import { TracingBeam } from "@/components/ui/tracingbeam";
import FetchQuestions from "@/helpers/fetchQuestions"; // update the path if needed

export default async function QuestionsPage() {
  let questions = [];
  try{
  const response = await database.listDocuments(db, questionCollection);
   questions = response.documents;
  }catch(error){
    console.error("Error fetching questions:", error);
  }

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
