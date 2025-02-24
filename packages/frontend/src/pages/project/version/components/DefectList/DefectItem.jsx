import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

const DefectItem = ({ defect, onStatusChange, onEdit, onDelete }) => {
    return (
        <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                    <h3 className="font-medium">{defect.title}</h3>
                    <div className="flex items-center gap-2">
                        <Select value={defect.status} onValueChange={(value) => onStatusChange(defect.id, value)}>
                            <SelectTrigger className="w-[120px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="open">待处理</SelectItem>
                                <SelectItem value="in_progress">处理中</SelectItem>
                                <SelectItem value="resolved">已解决</SelectItem>
                                <SelectItem value="closed">已关闭</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" size="sm" onClick={() => onEdit(defect)}>
                            编辑
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => onDelete(defect)}>
                            删除
                        </Button>
                    </div>
                </div>
                <p className="text-sm text-gray-500">{defect.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>严重程度：{defect.severity}</span>
                    <span>创建时间：{format(new Date(defect.createdAt), 'yyyy-MM-dd')}</span>
                </div>
            </div>
        </div>
    );
};

export default DefectItem;
