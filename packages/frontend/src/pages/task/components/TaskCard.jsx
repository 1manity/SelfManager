// src/components/TaskCard.js
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from '@/components/ui/card'; // 根据你的项目结构调整路径
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { IconPencil, IconTrash, IconCalendar } from '@tabler/icons-react';

const TaskCard = ({ task, onStatusChange, onEdit, onDelete }) => {
    const handleStatusChange = (value) => {
        onStatusChange(task.id, value);
    };

    const handleEdit = () => {
        onEdit(task);
    };

    const handleDelete = () => {
        onDelete(task.id);
    };

    return (
        <Card key={task.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
                <div className="flex justify-between">
                    <CardTitle className="text-lg">{task.title}</CardTitle>
                    <div className="flex items-center text-xs text-gray-500 mt-2">
                        <IconCalendar className="w-3 h-3 mr-1" />
                        {new Date(
                            task.dueDate
                        ).toLocaleDateString()} 截止
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pb-2">
                <p className="text-sm text-gray-600 line-clamp-2">
                    {task.description}
                </p>
            </CardContent>

            <CardFooter className="flex justify-end space-x-2 pt-2">
                <Select
                    defaultValue={task.status}
                    onValueChange={handleStatusChange}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="pending">待完成</SelectItem>
                        <SelectItem value="in-progress">进行中</SelectItem>
                        <SelectItem value="completed">已完成</SelectItem>
                    </SelectContent>
                </Select>
                <Button size="sm" variant="ghost" onClick={handleEdit}>
                    <IconPencil className="w-4 h-4" />
                </Button>
                <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive"
                    onClick={handleDelete}
                >
                    <IconTrash className="w-4 h-4" />
                </Button>
            </CardFooter>
        </Card>
    );
};
export default TaskCard;
