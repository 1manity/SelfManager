import { getAllTask } from "@/api/task"

export default function Task() {
    return (
        <div className="flex">
            <div className="w-64 p-6"><h1 class="scroll-m-20 text-2xl font-thin tracking-tight">任务</h1></div>
            <div className="flex-1 bg-[#fafafa] min-h-screen">
                <button onClick={async ()=> {
                const data = await getAllTask()
                console.log(data)
                }}>test</button>
            </div>
            
        </div>
    )
}