const levelEl     = document.getElementById('level');
const reqEl       = document.getElementById('required');
const feedBtn     = document.getElementById('feedBtn');
const feed100Btn  = document.getElementById('feed100Btn');
const resetBtn    = document.getElementById('resetBtn');
const feedCountEl = document.getElementById('feedCount');
const rewardEl    = document.getElementById('reward');
const logEl       = document.getElementById('log');

let level     = 1;
let feedCount = 0;

// 레벨별 확률
const rates = {
  1: { s:1,     f:0,     d:0   },
  2: { s:0.7,   f:0.3,   d:0   },
  3: { s:0.55,  f:0.45,  d:0   },
  4: { s:0.4,   f:0.6,   d:0   },
  5: { s:0.307, f:0.693, d:0   },
  6: { s:0.205, f:0.765, d:0.03},
  7: { s:0.153, f:0.817, d:0.03},
  8: { s:0.1,   f:0.87,  d:0.03},
};

// 레벨별 보상
const rewards = {
  2: { voucher: '20',   energy: 'Faint Sol Erda x4',   fragments: 'x1'   },
  3: { voucher: '60',   energy: 'Faint Sol Erda x12',  fragments: 'x3'   },
  4: { voucher: '120',  energy: 'Faint Sol Erda x24',  fragments: 'x6'   },
  5: { voucher: '200',  energy: 'Faint Sol Erda x40',  fragments: 'x10'  },
  6: { voucher: '300',  energy: 'Faint Sol Erda x60',  fragments: 'x20'  },
  7: { voucher: '600',  energy: 'Sol Erda x1',         fragments: 'x50'  },
  8: { voucher: '2000', energy: 'Sol Erda x4',         fragments: 'x150' },
  9: { voucher: '6000', energy: 'Sol Erda x8',         fragments: 'x300' },
};

// 누적 Required Kills 계산
function requiredKills(count) {
  return count === 0 ? 1000 : 1000 + (count * 300);
}

// UI 업데이트
function updateUI() {
  levelEl.innerHTML     = `${(level >= 9)?'<span style="color: #FF0004;">':""}Lv. ${level}${(level >= 9)?" 달성!!!</span> ":""}`;
  feedCountEl.innerHTML = `${(level >= 9)?"<b>":""}${feedCount}${(level >= 9)?"</b>":""}`;
  reqEl.textContent       = requiredKills(feedCount);

  // 버튼 활성화 제어
  const doneMax = feedCount >= 100 || level >= 9;
  feedBtn.disabled    = doneMax;
  feed100Btn.disabled = doneMax;

  // 보상 표시
  const r = rewards[level];
  if (r) {
    rewardEl.innerHTML =
      `Advanced EXP Voucher x${r.voucher}<br/>` +
      `${r.energy}<br/>` +
      `Sol Erda Fragments ${r.fragments}`;
  } else {
    rewardEl.textContent = '';
  }
}

// 로그 추가
function logMessage(msg) {
  const li = document.createElement('li');
  li.innerHTML = msg;
  logEl.prepend(li);
}

// 단일 Feed 수행
function doFeed() {
  // Lv.9 이상이거나 100회 이상일 땐 실행 중단
  if (level >= 9 || feedCount >= 100) return;
	
  const { s, f, d } = rates[level];
  const rnd = Math.random();
  let result;

  if (rnd < s) {
    level = Math.min(9, level + 1);
    result = '<span style="color: #5CC46F;">성공</span>';
  } else if (rnd < s + f) {
    level = Math.max(2, level - 1);
    result = '<span style="color: #FF6A6C;">실패</span>';
  } else {
    level = 2;
    result = '<span style="color: #FF0004;"><b>도망</b></span>';
  }

  feedCount++;
  logMessage(`#${feedCount}: ${result} → Lv ${level}`);
  updateUI();
}

// 이벤트 바인딩
feedBtn.addEventListener('click', doFeed);

feed100Btn.addEventListener('click', () => {
  while (feedCount < 100 && level < 9) {
    doFeed();
  }
});

resetBtn.addEventListener('click', () => {
  level     = 1;
  feedCount = 0;
  logEl.innerHTML = '';
  updateUI();
});

// 키보드 단축키
document.addEventListener('keydown', e => {
  if ((e.key === 'w' || e.key === 'W') && !feedBtn.disabled) {
    doFeed();
  }
  else if ((e.key === 'e' || e.key === 'E') && !feedBtn.disabled) {
	while (feedCount < 100 && level < 9) {
		doFeed();
	}
  }
  else if (e.key === 'r' || e.key === 'R') {
	level     = 1;
	feedCount = 0;
	logEl.innerHTML = '';
	updateUI();
  }
});



// 초기 렌더
updateUI();
