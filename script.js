// 중복 선언 방지를 위해 var 사용 및 체크
if (typeof firebaseConfig === 'undefined') {
    var firebaseConfig = {
        apiKey: "AIzaSyNXMeP8hSintwa1L8N7AqfM7K8tlhL-SC",
        authDomain: "jb-fire-6b2d0.firebaseapp.com",
        databaseURL: "https://jb-fire-6b2d0-default-rtdb.firebaseio.com",
        projectId: "jb-fire-6b2d0",
        storageBucket: "jb-fire-6b2d0.appspot.com",
        messagingSenderId: "36531388654",
        appId: "1:36531388654:web:9f8e4e7e974e6f9d9e4a3b"
    };
}

// Firebase 초기화
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

var auth = firebase.auth();
var database = firebase.database();

// 회원가입 함수
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

// 로그인 함수
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
    }).catch(function(err) { alert("로그인 오류: " + err.message); });
};

// 메모 저장 함수
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

// 메모 불러오기 함수
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
