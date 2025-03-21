import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

const severityColors = {
    low: 'bg-gray-500',
    medium: 'bg-yellow-500',
    high: 'bg-orange-500',
    critical: 'bg-red-500',
};

const statusColors = {
    open: 'bg-red-500',
    in_progress: 'bg-blue-500',
    resolved: 'bg-green-500',
    closed: 'bg-gray-500',
};

const DefectItem = ({ defect, onStatusChange, onEdit, onDelete, onAssign, members }) => {
    const assigneeValue = defect.assigneeId ? defect.assigneeId.toString() : 'unassigned';

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
                                    <h3 className="font-medium">{defect.title}</h3>
                                    <Badge className={statusColors[defect.status]}>
                                        {defect.status === 'open' && '待处理'}
                                        {defect.status === 'in_progress' && '处理中'}
                                        {defect.status === 'resolved' && '已解决'}
                                        {defect.status === 'closed' && '已关闭'}
                                    </Badge>
                                    <Badge className={severityColors[defect.severity]}>
                                        {defect.severity === 'low' && '低'}
                                        {defect.severity === 'medium' && '中'}
                                        {defect.severity === 'high' && '高'}
                                        {defect.severity === 'critical' && '严重'}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Select
                                        value={assigneeValue}
                                        onValueChange={(value) => {
                                            onAssign(defect.id, value === 'unassigned' ? null : parseInt(value));
                                        }}
                                    >
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="选择指派人" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="unassigned">未指派</SelectItem>
                                            {members.map((member) => (
                                                <SelectItem key={member.id} value={member.id.toString()}>
                                                    <div className="flex items-center">
                                                        <Avatar className="h-6 w-6 mr-2">
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
                                        value={defect.status}
                                        onValueChange={(value) => onStatusChange(defect.id, value)}
                                    >
                                        <SelectTrigger className="w-[120px]">
                                            <SelectValue placeholder="选择状态" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="open">待处理</SelectItem>
                                            <SelectItem value="in_progress">处理中</SelectItem>
                                            <SelectItem value="resolved">已解决</SelectItem>
                                            <SelectItem value="closed">已关闭</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEdit(defect);
                                        }}
                                    >
                                        编辑
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete(defect);
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
                            <p className="text-sm text-gray-500">{defect.description || '暂无描述'}</p>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium mb-1">复现步骤</h4>
                            <p className="text-sm text-gray-500">{defect.stepsToReproduce || '暂无复现步骤'}</p>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium mb-1">预期结果</h4>
                            <p className="text-sm text-gray-500">{defect.expectedResult || '暂无预期结果'}</p>
                        </div>
                        {defect.solution && (
                            <div>
                                <h4 className="text-sm font-medium mb-1">解决方案</h4>
                                <p className="text-sm text-gray-500">{defect.solution}</p>
                            </div>
                        )}
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>创建时间：{formatDate(defect.createdAt)}</span>
                            {defect.assignedAt && <span>指派时间：{formatDate(defect.assignedAt)}</span>}
                            <span>更新时间：{formatDate(defect.updatedAt)}</span>
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
};

export default DefectItem;
