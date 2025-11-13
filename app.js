//  Classes
class Product {
  constructor(id, name, price, stock) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.stock = stock;
    this.promotions = [];
  }

  applyPromotion() {
    const today = new Date();
    const activePromo = this.promotions.find(
      (p) => today >= p.startDate && today <= p.endDate
    );
    return activePromo
      ? this.price * (1 - activePromo.discountPercentage / 100)
      : this.price;
  }
}

class Customer {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.orders = [];
  }
}

class Order {
  constructor(id, customer, products) {
    this.id = id;
    this.customer = customer;
    this.products = products;
    this.date = new Date();
    this.status = "Created";
    this.total = this.calculateTotal();
  }

  calculateTotal() {
    return this.products.reduce((sum, p) => sum + p.applyPromotion(), 0);
  }
}

class Promotion {
  constructor(productId, discountPercentage, startDate, endDate) {
    this.productId = productId;
    this.discountPercentage = discountPercentage;
    this.startDate = new Date(startDate);
    this.endDate = new Date(endDate);
  }
}

// Data Storage
let products = [];
let customers = [];
let orders = [];

// Helper Functions
function updateProductList() {
  $("#product-list").empty();
  $("#product-select, #promotion-product").empty();
  products.forEach((p) => {
    $("#product-list").append(
      `<li>${p.name} - $${p.price} (Stock: ${p.stock})</li>`
    );
    $("#product-select, #promotion-product").append(
      `<option value="${p.id}">${p.name}</option>`
    );
  });
}

function updateCustomerList() {
  $("#customer-list").empty();
  $("#customer-select").empty();
  customers.forEach((c) => {
    $("#customer-list").append(`<li>${c.name}</li>`);
    $("#customer-select").append(`<option value="${c.id}">${c.name}</option>`);
  });
}

function updateOrderList() {
  $("#order-list").empty();
  orders.forEach((o) => {
    $("#order-list").append(
      `<li>Order ${o.id} - ${o.customer.name} - $${o.total.toFixed(
        2
      )} <button class='delete-order' data-id='${o.id}'>Delete</button></li>`
    );
  });
}

function updatePromotionList() {
  $("#promotion-list").empty();
  products.forEach((p) => {
    p.promotions.forEach((pr) => {
      $("#promotion-list").append(
        `<li>${p.name} - ${
          pr.discountPercentage
        }% off until ${pr.endDate.toDateString()}</li>`
      );
    });
  });
}

function generateReport() {
  let totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  let totalOrders = orders.length;
  $("#report-output").text(
    `Total Orders: ${totalOrders}\nTotal Revenue: $${totalRevenue.toFixed(2)}`
  );
}

// Event Listener
$("#product-form").on("submit", (e) => {
  e.preventDefault();
  const name = $("#product-name").val();
  const price = parseFloat($("#product-price").val());
  const stock = parseInt($("#product-stock").val());
  products.push(new Product(products.length + 1, name, price, stock));
  updateProductList();
  e.target.reset();
});

$("#customer-form").on("submit", (e) => {
  e.preventDefault();
  const name = $("#customer-name").val();
  customers.push(new Customer(customers.length + 1, name));
  updateCustomerList();
  e.target.reset();
});

$("#order-form").on("submit", (e) => {
  e.preventDefault();
  const customer = customers.find((c) => c.id == $("#customer-select").val());
  const selectedProducts = $("#product-select")
    .val()
    .map((id) => products.find((p) => p.id == id));
  const order = new Order(orders.length + 1, customer, selectedProducts);
  orders.push(order);
  customer.orders.push(order);
  selectedProducts.forEach((p) => (p.stock -= 1));
  updateProductList();
  updateOrderList();
});

$("#promotion-form").on("submit", (e) => {
  e.preventDefault();
  const productId = $("#promotion-product").val();
  const product = products.find((p) => p.id == productId);
  const promo = new Promotion(
    productId,
    parseFloat($("#promotion-discount").val()),
    $("#promotion-start").val(),
    $("#promotion-end").val()
  );
  product.promotions.push(promo);
  updatePromotionList();
  e.target.reset();
});

$("#order-list").on("click", ".delete-order", function () {
  if (confirm("Are you sure you want to delete this order?")) {
    const id = $(this).data("id");
    orders = orders.filter((o) => o.id != id);
    updateOrderList();
  }
});

$("#generate-report").on("click", generateReport);

// Initialize
$(document).ready(() => {
  products.push(new Product(1, "T-Shirt", 25, 15));
  products.push(new Product(2, "Jeans", 60, 20));
  products.push(new Product(2, "Winter-Jocket", 100, 20));

  customers.push(new Customer(1, "Savitha Yerram"));
  customers.push(new Customer(2, "Krishna Yerram"));

  // Intialize UI
  updateProductList();
  updateCustomerList();
  updateOrderList();
  updatePromotionList();
});
