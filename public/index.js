let globalObject = {
  fname: "",
  lname: "",
  address: "",
  city: "",
  state: "",
  orderTotal: "",
  items: null,
};

function addFieldListeners() {
  document.getElementById("fname").addEventListener("input", function (event) {
    globalObject.fname = event.target.value;
  });

  document.getElementById("lname").addEventListener("input", function (event) {
    globalObject.lname = event.target.value;
  });

  document
    .getElementById("address")
    .addEventListener("input", function (event) {
      globalObject.address = event.target.value;
    });

  document.getElementById("city").addEventListener("input", function (event) {
    globalObject.city = event.target.value;
  });

  document.getElementById("state").addEventListener("input", function (event) {
    globalObject.state = event.target.value;
  });

  document.getElementById("album").addEventListener("input", function (event) {
    globalObject.album = event.target.value;
  });

  document
    .getElementById("sub_total")
    .addEventListener("input", function (event) {
      globalObject.sub_total = event.target.value;
    });

  document
    .getElementById("total_tax")
    .addEventListener("input", function (event) {
      globalObject.total_tax = event.target.value;
    });

  document
    .getElementById("grand_total")
    .addEventListener("input", function (event) {
      globalObject.grand_total = event.target.value;
    });
}

window.onload = function () {
  addFieldListeners();
};

function isFieldsetFilled(fieldsetId) {
  const fieldset = document.getElementById(fieldsetId);
  const inputs = fieldset.querySelectorAll("input, select, textarea");
  let allFilled = true;

  inputs.forEach((input) => {
    if (
      !input.classList.contains("hidden") &&
      input.type !== "button" &&
      input.type !== "submit" &&
      input.required &&
      !input.value.trim()
    ) {
      allFilled = false;
    }
  });

  return allFilled;
}


const closeModalButton = document.getElementById('closeModal');
if (closeModalButton) {
  closeModalButton.onclick = function () {
    document.getElementById('errorModal').style.display = 'none';
    window.location.href = '/';
  };
}
/* -------------------------------------------------------------------------------------------------------------- */

function setCustomerData(data) {
  document.getElementById("fname").value = data.first_name || "";
  document.getElementById("lname").value = data.last_name || "";
  document.getElementById("email").value = data.email || "";
  document.getElementById("phone").value = data.phone || "";
  document.getElementById("address").value = data.shipping_address || "";
  document.getElementById("city").value = data.shipping_city || "";
  document.getElementById("state").value = data.shipping_state || "";
}

function setCustomerDataVisible() {
  document.getElementById("customer_details").classList.remove("hidden");
}

function setCustomerGlobalData(data) {
  globalObject.fname = data.first_name || "";
  globalObject.lname = data.last_name || "";
  globalObject.address = data.shipping_address || "";
  globalObject.city = data.shipping_city || "";
  globalObject.state = data.shipping_state || "";
}

async function getCustomerData(event) {
  event.preventDefault();

  const form = document.forms["sales_form"];
  const customer_id = form["customer_id"].value;

  if (!customer_id) {
    alert("Please enter a customer id.");
    return;
  }

  const formData = new FormData();
  formData.append("customer_id", customer_id);

  try {
    let response = await fetch(
      "https://hook.eu1.make.com/p3gu8v3v1n1yln1pbhjnooanss6gmt8y",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      alert(`There was an error while fetching customer: ${response.status}.`);
      formReset();
    }

    let data = await response.json();

    console.log(data);

    setCustomerData(data);
    setCustomerGlobalData(data);
    setCustomerDataVisible();
    return;
  } catch (error) {
    alert(`An error occured: ${error}.`);
    formReset();
  }
}

function nextOrderPage(event) {
  event.preventDefault();

  if (!isFieldsetFilled("customer_section")) {
    alert("Please fill all required fields in the Customer Section.");
    return;
  }

  document.getElementById("customer_section").classList.add("hidden");
  document.getElementById("order_section").classList.remove("hidden");
}

/* -------------------------------------------------------------------------------------------------------------- */

