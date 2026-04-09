const URL = "http://127.0.0.1:8000/api/products/"
const AUTH_URL = "http://127.0.0.1:8000/api/users/"

// auth login y registro
const authForm = document.getElementById("auth-form")
const toggleLink = document.getElementById("toggle-auth-mode")
let isLogin = true

if (toggleLink) {
    toggleLink.addEventListener("click", function (e) {
        e.preventDefault()
        isLogin = !isLogin
        const btn = document.getElementById("auth-submit-btn")
        if (isLogin) {
            btn.textContent = "Iniciar Sesion"
            toggleLink.textContent = "No tienes cuenta? Registrate aqui"
        } else {
            btn.textContent = "Registrarse"
            toggleLink.textContent = "Ya tienes cuenta? Inicia sesion"
        }
    })
}

if (authForm) {
    authForm.addEventListener("submit", function (e) {
        e.preventDefault()
        const email = document.getElementById("email").value
        const password = document.getElementById("password").value
        const endpoint = isLogin ? AUTH_URL + "login" : AUTH_URL

        fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email, password: password })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                const mensaje = document.getElementById("auth-error")
                if (data.detail) {
                    mensaje.style.color = "#f87171"
                    mensaje.textContent = isLogin ? "Credenciales incorrectas o usuario no registrado" : "Error al registrar usuario"
                } else {
                    window.location.href = "../index.html"
                }
            })
    })
}

// productos
const levelUp = window.location.pathname.includes("/Categorias/") || window.location.pathname.includes("/usuarios/") ? "../" : ""

fetch(URL)
    .then(response => response.json())
    .then(productos => {
        console.log(productos)
        const producto = document.getElementById("product-container")

        // producto destacado
        const featuredImage = document.getElementById("featured-image")
        const featuredTitle = document.getElementById("featured-title")
        const featuredDescription = document.getElementById("featured-description")
        const featuredPrice = document.getElementById("featured-price")

        if (featuredImage) {
            featuredImage.src = productos[0].images.replace("Fronted/", "")
            featuredTitle.textContent = productos[0].title
            featuredDescription.textContent = productos[0].description
            featuredPrice.textContent = `$${productos[0].price}`
        }

        // Filtrar por categoria si le asigno el id de la catego
        const categoryId = producto.getAttribute("data-category-id")
        let lista = productos
        if (categoryId) {
            lista = productos.filter(item => item.category_id == categoryId)
        }

        lista.forEach(item => {
            const img = document.createElement("img")
            const title = document.createElement("h2")
            const price = document.createElement("p")
            const description = document.createElement("p")

            const card = document.createElement("article")
            card.className = "product-card"

            img.src = levelUp + item.images.replace("Fronted/", "")
            title.textContent = item.title
            price.textContent = `$${item.price}`
            description.textContent = item.description

            price.className = "price"
            description.className = "desc"

            card.appendChild(img)
            card.appendChild(title)
            card.appendChild(price)
            card.appendChild(description)
            producto.appendChild(card)
        })
    })
