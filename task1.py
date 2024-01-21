class Product:
    def __init__(self, name, price):
        self.name = name
        self.price = price
        self.quantity = 0
        self.is_gift_wrapped = False

    def calculate_total(self):
        return self.quantity * self.price

    def apply_bulk_discount(self, bulk_quantity, discount_percentage):
        if self.quantity > bulk_quantity:
            return self.calculate_total() * (discount_percentage / 100)
        return 0

    def apply_tiered_discount(self, tier_quantity, discount_percentage):
        if self.quantity > tier_quantity:
            discounted_quantity = max(0, self.quantity - 15)
            return self.price * discounted_quantity * (discount_percentage / 100)
        return 0

def main():
    products = {
        "Product A": Product("Product A", 20),
        "Product B": Product("Product B", 40),
        "Product C": Product("Product C", 50)
    }

    for name, product in products.items():
        quantity = int(input(f"Enter the quantity of {name}: "))
        is_gift_wrapped = input(f"Is {name} wrapped as a gift? (yes/no): ").lower() == "yes"

        product.quantity = quantity
        product.is_gift_wrapped = is_gift_wrapped

    subtotal = 0
    discount_rules = []

    for product in products.values():
        subtotal += product.calculate_total()

    if subtotal > 200:
        discount_rules.append(("flat_10_discount", 10))

    for product in products.values():
        discount_amount_bulk = product.apply_bulk_discount(10, 5)
        if discount_amount_bulk > 0:
            discount_rules.append(("bulk_5_discount", discount_amount_bulk))

    total_quantity = sum(product.quantity for product in products.values())

    if total_quantity > 20:
        discount_amount_bulk_10 = subtotal * 0.1
        if discount_amount_bulk_10 > 0:
            discount_rules.append(("bulk_10_discount", discount_amount_bulk_10))

    if total_quantity > 30 and any(product.quantity > 15 for product in products.values()):
        discount_amount_tiered_50 = sum(product.apply_tiered_discount(30, 50) for product in products.values())
        if discount_amount_tiered_50 > 0:
            discount_rules.append(("tiered_50_discount", discount_amount_tiered_50))

    # Apply the most beneficial discount
    if discount_rules:
        best_discount_rule = max(discount_rules, key=lambda x: x[1])
        discount_name, discount_amount = best_discount_rule
    else:
        discount_name, discount_amount = "", 0

    gift_wrap_fee = sum(product.quantity for product in products.values() if product.is_gift_wrapped)
    shipping_fee = ((total_quantity+9) // 10) * 5 # to calculate ceil value 

    total = subtotal - discount_amount + gift_wrap_fee + shipping_fee

    # Output details
    print("\n----------------------------------------------------------")
    for name, product in products.items():
        print(f"{name}: Quantity - {product.quantity}, Total - ${product.calculate_total()}")
    print("\n----------------------------------------------------------")
    print("Subtotal: ${}".format(subtotal))
    print("Discount applied: {} - ${}".format(discount_name, discount_amount))
    print("Gift wrap fee: ${}".format(gift_wrap_fee))
    print("Shipping fee: ${}".format(shipping_fee))
    print("Total: ${}".format(total))

if __name__ == "__main__":
    main()
