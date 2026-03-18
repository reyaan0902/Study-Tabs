const STUDY = ['github.com','leetcode.com','stackoverflow.com','wikipedia.org','khanacademy.org','udemy.com','notion.so','replit.com','w3schools.com','geeksforgeeks.org'];
const DIST  = ['instagram.com','facebook.com','twitter.com','x.com','netflix.com','reddit.com','snapchat.com','tiktok.com'];
const NEWS  = ['timesofindia.com','ndtv.com','thehindu.com','bbc.com','cnn.com'];
const BADGES = [{xp:10,icon:'🌱',name:'Beginner'},{xp:50,icon:'💻',name:'Coder'},{xp:100,icon:'📚',name:'Grinder'},{xp:200,icon:'🔥',name:'Focus Beast'},{xp:500,icon:'🏆',name:'Study Legend'}];
const TIPS = {
  'github.com':        '💡 Commit daily — even small changes build a strong profile!',
  'leetcode.com':      '💡 1 problem daily beats 10 in one day.',
  'stackoverflow.com': '💡 Read the full error before googling it.',
  'wikipedia.org':     '💡 Check the Sources section for deeper reading.',
  'geeksforgeeks.org': '💡 After reading, try coding the solution yourself.',
  'w3schools.com':     '💡 MDN docs are more accurate for reference.',
  'udemy.com':         '💡 Watch at 1.5x, rewatch confusing parts at 1x.',
};
const NEWS_TIP = '📰 Cross-check this with another source before sharing.';

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'complete' || !tab.url) return;
  const url = tab.url.toLowerCase();
  const isStudy = STUDY.some(s => url.includes(s));
  const isDist  = DIST.some(s => url.includes(s));
  const isNews  = NEWS.some(s => url.includes(s));
  const tip     = Object.keys(TIPS).find(s => url.includes(s));

  chrome.storage.local.get(['xp','badges','stats','lastDate'], data => {
    let xp = data.xp || 0, badges = data.badges || [];
    let stats = data.stats || {study:0,distraction:0};
    const today = new Date().toDateString();
    if (data.lastDate !== today) { stats = {study:0,distraction:0}; }
    if (isStudy) { xp += 10; stats.study++; }
    else if (isDist) { xp = Math.max(0, xp - 5); stats.distraction++; }
    BADGES.forEach(b => { if (xp >= b.xp && !badges.includes(b.name)) badges.push(b.name); });
    chrome.storage.local.set({xp, badges, stats, lastDate: today, tip: tip ? TIPS[tip] : isNews ? NEWS_TIP : null});
  });
});