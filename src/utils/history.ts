import { MessageInterface, SessonInterface } from "../interfaces/Interfaces";

function saveSessons(session: SessonInterface[]) {
  localStorage.setItem("sessons", JSON.stringify(session));
}

function getSessons() {
  try {
    const items = JSON.parse(localStorage.getItem("sessons") || "");
    console.log(items);
    return items;
  } catch {
    return undefined;
  }
}
function deleteSession(sessionId: string) {
  try {
    const items = JSON.parse(localStorage.getItem("sessons") || "");
    console.log(items);
    const newItems = items.filter(
      (item: SessonInterface) => item.id !== sessionId
    );
    localStorage.setItem("sessons", JSON.stringify(newItems));
    return newItems;
  } catch {
    return undefined;
  }
}

function saveChat(chatId: string, session: MessageInterface[]) {
  localStorage.setItem(chatId, JSON.stringify(session));
}

function getChat(chatId: string) {
  try {
    const items = JSON.parse(localStorage.getItem(chatId) || "");
    return items;
  } catch {
    return undefined;
  }
}

export { saveChat, saveSessons, getChat, getSessons, deleteSession };
