import Navbar from "@/components/home/navbar/navbar";
import { Banner } from "@/components/home/banner/banner";



export default function Page() {
  return (
    <div className="flex min-h-svh flex-col p-6 pt-28">
      <Navbar></Navbar>
      <Banner />
    </div>
  )
}
