import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

const RequirementItem = ({ requirement, onStatusChange, onEdit, onDelete }) => {
    return (
        <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                    <h3 className="font-medium">{requirement.title}</h3>
                    <div className="flex items-center gap-2">
                        <Select
                            value={requirement.status}
                            onValueChange={(value) => onStatusChange(requirement.id, value)}
                        >
                            <SelectTrigger className="w-[120px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">待开发</SelectItem>
                                <SelectItem value="in_progress">开发中</SelectItem>
                                <SelectItem value="developed">已完成</SelectItem>
                                <SelectItem value="testing">测试中</SelectItem>
                                <SelectItem value="completed">已上线</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" size="sm" onClick={() => onEdit(requirement)}>
                            编辑
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => onDelete(requirement)}>
                            删除
                        </Button>
                    </div>
                </div>
                <p className="text-sm text-gray-500">{requirement.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>优先级：{requirement.priority}</span>
                    <span>进度：{requirement.progress}%</span>
                    <span>截止日期：{format(new Date(requirement.dueDate), 'yyyy-MM-dd')}</span>
                </div>
            </div>
        </div>
    );
};

export default RequirementItem;
