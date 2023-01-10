const SERVER_BASE_URL = "http://localhost:8000";
const getTodo = async () => {
  console.log(SERVER_BASE_URL);
  isLogin();
  $("form").submit(async (e) => {
    e.preventDefault();
    const form = document.querySelector("form");
    const data = Object.fromEntries(new FormData(form).entries());
    const res = await axios.post(`${SERVER_BASE_URL}/api/register`, data);
    console.log(res);
    if (res.status == 200) {
      localStorage.setItem("token", res.data.token);
      window.location.href = "/views/todo.html";
    } else {
      alert(res.response.data.message);
    }
  });
};

const isLogin = () => {
  const token = localStorage.getItem("token");
  if (token && token != "undefined") {
    window.location.href = "/views/todo.html";
  }
};

window.addEventListener("DOMContentLoaded", getTodo());
