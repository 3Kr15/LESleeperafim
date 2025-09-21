// === Enhanced Demo data with status ===
const friendsData = [
    { id:1, name:"Chaewon", avatar:"L", streak:9,  avgHours:7.8, rank:1, trend:"up",   badges:["deep-sleeper","on-fire","balanced"], isCurrentUser:false, status:"sleeping", lastSeen:"2 min ago" },
    { id:2, name:"Yunjin", avatar:"K", streak:5,  avgHours:7.2, rank:2, trend:"up",   badges:["on-fire","balanced"], isCurrentUser:false, status:"online", lastSeen:"now" },
    { id:3, name:"Kazuha",  avatar:"B", streak:2,  avgHours:6.1, rank:3, trend:"down", badges:["balanced"], isCurrentUser:false, status:"gaming", lastSeen:"5 min ago" },
    { id:4, name:"Eunchae",    avatar:"J", streak:14, avgHours:8.0, rank:4, trend:"up",   badges:["deep-sleeper","on-fire"], isCurrentUser:false, status:"music", lastSeen:"12 min ago" },
    { id:5, name:"Sakura",    avatar:"K", streak:7,  avgHours:6.9, rank:5, trend:"up",   badges:["on-fire","balanced"], isCurrentUser:false, status:"offline", lastSeen:"2 hours ago" },
    { id:6, name:"Jovarn",    avatar:"Y", streak:3,  avgHours:7.5, rank:6, trend:"up",   badges:["balanced"], isCurrentUser:false, status:"online", lastSeen:"now" }
];

let currentFriendsData = [...friendsData];
let lastCapacity = { cols: 0, rows: 0, density: 'full', showLegend: true };

document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    renderLeaderboard();
    layoutToFit();
    
    // Simulate status updates
    setInterval(updateStatuses, 3000); // Update every 30 seconds

    // classic resize
    window.addEventListener('resize', debounce(layoutToFit, 80));

    // viewport-aware
    if (window.visualViewport) {
        const relayout = debounce(layoutToFit, 80);
        visualViewport.addEventListener('resize', relayout);
        visualViewport.addEventListener('scroll', relayout);
    }
});

// debounce helper
function debounce(fn, ms=80) {
    let t; return (...args)=>{clearTimeout(t);t=setTimeout(()=>fn(...args),ms)};
}

// Status update simulation
function updateStatuses() {
    const statuses = ['online', 'sleeping', 'music', 'gaming', 'offline'];
    friendsData.forEach(friend => {
        if (!friend.isCurrentUser && Math.random() < 0.3) { // 30% chance to update
            friend.status = statuses[Math.floor(Math.random() * statuses.length)];
            friend.lastSeen = generateLastSeen(friend.status);
        }
    });
    currentFriendsData = [...friendsData];
    renderLeaderboard();
}

function generateLastSeen(status) {
    if (status === 'online') return 'now';
    const minutes = Math.floor(Math.random() * 120) + 1;
    if (minutes < 60) return `${minutes} min ago`;
    return `${Math.floor(minutes / 60)} hour${Math.floor(minutes / 60) > 1 ? 's' : ''} ago`;
}

function getStatusIcon(status) {
    switch(status) {
        case 'online': return '';
        case 'sleeping': return '😴';
        case 'music': return '🎵';
        case 'gaming': return '🎮';
        case 'offline': return '';
        default: return '';
    }
}

function getStatusText(status) {
    switch(status) {
        case 'online': return 'Online';
        case 'sleeping': return 'Sleeping';
        case 'music': return 'Music';
        case 'gaming': return 'Gaming';
        case 'offline': return 'Offline';
        default: return 'Unknown';
    }
}

