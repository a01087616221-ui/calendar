// 중복 선언 방지를 위해 var 사용 및 체크
if (typeof firebaseConfig === 'undefined') {
    var firebaseConfig = {
        apiKey: "AIzaSy...", // const firebaseConfig = {
  apiKey: "AIzaSyD0XW0p8hs1nEWaIL8NlAqFM7K8t1nLrBE",
  authDomain: "jb-fire-6b2d0.firebaseapp.com",
  projectId: "jb-fire-6b2d0",
  storageBucket: "jb-fire-6b2d0.firebasestorage.app",
  messagingSenderId: "912026254448",
  appId: "1:912026254448:web:79c925beef5a60c356c8b5",
  measurementId: "G-3RB6GVYY57"
};

        authDomain: "jb-fire-6b2d0.firebaseapp.com",
        databaseURL: "https://jb-fire-6b2d0-default-rtdb.firebaseio.com",
        projectId: "jb-fire-6b2d0",
        storageBucket: "jb-fire-6b2d0.appspot.com",
        messagingSenderId: "36531388654",
        appId: "1:36531388654:web:9f8e4e7e974e6f9d9e4a3b"
    };
}

// Firebase 초기화 (한 번만 실행)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

var auth = firebase.auth();
var database = firebase.database();

// 버튼 클릭 시 브라우저가 찾을 수 있도록 window에 직접 등록
window.signUp = function() {
    var email = document.getElementById('email').value;
    var pw = document.getElementById('password').value;
    var dept = document.getElementById('department').value;

    if(!email || !pw) return alert("이메일과 비밀번호를 입력하세요.");

    auth.createUserWithEmailAndPassword(email, pw).then(function(userCredential) {
        database.ref('users/' + userCredential.user.uid).set({ department: dept });
        alert("가입 성공! 이제 로그인 해주세요.");
    }).catch(function(err) { alert("가입 오류: " + err.message); });
};

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
