// 중복 선언 방지를 위한 체크
if (typeof firebaseConfig === 'undefined') {
    var firebaseConfig = {
        // 아래 apiKey를 끝까지 정확하게 복사해서 넣어야 합니다.
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
        console.error(err);
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
