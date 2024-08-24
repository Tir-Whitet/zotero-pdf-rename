import { config } from "../../package.json";
export { renameSelectedItems, messageWindow };

// 提供了一种方便的方式来显示带有状态和图标的进度窗口消息。它可以用于通知用户操作的结果（成功、失败或其他状态），并增强用户体验。
function messageWindow(info: string, status: string) {
  new ztoolkit.ProgressWindow(config.addonName, {
    closeOnClick: true,
  })
    .createLine({
      text: info,
      type: status,
      icon: `chrome://${config.addonRef}/content/icons/favicon.png`,
    })
    .show();
}

// 是一个异步函数，用于批量重命名 Zotero 中用户选择的项目项的附件文件。
// 它根据项目的元数据生成新的文件名，并更新附件文件的名称和标题字段
async function renameSelectedItems() {
  const items = getSelectedItems();
  if (items.length === 0) {
    messageWindow("No items selected", "fail");
    return;
  } else if (items.length > 1) {
    messageWindow(" " + items.length + " items selected", "default");
  }

  for (const item of items) {
    const att = getAttachmentFromItem(item);
    if (att === -1) {
      continue;
    }
    const newAttName = getAttachmentName(item);
    const status = await att.renameAttachmentFile(newAttName);
    if (status === true) {
      messageWindow(newAttName, "success");
      if (newAttName !== att.getField("title")) {
        att.setField("title", newAttName);
        att.saveTx();
      }
    } else if (status === -1) {
      messageWindow("Destination file exists; use force to overwrite.", "fail");
    } else {
      messageWindow("Attachment file not found.", "fail");
    }
  }
}

// 用于从 Zotero 界面中获取用户当前选择的项目项，并确保返回的是唯一的常规项目（regular items）。
// 它处理了直接选择的常规项目和通过附件关联的父项目
function getSelectedItems() {
  let items = Zotero.getActiveZoteroPane().getSelectedItems();
  // get regular items
  let itemIds = items
    .filter((item) => item.isRegularItem())
    .map((item) => item.id as number);
  // get items from attachment
  const itemIdsFromAttachment = items
    .filter((item) => item.isAttachment())
    .map((item) => item.parentItemID as number);
  // remove duplicate items
  itemIds = itemIds.concat(itemIdsFromAttachment);
  itemIds = Zotero.Utilities.arrayUnique(itemIds);
  items = itemIds.map((id) => Zotero.Items.get(id));
  return items;
}

// Get the first PDF attachment from the item
// To be changed here 
// Input item and Options
// Output: attachment filename,  
function getAttachmentFromItem(item: Zotero.Item) {
  const oldTitle = item.getField("title").toString().slice(0, 10);
  const attachmentIDs = item.getAttachments();
  const attachments = attachmentIDs.map((id) => Zotero.Items.get(id));

  //   attachments = attachments.filter(att => att.attachmentLinkMode === Zotero.Attachments.LINK_MODE_LINKED_FILE);
  const pdfAttachments = attachments.filter((att) => {
    return (
      att.attachmentContentType === "application/pdf" ||
      (att.attachmentFilename &&
        att.attachmentFilename.toLowerCase().endsWith(".pdf"))
    );
  });
  if (pdfAttachments.length === 0) {
    messageWindow("No attachments found for " + oldTitle, "fail");
    return -1;
  } else if (pdfAttachments.length > 1) {
    messageWindow(
      " " + pdfAttachments.length + " attachments found for " + oldTitle,
      "default"
    );
  }
  return pdfAttachments[0];
}

function getAttachmentName(item: Zotero.Item) {
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

function getJournalShortTitle(item: Zotero.Item) {
  const tags = item.getTags();
  // Find the tag that contains the journal short title
  // For example, the tag might be "Object { tag: "Jab/#IJCV" }"
  const journalTag = tags.find((tag) => tag.tag.startsWith("Jab/#"));
  let title = "";
  if (journalTag) {
    title = journalTag.tag.split("/#")[1];
    Zotero.debug("[renamePDF] Found journal short title from tag: " + title);
  } else {
    title = generateJournalShortTitle(item);
    Zotero.debug("[renamePDF] Generated journal short title: " + title);
    if (title !== "") {
      item.addTag("Jab/#" + title);
      item.saveTx();
    }
  }
  return title;
}

function generateJournalShortTitle(item: Zotero.Item) {
  let jst = "Unknown";
  if (item.itemType === "journalArticle") {
    const journalName = item.getField("publicationTitle").toString();
    if (journalName.includes("arXiv")) {
      return jst;
    }
    jst = firstLetterOfEachWord(journalName);
  } else if (item.itemType === "conferencePaper") {
    const conferenceName = item.getField("conferenceName").toString();
    // use abbreviations in parentheses
    const patt = /.*\((.+)\)/;
    jst = conferenceName?.match(patt)?.[1] ?? "";
    if (jst === "") {
      // use first letter of each word
      jst = firstLetterOfEachWord(conferenceName);
    }
  } else if (item.itemType === "bookSection") {
    const bookTitle = item.getField("bookTitle").toString();
    // if bookTitle contains "ECCV" or "ACCV", use it as the journal short title
    if (bookTitle.includes("ECCV")) {
      jst = "ECCV";
    } else if (bookTitle.includes("ACCV")) {
      jst = "ACCV";
    } else {
      jst = "Book";
    }
  }
  return jst;
}

function firstLetterOfEachWord(str: string) {
  if (str === "") {
    return "Unknown";
  }
  // Use each capitalized initial letter of the journal title as an abbreviation
  const words = str.split(" ");
  // remove lowercase words and "IEEE", "ACM", "The", numbers, etc.
  const capitalizedWords = words.filter(
    (word) =>
      word[0] === word[0].toUpperCase() &&
      word !== "The" &&
      !word.match(/\d+/)
  );
  // use first letter of each word as abbreviation
  const jab = capitalizedWords.map((word) => word[0]).join("");
  return jab;
}
