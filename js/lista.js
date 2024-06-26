import { sendToServer } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  const productList = document
    .getElementById("productList")
    .getElementsByTagName("tbody")[0];
  const sendToServerButton = document.getElementById("sendToServer");
  const clearListButton = document.getElementById("clearList");

  let products = JSON.parse(localStorage.getItem("listaProdutos")) || [];
  let shoppingList = JSON.parse(localStorage.getItem("listaCompras")) || [];

  const renderList = () => {
    productList.innerHTML = "";
    products
      .filter((p) => p.active)
      .forEach((product, index) => {
        const row = productList.insertRow();
        row.insertCell(0).textContent = product.id;
        row.insertCell(1).textContent = product.name;
        row.insertCell(2).textContent = product.unit;
        row.insertCell(3).textContent = product.quantity;
        const purchaseCell = row.insertCell(4);
        const purchaseInput = document.createElement("input");
        purchaseInput.type = "number";
        purchaseInput.min = 0;
        purchaseInput.value = product.purchased || 0;
        purchaseInput.addEventListener("input", (e) => {
          product.purchased = Number(e.target.value);
          localStorage.setItem("listaProdutos", JSON.stringify(products));
          renderList();
        });
        purchaseCell.appendChild(purchaseInput);
        const collectedCell = row.insertCell(5);
        if ((product.purchased || 0) >= product.quantity) {
          collectedCell.textContent = "Sim";
          row.classList.add("strikethrough");
        } else {
          collectedCell.textContent = "Não";
        }

        const deleteCell = row.insertCell(6);
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Excluir";
        deleteButton.addEventListener("click", () => {
          deleteProduct(index);
        });
        deleteCell.appendChild(deleteButton);
      });

    updateSendToServerButton();
  };

  const updateSendToServerButton = () => {
    if (products.every((p) => (p.purchased || 0) >= p.quantity)) {
      sendToServerButton.disabled = false; // Ativa o botão se todos os produtos foram coletados
    } else {
      sendToServerButton.disabled = true; // Desativa o botão se há produtos não coletados
    }
  };

  const deleteProduct = (index) => {
    if (confirm("Tem certeza de que deseja excluir este produto?")) {
      products.splice(index, 1);
      localStorage.setItem("listaProdutos", JSON.stringify(products));
      renderList();
    }
  };

  clearListButton.addEventListener("click", () => {
    if (confirm("Tem certeza de que deseja limpar toda a lista?")) {
      localStorage.removeItem("listaProdutos");
      localStorage.removeItem("listaCompras");
      products = [];
      shoppingList = [];
      renderList();
    }
  });

  sendToServerButton.addEventListener("click", () => {
    if (products.every((p) => (p.purchased || 0) >= p.quantity)) {
      sendToServer(products, shoppingList); // Chama a função sendToServer com os dados corretos
    } else {
      alert("Ainda há produtos não coletados.");
    }
  });

  renderList();
});
