let productos = [];
let carrito = [];

async function cargarProductos() {
  const resp = await fetch('productos.json');
  productos = await resp.json();
  mostrarProductos();
}

function mostrarProductos(filtro = 'Todos') {
  const catalogo = document.getElementById('catalogo');
  catalogo.innerHTML = '';
  const productosFiltrados = filtro === 'Todos' ?
    productos : productos.filter(p => p.categoria === filtro);

  productosFiltrados.forEach(producto => {
    const div = document.createElement('div');
    div.className = 'producto';
    div.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}">
      <h3>${producto.nombre}</h3>
      <p>Categoría: ${producto.categoria}</p>
      <p class="precio">$${producto.precio}</p>
      <p class="descripcion">${producto.descripcion}</p>
      <button onclick="agregarAlCarrito(${producto.id})">Agregar al carrito</button>
    `;
    catalogo.appendChild(div);
  });
}

function agregarAlCarrito(id) {
  const prod = productos.find(p => p.id === id);
  const item = carrito.find(i => i.id === id);
  if (item) {
    item.cantidad++;
  } else {
    carrito.push({ ...prod, cantidad: 1 });
  }
  mostrarCarrito();
}

function mostrarCarrito() {
  const itemsCarrito = document.getElementById('items-carrito');
  const total = document.getElementById('total');
  itemsCarrito.innerHTML = '';
  let suma = 0;
  carrito.forEach(item => {
    suma += item.precio * item.cantidad;
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${item.nombre} x${item.cantidad}</span>
      <span>$${item.precio * item.cantidad}</span>
      <button style="background:#e53935; color:white; border:none; border-radius:4px; padding:2px 6px; margin-left:8px;" onclick="quitarDelCarrito(${item.id})">-</button>
    `;
    itemsCarrito.appendChild(li);
  });
  total.textContent = `Total: $${suma}`;
}

function quitarDelCarrito(id) {
  const idx = carrito.findIndex(i => i.id === id);
  if (idx > -1) {
    if (carrito[idx].cantidad > 1) {
      carrito[idx].cantidad--;
    } else {
      carrito.splice(idx, 1);
    }
    mostrarCarrito();
  }
}

document.getElementById('vaciar-carrito').onclick = function() {
  carrito = [];
  mostrarCarrito();
};

document.getElementById('categoria').onchange = function(e) {
  mostrarProductos(e.target.value);
};

cargarProductos();