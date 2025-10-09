"use client"
import { Particles } from "@/components/magicui/particles";
import Link from "next/link"
import dynamic from 'next/dynamic'
import { useAuthStore } from "@/store/Auth";
import  { useRouter } from "next/navigation";
const IconCloud = dynamic(() => import('@/components/magicui/icon-cloud'), {
  ssr: false,
})
function NavItem({
  href,
  text,
  onClick,
}: {
  href?: string;
  text: string;
  onClick?: () => void;
}) {
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="px-4 py-2 rounded-full hover:bg-white/10 transition text-sm text-white"
      >
        {text}
      </button>
    );
  }

  return (
    <Link
      href={href!}
      className="px-4 py-2 rounded-full hover:bg-white/10 transition text-sm text-white"
    >
      {text}
    </Link>
  );
}

export default function Home() {
  const router = useRouter()
  const {logout} = useAuthStore()
  const onClick = () => {
   logout()
   router.push("/auth/login")
  }
  return (
    
    <div className="relative overflow-hidden min-h-screen w-full bg-black">
  <Particles
                className="fixed inset-0 h-full w-full"
                quantity={500}
                ease={100}
                color="#ffffff"
                refresh
            />
           <nav className="w-full px-6 py-6 flex justify-center items-center">
        <div className="flex gap-4 border border-white/30 rounded-full px-6 py-2 backdrop-blur-sm">
        <NavItem href="/dashboard" text="Dashboard" />
          <NavItem href="/questions" text="Questions" />
          <NavItem text="Logout" onClick={onClick} />
          
        </div>

      </nav>
      <IconCloud
        iconSlugs={["react", "nextjs", "javascript", "typescript", "node-dot-js", "express", "nextdotjs","mongodb", "graphql", "css", "html5","docker"]}/>
</div>

  );
}
