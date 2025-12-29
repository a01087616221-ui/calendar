const firebaseConfig = {
  apiKey: "AIzaSyD0XW0p8hs1nEWaIL8NlAqFM7K8t1nLrBE",
  authDomain: "jb-fire-6b2d0.firebaseapp.com",
  projectId: "jb-fire-6b2d0",
  storageBucket: "jb-fire-6b2d0.firebasestorage.app",
  messagingSenderId: "912026254448",
  appId: "1:912026254448:web:79c925beef5a60c356c8b5",
  measurementId: "G-3RB6GVYY57"
};

const firebaseConfig = {
    apiKey: "AIzaSy...", 
    authDomain: "jb-fire-6b2d0.firebaseapp.com",
    databaseURL: "https://jb-fire-6b2d0-default-rtdb.firebaseio.com", // 본인 DB 주소 확인
    projectId: "jb-fire-6b2d0",
    storageBucket: "jb-fire-6b2d0.appspot.com",
    messagingSenderId: "36531388654",
    appId: "1:36531388654:web:9f8e4e7e974e6f9d9e4a3b"
};

// 2. 초기화 (이미 선언되었는지 확인 후 실행)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const database = firebase.database();

// 3. 회원가입 함수
window.signUp = function() {
    const email = document.getElementById('email').value;
    const pw = document.getElementById('password').value;
    const dept = document.getElementById('department').value;

    if(!email || !pw) return alert("이메일과 비밀번호를 입력하세요.");

    auth.createUserWithEmailAndPassword(email, pw).then((userCredential) => {
        database.ref('users/' + userCredential.user.uid).set({ department: dept });
        alert("가입 성공! 이제 로그인 해주세요.");
    }).catch(err => alert("가입 오류: " + err.message));
};

// 4. 로그인 함수
window.login = function() {
    const email = document.getElementById('email').value;
    const pw = document.getElementById('password').value;

    auth.signInWithEmailAndPassword(email, pw).then((userCredential) => {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('main-section').style.display = 'block';
        
        database.ref('users/' + userCredential.user.uid).once('value', (snapshot) => {
            const userDept = snapshot.val().department;
            document.getElementById('welcome-msg').innerText = `소속: ${userDept}`;
            loadMemos(userDept);
        });
    }).catch(err => alert("로그인 오류: " + err.message));
};

// 5. 메모 로드 및 저장 함수 등 나머지...
window.saveMemo = function() {
    const user = auth.currentUser;
    const memoText = document.getElementById('memo-text').value;
    if(!memoText) return;
    
    database.ref('users/' + user.uid).once('value', (snapshot) => {
        const userDept = snapshot.val().department;
        database.ref('memos/' + userDept).push({
            text: memoText,
            user: user.email,
            time: new Date().toLocaleString()
        });
        document.getElementById('memo-text').value = "";
    });
};

function loadMemos(dept) {
    database.ref('memos/' + dept).on('value', (snapshot) => {
        const memoList = document.getElementById('memo-list');
        memoList.innerHTML = "";
        snapshot.forEach((child) => {
            const data = child.val();
            memoList.innerHTML += `<div class="memo-item"><strong>${data.user}</strong> (${data.time})<br>${data.text}</div>`;
        });
    });
}
