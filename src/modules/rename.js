"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renameSelectedItems = renameSelectedItems;
exports.messageWindow = messageWindow;
const package_json_1 = require("../../package.json");
function messageWindow(info, status) {
    new ztoolkit.ProgressWindow(package_json_1.config.addonName, {
        closeOnClick: true,
    })
        .createLine({
        text: info,
        type: status,
        icon: `chrome://${package_json_1.config.addonRef}/content/icons/favicon.png`,
    })
        .show();
}
function renameSelectedItems() {
    return __awaiter(this, void 0, void 0, function* () {
        const items = getSelectedItems();
        if (items.length === 0) {
            messageWindow("No items selected", "fail");
            return;
        }
        else if (items.length > 1) {
            messageWindow(" " + items.length + " items selected", "default");
        }
        for (const item of items) {
            const att = getAttachmentFromItem(item);
            if (att === -1) {
                continue;
            }
            const newAttName = getAttachmentName(item);
            const status = yield att.renameAttachmentFile(newAttName);
            if (status === true) {
                messageWindow(newAttName, "success");
                if (newAttName !== att.getField("title")) {
                    att.setField("title", newAttName);
                    att.saveTx();
                }
            }
            else if (status === -1) {
                messageWindow("Destination file exists; use force to overwrite.", "fail");
            }
            else {
                messageWindow("Attachment file not found.", "fail");
            }
        }
    });
}
function getSelectedItems() {
    let items = Zotero.getActiveZoteroPane().getSelectedItems();
    // get regular items
    let itemIds = items
        .filter((item) => item.isRegularItem())
        .map((item) => item.id);
    // get items from attachment
    const itemIdsFromAttachment = items
        .filter((item) => item.isAttachment())
        .map((item) => item.parentItemID);
    // remove duplicate items
    itemIds = itemIds.concat(itemIdsFromAttachment);
    itemIds = Zotero.Utilities.arrayUnique(itemIds);
    items = itemIds.map((id) => Zotero.Items.get(id));
    return items;
}
function getAttachmentFromItem(item) {
    const oldTitle = item.getField("title").toString().slice(0, 10);
    const attachmentIDs = item.getAttachments();
    const attachments = attachmentIDs.map((id) => Zotero.Items.get(id));
    //   attachments = attachments.filter(att => att.attachmentLinkMode === Zotero.Attachments.LINK_MODE_LINKED_FILE);
    const pdfAttachments = attachments.filter((att) => {
        return (att.attachmentContentType === "application/pdf" ||
            (att.attachmentFilename &&
                att.attachmentFilename.toLowerCase().endsWith(".pdf")));
    });
    if (pdfAttachments.length === 0) {
        messageWindow("No attachments found for " + oldTitle, "fail");
        return -1;
    }
    else if (pdfAttachments.length > 1) {
        messageWindow(" " + pdfAttachments.length + " attachments found for " + oldTitle, "default");
    }
    return pdfAttachments[0];
}
function getAttachmentName(item) {
    const jst = getJournalShortTitle(item);
    let shortTitle = item.getField("shortTitle");
    if (!shortTitle) {
        shortTitle = item.getField("title");
    }
    const year = item.getField("year");
    let newFileName = `${jst}_${year}_${shortTitle}.pdf`;
    newFileName = Zotero.Utilities.cleanTags(newFileName);
    Zotero.debug("[renamePDF] New file name: " + newFileName);
    return newFileName;
}
function getJournalShortTitle(item) {
    const tags = item.getTags();
    // Find the tag that contains the journal short title
    // For example, the tag might be "Object { tag: "Jab/#IJCV" }"
    const journalTag = tags.find((tag) => tag.tag.startsWith("Jab/#"));
    let title = "";
    if (journalTag) {
        title = journalTag.tag.split("/#")[1];
        Zotero.debug("[renamePDF] Found journal short title from tag: " + title);
    }
    else {
        title = generateJournalShortTitle(item);
        Zotero.debug("[renamePDF] Generated journal short title: " + title);
        if (title !== "") {
            item.addTag("Jab/#" + title);
            item.saveTx();
        }
    }
    return title;
}
function generateJournalShortTitle(item) {
    var _a, _b;
    let jst = "Unknown";
    if (item.itemType === "journalArticle") {
        const journalName = item.getField("publicationTitle").toString();
        if (journalName.includes("arXiv")) {
            return jst;
        }
        jst = firstLetterOfEachWord(journalName);
    }
    else if (item.itemType === "conferencePaper") {
        const conferenceName = item.getField("conferenceName").toString();
        // use abbreviations in parentheses
        const patt = /.*\((.+)\)/;
        jst = (_b = (_a = conferenceName === null || conferenceName === void 0 ? void 0 : conferenceName.match(patt)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : "";
        if (jst === "") {
            // use first letter of each word
            jst = firstLetterOfEachWord(conferenceName);
        }
    }
    else if (item.itemType === "bookSection") {
        const bookTitle = item.getField("bookTitle").toString();
        // if bookTitle contains "ECCV" or "ACCV", use it as the journal short title
        if (bookTitle.includes("ECCV")) {
            jst = "ECCV";
        }
        else if (bookTitle.includes("ACCV")) {
            jst = "ACCV";
        }
        else {
            jst = "Book";
        }
    }
    return jst;
}
function firstLetterOfEachWord(str) {
    if (str === "") {
        return "Unknown";
    }
    // Use each capitalized initial letter of the journal title as an abbreviation
    const words = str.split(" ");
    // remove lowercase words and "IEEE", "ACM", "The", numbers, etc.
    const capitalizedWords = words.filter((word) => word[0] === word[0].toUpperCase() &&
        word !== "The" &&
        !word.match(/\d+/));
    // use first letter of each word as abbreviation
    const jab = capitalizedWords.map((word) => word[0]).join("");
    return jab;
}
