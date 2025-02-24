import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

const CreateRequirement = ({ isOpen, onOpenChange, onCreate, versionId }) => {
    const [newRequirement, setNewRequirement] = useState({
        title: '',
        description: '',
        priority: 'medium',
        status: 'pending',
        dueDate: format(new Date(), 'yyyy-MM-dd'),
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onCreate({ ...newRequirement, versionId });
        setNewRequirement({
            title: '',
            description: '',
            priority: 'medium',
            status: 'pending',
            dueDate: format(new Date(), 'yyyy-MM-dd'),
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>创建需求</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="title">标题</Label>
                        <Input
                            id="title"
                            value={newRequirement.title}
                            onChange={(e) => setNewRequirement({ ...newRequirement, title: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="description">描述</Label>
                        <Textarea
                            id="description"
                            value={newRequirement.description}
                            onChange={(e) => setNewRequirement({ ...newRequirement, description: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="priority">优先级</Label>
                        <Select
                            value={newRequirement.priority}
                            onValueChange={(value) => setNewRequirement({ ...newRequirement, priority: value })}
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
                            value={newRequirement.dueDate}
                            onChange={(e) => setNewRequirement({ ...newRequirement, dueDate: e.target.value })}
                            required
                        />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            取消
                        </Button>
                        <Button type="submit">创建</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateRequirement;
