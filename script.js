// 1. 파이어베이스 설정 (대원님의 메모장 사진 값 100% 적용)
if (typeof firebaseConfig === 'undefined') {
    var firebaseConfig = {
        apiKey: "AIzaSyD0XW0p8hs1nEWall8N1AqFM7K8t1nLrBE",
        authDomain: "jb-fire-6b2d0.firebaseapp.com",
        projectId: "jb-fire-6b2d0",
        storageBucket: "jb-fire-6b2d0.firebasestorage.app",
        messagingSenderId: "912026254448",
        appId: "1:912026254448:web:79c925beef5a60c356c8b5",
        measurementId: "G-3RB6GVYY57"
    };
}

// 2. 파이어베이스 초기화
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

var auth = firebase.auth();
var database = firebase.database();

// 3. 회원가입 함수
window.signUp = function() {
    var email = document.getElementById('email').value;
    var pw = document.getElementById('password').value;
    var dept = document.getElementById('department').value;

    if(!email || !pw) return alert("이메일과 비밀번호를 입력하세요.");

    auth.createUserWithEmailAndPassword(email, pw).then(function(userCredential) {
        database.ref('users/' + userCredential.user.uid).set({ department: dept });
        alert("가입 성공! 이제 로그인 해주세요.");
    }).catch(function(err) { 
        alert("가입 오류: " + err.message); 
    });
};

// 4. 로그인 함수
window.login = function() {
    var email = document.getElementById('email').value;
    var pw = document.getElementById('password').value;

    auth.signInWithEmailAndPassword(email, pw).then(function(userCredential) {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('main-section').style.display = 'block';
        
        database.ref('users/' + userCredential.user.uid).once('value', function(snapshot) {
            var userDept = snapshot.val().department;
            document.getElementById('welcome-msg').innerText = "소속: " + userDept;
            loadMemos(userDept);
        });
    }).catch(function(err) { 
        alert("로그인 오류: " + err.message); 
    });
};

// 5. 메모 저장 함수
window.saveMemo = function() {
    var user = auth.currentUser;
    var memoText = document.getElementById('memo-text').value;
    if(!memoText) return;
    
    database.ref('users/' + user.uid).once('value', function(snapshot) {
        var userDept = snapshot.val().department;
        database.ref('memos/' + userDept).push({
            text: memoText,
            user: user.email,
            time: new Date().toLocaleString()
        });
        document.getElementById('memo-text').value = "";
    });
};

// 6. 메모 불러오기 함수
function loadMemos(dept) {
    database.ref('memos/' + dept).on('value', function(snapshot) {
        var memoList = document.getElementById('memo-list');
        memoList.innerHTML = "";
        snapshot.forEach(function(child) {
            var data = child.val();
            memoList.innerHTML += '<div class="memo-item"><strong>' + data.user + '</strong> (' + data.time + ')<br>' + data.text + '</div>';
        });
    });
}
