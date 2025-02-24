import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

const EditRequirement = ({ isOpen, onOpenChange, requirement, onUpdate }) => {
    const [editingData, setEditingData] = useState(null);

    useEffect(() => {
        if (requirement) {
            setEditingData({
                ...requirement,
                dueDate: format(new Date(requirement.dueDate), 'yyyy-MM-dd'),
            });
        }
    }, [requirement]);

    if (!editingData) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onUpdate(editingData);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>编辑需求</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="title">标题</Label>
                        <Input
                            id="title"
                            value={editingData.title}
                            onChange={(e) => setEditingData({ ...editingData, title: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="description">描述</Label>
                        <Textarea
                            id="description"
                            value={editingData.description}
                            onChange={(e) => setEditingData({ ...editingData, description: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="priority">优先级</Label>
                        <Select
                            value={editingData.priority}
                            onValueChange={(value) => setEditingData({ ...editingData, priority: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="选择优先级" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="low">低</SelectItem>
                                <SelectItem value="medium">中</SelectItem>
                                <SelectItem value="high">高</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="dueDate">截止日期</Label>
                        <Input
                            id="dueDate"
                            type="date"
                            value={editingData.dueDate}
                            onChange={(e) => setEditingData({ ...editingData, dueDate: e.target.value })}
                            required
                        />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            取消
                        </Button>
                        <Button type="submit">更新</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditRequirement;
