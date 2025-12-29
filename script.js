// Firebase 설정
var firebaseConfig = {
    apiKey: "AIzaSyD0XW0p8hs1nEWaIL8NlAqFM7K8t1nLrBE",
    authDomain: "jb-fire-6b2d0.firebaseapp.com",
    projectId: "jb-fire-6b2d0",
    storageBucket: "jb-fire-6b2d0.firebasestorage.app",
    messagingSenderId: "912026254448",
    appId: "1:912026254448:web:79c925beef5a60c356c8b5"
};

firebase.initializeApp(firebaseConfig);

var auth = firebase.auth();
var db = firebase.database();
var currentDept = "";

/* 회원가입 */
function signUp() {
    var email = email.value;
    var pw = password.value;
    var dept = department.value;

    auth.createUserWithEmailAndPassword(email, pw).then(res => {
        db.ref("users/" + res.user.uid).set({ department: dept });
        alert("회원가입 완료");
    }).catch(e => alert(e.message));
}

/* 로그인 */
function login() {
    auth.signInWithEmailAndPassword(email.value, password.value).then(res => {
        db.ref("users/" + res.user.uid).once("value", snap => {
            currentDept = snap.val().department;
            login-section.style.display = "none";
            main-section.style.display = "block";
            welcome-msg.innerText = "소속 : " + currentDept;

            loadCalendar(currentDept);
            loadMemos(currentDept);
        });
    }).catch(e => alert(e.message));
}

/* 로그아웃 */
function logout() {
    auth.signOut();
    main-section.style.display = "none";
    login-section.style.display = "block";
}

/* 비밀번호 재설정 */
function resetPassword() {
    if (!email.value) return alert("이메일 입력");
    auth.sendPasswordResetEmail(email.value)
        .then(() => alert("메일 발송 완료"));
}

/* 캘린더 */
function loadCalendar(dept) {
    var calendar = new FullCalendar.Calendar(calendar, {
        locale: "ko",
        selectable: true,
        select(info) {
            var title = prompt("연가 / 출장 / 교육 / 특별휴가");
            if (title) {
                db.ref("calendar/" + dept).push({
                    title,
                    start: info.startStr,
                    end: info.endStr
                });
            }
        },
        events(fetch, success) {
            db.ref("calendar/" + dept).once("value", snap => {
                var arr = [];
                snap.forEach(c => arr.push(c.val()));
                success(arr);
            });
        }
    });
    calendar.render();
}

/* 메모 저장 */
function saveMemo() {
    if (!memo-text.value) return;
    db.ref("memos/" + currentDept).push({
        text: memo-text.value,
        time: new Date().toLocaleString()
    });
    memo-text.value = "";
}

/* 메모 불러오기 + 수정 삭제 */
function loadMemos(dept) {
    db.ref("memos/" + dept).on("value", snap => {
        memo-list.innerHTML = "";
        snap.forEach(c => {
            memo-list.innerHTML += `
            <div class="memo-item">
                ${c.val().text}<br>
                <button onclick="editMemo('${dept}','${c.key}')">수정</button>
                <button onclick="deleteMemo('${dept}','${c.key}')">삭제</button>
            </div>`;
        });
    });
}

function editMemo(dept, key) {
    var text = prompt("수정 내용");
    if (text) db.ref(`memos/${dept}/${key}`).update({ text });
}

function deleteMemo(dept, key) {
    if (confirm("삭제?")) db.ref(`memos/${dept}/${key}`).remove();
}
