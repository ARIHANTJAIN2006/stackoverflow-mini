"use client"

import DownvoteButton from "@/components/ui/downvotebutton"
import { Separator } from "@/components/ui/separator"
import UpvoteButton from "@/components/ui/upvotebutton"
import axios from "axios"
import { useEffect, useState } from "react"
import { useAuthStore } from "@/store/Auth";
import { FetchComments } from "./fetchcomments"
//votedById,voteStatus,type,typeId
import Editor from '@uiw/react-md-editor';

// This is the read‑only preview component
export const MarkdownPreview = Editor.Markdown;
export default function FetchAnswers({ qid }: { qid: string }) {
  const {user} = useAuthStore()
  const userId  = user?.$id
  console.log(userId)
  const [qtitle, setting] = useState("")
  const [qcontent,setcontent] = useState("")
  const [anscheck, setter] = useState(false)
  const [authorss, set] = useState<Record<string, string>>({})
  type Answer = {
    $id: string;
    authorId: string;
    content: string;
    // add other properties if needed
  };
  const [answers, setAnswers] = useState<Answer[]>([])
  const [upvotedMap, setUpvotedMap] = useState<Record<string, boolean>>({});
const [downvotedMap, setDownvotedMap] = useState<Record<string, boolean>>({});
const [voteCounts, setVoteCounts] = useState<Record<string, number>>({});

  const handleupbutton = async (type:string,typeId:string) => {
      const alreadyUpvoted = upvotedMap[typeId]
      if(alreadyUpvoted){
       await axios.post("/api/vote",{votedById:userId,voteStatus:"upvoted",type:type,typeId:typeId})
       setUpvotedMap({...upvotedMap,[typeId]:false})
       const response = await axios.post("/api/vote-count",{typeid:typeId,type:type})
       setVoteCounts({
       ...voteCounts,
       [typeId]: response.data.data,
  });
}
     else{
        await axios.post("/api/vote",{votedById:userId,voteStatus:"upvoted",type:type,typeId})
        setUpvotedMap({...upvotedMap,[typeId]:true})
       setDownvotedMap({...downvotedMap,[typeId]:false})
       const response = await axios.post("/api/vote-count",{typeid:typeId,type:type})
       setVoteCounts({
       ...voteCounts,
       [typeId]: response.data.data,
  });
}
  }
  const handledownbutton = async (type:string,typeId:string) => {
    
    const alreadyDownvoted = downvotedMap[typeId]
    
    if(alreadyDownvoted){
        await axios.post("/api/vote",{votedById:userId,voteStatus:"downvoted",type,typeId})
    setDownvotedMap({...downvotedMap,[typeId]:false})
    const response = await axios.post("/api/vote-count",{typeid:typeId,type:type})
  setVoteCounts({
    ...voteCounts,
    [typeId]: response.data.data,
  });
    }
    else{
      await axios.post("/api/vote",{votedById:userId,voteStatus:"downvoted",type:type,typeId:typeId})
     setUpvotedMap({...upvotedMap,[typeId]:false})
    setDownvotedMap({...downvotedMap,[typeId]:true})
    const response = await axios.post("/api/vote-count",{typeid:typeId,type:type})
  setVoteCounts({
    ...voteCounts,
    [typeId]: response.data.data,
  });
}
  } 
  useEffect(() => {
    async function fetchanswers() {
        const res = await axios.post("/api/questions/qid", { qid: qid })
        const data = res.data.data
        setting(data.questiontitle)
        setcontent(data.questioncontent)

        if (data.message === "Unanswered") {
          setter(true)
          return
        }

        const fetchedAnswers = data.answers
        setAnswers(fetchedAnswers)


        const authors: Record<string, string> = {}

        for (const a of fetchedAnswers) {
          
          const authorId = a.authorId
          const userRes = await axios.post("/api/fetchuserdetails", { authorId:authorId })
          authors[authorId] = userRes.data.data
            

        }
        
        set(authors)
        setter(false)
        
    }
    fetchanswers()
  }, [])
  // This useEffect depends on 'answers' and 'userId'
useEffect(() => {
  if (answers.length === 0 || !userId) return;

  async function voteCounts() {
    const result: Record<string, number> = {};
    const upvoted: Record<string, boolean> = {};
    const downvoted: Record<string, boolean> = {};

    for (const a of answers) {
      try {
        const res = await axios.post("/api/vote-count", {
          typeid: a.$id,
          type: "answer",
        });
        result[a.$id] = res.data.data;

        const resp = await axios.post("/api/votestatuscheck", {
          typeid: a.$id,
          type: "answer",
          votedById: userId,
        });

        const voteStatus = resp.data.data;
        if (voteStatus === "upvoted") {
          upvoted[a.$id] = true;
          downvoted[a.$id] = false;
        } else if (voteStatus === "downvoted") {
          upvoted[a.$id] = false;
          downvoted[a.$id] = true;
        } else {
          upvoted[a.$id] = false;
          downvoted[a.$id] = false;
        }
        const ress = await axios.post("/api/vote-count", {
          typeid: qid,
          type: "question",
        });
                result[qid] = ress.data.data;

        const respp = await axios.post("/api/votestatuscheck", {
          typeid: qid,
          type: "question",
          votedById: userId,
        });
                const voteStatuss = respp.data.data;
         if (voteStatuss === "upvoted") {
          upvoted[qid] = true;
          downvoted[qid] = false;
        } else if (voteStatuss === "downvoted") {
          upvoted[qid] = false;
          downvoted[qid] = true;
        } else {
          upvoted[qid] = false;
          downvoted[qid] = false;
        }
      } catch {
        result[qid] = 0;
        
      }
      
    }
    
    setVoteCounts(result);
    setUpvotedMap(upvoted);
    setDownvotedMap(downvoted);
  }

  voteCounts();
}, [answers, userId,qid]);
  return (
    <div className="">
        <div className = "flex mb-4">
            <div className="flex flex-col justify-between h-35">
                <UpvoteButton voted={upvotedMap[qid]} onClick={() => handleupbutton("question",qid) }/>
                <p className="ml-3.5">{voteCounts[qid]}</p>
                <DownvoteButton voted={downvotedMap[qid]} onClick={() => handledownbutton("question",qid) }/>
            </div>
             <div> 
              <h1 className="  mb-5 text-3xl text-white ml-10 ">{qtitle}</h1>
             <MarkdownPreview source = {qcontent} className="w-full ml-10 max-h-full"/>
             </div>
     
      
        </div>
       
      <Separator className="bg-zinc-700 h-[1px]"/>

      {anscheck ? (
        <p className="mt-5 text-yellow-400">This question is unanswered.</p>
      ) : (
        <div className="mt-4 space-y-4">
          {answers.map((a) => (
            <div key = {a.$id}>
             <div key={a.$id} className="bg-zinc-900 p-4 rounded-xl ">
              <div className="flex">
             <div className="flex flex-col justify-between h-35">
                <UpvoteButton voted={upvotedMap[a.$id]} onClick={() => handleupbutton("answer",a.$id) }/>
                <p className="ml-3.5 text-white">{voteCounts[a.$id]}</p>
                <DownvoteButton voted={downvotedMap[a.$id]} onClick={() => handledownbutton("answer",a.$id)  }/>
            </div>
                    <p className="text-white text-sm ml-10">{a.content}</p>
              <p className="text-yellow-400 text-xs mt-25 ml-150">By: {authorss[a.authorId]}</p>
              </div>
              
            </div>
                  
                  <FetchComments parentId={a.$id} type={"answer"} userId={userId!}/>
            </div>
           
            
          ))}
        </div>
      )}
    </div>
  )
}
