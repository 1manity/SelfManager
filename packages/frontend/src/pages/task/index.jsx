import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from "@/components/ui/sheet"
import { getAllTask, createNewTask, deleteTask } from "@/api/task"

export default function Task() {
    const [tasks, setTasks] = useState([])
    const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
    const [newTask, setNewTask] = useState({ title: "", description: "", dueDate: "" })

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const { code, message, data } = await getAllTask();  // 直接获取结构化的 { code, message, data }
            if (code === 200) {
                setTasks(data); // 假设任务数据存储在 data 中
            } else {
                console.error(message); // 如果没有成功，打印错误消息
            }
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    }

    // 创建任务
    const handleCreateTask = async () => {
        try {
            const { code, message, data } = await createNewTask(newTask);
            if (code === 200) {
                setTasks([...tasks, data]);  // 假设创建的任务数据存储在 data 中
            } else {
                console.error(message); // 如果没有成功，打印错误消息
            }
        } catch (error) {
            console.error('任务创建失败:', error.message);
        }
    };

    // 删除任务
    const handleDeleteTask = async (taskId) => {
        try {
            const { code, message } = await deleteTask(taskId);
            if (code === 200) {
                setTasks(tasks.filter(task => task.id !== taskId)); // 更新任务列表
            } else {
                console.error(message); // 如果删除失败，打印错误消息
            }
        } catch (error) {
            console.error('删除任务失败:', error.message);
        }
    };

    const handleUpdateTask = (taskId) => {
        // 这里实现更新任务的逻辑
        console.log("Updating task:", taskId);
    }

    return (
        <div className="flex h-screen">
            <div className="w-64 p-6 border-r">
                <h1 className="scroll-m-20 text-2xl font-thin tracking-tight mb-4">任务</h1>
                <Button onClick={() => setIsAddTaskOpen(true)}>添加任务</Button>
            </div>
            <div className="flex-1 bg-[#fafafa] p-6 overflow-auto">
                <h2 className="text-xl font-semibold mb-4">今日待完成任务</h2>
                {tasks.map((task) => (
                <Card key={task.id} className="mb-4">
                    <CardHeader>
                    <CardTitle>{task.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                    <p>{task.description}</p>
                    <p className="text-sm text-gray-500 mt-2">截止日期: {new Date(task.dueDate).toLocaleString()}</p>
                    </CardContent>
                    <CardFooter className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => handleUpdateTask(task.id)}>修改</Button>
                    <Button variant="destructive" onClick={() => handleDeleteTask(task.id)}>删除</Button>
                    </CardFooter>
                </Card>
                ))}
            </div>

            <Sheet open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
                <SheetContent>
                <SheetHeader>
                    <SheetTitle>添加新任务</SheetTitle>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                        标题
                    </Label>
                    <Input
                        id="title"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        className="col-span-3"
                    />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                        内容
                    </Label>
                    <Textarea
                        id="description"
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        className="col-span-3"
                    />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="dueDate" className="text-right">
                        截止日期
                    </Label>
                    <Input
                        id="dueDate"
                        type="datetime-local"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                        className="col-span-3"
                    />
                    </div>
                </div>
                <SheetFooter>
                    <SheetClose asChild>
                    <Button type="submit" onClick={handleCreateTask}>保存任务</Button>
                    </SheetClose>
                </SheetFooter>
                </SheetContent>
            </Sheet>
        </div>
    )
}