

function saveSessons(session: Record<string, string>[]) {
  localStorage.setItem("sessons", JSON.stringify(session));
}

function getSessons() {
  try{
  const items = JSON.parse(localStorage.getItem("sessons") || "");
  console.log(items)
  return items;
}catch{
  return undefined
}
}

function saveChat(chatId: string, session: Record<string, string>[]) {
  localStorage.setItem(chatId, JSON.stringify(session));
}

function getChat(chatId: string) {
  try{
  const items = JSON.parse(localStorage.getItem(chatId) || "");
  return items;
}catch{
  return undefined
}
}

export {
    saveChat,
    saveSessons,
    getChat,
    getSessons
}