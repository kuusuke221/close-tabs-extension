// コンテキストメニューを作成
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "close-unpinned-ungrouped-tabs",
    title: "ピン留め・グループ以外のタブを閉じる",
    contexts: ["page"]
  });
});

// ピン留め・グループ化されていないタブを一括で閉じる共通処理
async function closeUnpinnedUngroupedTabs() {
  // 現在のウィンドウにある「ピン留めされていない」タブをすべて取得
  const tabs = await chrome.tabs.query({
    currentWindow: true,
    pinned: false
  });

  // グループ化されていない（groupId が chrome.tabs.TAB_GROUP_ID_NONE または -1）タブのみをフィルタリング
  const ungroupedTabs = tabs.filter(tab => tab.groupId === chrome.tabs.TAB_GROUP_ID_NONE || tab.groupId === -1);

  // 該当するタブのIDを配列にまとめる
  const tabIds = ungroupedTabs.map(tab => tab.id);

  // タブが存在すれば一括で閉じる
  if (tabIds.length > 0) {
    await chrome.tabs.remove(tabIds);
  }
}

// コンテキストメニューがクリックされたときのイベント
chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === "close-unpinned-ungrouped-tabs") {
    closeUnpinnedUngroupedTabs();
  }
});

// 拡張機能のアイコンがクリックされたときのイベント
chrome.action.onClicked.addListener(() => {
  closeUnpinnedUngroupedTabs();
});