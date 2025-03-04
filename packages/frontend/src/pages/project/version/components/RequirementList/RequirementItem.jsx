import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const priorityColors = {
    low: 'bg-gray-500',
    medium: 'bg-yellow-500',
    high: 'bg-red-500',
};

const statusColors = {
    pending: 'bg-gray-500',
    in_progress: 'bg-blue-500',
    developed: 'bg-yellow-500',
    testing: 'bg-purple-500',
    completed: 'bg-green-500',
};

const RequirementItem = ({ requirement, onStatusChange, onEdit, onDelete, onAssign, members }) => {
    const assigneeValue = requirement.assigneeId ? requirement.assigneeId.toString() : 'unassigned';

    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), 'yyyy-MM-dd HH:mm');
        } catch (error) {
            console.error('日期格式化错误:', error);
            return '无效日期';
        }
    };

    return (
        <Accordion type="single" collapsible className="border rounded-lg">
            <AccordionItem value="item-1" className="border-none">
                <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center justify-between p-4 w-full">
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <h3 className="font-medium">{requirement.title}</h3>
                                    <Badge className={statusColors[requirement.status]}>
                                        {requirement.status === 'pending' && '待开发'}
                                        {requirement.status === 'in_progress' && '开发中'}
                                        {requirement.status === 'developed' && '已完成'}
                                        {requirement.status === 'testing' && '测试中'}
                                        {requirement.status === 'completed' && '已上线'}
                                    </Badge>
                                    <Badge className={priorityColors[requirement.priority]}>
                                        {requirement.priority === 'low' && '低优先级'}
                                        {requirement.priority === 'medium' && '中优先级'}
                                        {requirement.priority === 'high' && '高优先级'}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Select
                                        value={assigneeValue}
                                        onValueChange={(value) =>
                                            onAssign(requirement.id, value === 'unassigned' ? null : parseInt(value))
                                        }
                                        onOpenChange={(open) => {
                                            if (open) {
                                                event.stopPropagation();
                                            }
                                        }}
                                    >
                                        <SelectTrigger className="w-[140px]">
                                            <SelectValue>
                                                {requirement.assignee ? (
                                                    <div className="flex items-center gap-2">
                                                        <Avatar className="h-6 w-6">
                                                            <AvatarImage src={requirement.assignee.avatar} />
                                                            <AvatarFallback>
                                                                {requirement.assignee.username[0]}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <span>{requirement.assignee.username}</span>
                                                    </div>
                                                ) : (
                                                    '未指派'
                                                )}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="unassigned">未指派</SelectItem>
                                            {members?.map((member) => (
                                                <SelectItem key={member.id} value={member.id.toString()}>
                                                    <div className="flex items-center gap-2">
                                                        <Avatar className="h-6 w-6">
                                                            <AvatarImage src={member.avatar} />
                                                            <AvatarFallback>{member.username[0]}</AvatarFallback>
                                                        </Avatar>
                                                        {member.username}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <Select
                                        value={requirement.status}
                                        onValueChange={(value) => onStatusChange(requirement.id, value)}
                                        onOpenChange={(open) => {
                                            if (open) {
                                                event.stopPropagation();
                                            }
                                        }}
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

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEdit(requirement);
                                        }}
                                    >
                                        编辑
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete(requirement);
                                        }}
                                    >
                                        删除
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </AccordionTrigger>

                <AccordionContent className="px-4 pb-4">
                    <div className="space-y-4">
                        <div>
                            <h4 className="text-sm font-medium mb-1">描述</h4>
                            <p className="text-sm text-gray-500">{requirement.description || '暂无描述'}</p>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium mb-1">进度</h4>
                            <div className="space-y-2">
                                <Progress value={requirement.progress} />
                                <p className="text-sm text-gray-500">{requirement.progress}%</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>创建时间：{formatDate(requirement.createdAt)}</span>
                            <span>截止时间：{formatDate(requirement.dueDate)}</span>
                            {requirement.assignedAt && <span>指派时间：{formatDate(requirement.assignedAt)}</span>}
                            {requirement.startedAt && <span>开始时间：{formatDate(requirement.startedAt)}</span>}
                            {requirement.completedAt && <span>完成时间：{formatDate(requirement.completedAt)}</span>}
                            <span>更新时间：{formatDate(requirement.updatedAt)}</span>
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
};

export default RequirementItem;
