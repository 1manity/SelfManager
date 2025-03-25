import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IconPlus } from '@tabler/icons-react';
import RequirementList from '../components/RequirementList';
import CreateRequirement from '../components/RequirementList/CreateRequirement';
import { getRequirementsByVersionId } from '@/api/requirement';
import { useToast } from '@/hooks/use-toast';

const RequirementTab = () => {
    const { version, project, canManage } = useOutletContext();
    const [requirements, setRequirements] = useState([]);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        if (version?.id) {
            fetchRequirements();
        }
    }, [version?.id]);

    const fetchRequirements = async () => {
        try {
            setLoading(true);
            const response = await getRequirementsByVersionId(version.id);
            if (response.code === 200) {
                setRequirements(response.data);
            } else {
                setRequirements([]);
            }
        } catch (error) {
            console.error('获取需求列表失败:', error);
            toast({
                title: '获取需求列表失败',
                description: error.message,
                variant: 'destructive',
            });
            setRequirements([]);
        } finally {
            setLoading(false);
        }
    };

    const handleRequirementCreated = () => {
        fetchRequirements();
        setIsCreateOpen(false);
    };

    const handleRequirementUpdated = () => {
        fetchRequirements();
    };

    return (
        <div className="space-y-6 p-6">
            <RequirementList
                requirements={requirements || []}
                versionId={version?.id}
                projectId={project?.id}
                onRequirementUpdated={handleRequirementUpdated}
                canManage={canManage}
                loading={loading}
                onUpdate={handleRequirementUpdated}
            />

            <CreateRequirement
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                versionId={version?.id}
                projectId={project?.id}
                onRequirementCreated={handleRequirementCreated}
            />
        </div>
    );
};

export default RequirementTab;
