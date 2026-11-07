import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } 
from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDcWUH344NcoLtDULyoh-pZ9yke6_Be7rY",
    authDomain: "coffee-management-5014a.firebaseapp.com",
    projectId: "coffee-management-5014a",
    storageBucket: "coffee-management-5014a.firebasestorage.app",
    messagingSenderId: "482940095539",
    appId: "1:482940095539:web:fb0a40bad1b723b5b0e746",
    measurementId: "G-CRLDVB1SWL"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

window.switchForm = function(type) {
    document.getElementById('login-form').classList.toggle('hidden', type === 'register');
    document.getElementById('register-form').classList.toggle('hidden', type === 'login');
    hideAlert();
}

window.showAlert = function(message, isSuccess = false) {
    const alertBox = document.getElementById('alert-box');
    alertBox.textContent = message;
    alertBox.className = `mb-4 p-3 rounded-lg text-sm text-center font-bold border ${isSuccess ? 'bg-green-900/50 text-green-400 border-green-500/50' : 'bg-red-900/50 text-red-400 border-red-500/50'}`;
    alertBox.classList.remove('hidden');
}

window.hideAlert = function() {
    document.getElementById('alert-box').classList.add('hidden');
}

// Xử lý Đăng ký
window.handleRegister = function(event) {
    event.preventDefault(); 
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            showAlert("Đăng ký thành công! Đang chuyển trang...", true);
            // Tự động chuyển trang sau 1 giây
            setTimeout(() => {
                window.location.href = "home.html";
            }, 1000);
        })
        .catch((error) => {
            showAlert("Lỗi: " + error.message);
        });
}

// Xử lý Đăng nhập
window.handleLogin = function(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            showAlert("Đăng nhập thành công!", true);
            // Chuyển trang ngay sau khi đăng nhập đúng
            setTimeout(() => {
                window.location.href = "home.html";
            }, 500);
        })
        .catch((error) => {
            showAlert("Sai email hoặc mật khẩu!");
        });
}