// src/components/TaskRuleCard.js
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from '@/components/ui/card'; // 根据你的项目结构调整路径
import { Button } from '@/components/ui/button';
import { IconPencil, IconTrash } from '@tabler/icons-react'; // 根据你的图标组件路径调整

const TaskRuleCard = ({ taskRule, onEdit, onDelete }) => {
    const handleEdit = () => {
        onEdit(taskRule);
    };

    const handleDelete = () => {
        onDelete(taskRule.id);
    };

    return (
        <Card key={taskRule.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
                <div className="flex justify-between">
                    <CardTitle className="text-lg">{taskRule.title}</CardTitle>
                    <div className="flex items-center text-xs text-gray-500 mt-2">
                        {new Date(taskRule.nextRun).toLocaleDateString()} 执行
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pb-2">
                <p className="text-sm text-gray-600 line-clamp-2">
                    {taskRule.description}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                    频率:{' '}
                    {taskRule.frequency === 'daily'
                        ? '每日'
                        : `每周 ${taskRule.daysOfWeek.map((d) => ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][d]).join(', ')}`}
                </p>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2 pt-2">
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

export default TaskRuleCard;
