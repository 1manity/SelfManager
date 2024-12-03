import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from "@/components/ui/sheet"
import { getAllTask, createNewTask, deleteTask } from "@/api/task"
import { IconPencil,IconTrash,IconCalendar   } from '@tabler/icons-react';

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
                <h2 className="text-2xl font-semibold mb-6">今日待完成任务</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tasks.map((task) => (
                    <Card key={task.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{task.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                        <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
                        <div className="flex items-center text-xs text-gray-500 mt-2">
                        <IconCalendar className="w-3 h-3 mr-1" />
                        {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end space-x-2 pt-2">
                        <Button size="sm" variant="ghost" onClick={() => handleUpdateTask(task.id)}>
                        <IconPencil className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDeleteTask(task.id)}>
                        <IconTrash className="w-4 h-4" />
                        </Button>
                    </CardFooter>
                    </Card>
                ))}
                </div>
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