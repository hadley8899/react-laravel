import React from "react";
import SectionPreviewHeader from "../../components/email-editor/preview-section-items/SectionPreviewHeader";
import SectionPreviewText from "../../components/email-editor/preview-section-items/SectionPreviewText";
import SectionPreviewMultiColText from "../../components/email-editor/preview-section-items/SectionPreviewMultiColText";
import SectionPreviewTextImageTop from "../../components/email-editor/preview-section-items/SectionPreviewTextImageTop";
import SectionPreviewImageWithLeftRightText from "../../components/email-editor/preview-section-items/SectionPreviewImageWithLeftRightText";
import SectionPreviewImage from "../../components/email-editor/preview-section-items/SectionPreviewImage";
import SectionPreviewButton from "../../components/email-editor/preview-section-items/SectionPreviewButton";
import SectionPreviewMultiButtons from "../../components/email-editor/preview-section-items/SectionPreviewMultiButtons";
import SectionPreviewFooter from "../../components/email-editor/preview-section-items/SectionPreviewFooter";
import SectionPreviewList from "../../components/email-editor/preview-section-items/SectionPreviewList";
import SectionPreviewProduct from "../../components/email-editor/preview-section-items/SectionPreviewProduct";
import SectionPreviewImageMultiple from "../../components/email-editor/preview-section-items/SectionPreviewImageMultiple";
import SectionPreviewDivider from "../../components/email-editor/preview-section-items/SectionPreviewDivider";
import SectionPreviewSpacer from "../../components/email-editor/preview-section-items/SectionPreviewSpacer";
import SectionPreviewQuote from "../../components/email-editor/preview-section-items/SectionPreviewQuote";
import SectionPreviewTwoCol from "../../components/email-editor/preview-section-items/SectionPreviewTwoCol";
import SectionPreviewTwoProducts from "../../components/email-editor/preview-section-items/SectionPreviewTwoProducts";
import SectionPreviewVideo from "../../components/email-editor/preview-section-items/SectionPreviewVideo";
import SectionPreviewSocial from "../../components/email-editor/preview-section-items/SectionPreviewSocial";

/**
 * Lightweight visual for the drag-and-drop canvas.
 * Keep styling inline so we don’t pull extra CSS.
 *
 * NOTE: Any new template type added to `EmailSectionTemplateSeeder`
 * must have a preview here (even if rudimentary) so the designer can
 * see something while dragging.
 */
export const renderSectionPreview: React.FC = (section: any) => {
    const {type, content} = section;

    switch (type) {
        /* ───────────────���────────────── HEADER ─────────────────────────── */
        case "header":
            return <SectionPreviewHeader content={content}/>;

        /* ─────────────────────────────── TEXT ──────────────────────────── */
        case "text":
            return <SectionPreviewText content={content}/>;

        /* ---------- 2 & 3 COLUMN TEXT ---------- */
        case "two_col_text":
        case "three_col_text":
            return <SectionPreviewMultiColText content={content}/>;

        /* ─────────────── Text block WITH image on top ─────────────── */
        case "text_image_top":
            return <SectionPreviewTextImageTop content={content}/>;

        /* ─────────────────── Text-Left / Image-Right ─────────────────── */
        case "text_left_image_right":
        case "image_left_text_right":
            return <SectionPreviewImageWithLeftRightText type={type} content={content}/>;

        /* ───────────────────────────── IMAGE ─────────────────────────── */
        case "image":
            return <SectionPreviewImage content={content}/>;

        /* ────────────────────────��──── BUTTON ────────────────────────── */
        case "button":
            return <SectionPreviewButton content={content}/>;

        /* ---------- 2-3 BUTTONS ---------- */
        case "two_buttons":
        case "three_buttons":
            return <SectionPreviewMultiButtons content={content}/>;

        /* ───────────────────────────── LIST ──────────────────────────── */
        case "list":
            return <SectionPreviewList content={content}/>;

        /* ───────────────────────────── FOOTER ─────────────────────────── */
        case "footer":
            return <SectionPreviewFooter content={content}/>;

        /* ───────────────────────── NEW BASIC ELEMENTS ──────────────────── */
        case "divider":
            return <SectionPreviewDivider content={content}/>;

        case "spacer":
            return <SectionPreviewSpacer content={content}/>;

        case "quote":
            return <SectionPreviewQuote content={content}/>;

        case "two_column":
            return <SectionPreviewTwoCol content={content}/>;

        /* ─────────────────────────── TWO IMAGES ───────────────────────── */
        case "two_images":
            return <SectionPreviewImageMultiple content={content}/>;

        /* ───────────────────────────── PRODUCT ─────────────────────────── */
        case "product":
            return <SectionPreviewProduct content={content}/>;

        /* ──────────────���──────────── TWO PRODUCTS ──────────────────────── */
        case "two_products":
            return <SectionPreviewTwoProducts content={content}/>;

        /* ───────────────────────────── VIDEO ───────────────────────────── */
        case "video":
            return <SectionPreviewVideo content={content}/>;

        /* ──────────────────────────── SOCIAL ──────────────────────────── */
        case "social":
            return <SectionPreviewSocial content={content}/>;

        /* ────────────────────��────── FALLBACK ─────────────────────────── */
        default:
            return (
                <div style={{padding: 16, color: "#999"}}>Unknown section type</div>
            );
    }
};
