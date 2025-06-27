import React, { useState } from 'react';
import { DEFAULT_SECTIONS, SECTION_TYPES } from '../mock/editor/default-sections';
import {renderSectionPreview} from "../helpers/editor/renderSectionPreview";
import {renderEditForm} from "../helpers/editor/renderEditForm.tsx";

const EmailEditor: React.FC = () => {
    const [emailSections, setEmailSections] = useState([]);
    const [editingSection, setEditingSection] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [draggedIndex, setDraggedIndex] = useState(null);

    // Add section to email
    const addSection = (sectionType) => {
        const newSection = {
            ...DEFAULT_SECTIONS[sectionType],
            id: Date.now() + Math.random()
        };
        setEmailSections([...emailSections, newSection]);
    };

    // Remove section from email
    const removeSection = (sectionId) => {
        setEmailSections(emailSections.filter(section => section.id !== sectionId));
    };

    // Open edit modal for section
    const editSection = (section) => {
        setEditingSection({ ...section });
        setEditModalOpen(true);
    };

    // Save edited section
    const saveSection = () => {
        setEmailSections(emailSections.map(section =>
            section.id === editingSection.id ? editingSection : section
        ));
        setEditModalOpen(false);
        setEditingSection(null);
    };

    // Handle drag and drop
    const handleDragStart = (index) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (dropIndex) => {
        if (draggedIndex === null) return;

        const newSections = [...emailSections];
        const draggedSection = newSections[draggedIndex];
        newSections.splice(draggedIndex, 1);
        newSections.splice(dropIndex, 0, draggedSection);

        setEmailSections(newSections);
        setDraggedIndex(null);
    };

    // Update content helper
    const updateContent = (field, value) => {
        setEditingSection({
            ...editingSection,
            content: { ...editingSection.content, [field]: value }
        });
    };

    const styles = {
        container: {
            height: '100vh',
            display: 'flex',
            fontFamily: 'Arial, sans-serif',
            backgroundColor: '#f5f5f5'
        },
        leftPanel: {
            width: '300px',
            backgroundColor: 'white',
            padding: '20px',
            marginRight: '16px',
            overflowY: 'auto',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            borderRadius: '8px',
            margin: '16px 0 16px 16px'
        },
        rightPanel: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            borderRadius: '8px',
            margin: '16px 16px 16px 0'
        },
        sectionCard: {
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'white'
        },
        sectionCardHover: {
            backgroundColor: '#f8f9fa',
            borderColor: '#1976d2',
            transform: 'translateY(-1px)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        },
        emailSection: {
            marginBottom: '8px',
            cursor: 'pointer',
            position: 'relative',
            border: '2px solid transparent',
            borderRadius: '8px',
            backgroundColor: 'white',
            transition: 'all 0.2s ease'
        },
        emailSectionHover: {
            borderColor: '#1976d2',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        },
        controlButtons: {
            position: 'absolute',
            top: '8px',
            right: '8px',
            display: 'flex',
            gap: '4px',
            opacity: 0,
            transition: 'opacity 0.2s ease'
        },
        controlButton: {
            background: 'white',
            border: '1px solid #ddd',
            borderRadius: '4px',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '14px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        },
        modal: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        },
        modalContent: {
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '24px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto'
        },
        button: {
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            marginRight: '8px'
        },
        buttonSecondary: {
            backgroundColor: 'transparent',
            color: '#1976d2',
            border: '1px solid #1976d2',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
        },
        emptyState: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: '#666',
            textAlign: 'center'
        }
    };

    return (
        <div style={styles.container}>
            {/* Left Panel - Section Library */}
            <div style={styles.leftPanel}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 'bold' }}>
                    Email Sections
                </h3>
                <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#666' }}>
                    Click to add sections to your email
                </p>

                {Object.entries(SECTION_TYPES).map(([, type]) => (
                    <div
                        key={type}
                        style={styles.sectionCard}
                        onClick={() => addSection(type)}
                        onMouseEnter={(e) => {
                            Object.assign(e.target.style, styles.sectionCardHover);
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'white';
                            e.target.style.borderColor = '#e0e0e0';
                            e.target.style.transform = 'none';
                            e.target.style.boxShadow = 'none';
                        }}
                    >
                        <div style={{
                            width: '24px',
                            height: '24px',
                            backgroundColor: '#1976d2',
                            borderRadius: '4px',
                            marginRight: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '12px',
                            fontWeight: 'bold'
                        }}>
                            {type.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>
              {DEFAULT_SECTIONS[type].title}
            </span>
                        <span style={{ marginLeft: 'auto', fontSize: '18px', color: '#1976d2' }}>+</span>
                    </div>
                ))}
            </div>

            {/* Right Panel - Email Preview */}
            <div style={styles.rightPanel}>
                <div style={{
                    padding: '20px',
                    borderBottom: '1px solid #e0e0e0',
                    backgroundColor: '#fafafa'
                }}>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 'bold' }}>
                        Email Preview
                    </h3>
                    <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                        {emailSections.length} sections • Click sections to edit
                    </p>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
                    {emailSections.length === 0 ? (
                        <div style={styles.emptyState}>
                            <div style={{
                                fontSize: '48px',
                                marginBottom: '16px',
                                opacity: 0.3
                            }}>📧</div>
                            <h4 style={{ margin: '0 0 8px 0', fontSize: '20px' }}>
                                Start Building Your Email
                            </h4>
                            <p style={{ margin: 0, fontSize: '14px' }}>
                                Add sections from the left panel to create your email
                            </p>
                        </div>
                    ) : (
                        emailSections.map((section, index) => (
                            <div
                                key={section.id}
                                style={styles.emailSection}
                                draggable
                                onDragStart={() => handleDragStart(index)}
                                onDragOver={handleDragOver}
                                onDrop={() => handleDrop(index)}
                                onClick={() => editSection(section)}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = '#1976d2';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                                    const controls = e.currentTarget.querySelector('.control-buttons');
                                    if (controls) controls.style.opacity = '1';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = 'transparent';
                                    e.currentTarget.style.boxShadow = 'none';
                                    const controls = e.currentTarget.querySelector('.control-buttons');
                                    if (controls) controls.style.opacity = '0';
                                }}
                            >
                                <div
                                    className="control-buttons"
                                    style={{...styles.controlButtons, opacity: 0}}
                                >
                                    <button
                                        style={styles.controlButton}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            editSection(section);
                                        }}
                                        title="Edit"
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        style={styles.controlButton}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeSection(section.id);
                                        }}
                                        title="Delete"
                                    >
                                        🗑️
                                    </button>
                                    <button
                                        style={{...styles.controlButton, cursor: 'grab'}}
                                        title="Drag to reorder"
                                    >
                                        ⋮⋮
                                    </button>
                                </div>

                                {renderSectionPreview(section)}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Edit Modal */}
            {editModalOpen && (
                <div style={styles.modal} onClick={() => setEditModalOpen(false)}>
                    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 'bold' }}>
                            Edit {editingSection?.title}
                        </h3>

                        {renderEditForm(editingSection,updateContent)}

                        <div style={{ marginTop: '24px', textAlign: 'right' }}>
                            <button
                                style={styles.buttonSecondary}
                                onClick={() => setEditModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                style={styles.button}
                                onClick={saveSection}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmailEditor;