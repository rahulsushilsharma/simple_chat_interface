import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import {
    Box,
    Button,
    CircularProgress,
    IconButton,
    Link,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

const API_BASE = 'http://localhost:8000/file';
const USER_ID = 1;

type FileItem = {
    id: number;
    file_name: string;
    file_type: string;
    md5: string;
    user_id: number;
    file_path: string;
};

const FileUploader: React.FC = () => {
    const [files, setFiles] = useState<FileItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const fetchFiles = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE}/files?user_id=${USER_ID}`, {
                headers: { accept: 'application/json' },
            });
            const data: FileItem[] = await response.json();
            setFiles(data);
        } catch (error) {
            console.error('Failed to fetch files:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        try {
            await fetch(`${API_BASE}/upload?user_id=${USER_ID}`, {
                method: 'POST',
                body: formData,
            });
            await fetchFiles(); // Refresh after upload
        } catch (error) {
            console.error('Upload failed:', error);
        } finally {
            setUploading(false);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    const getDownloadUrl = (filePath: string) => {
        // You must serve this route correctly on backend (e.g., /file/download/<filename>)
        return `http://localhost:8000/${filePath.replace(/\\/g, '/')}`;
    };

    return (
        <Box p={3}>
            <Typography variant="h5" gutterBottom>
                Uploaded Files
            </Typography>

            {loading ? (
                <CircularProgress />
            ) : files.length === 0 ? (
                <Typography>No files found.</Typography>
            ) : (
                <List>
                    {files.map((file) => (
                        <ListItem key={file.id}>
                            <ListItemText
                                primary={file.file_name}
                                secondary={`Type: ${file.file_type.toUpperCase()} | MD5: ${file.md5}`}
                            />
                            <ListItemSecondaryAction>
                                <IconButton
                                    edge="end"
                                    component={Link}
                                    href={getDownloadUrl(file.file_path)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <CloudDownloadIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            )}

            <Box mt={3}>
                <input
                    id="upload-button"
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handleUpload}
                />
                <label htmlFor="upload-button">
                    <Button
                        variant="contained"
                        component="span"
                        disabled={uploading}
                    >
                        {uploading ? 'Uploading…' : 'Upload File'}
                    </Button>
                </label>
            </Box>
        </Box>
    );
};

export default FileUploader;
