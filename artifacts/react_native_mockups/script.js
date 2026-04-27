const state = {
    currentPage: 'landing-page',
    currentQuestionIndex: 0,
    answers: [],
    questions: [
        {
            title: "世界杯分组出来了，你支持的球队分到了「死亡之组」，你的第一反应是？",
            options: [
                { text: "死亡之组又怎样？八进四我都想好怎么走了，信仰不灭", value: 1 },
                { text: "有点慌，但还是会看，不行就当见证历史了", value: 2 },
                { text: "赶紧看看其他组有没有更值得追的队伍", value: 3 }
            ]
        },
        {
            title: "你在直播吧看到「你的主队核心球星转会到死敌球队」的新闻，你？",
            options: [
                { text: "心碎但立场不变，我支持的是球衣上的队徽", value: 1 },
                { text: "纠结好一阵子，可能会同时关注两支队", value: 2 },
                { text: "那我也跟着关注新东家吧，球星在哪精彩就在哪", value: 3 }
            ]
        }
    ]
};

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    state.currentPage = pageId;
}

function renderQuestion() {
    const q = state.questions[state.currentQuestionIndex];
    if (!q) {
        startTransition();
        return;
    }

    document.getElementById('q-title').innerText = q.title;
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';
    
    q.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt.text;
        btn.onclick = () => selectOption(idx);
        optionsContainer.appendChild(btn);
    });

    const progress = ((state.currentQuestionIndex + 1) / 16) * 100;
    document.getElementById('progress-bar').style.setProperty('--p-width', progress + '%');
    // Manual style update because ::after transition is tricky with dynamic width in mockup
    document.styleSheets[0].addRule('.progress-bar::after', `width: ${progress}%;`);
    document.getElementById('progress-text').innerText = `${state.currentQuestionIndex + 1}/16`;

    if (state.currentQuestionIndex > 0) {
        document.getElementById('back-btn').style.display = 'block';
    } else {
        document.getElementById('back-btn').style.display = 'none';
    }
}

function selectOption(idx) {
    const buttons = document.querySelectorAll('.option-btn');
    buttons[idx].classList.add('selected');
    
    setTimeout(() => {
        state.answers[state.currentQuestionIndex] = idx;
        state.currentQuestionIndex++;
        renderQuestion();
    }, 300);
}

function startTransition() {
    showPage('transition-page');
    setTimeout(() => {
        showPage('result-page');
    }, 2500);
}

function showError(title, desc) {
    document.getElementById('error-title').innerText = title;
    document.getElementById('error-desc').innerText = desc;
    showPage('error-page');
}

// Event Listeners
document.getElementById('start-btn').onclick = () => {
    // 模拟检测活动状态
    const mockStatus = 'active'; // 也可以是 'upcoming' 或 'ended'
    if (mockStatus === 'upcoming') {
        showError('活动即将开始', '敬请期待，开启你的世界杯球迷人格之旅');
    } else if (mockStatus === 'ended') {
        showError('活动已结束', '感谢参与，我们下届世界杯再见');
    } else {
        showPage('quiz-page');
        renderQuestion();
    }
};

document.getElementById('back-btn').onclick = () => {
    if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex--;
        renderQuestion();
    }
};

document.getElementById('re-test-btn').onclick = () => {
    state.currentQuestionIndex = 0;
    state.answers = [];
    showPage('landing-page');
};

document.getElementById('save-poster-btn').onclick = () => {
    document.getElementById('poster-overlay').style.display = 'flex';
};

document.getElementById('close-poster').onclick = () => {
    document.getElementById('poster-overlay').style.display = 'none';
};

// Initial state
showPage('landing-page');
