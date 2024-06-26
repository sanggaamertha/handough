let listProductHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listCart');
let iconCart = document.querySelector('.icon-cart2');
let iconCartSpan = document.querySelector('.icon-cart2 span');
let body = document.querySelector('body');
let closeCart = document.querySelector('.close');
let checkOutCart = document.querySelector('.checkOut');


let totalharganya = document.querySelector('.totalharga');
let totalitem = document.querySelector('#items');

let checkoutForm = document.getElementById('checkoutForm');
checkoutForm.style.display = 'none';

let products = [];
let cart = [];
let hh = '';


iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
})

closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
})



checkOutCart.addEventListener('click', () => {
    checkoutForm.style.display = 'block';
    let message = 'Pesanan:\n';
    let totalPrice ='';

    cart.forEach(item => {
        let positionProduct = products.findIndex(value => value.id == item.product_id);
        let info = products[positionProduct];
        let sizeText = item.size === 'medium' ? 'Medium ' : 'Large ';
        let totalpricenya = item.quantity * (item.size === 'medium' ? info.price : info.price2);
       
        message += `${item.quantity} ${sizeText} ${info.name} ${totalpricenya}K\n`;
    });

    // Event listener untuk tombol "submit"
    document.getElementById('checkout-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Mencegah perilaku default dari form submission
    
        let nama = document.getElementById('nama').value;
        let noHp = document.getElementById('no-hp').value;
        let alamat = document.getElementById('alamat').value;
        let tanggal = document.getElementById('tanggal').value;
        let jam = document.getElementById('jam').value;
    
        message += `Nama: ${nama}\nNo HP: ${noHp}\nAlamat: ${alamat}\nTanggal Pengambilan: ${tanggal}\nJam Pengambilan: ${jam}`;

        totalPrice += `Total price: IDR ${hh} K`;
        message += `\n${totalPrice}`;
    
        const phoneNumber = 6282144206195; 
        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        document.location.href = whatsappURL;
    });

    // Event listener untuk tombol "cancel"
    
});
document.getElementById('cancelbutton').addEventListener('click', function(event) {
    event.preventDefault(); // Mencegah perilaku default dari tombol "cancel"
    checkoutForm.style.display = 'none'; // Menyembunyikan formulir checkout
});






const addDataToHTML = () => {
    // add new datas
    if(products.length > 0) // if has data
    {
        products.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.dataset.id = product.id;
            newProduct.classList.add('item');
            newProduct.innerHTML = 
            `<img src="${product.image}" alt="">
            <h2 class="namanya">${product.name}</h2>
            <div class="info">${product.info}</div>
            <div class="price">Medium IDR ${product.price}K</div>
            <button class="addCart" data-size="medium">Add To Cart</button>
            <div class="price2">Large IDR ${product.price2}K</div>
            <button class="addCart2" data-size="large">Add To Cart</button>`;
            listProductHTML.appendChild(newProduct);
        });
    }
}
listProductHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if(positionClick.classList.contains('addCart')){
        let id_product = positionClick.parentElement.dataset.id;
        let size = positionClick.getAttribute('data-size');
        addToCart(id_product, size);
    }
    if(positionClick.classList.contains('addCart2')){
        let id_product = positionClick.parentElement.dataset.id;
        let size = positionClick.getAttribute('data-size');
        addToCart(id_product, size);
    }
})
const addToCart = (product_id, size) => {
    let positionThisProductInCart = cart.findIndex((value) => value.product_id == product_id && value.size == size);
    if(cart.length <= 0){
        cart = [{
            product_id: product_id,
            size: size,
            quantity: 1
        }];
    }else if(positionThisProductInCart < 0){
        cart.push({
            product_id: product_id,
            size: size,
            quantity: 1
        });
    }else{
        cart[positionThisProductInCart].quantity = cart[positionThisProductInCart].quantity + 1;
    }
    addCartToHTML();
    addCartToMemory();
}

const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
}
const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    let totalPricing = 0; // Menghitung total harga semua item

    if (cart.length > 0) {
        cart.forEach(item => {
            totalQuantity += item.quantity;
            let newItem = document.createElement('div');
            newItem.classList.add('item');
            newItem.dataset.id = item.product_id;

            let positionProduct = products.findIndex(value => value.id == item.product_id);
            let info = products[positionProduct];
            listCartHTML.appendChild(newItem);

            let sizeText = item.size === 'medium' ? 'Medium ' : 'Large ';
            let price = item.size === 'medium' ? info.price : info.price2; // Menyesuaikan harga berdasarkan ukuran
            let totalPrice = price * item.quantity; // Total harga untuk item ini

            totalPricing += totalPrice; // Menambahkan total harga untuk item ini ke total harga keseluruhan

            newItem.innerHTML = `
            <div class="image">
                <img src="${info.image}">
            </div>
            <div class="name">${sizeText}${info.name}</div>
            <div class="totalPrice">IDR ${totalPrice}K</div>
            <div class="quantity">
                <span class="minus"><</span>
                <span>${item.quantity}</span>
                <span class="plus">></span>
            </div>
            `;
        });
    }
    // Menetapkan jumlah total item ke ikon keranjang
    iconCartSpan.innerText = totalQuantity;

    // Menghitung total quantity dan harga
    let qq1 = totalQuantity.toString();
    hh = totalPricing.toString();
    totalitem.textContent = qq1+" items";
    totalharganya.textContent = "IDR "+hh+"K"
    console.log("Total Quantity:", qq1);
    console.log("Total Harga:", hh);

}


listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    let product_id = positionClick.parentElement.parentElement.dataset.id;
    let size = positionClick.parentElement.parentElement.querySelector('.name').textContent.trim().toLowerCase().includes('medium') ? 'medium' : 'large';
    
    if (positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {
        let type = positionClick.classList.contains('plus') ? 'plus' : 'minus';
        if (size === 'medium') {
            changeQuantityCart(product_id, type, size);
        } else {
            changeQuantityCart2(product_id, type, size);
        }
    }
})

const changeQuantityCart = (product_id, type, size) => {
    let positionItemInCart = cart.findIndex((value) => value.product_id == product_id && value.size == size);
    if (positionItemInCart >= 0) {
        switch (type) {
            case 'plus':
                cart[positionItemInCart].quantity += 1;
                break;
            default:
                if (cart[positionItemInCart].quantity > 1) {
                    cart[positionItemInCart].quantity -= 1;
                } else {
                    cart.splice(positionItemInCart, 1);
                }
                break;
        }
    }
    addCartToHTML();
    addCartToMemory();
}

const changeQuantityCart2 = (product_id, type, size) => {
    let positionItemInCart = cart.findIndex((value) => value.product_id == product_id && value.size == size);
    if (positionItemInCart >= 0) {
        switch (type) {
            case 'plus':
                cart[positionItemInCart].quantity += 1;
                break;
            default:
                if (cart[positionItemInCart].quantity > 1) {
                    cart[positionItemInCart].quantity -= 1;
                } else {
                    cart.splice(positionItemInCart, 1);
                }
                break;
        }
    }
    addCartToHTML();
    addCartToMemory();
}

const initApp = () => {
    // get data product
    fetch('produk.json')
    .then(response => response.json())
    .then(data => {
        products = data;
        addDataToHTML();

        // get data cart from memory
        if(localStorage.getItem('cart')){
            cart = JSON.parse(localStorage.getItem('cart'));
            addCartToHTML();
        }
    })
}
initApp();



