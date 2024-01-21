class Product {
    constructor(name, price) {
        this.name = name;
        this.price = price;
        this.quantity = 0;
        this.isGiftWrapped = false;
    }

    calculateTotal() {
        return this.quantity * this.price;
    }

    applyBulkDiscount(bulkQuantity, discountPercentage) {
        if (this.quantity > bulkQuantity) {
            return this.calculateTotal() * (discountPercentage / 100);
        }
        return 0;
    }

    applyTieredDiscount(tierQuantity, discountPercentage) {
        if (this.quantity > tierQuantity) {
            const discountedQuantity = Math.max(0, this.quantity - 15);
            return this.price * discountedQuantity * (discountPercentage / 100);
        }
        return 0;
    }
}

function main() {
    const products = {
        "Product A": new Product("Product A", 20),
        "Product B": new Product("Product B", 40),
        "Product C": new Product("Product C", 50),
    };

    for (const [name, product] of Object.entries(products)) {
        const quantity = parseInt(prompt(`Enter the quantity of ${name}:`), 10);
        const isGiftWrapped = prompt(`Is ${name} wrapped as a gift? (yes/no):`).toLowerCase() === "yes";

        product.quantity = quantity;
        product.isGiftWrapped = isGiftWrapped;
    }

    let subtotal = 0;
    const discountRules = [];

    for (const product of Object.values(products)) {
        subtotal += product.calculateTotal();
    }

    if (subtotal > 200) {
        discountRules.push(["flat_10_discount", 10]);
    }

    for (const product of Object.values(products)) {
        const discountAmountBulk = product.applyBulkDiscount(10, 5);
        if (discountAmountBulk > 0) {
            discountRules.push(["bulk_5_discount", discountAmountBulk]);
        }
    }

    const totalQuantity = Object.values(products).reduce((sum, product) => sum + product.quantity, 0);

    if (totalQuantity > 20) {
        const discountAmountBulk10 = subtotal * 0.1;
        if (discountAmountBulk10 > 0) {
            discountRules.push(["bulk_10_discount", discountAmountBulk10]);
        }
    }

    if (totalQuantity > 30 && Object.values(products).some(product => product.quantity > 15)) {
        const discountAmountTiered50 = Object.values(products).reduce(
            (sum, product) => sum + product.applyTieredDiscount(30, 50),
            0
        );
        if (discountAmountTiered50 > 0) {
            discountRules.push(["tiered_50_discount", discountAmountTiered50]);
        }
    }

    // Apply the most beneficial discount
    let discountName = "";
    let discountAmount = 0;
    if (discountRules.length > 0) {
        const bestDiscountRule = discountRules.reduce((maxDiscount, currentDiscount) =>
            currentDiscount[1] > maxDiscount[1] ? currentDiscount : maxDiscount
        );
        [discountName, discountAmount] = bestDiscountRule;
    }

    const giftWrapFee = Object.values(products).reduce((sum, product) =>
        product.isGiftWrapped ? sum + product.quantity : sum, 0);

    const shippingFee = Math.ceil(totalQuantity / 10) * 5;

    const total = subtotal - discountAmount + giftWrapFee + shippingFee;

    // Output details
    console.log("\n----------------------------------------------------------");
    for (const [name, product] of Object.entries(products)) {
        console.log(`${name}: Quantity - ${product.quantity}, Total - $${product.calculateTotal()}`);
    }
    console.log("\n----------------------------------------------------------");
    console.log(`Subtotal: $${subtotal}`);
    console.log(`Discount applied: ${discountName} - $${discountAmount}`);
    console.log(`Gift wrap fee: $${giftWrapFee}`);
    console.log(`Shipping fee: $${shippingFee}`);
    console.log(`Total: $${total}`);
}

main();
