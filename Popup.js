const BADGES = [{xp:10,icon:'🌱',name:'Beginner'},{xp:50,icon:'💻',name:'Coder'},{xp:100,icon:'📚',name:'Grinder'},{xp:200,icon:'🔥',name:'Focus Beast'},{xp:500,icon:'🏆',name:'Study Legend'}];
const ROASTS = ["Bro… really? Instagram again? 😭","Netflix? Exam in 3 days 💀","Reddit at this hour? Disappointing.","Your future self is crying rn 😢","Facebook in 2026? No. 💀"];
const DIST   = ['instagram.com','facebook.com','twitter.com','x.com','netflix.com','reddit.com','snapchat.com','tiktok.com'];

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['xp','badges','stats','tip'], data => {
    const xp = data.xp || 0, earned = data.badges || [], stats = data.stats || {study:0,distraction:0};

    let cur = BADGES[0];
    BADGES.forEach(b => { if (xp >= b.xp) cur = b; });
    const nxt      = BADGES.find(b => xp < b.xp) || {xp:999};
    const progress = Math.min(100, ((xp - cur.xp) / (nxt.xp - cur.xp)) * 100);

    document.getElementById('xp-text').textContent        = xp + ' XP';
    document.getElementById('next-text').textContent      = 'Next: ' + nxt.xp + ' XP';
    document.getElementById('bar').style.width            = progress + '%';
    document.getElementById('level-icon').textContent     = cur.icon;
    document.getElementById('level-name').textContent     = cur.name;
    document.getElementById('stat-study').textContent     = stats.study;
    document.getElementById('stat-distraction').textContent = stats.distraction;

    if (data.tip) { const t = document.getElementById('tip'); t.textContent = data.tip; t.style.display = 'block'; }

    const bc = document.getElementById('badges');
    BADGES.forEach(b => { const d = document.createElement('div'); d.className = earned.includes(b.name) ? 'badge' : 'badge locked'; d.textContent = b.icon+' '+b.name; bc.appendChild(d); });

    chrome.tabs.query({active:true,currentWindow:true}, tabs => {
      const url = (tabs[0].url||'').toLowerCase();
      if (DIST.some(s => url.includes(s))) { const r = document.getElementById('roast'); r.textContent = ROASTS[Math.floor(Math.random()*ROASTS.length)]; r.style.display='block'; }
    });
  });

  document.getElementById('reset-btn').addEventListener('click', () => {
    chrome.storage.local.clear(() => location.reload());
  });
});