function setOrderData(data) {
  document.getElementById("album").value = data[0].album_name || "";
  document.getElementById("sub_total").value = data[0].sub_total || 0;
  document.getElementById("total_tax").value = data[0].total_tax || 0;
  document.getElementById("grand_total").value = data[0].grand_total || 0;
  document.getElementById("grand_total").value = data[0].grand_total || 0;
  document.getElementById("items_list").value = JSON.stringify(data[0].orders) || "";

  const orders = data[0].orders;
  let order_items = document.getElementById("order_items");
  order_items.innerHTML = "";

  orders.forEach((item, index) => {
    let element = document.createElement("div");
    element.id = `item-${index + 1}`;

    element.innerHTML = `
            <input type="text" class="" name="product_name_${index + 1
      }" id="product_name" value="${item.product_name.trim()}" required/>
            <div class="">
                <span class="">Description</span><br>
                <input type="text" name="description_${index + 1
      }" id="description" value="${item.description.trim()}" class="" required>
            </div>

            <div class="">
                <span class="">Quantity</span><br>
                <input type="number" name="quantity_${index + 1
      }" id="quantity" value="${item.quantity
      }" class="" required>
            </div>

            <div class="">
                <span class="">Image Name</span><br>
                <textarea name="image_name_${index + 1
      }" id="image_name" class="" rows="3" required>${item.image_name ? item.image_name.trim() : ""
      }</textarea>
            </div>
        `;
    order_items.appendChild(element);
  });
}

function setOrderDataVisible() {
  document.getElementById("order_details").classList.remove("hidden");
}

function setOrderGlobalData(data) {
  globalObject.items = JSON.stringify(data[0].orders);
  globalObject.orderTotal = data[0].grand_total || 0;
}

async function getOrderData(event) {
  event.preventDefault();

  const form = document.forms["sales_form"];
  const xml_file = form["xml_file"].files[0];

  if (!xml_file) {
    alert("Please select a XML file.");
    return;
  }

  const formData = new FormData();
  formData.append("xml_file", xml_file);

  try {
    let response = await fetch(
      "https://hook.eu1.make.com/9e1kp6jvf121jusdl1llq5osy00hl4wt",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      alert(`There was an error while parsing xml file: ${response.status}.`);
      formReset();
    }

    let data = await response.json();

    console.log(data);

    setOrderData(data);
    setOrderGlobalData(data);
    setOrderDataVisible();
    return;
  } catch (error) {
    alert(`An error occured: ${error}.`);
    formReset();
  }
}

function previousCustomerPage(event) {
  event.preventDefault();

  document.getElementById("customer_section").classList.remove("hidden");
  document.getElementById("order_section").classList.add("hidden");
}

function nextConfirmationPage(event) {
  event.preventDefault();

  if (!isFieldsetFilled("order_section")) {
    alert("Please fill all required fields in the Order Section.");
    return;
  }

  console.log(globalObject);

  document.getElementById("confirmation_section").classList.remove("hidden");
  document.getElementById("order_section").classList.add("hidden");
}

/* -------------------------------------------------------------------------------------------------------------- */

function getConfirmData(event) {
  event.preventDefault();

  setConfirmData();
  setConfirmDataVisible();
}

function setConfirmData() {
  document.getElementById("confirm_fname").value = globalObject.fname;
  document.getElementById("confirm_lname").value = globalObject.lname;
  document.getElementById("confirm_address").value = globalObject.address;
  document.getElementById("confirm_city").value = globalObject.city;
  document.getElementById("confirm_state").value = globalObject.state;
  document.getElementById("confirm_total").value = globalObject.orderTotal;
}

function setConfirmDataVisible() {
  document.getElementById("confirm_details").classList.remove("hidden");
}

function previousOrderPage(event) {
  event.preventDefault();

  document.getElementById("confirmation_section").classList.add("hidden");
  document.getElementById("order_section").classList.remove("hidden");
}

/* ------------------------------------------------------------------------------------------------------------ */

function copyUrl(event) {
  event.preventDefault();
  let payment_link = document.getElementById("url-to-copy");
  payment_link.select();
  payment_link.setSelectionRange(0, 99999);

  navigator.clipboard.writeText(payment_link.value).then(() => {
    document.getElementById('success-msg').style.display = "flex";
    document.getElementById('copyFeedback').innerText = 'URL copied to clipboard!';
  }).catch(err => {
    document.getElementById('error-msg').style.display = "flex";
    document.getElementById('copyFeedback').innerText = 'Failed to copy URL to clipboard!';
  })
}

function closeSuccessMsg(event) {
  event.preventDefault();
  document.getElementById('success-msg').style.display = "none";
}

function closeErrorMsg(event) {
  event.preventDefault();
  document.getElementById('error-msg').style.display = "none";
}
