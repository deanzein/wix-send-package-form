class SendPackageForm extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <style>
        .form-container {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-width: 400px;
        }
        input, select, button {
          padding: 10px;
          font-size: 16px;
          width: 100%;
          box-sizing: border-box;
        }
        button {
          background: #0071e3;
          color: white;
          border: none;
          cursor: pointer;
          font-size: 16px;
        }
        button:hover {
          background: #005bb5;
        }
      </style>

      <div class="form-container">
        <input type="text" id="pickupInput" placeholder="Pickup Address" required />
        <input type="text" id="dropoffInput" placeholder="Drop-off Address" required />
        <input type="number" id="weightInput" placeholder="Package Weight (lbs)" min="1" required />
        
        <select id="sizeDropdown" required>
          <option value="">Select Package Size</option>
          <option value="Small">Small</option>
          <option value="Medium">Medium</option>
          <option value="Large">Large</option>
          <option value="X-Large">X-Large</option>
        </select>

        <select id="urgencyDropdown" required>
          <option value="">Select Delivery Urgency</option>
          <option value="Go Now">Go Now</option>
          <option value="Standard">Standard</option>
          <option value="Take Your Time">Take Your Time</option>
        </select>

        <button id="submitOrderButton">Submit Order</button>
      </div>
    `;

    this.querySelector('#submitOrderButton').addEventListener('click', () => {
      const pickup = this.querySelector('#pickupInput').value.trim();
      const dropoff = this.querySelector('#dropoffInput').value.trim();
      const weight = Number(this.querySelector('#weightInput').value);
      const size = this.querySelector('#sizeDropdown').value;
      const urgency = this.querySelector('#urgencyDropdown').value;

      if (!pickup || !dropoff || !weight || !size || !urgency || isNaN(weight) || weight <= 0) {
        alert('Please fill out all fields correctly.');
        return;
      }

      let price = 12.50;
      if (weight > 10) price += (weight - 10) * 0.50;
      if (size === "Large") price += 5;
      if (size === "X-Large") price += 10;
      if (urgency === "Go Now") price *= 1.5;
      else if (urgency === "Take Your Time") price *= 0.9;
      price = parseFloat(price.toFixed(2));

      const trackingCode = Math.random().toString(36).substr(2, 8).toUpperCase();

      const newOrder = {
        pickupAddress: pickup,
        dropoffAddress: dropoff,
        packageWeight: weight,
        packageSize: size,
        deliveryUrgency: urgency,
        calculatedPrice: price,
        trackingCode: trackingCode,
        status: "Pending"
      };

      console.log('Final Order to Submit:', newOrder);

      // ✅ Submit order to backend function
      fetch('/_functions/sendOrder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      })
      .then(response => response.json())
      .then(data => {
        console.log('Order Saved Successfully:', data);
        alert('Order submitted successfully! Tracking Code: ' + trackingCode);
        window.location.href = '/track/' + trackingCode;
      })
      .catch(error => {
        console.error('Error submitting order:', error);
        alert('There was an error submitting your order. Please try again.');
      });
    });
  }
}

customElements.define('send-package-form', SendPackageForm);