/* -------------------- FIT LOGIC -------------------- */
function layoutToFit() {
    const app = document.getElementById('app');
    const header = document.querySelector('.header');
    const main = document.querySelector('.main-content');
    const legend = document.querySelector('.legend');

    const vh = (window.visualViewport?.height) || window.innerHeight;
    const vw = (window.visualViewport?.width) || window.innerWidth;

    const sidebar = vw >= 1024; // sidebar visible on larger screens

    app.classList.remove('compact','micro');

    const cssNum=(name,f)=>{const v=getComputedStyle(document.documentElement).getPropertyValue(name).trim();const n=parseFloat(v);return Number.isFinite(n)?n:f;}

    const csMain=getComputedStyle(main);
    const padX=parseFloat(csMain.paddingLeft)+parseFloat(csMain.paddingRight);
    const maxContainer=1400;

    const estimate=(density,rowsWanted)=>{
        app.classList.remove('compact','micro');
        if(density==='compact') app.classList.add('compact');
        if(density==='micro')   app.classList.add('micro');

        const cardW=280;
        const cardH=320;
        const podiumFirst=160;
        const podiumSecond=130;
        const podiumThird=100;
        const titleMB=24;

        const headerH=header.getBoundingClientRect().height;
        const podiumBlockH=Math.max(podiumFirst,podiumSecond,podiumThird)+48;
        const titleH=28+titleMB;

        const rows=Math.max(1,Math.min(2,rowsWanted));
        const cardsBlockH=rows*cardH+(rows-1)*20;

        const legendH=sidebar?0:84; // ignore when sidebar
        const totalWithLegend=headerH+titleH+podiumBlockH+cardsBlockH+legendH+24;
        const totalNoLegend=headerH+titleH+podiumBlockH+cardsBlockH+8;

        const innerW=Math.min(maxContainer,vw-padX-(sidebar ? 320 : 0));
        const cols=Math.max(1,Math.floor((innerW+20)/(cardW+20)));

        const showLegend=sidebar?true:(totalWithLegend<=vh);
        const totalH=showLegend?totalWithLegend:totalNoLegend;
        return {density,rows,cols,showLegend,totalH};
    };

    const options=[
        estimate('full',2),
        estimate('full',1),
        estimate('compact',2),
        estimate('compact',1),
        estimate('micro',2),
        estimate('micro',1)
    ];

    let best=options.find(o=>o.totalH<=vh)||options.reduce((a,b)=>a.totalH<b.totalH?a:b);

    app.classList.remove('compact','micro');
    if(best.density==='compact') app.classList.add('compact');
    if(best.density==='micro')   app.classList.add('micro');

    if(legend) legend.classList.toggle('hidden',!best.showLegend);

    const changed=best.cols!==lastCapacity.cols||best.rows!==lastCapacity.rows||best.density!==lastCapacity.density||best.showLegend!==lastCapacity.showLegend;
    lastCapacity=best;
    if(changed) renderLeaderboard();
}

/* -------------------- RENDER -------------------- */
function renderLeaderboard() {
    const podiumContainer = document.getElementById('podiumContainer');
    const leaderboard = document.getElementById('leaderboard');
    const emptyState = document.getElementById('emptyState');

    // Just use all friends directly
    const visibleFriends = currentFriendsData.filter(friend => !friend.isCurrentUser);

    if (visibleFriends.length === 0) {
        podiumContainer.innerHTML = '';
        leaderboard.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }
    if (emptyState) emptyState.style.display = 'none';

    const sortedFriends = [...visibleFriends].sort((a, b) => a.rank - b.rank);
    const top3 = sortedFriends.slice(0, 3);
    
    // Render podium (top 3) - reorder to put 1st in middle
podiumContainer.innerHTML = '';
const podiumOrder = [top3[1], top3[0], top3[2]]; // 2nd, 1st, 3rd

podiumOrder.forEach((friend, index) => {
    if (!friend) return; // Skip if position doesn't exist
    
    const pos = friend.rank; // Use actual rank, not index
    const cls = pos === 1 ? 'first' : pos === 2 ? 'second' : 'third';
    const statusIcon = getStatusIcon(friend.status);

    podiumContainer.innerHTML += `
        <div class="podium-position ${cls}">
            ${pos === 1 ? '<div class="crown">👑</div>' : ''}
            <div class="podium-avatar" style="background:${getAvatarGradient(friend.name)}">
                ${friend.avatar}
                <div class="status-indicator ${friend.status}" title="${getStatusText(friend.status)}">
                    ${statusIcon}
                </div>
            </div>
            <div class="podium-name">${friend.name}</div>
            <div class="podium-streak">
                <span class="streak-number">${friend.streak}</span>
                <span>day streak</span>
            </div>
        </div>`;
    });

    // Render ALL remaining friends (removed capacity limitation)
    const remaining = sortedFriends.slice(3);
    
    leaderboard.innerHTML = '';
    remaining.forEach(f => { 
        leaderboard.innerHTML += createFriendCard(f); 
    });
}

