import React from 'react';
import { MediaDirectory } from '../../interfaces/MediaDirectory';
import { TreeItem } from '@mui/x-tree-view';
import Box from '@mui/material/Box';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface Props {
    node: MediaDirectory;
    directories: MediaDirectory[];
    currentDirId: string;
    /** ← just *requests* delete; actual deletion handled in parent */
    onDeleteDir: (dir: MediaDirectory) => void;
    rootId?: string;
}

const TreeItemRender: React.FC<Props> = ({
                                             node,
                                             directories,
                                             currentDirId,
                                             onDeleteDir,
                                             rootId,
                                         }) => (
    <TreeItem
        key={node.uuid}
        itemId={node.uuid}
        label={
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    pr: 0.5, // keep icon from clipping
                    '&:hover .delete-btn': { opacity: 1 },
                }}
            >
        <span style={{ fontWeight: node.uuid === currentDirId ? 600 : 400 }}>
          {node.name}
        </span>

                {node.uuid !== rootId && (
                    <IconButton
                        className="delete-btn"
                        size="small"
                        color="error"
                        sx={{ opacity: 0, transition: 'opacity 0.2s' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            onDeleteDir(node);
                        }}
                    >
                        <DeleteIcon fontSize="inherit" />
                    </IconButton>
                )}
            </Box>
        }
    >
        {directories
            .filter((d) => d.parent_uuid === node.uuid)
            .map((child) => (
                <TreeItemRender
                    key={child.uuid}
                    node={child}
                    directories={directories}
                    currentDirId={currentDirId}
                    onDeleteDir={onDeleteDir}
                    rootId={rootId}
                />
            ))}
    </TreeItem>
);

export default TreeItemRender;
