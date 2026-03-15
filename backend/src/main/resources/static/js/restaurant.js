// API base
const API_BASE = "http://localhost:8080/api"

// ===============================
// LOAD FRAGMENT
// ===============================
async function loadFragment(name) {

    // highlight sidebar
    document.querySelectorAll(".sidebar li").forEach(li => {
        li.classList.remove("active")
    })

    event.target.classList.add("active")

    const content = document.getElementById("content-area")

    if (name === "manage-menu") {
        document.getElementById("fragment-title").innerHTML = "<h2>Quản lý menu</h2>"
        loadMenu()
    }

    if (name === "toggle-items") {
        content.innerHTML = "<h3>Bật / tắt món</h3>"
    }

    if (name === "new-orders") {
        content.innerHTML = "<h3>Đơn mới</h3>"
    }

    if (name === "order-status") {
        content.innerHTML = "<h3>Trạng thái đơn</h3>"
    }

    if (name === "revenue-stats") {
        content.innerHTML = "<h3>Thống kê doanh thu</h3>"
    }

    if (name === "res-info") {
        content.innerHTML = "<h3>Thông tin nhà hàng</h3>"
    }
}


// ===============================
// LOAD MENU FROM API
// ===============================
async function loadMenu() {

    const content = document.getElementById("content-area")

    content.innerHTML = `<div class="loader">Đang tải menu...</div>`

    try {

        const res = await fetch(`${API_BASE}/admin/foods`)
        const foods = await res.json()

        renderMenu(foods)

    } catch (err) {

        content.innerHTML = "Không tải được menu"

    }

}


// ===============================
// RENDER MENU GRID
// ===============================
function renderMenu(foods) {

    const content = document.getElementById("content-area")

    let html = `
        <div style="display:flex; justify-content:space-between; margin-bottom:20px;">
            <input 
                type="text" 
                placeholder="Tìm món..." 
                id="searchFood"
                style="width:250px; padding:10px;"
                oninput="searchFood()"
            >

            <button class="btn-primary" onclick="addFood()">
                + Thêm món
            </button>
        </div>

        <div class="grid-container" id="foodGrid">
    `

    foods.forEach(food => {

        html += `
            <div class="card">

                <div class="card-img">
                    <img src="/image/${food.image}" 
                         style="width:100%; height:100%; object-fit:cover">
                </div>

                <div class="card-body">

                    <div class="card-title">
                        ${food.foodName}
                    </div>

                    <div class="card-price">
                        ${food.price.toLocaleString()} đ
                    </div>

                    <button class="card-btn">
                        Chỉnh sửa
                    </button>

                </div>

            </div>
        `

    })

    html += "</div>"

    content.innerHTML = html
}


// ===============================
// SEARCH FOOD
// ===============================
function searchFood() {

    const keyword = document
        .getElementById("searchFood")
        .value
        .toLowerCase()

    const cards = document.querySelectorAll(".card")

    cards.forEach(card => {

        const name = card
            .querySelector(".card-title")
            .innerText
            .toLowerCase()

        if (name.includes(keyword)) {
            card.style.display = "block"
        } else {
            card.style.display = "none"
        }

    })

}


// ===============================
// ADD FOOD
// ===============================
function addFood(){

    alert("Chức năng thêm món đang phát triển")

}


// ===============================
// LOGOUT
// ===============================
function handleLogout(){

    localStorage.clear()

    window.location.href = "index.html"

}