function createFriendCard(friend){
    const badges=friend.badges.map(b=>{const i=getBadgeInfo(b);return `<span class="badge ${b}">${i.icon} ${i.name}</span>`;}).join('');
    const trendIcon=friend.trend==='up'?'📈':friend.trend==='down'?'📉':'';
    const trendClass=friend.trend==='up'?'trend-up':'trend-down';
    const statusIcon = getStatusIcon(friend.status);
    
    return `
        <div class="friend-card ${friend.isCurrentUser?'current-user':''}" data-friend-id="${friend.id}">
            <div class="friend-header">
                <div class="avatar" style="background:${getAvatarGradient(friend.name)}">
                    ${friend.avatar}
                    <div class="status-indicator ${friend.status}" title="${getStatusText(friend.status)}">
                        ${statusIcon}
                    </div>
                </div>
                <div class="friend-info">
                    <div class="friend-name">${friend.name}</div>
                    <div class="friend-rank">${friend.rank<=3?'<span class="rank-crown">👑</span>':''} #${friend.rank}
                    ${trendIcon?`<span class="trend-indicator ${trendClass}">${trendIcon}</span>`:''}</div>
                    <div class="status-text ${friend.status}">
                        <span class="status-dot"></span>
                        ${getStatusText(friend.status)} • ${friend.lastSeen}
                    </div>
                </div>
            </div>
            <div class="friend-stats">
                <div class="stat"><div class="stat-value">${friend.streak}</div><div class="stat-label">Day Streak</div></div>
                <div class="stat"><div class="stat-value">${friend.avgHours}h</div><div class="stat-label">Avg Sleep</div></div>
            </div>
            <div class="badges">${badges}</div>
            ${!friend.isCurrentUser?`
            <div class="friend-actions">
                <button class="action-btn nudge-btn" onclick="nudgeFriend(${friend.id}, '${friend.name}')">👋 Nudge</button>
            </div>`:''}
        </div>`;
}

/* -------------------- Helpers -------------------- */
function setupEventListeners(){
    document.getElementById('searchInput').addEventListener('input', handleSearch);
    document.getElementById('inviteBtn').addEventListener('click', openInviteModal);
    document.getElementById('inviteModal').addEventListener('click',e=>{if(e.target===e.currentTarget) closeInviteModal();});
    
    // Sign out button
    const signOutBtn = document.getElementById('sign-out');
    if (signOutBtn) {
        signOutBtn.addEventListener('click', handleSignOut);
    }
}

function handleSearch(e){
    const term=e.target.value.toLowerCase();
    currentFriendsData=(term==='')?[...friendsData]:friendsData.filter(f=>f.name.toLowerCase().includes(term));
    renderLeaderboard(); 
    layoutToFit();
}

function nudgeFriend(friendId, name) {
    showNudgeModal(name);
}

function showNudgeModal(friendName) {
    const modal = document.getElementById('nudgeModal');
    const friendNameElement = document.getElementById('nudgeFriendName');
    
    if (modal && friendNameElement) {
        friendNameElement.textContent = friendName;
        modal.classList.add('show');
        
        // Auto-hide after 2.5 seconds
        setTimeout(() => {
            modal.classList.remove('show');
        }, 2500);
    }
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    const modal = document.getElementById('nudgeModal');
    if (e.target === modal) {
        modal.classList.remove('show');
    }
});


function handleSignOut() {
    showToast('Sweet dreams! 😴');
    setTimeout(() => {
        // Redirect to login page or perform sign out logic
        window.location.href = './login.html';
    }, 1500);
}

function openInviteModal(){
    document.getElementById('inviteModal').classList.add('show');
    const code=Math.random().toString(36).substring(2,8).toUpperCase();
    document.getElementById('inviteCode').textContent=code;
}

function closeInviteModal(){
    document.getElementById('inviteModal').classList.remove('show');
}

function copyInviteCode(){
    const code=document.getElementById('inviteCode').textContent;
    navigator.clipboard.writeText(code).then(()=>showToast(`Invite code ${code} copied!`))
    .catch(()=>showToast('Failed to copy code.'));
}

function shareInvite(){
    const code=document.getElementById('inviteCode').textContent;
    const text=`Join my Sleep Squad! 😴 Use code: ${code}`;
    if(navigator.share){
        navigator.share({title:'Sleep Squad Invite',text,url:window.location.href});
    } else {
        navigator.clipboard.writeText(text).then(()=>showToast('Invite link copied!'));
    }
}


function showToast(msg){
    const toast=document.getElementById('toast');
    if (!toast) return;
    toast.textContent=msg;
    toast.classList.add('show');
    clearTimeout(toast._hideTimer);
    toast._hideTimer = setTimeout(()=>toast.classList.remove('show'),3000);
}
function getBadgeInfo(b){
    const map={
        'deep-sleeper':{icon:'🏆',name:'Deep Sleeper'},
        'on-fire':{icon:'🔥',name:'On Fire'},
        'balanced':{icon:'🌙',name:'Balanced'}
    };
    return map[b]||{icon:'⭐',name:'Badge'};
}

function getAvatarGradient(name){
    const g=[
        'linear-gradient(135deg,#8b5cf6,#06b6d4)',
        'linear-gradient(135deg,#10b981,#06b6d4)',
        'linear-gradient(135deg,#f59e0b,#ef4444)',
        'linear-gradient(135deg,#8b5cf6,#ef4444)',
        'linear-gradient(135deg,#06b6d4,#10b981)',
        'linear-gradient(135deg,#f59e0b,#8b5cf6)'
    ];
    return g[name.charCodeAt(0)%g.length];
}

