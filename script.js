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
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_ID",
    appId: "YOUR_APP_ID"
};
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const database = firebase.database();

// 회원가입
function signUp() {
    const email = document.getElementById('email').value;
    const pw = document.getElementById('password').value;
    const dept = document.getElementById('department').value;

    auth.createUserWithEmailAndPassword(email, pw).then((userCredential) => {
        // 부서 정보 저장
        database.ref('users/' + userCredential.user.uid).set({ department: dept });
        alert("가입 성공! 이제 로그인 해주세요.");
    }).catch(err => alert(err.message));
}

// 로그인 및 데이터 불러오기
function login() {
    const email = document.getElementById('email').value;
    const pw = document.getElementById('password').value;

    auth.signInWithEmailAndPassword(email, pw).then((userCredential) => {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('main-section').style.display = 'block';
        
        // 부서 확인 후 메모 로드
        database.ref('users/' + userCredential.user.uid).once('value', (snapshot) => {
            const userDept = snapshot.val().department;
            document.getElementById('welcome-msg').innerText = `소속: ${userDept}`;
            loadMemos(userDept);
        });
    }).catch(err => alert(err.message));
}

// 메모 저장
function saveMemo() {
    const user = auth.currentUser;
    const memoText = document.getElementById('memo-text').value;
    
    database.ref('users/' + user.uid).once('value', (snapshot) => {
        const userDept = snapshot.val().department;
        database.ref('memos/' + userDept).push({
            text: memoText,
            user: user.email,
            time: new Date().toLocaleString()
        });
        document.getElementById('memo-text').value = "";
    });
}

// 부서 메모 실시간 로드
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
