const token = localStorage.getItem("token");
const SERVER_BASE_URL = "http://localhost:8000";
const options = {
  headers: { Authorization: `Barear ${token}` },
};

const getTodo = async () => {
  isLogin();
  const { data } = await axios.get(`${SERVER_BASE_URL}/api/`, options);
  console.log(data);
  const { allTodos, pendingCount, cancelCount, deleteCount, completedCount } = data;
  let innerHTML = "";
  for (let i = 0; i < allTodos.length; i++) {
    let status = "";
    let completeButton = "";
    let cancelButton = "";

    if (allTodos[i].status == "CANCELED") {
      status = `<i class="fa fa-close"></i>`;
    } else if (allTodos[i].status == "COMPLETED") {
      status = `<i class="fa fa-check" aria-hidden="true"></i>`;
    } else {
      cancelButton = `<i onclick="cancelItem('${allTodos[i]._id}')" class="fa fa-times-circle" aria-hidden="true"></i>`;
      completeButton = `<i onclick="completeItem('${allTodos[i]._id}')" class="fa fa-check" aria-hidden="true"></i> `;
    }
    let tempHTML = ` <li id="${allTodos[i]._id}" > ${allTodos[i].todo} (${allTodos[i].priority}) [${status}] &nbsp;&nbsp; <i onclick="deleteItem('${allTodos[i]._id}')" class="fa fa-trash" aria-hidden="true">&nbsp;&nbsp;</i>${completeButton} ${cancelButton}`;
    innerHTML += tempHTML;
  }
  const list = document.getElementById("todo-list");
  list.innerHTML = innerHTML;

  const counts = document.getElementById("counts");
  counts.innerHTML = `<div>Pending Todos [${pendingCount}] &nbsp;&nbsp; Cancel Todos [${cancelCount}] &nbsp;&nbsp; Delete Todos [${deleteCount}] &nbsp;&nbsp; Complete Todos [${completedCount}] &nbsp;&nbsp; </div>`
};

const deleteItem = async (id) => {
  await axios.delete(`${SERVER_BASE_URL}/api/deleteTodo/${id}`, options);
  getTodo();
};

const cancelItem = async (id) => {
  await axios.patch(`${SERVER_BASE_URL}/api/cancelTodo/${id}`, null, options);
  getTodo();
};

const completeItem = async (id) => {
  await axios.patch(`${SERVER_BASE_URL}/api/completeTodo/${id}`, null, options);
  getTodo();
};

const isLogin = () => {
  if (!token || token == "undefined") {
    window.location.href = "/views/login.html";
  }
};

$("form").submit(async (e) => {
  e.preventDefault();
  const form = document.querySelector("form");
  const data = Object.fromEntries(new FormData(form).entries());
  const res = await axios.post(
    `${SERVER_BASE_URL}/api/createTodo`,
    data,
    options
    );
  if (res.status == 200) {
    getTodo();
  } else {
    alert("Credential are invalid");
  }
});

window.addEventListener("DOMContentLoaded", getTodo());
