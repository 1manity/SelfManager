import request from '@/api/request';

/**
 * 获取项目文件列表
 * @param {number} projectId - 项目ID
 * @returns {Promise<Object>} 响应对象
 */
export const getProjectFiles = async (projectId) => {
    try {
        const response = await request.get(`/projects/${projectId}/files`);
        return response;
    } catch (error) {
        console.error('获取项目文件列表失败:', error.message);
        throw error;
    }
};

/**
 * 上传项目文件
 * @param {number} projectId - 项目ID
 * @param {FormData} formData - 包含文件和文件名的表单数据
 * @returns {Promise<Object>} 响应对象
 */
export const uploadProjectFile = async (projectId, formData) => {
    try {
        const response = await request.post(`/projects/${projectId}/files/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    } catch (error) {
        console.error('上传项目文件失败:', error.message);
        throw error;
    }
};

/**
 * 下载项目文件
 * @param {number} projectId - 项目ID
 * @param {number} fileId - 文件ID
 * @returns {Promise<void>} 无返回值，直接触发文件下载
 */
export const downloadProjectFile = async (projectId, fileId) => {
    try {
        const response = await request.get(`/projects/${projectId}/files/${fileId}/download`, {
            responseType: 'blob',
        });

        // 检查响应是否为空
        if (!response.data) {
            throw new Error('下载失败，服务器返回空数据');
        }

        // 如果服务器返回了JSON格式的错误信息
        const contentType = response.headers['content-type'];
        if (contentType && contentType.includes('application/json')) {
            const reader = new FileReader();
            return new Promise((resolve, reject) => {
                reader.onload = () => {
                    try {
                        const errorData = JSON.parse(reader.result);
                        reject(new Error(errorData.message || '下载失败，服务器返回错误'));
                    } catch (e) {
                        reject(new Error('下载失败，无法解析错误信息'));
                    }
                };
                reader.onerror = () => reject(new Error('下载失败，无法读取响应内容'));
                reader.readAsText(response.data);
            });
        }

        // 创建下载链接 - 使用服务器返回的Content-Type
        const blob = new Blob([response.data], { type: contentType || 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;

        // 尝试从响应头获取文件名
        const contentDisposition = response.headers['content-disposition'];
        let filename = `file_${fileId}`;

        if (contentDisposition) {
            // 直接提取引号内的文件名
            const filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
            if (filenameMatch && filenameMatch.length > 1) {
                filename = filenameMatch[1];
            } else {
                // 尝试其他格式
                const filenameMatch2 = contentDisposition.match(/filename=([^;]+)/);
                if (filenameMatch2 && filenameMatch2.length > 1) {
                    filename = filenameMatch2[1].trim();
                }
            }
        }

        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();

        // 清理
        setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        }, 100);

        return true;
    } catch (error) {
        console.error('下载项目文件失败:', error);
        // 提供更具体的错误信息
        if (error.response) {
            throw new Error(`下载失败: ${error.response.status} ${error.response.statusText || '服务器错误'}`);
        } else if (error.request) {
            throw new Error('下载失败: 服务器无响应');
        } else {
            throw new Error(`下载失败: ${error.message || 'Unknown error'}`);
        }
    }
};

/**
 * 删除项目文件
 * @param {number} projectId - 项目ID
 * @param {number} fileId - 文件ID
 * @returns {Promise<Object>} 响应对象
 */
export const deleteProjectFile = async (projectId, fileId) => {
    try {
        const response = await request.delete(`/projects/${projectId}/files/${fileId}`);
        return response;
    } catch (error) {
        console.error('删除项目文件失败:', error.message);
        throw error;
    }
};
