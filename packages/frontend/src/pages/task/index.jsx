import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { getAllTask, createNewTask, deleteTask, updateTask, updateTaskStatus } from '@/api/task';
import { getAllTaskRules, createNewTaskRule, deleteTaskRule, updateTaskRule } from '@/api/taskRule';

import TaskCard from './components/TaskCard';
import TaskRuleCard from './components/TaskRuleCard';

export default function Task() {
    const { toast } = useToast();

    const [tasks, setTasks] = useState([]);
    const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
    const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        dueDate: '',
    });
    const [editingTask, setEditingTask] = useState(null);

    // 任务规则状态
    const [taskRules, setTaskRules] = useState([]);
    const [isAddTaskRuleOpen, setIsAddTaskRuleOpen] = useState(false);
    const [isEditTaskRuleOpen, setIsEditTaskRuleOpen] = useState(false);
    const [newTaskRule, setNewTaskRule] = useState({
        title: '',
        description: '',
        frequency: 'daily',
        daysOfWeek: [],
        timeOfDay: '09:00:00',
    });
    const [editingTaskRule, setEditingTaskRule] = useState(null);

    useEffect(() => {
        fetchTasks();
        fetchTaskRules();
    }, []);

    const fetchTasks = async () => {
        try {
            const { code, message, data } = await getAllTask();
            if (code === 200) {
                setTasks(data);
            } else {
                console.error(message);
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
            console.log('132');
        }
    };

    const fetchTaskRules = async () => {
        try {
            const { code, message, data } = await getAllTaskRules();
            if (code === 200) {
                setTaskRules(data);
            } else {
                console.error(message);
            }
        } catch (error) {
            console.error('Error fetching task rules:', error);
        }
    };

    const handleCreateTask = async () => {
        try {
            const { code, message, data } = await createNewTask(newTask);
            if (code === 200) {
                toast({ title: '任务创建成功😃' });
                setTasks([...tasks, data]);
                setIsAddTaskOpen(false);
                setNewTask({ title: '', description: '', dueDate: '' });
            } else {
                throw new Error(message);
            }
        } catch (error) {
            toast({ title: '任务创建失败😢', description: error });
            console.error('任务创建失败:', error.message);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            const { code, message } = await deleteTask(taskId);
            if (code === 200) {
                toast({ title: '任务删除成功😃' });
                setTasks(tasks.filter((task) => task.id !== taskId));
            } else {
                throw new Error(message);
            }
        } catch (error) {
            toast({ title: '任务删除失败😢', description: error });
            console.error('删除任务失败:', error.message);
        }
    };

    const handleUpdateTask = async () => {
        try {
            const { code, message, data } = await updateTask(editingTask.id, editingTask);
            if (code === 200) {
                toast({ title: '任务更新成功😃' });
                setTasks(tasks.map((task) => (task.id === editingTask.id ? data : task)));
                setIsEditTaskOpen(false);
                setEditingTask(null);
            } else {
                throw new Error(message);
            }
        } catch (error) {
            toast({ title: '任务更新失败😢', description: error });
            console.error('更新任务失败:', error.message);
        }
    };

    const handleStatusChange = (taskId, newStatus) => {
        // This function will be implemented by you
        console.log(`Changing status of task ${taskId} to ${newStatus}`);
        try {
            updateTaskStatus(taskId, newStatus).then((res) => {
                if (res.code === 200) {
                    toast({ title: '任务状态更新成功😃' });
                    console.log(tasks, res.data);
                    setTasks(tasks.map((task) => (task.id === res.data.id ? res.data : task)));
                }
            });
        } catch (error) {
            toast({ title: '任务状态更新失败😢', description: error });
            console.error('更新任务状态失败:', error.message);
        }
    };

    const openEditTask = (task) => {
        setEditingTask(task);
        setIsEditTaskOpen(true);
    };

    // 任务规则相关处理函数
    const handleCreateTaskRule = async () => {
        try {
            const { code, message, data } = await createNewTaskRule(newTaskRule);
            if (code === 200) {
                toast({ title: '规则任务创建成功😃' });
                setTaskRules([...taskRules, data]);
                setIsAddTaskRuleOpen(false);
                setNewTaskRule({
                    title: '',
                    description: '',
                    frequency: 'daily',
                    daysOfWeek: [],
                    timeOfDay: '09:00:00',
                });
            } else {
                throw new Error(message);
            }
        } catch (error) {
            toast({ title: '规则任务创建失败😢', description: error });
            console.error('规则任务创建失败:', error.message);
        }
    };

    const handleDeleteTaskRule = async (taskRuleId) => {
        try {
            const { code, message } = await deleteTaskRule(taskRuleId);
            if (code === 200) {
                toast({ title: '规则任务删除成功😃' });
                setTaskRules(taskRules.filter((rule) => rule.id !== taskRuleId));
            } else {
                throw new Error(message);
            }
        } catch (error) {
            toast({ title: '规则任务删除失败😢', description: error });
            console.error('删除规则任务失败:', error.message);
        }
    };

    const handleUpdateTaskRule = async () => {
        try {
            const { code, message, data } = await updateTaskRule(editingTaskRule.id, newTaskRule);
            if (code === 200) {
                toast({ title: '规则任务更新成功😃' });
                setTaskRules(taskRules.map((rule) => (rule.id === data.id ? data : rule)));
                setIsEditTaskRuleOpen(false);
                setEditingTaskRule(null);
            } else {
                throw new Error(message);
            }
        } catch (error) {
            toast({ title: '规则任务更新失败😢', description: error });
            console.error('规则任务更新失败:', error.message);
        }
    };

    const handleEditTaskRule = (taskRule) => {
        setEditingTaskRule(taskRule);
        setIsEditTaskRuleOpen(true);
        setNewTaskRule({
            title: taskRule.title,
            description: taskRule.description,
            frequency: taskRule.frequency,
            daysOfWeek: taskRule.daysOfWeek,
            timeOfDay: taskRule.timeOfDay,
        });
    };
    return (
        <div className="flex h-screen">
            <div className="w-64 p-6 border-r">
                <h1 className="scroll-m-20 text-2xl font-thin tracking-tight mb-4">任务</h1>
                <Button onClick={() => setIsAddTaskOpen(true)}>添加任务</Button>
                <h1 className="scroll-m-20 text-2xl font-thin tracking-tight mb-4 mt-4">任务规则</h1>
                <Button onClick={() => setIsAddTaskRuleOpen(true)} className="mb-2">
                    添加任务规则
                </Button>
            </div>
            <div className="flex-1 bg-[#fafafa] p-6 overflow-auto">
                <h2 className="text-2xl font-semibold mb-6">今日待完成任务</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onStatusChange={handleStatusChange}
                            onEdit={openEditTask}
                            onDelete={handleDeleteTask}
                        />
                    ))}
                </div>
                <h2 className="text-2xl font-semibold mt-10 mb-6">规则任务</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {taskRules.map((rule) => (
                        <TaskRuleCard
                            key={rule.id}
                            taskRule={rule}
                            onEdit={handleEditTaskRule}
                            onDelete={handleDeleteTaskRule}
                        />
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
                                onChange={(e) =>
                                    setNewTask({
                                        ...newTask,
                                        title: e.target.value,
                                    })
                                }
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
                                onChange={(e) =>
                                    setNewTask({
                                        ...newTask,
                                        description: e.target.value,
                                    })
                                }
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
                                onChange={(e) =>
                                    setNewTask({
                                        ...newTask,
                                        dueDate: e.target.value,
                                    })
                                }
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <SheetFooter>
                        <SheetClose asChild>
                            <Button type="submit" onClick={handleCreateTask}>
                                保存任务
                            </Button>
                        </SheetClose>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            <Sheet open={isEditTaskOpen} onOpenChange={setIsEditTaskOpen}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>编辑任务</SheetTitle>
                    </SheetHeader>
                    {editingTask && (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-title" className="text-right">
                                    标题
                                </Label>
                                <Input
                                    id="edit-title"
                                    value={editingTask.title}
                                    onChange={(e) =>
                                        setEditingTask({
                                            ...editingTask,
                                            title: e.target.value,
                                        })
                                    }
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-description" className="text-right">
                                    内容
                                </Label>
                                <Textarea
                                    id="edit-description"
                                    value={editingTask.description}
                                    onChange={(e) =>
                                        setEditingTask({
                                            ...editingTask,
                                            description: e.target.value,
                                        })
                                    }
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-dueDate" className="text-right">
                                    截止日期
                                </Label>
                                <Input
                                    id="edit-dueDate"
                                    type="datetime-local"
                                    value={editingTask.dueDate}
                                    onChange={(e) =>
                                        setEditingTask({
                                            ...editingTask,
                                            dueDate: e.target.value,
                                        })
                                    }
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                    )}
                    <SheetFooter>
                        <SheetClose asChild>
                            <Button type="submit" onClick={handleUpdateTask}>
                                更新任务
                            </Button>
                        </SheetClose>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            {/* 添加任务规则弹窗 */}
            <Sheet open={isAddTaskRuleOpen} onOpenChange={setIsAddTaskRuleOpen}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>添加任务规则</SheetTitle>
                    </SheetHeader>
                    <div className="grid gap-4 py-4">
                        {/* 规则标题 */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="rule-title" className="text-right">
                                标题
                            </Label>
                            <Input
                                id="rule-title"
                                value={newTaskRule.title}
                                onChange={(e) =>
                                    setNewTaskRule({
                                        ...newTaskRule,
                                        title: e.target.value,
                                    })
                                }
                                className="col-span-3"
                            />
                        </div>

                        {/* 规则描述 */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="rule-description" className="text-right">
                                描述
                            </Label>
                            <Textarea
                                id="rule-description"
                                value={newTaskRule.description}
                                onChange={(e) =>
                                    setNewTaskRule({
                                        ...newTaskRule,
                                        description: e.target.value,
                                    })
                                }
                                className="col-span-3"
                            />
                        </div>

                        {/* 频率选择 */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="rule-frequency" className="text-right">
                                频率
                            </Label>
                            <select
                                id="rule-frequency"
                                value={newTaskRule.frequency}
                                onChange={(e) =>
                                    setNewTaskRule({
                                        ...newTaskRule,
                                        frequency: e.target.value,
                                        daysOfWeek: [], // 重置星期几选择
                                    })
                                }
                                className="col-span-3 w-full p-2 border rounded"
                            >
                                <option value="daily">每日</option>
                                <option value="weekly">每周</option>
                            </select>
                        </div>

                        {/* 星期几选择，仅当频率为“weekly”时显示 */}
                        {newTaskRule.frequency === 'weekly' && (
                            <div className="grid grid-cols-4 items-start gap-4">
                                <Label className="text-right">星期几</Label>
                                <div className="col-span-3 flex flex-wrap">
                                    {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                                        <label key={day} className="mr-4 flex items-center">
                                            <input
                                                type="checkbox"
                                                value={day}
                                                checked={newTaskRule.daysOfWeek.includes(day)}
                                                onChange={(e) => {
                                                    const dayValue = parseInt(e.target.value);
                                                    setNewTaskRule((prev) => ({
                                                        ...prev,
                                                        daysOfWeek: prev.daysOfWeek.includes(dayValue)
                                                            ? prev.daysOfWeek.filter((d) => d !== dayValue)
                                                            : [...prev.daysOfWeek, dayValue],
                                                    }));
                                                }}
                                                className="mr-1"
                                            />
                                            {['周日', '周一', '周二', '周三', '周四', '周五', '周六'][day]}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 执行时间 */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="rule-timeOfDay" className="text-right">
                                执行时间
                            </Label>
                            <Input
                                id="rule-timeOfDay"
                                type="time"
                                value={newTaskRule.timeOfDay.slice(0, 5)} // "HH:mm"
                                onChange={(e) =>
                                    setNewTaskRule({
                                        ...newTaskRule,
                                        timeOfDay: `${e.target.value}:00`, // 补全为 "HH:mm:ss"
                                    })
                                }
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <SheetFooter>
                        <SheetClose asChild>
                            <Button type="submit" onClick={handleCreateTaskRule}>
                                创建规则任务
                            </Button>
                        </SheetClose>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            {/* 编辑任务规则弹窗 */}
            <Sheet open={isEditTaskRuleOpen} onOpenChange={setIsEditTaskRuleOpen}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>编辑任务规则</SheetTitle>
                    </SheetHeader>
                    {editingTaskRule && (
                        <div className="grid gap-4 py-4">
                            {/* 规则标题 */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-rule-title" className="text-right">
                                    标题
                                </Label>
                                <Input
                                    id="edit-rule-title"
                                    value={newTaskRule.title}
                                    onChange={(e) =>
                                        setNewTaskRule({
                                            ...newTaskRule,
                                            title: e.target.value,
                                        })
                                    }
                                    className="col-span-3"
                                />
                            </div>

                            {/* 规则描述 */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-rule-description" className="text-right">
                                    描述
                                </Label>
                                <Textarea
                                    id="edit-rule-description"
                                    value={newTaskRule.description}
                                    onChange={(e) =>
                                        setNewTaskRule({
                                            ...newTaskRule,
                                            description: e.target.value,
                                        })
                                    }
                                    className="col-span-3"
                                />
                            </div>

                            {/* 频率选择 */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-rule-frequency" className="text-right">
                                    频率
                                </Label>
                                <select
                                    id="edit-rule-frequency"
                                    value={newTaskRule.frequency}
                                    onChange={(e) =>
                                        setNewTaskRule({
                                            ...newTaskRule,
                                            frequency: e.target.value,
                                            daysOfWeek: [], // 重置星期几选择
                                        })
                                    }
                                    className="col-span-3 w-full p-2 border rounded"
                                >
                                    <option value="daily">每日</option>
                                    <option value="weekly">每周</option>
                                </select>
                            </div>

                            {/* 星期几选择，仅当频率为“weekly”时显示 */}
                            {newTaskRule.frequency === 'weekly' && (
                                <div className="grid grid-cols-4 items-start gap-4">
                                    <Label className="text-right">星期几</Label>
                                    <div className="col-span-3 flex flex-wrap">
                                        {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                                            <label key={day} className="mr-4 flex items-center">
                                                <input
                                                    type="checkbox"
                                                    value={day}
                                                    checked={newTaskRule.daysOfWeek.includes(day)}
                                                    onChange={(e) => {
                                                        const dayValue = parseInt(e.target.value);
                                                        setNewTaskRule((prev) => ({
                                                            ...prev,
                                                            daysOfWeek: prev.daysOfWeek.includes(dayValue)
                                                                ? prev.daysOfWeek.filter((d) => d !== dayValue)
                                                                : [...prev.daysOfWeek, dayValue],
                                                        }));
                                                    }}
                                                    className="mr-1"
                                                />
                                                {['周日', '周一', '周二', '周三', '周四', '周五', '周六'][day]}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 执行时间 */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-rule-timeOfDay" className="text-right">
                                    执行时间
                                </Label>
                                <Input
                                    id="edit-rule-timeOfDay"
                                    type="time"
                                    value={newTaskRule.timeOfDay.slice(0, 5)} // "HH:mm"
                                    onChange={(e) =>
                                        setNewTaskRule({
                                            ...newTaskRule,
                                            timeOfDay: `${e.target.value}:00`, // 补全为 "HH:mm:ss"
                                        })
                                    }
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                    )}
                    <SheetFooter>
                        <SheetClose asChild>
                            <Button type="submit" onClick={handleUpdateTaskRule}>
                                更新规则任务
                            </Button>
                        </SheetClose>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </div>
    );
}
