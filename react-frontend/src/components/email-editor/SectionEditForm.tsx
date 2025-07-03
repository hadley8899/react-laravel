import React from "react";
import { Typography, InputAdornment } from "@mui/material";
import InsertVariableMenu from "./InsertVariableMenu";
import { CompanyVariable } from "../../interfaces/CompanyVariable";

import EditorHeader from "./edit-form-items/EditorHeader";
import EditorText from "./edit-form-items/EditorText";
import EditorImage from "./edit-form-items/EditorImage";
import EditorButton from "./edit-form-items/EditorButton";
import EditorList from "./edit-form-items/EditorList";
import EditorFooter from "./edit-form-items/EditorFooter";
import EditorDivider from "./edit-form-items/EditorDivider";
import EditorSpacer from "./edit-form-items/EditorSpacer";
import EditorTwoCol from "./edit-form-items/EditorTwoCol";
import EditorQuote from "./edit-form-items/EditorQuote";
import EditorSocial from "./edit-form-items/EditorSocial";
import EditorColumnsText from "./edit-form-items/EditorColumnsText";
import EditorTextImageTop from "./edit-form-items/EditorTextImageTop";
import EditorTextLeftImageRight from "./edit-form-items/EditorTextLeftImageRight";
import EditorImageLeftTextRight from "./edit-form-items/EditorImageLeftTextRight";
import EditorButtonsGroup from "./edit-form-items/EditorButtonsGroup";
import EditorTwoImages from "./edit-form-items/EditorTwoImages";
import EditorProduct from "./edit-form-items/EditorProduct";
import EditorTwoProducts from "./edit-form-items/EditorTwoProducts";
import EditorVideo from "./edit-form-items/EditorVideo";

const buildSlotProps = (
    field: string,
    value: string,
    vars: CompanyVariable[],
    update: (f: string, v: string) => void
) => ({
    input: {
        endAdornment: (
            <InputAdornment position="end">
                <InsertVariableMenu
                    variables={vars}
                    onInsert={(token) => update(field, value + token)}
                />
            </InputAdornment>
        ),
    },
});

interface Props {
    editingSection: any;
    updateContent: (field: string, value: any) => void;
    variables: CompanyVariable[];
    openMediaLibrary: (field: string, type: "image" | "all") => void;
}

const SectionEditForm: React.FC<Props> = ({
                                              editingSection,
                                              updateContent,
                                              variables,
                                              openMediaLibrary,
                                          }) => {
    if (!editingSection) return null;

    const { type, content } = editingSection;
    const baseProps = {
        size: "small" as const,
        fullWidth: true,
        sx: { mb: 2 },
    };

    /* ---------- existing types ---------- */
    if (type === "header")
        return (
            <EditorHeader
                content={content}
                updateContent={updateContent}
                variables={variables}
                baseProps={baseProps}
                buildSlotProps={buildSlotProps}
            />
        );

    if (type === "text")
        return (
            <EditorText
                content={content}
                updateContent={updateContent}
                variables={variables}
                baseProps={baseProps}
                buildSlotProps={buildSlotProps}
            />
        );

    if (type === "image")
        return (
            <EditorImage
                content={content}
                updateContent={updateContent}
                variables={variables}
                baseProps={baseProps}
                buildSlotProps={buildSlotProps}
                openMediaLibrary={openMediaLibrary}
            />
        );

    if (type === "button")
        return (
            <EditorButton
                content={content}
                updateContent={updateContent}
                variables={variables}
                baseProps={baseProps}
                buildSlotProps={buildSlotProps}
                openMediaLibrary={openMediaLibrary}
            />
        );

    if (type === "list")
        return (
            <EditorList
                content={content}
                updateContent={updateContent}
                variables={variables}
                baseProps={baseProps}
            />
        );

    if (type === "footer")
        return (
            <EditorFooter
                content={content}
                updateContent={updateContent}
                variables={variables}
                baseProps={baseProps}
                buildSlotProps={buildSlotProps}
            />
        );

    if (type === "divider")
        return (
            <EditorDivider
                content={content}
                updateContent={updateContent}
                baseProps={baseProps}
            />
        );

    if (type === "spacer")
        return (
            <EditorSpacer
                content={content}
                updateContent={updateContent}
                baseProps={baseProps}
            />
        );

    if (type === "quote")
        return (
            <EditorQuote
                content={content}
                updateContent={updateContent}
                variables={variables}
                baseProps={baseProps}
                buildSlotProps={buildSlotProps}
            />
        );

    if (type === "two_column")
        return (
            <EditorTwoCol
                content={content}
                updateContent={updateContent}
                variables={variables}
                baseProps={baseProps}
                buildSlotProps={buildSlotProps}
            />
        );

    if (type === "social")
        return (
            <EditorSocial
                content={content}
                updateContent={updateContent}
                variables={variables}
                baseProps={baseProps}
                buildSlotProps={buildSlotProps}
            />
        );

    if (type === "two_col_text" || type === "three_col_text")
        return (
            <EditorColumnsText
                content={content}
                updateContent={updateContent}
                variables={variables}
                baseProps={baseProps}
                buildSlotProps={buildSlotProps}
            />
        );

    if (type === "text_image_top")
        return (
            <EditorTextImageTop
                content={content}
                updateContent={updateContent}
                variables={variables}
                baseProps={baseProps}
                buildSlotProps={buildSlotProps}
                openMediaLibrary={openMediaLibrary}
            />
        );

    if (type === "text_left_image_right")
        return (
            <EditorTextLeftImageRight
                content={content}
                updateContent={updateContent}
                variables={variables}
                baseProps={baseProps}
                buildSlotProps={buildSlotProps}
                openMediaLibrary={openMediaLibrary}
            />
        );

    if (type === "image_left_text_right")
        return (
            <EditorImageLeftTextRight
                content={content}
                updateContent={updateContent}
                variables={variables}
                baseProps={baseProps}
                buildSlotProps={buildSlotProps}
                openMediaLibrary={openMediaLibrary}
            />
        );

    if (type === "two_buttons" || type === "three_buttons")
        return (
            <EditorButtonsGroup
                content={content}
                updateContent={updateContent}
                variables={variables}
                baseProps={baseProps}
                buildSlotProps={buildSlotProps}
            />
        );

    if (type === "two_images")
        return (
            <EditorTwoImages
                content={content}
                updateContent={updateContent}
                variables={variables}
                baseProps={baseProps}
                buildSlotProps={buildSlotProps}
                openMediaLibrary={openMediaLibrary}
            />
        );

    if (type === "product")
        return (
            <EditorProduct
                content={content}
                updateContent={updateContent}
                variables={variables}
                baseProps={baseProps}
                buildSlotProps={buildSlotProps}
                openMediaLibrary={openMediaLibrary}
            />
        );

    if (type === "two_products")
        return (
            <EditorTwoProducts
                content={content}
                updateContent={updateContent}
                variables={variables}
                baseProps={baseProps}
                buildSlotProps={buildSlotProps}
                openMediaLibrary={openMediaLibrary}
            />
        );

    if (type === "video")
        return (
            <EditorVideo
                content={content}
                updateContent={updateContent}
                variables={variables}
                baseProps={baseProps}
                buildSlotProps={buildSlotProps}
            />
        );

    return <Typography color="text.secondary">No edit form available</Typography>;
};

export default SectionEditForm;
