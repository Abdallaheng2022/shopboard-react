# Day 5 answers

## Where does the cart live, and why?

Above all application so it will encompass App.

- Header: takes the number appear above the cart in all pages
- ProductCard: in the add to cart in the main page
- ProductDetails: the press button in the product page
- CartContent: when adding the product Details appear in one page.
- CheckoutPage: also during the payment.

The Cart are kept because it appeared during navigating through different pages and it is above all components of the app.
when add CartProvider above the App used components withdraw the CartProvider through using useCart().

## One effect you kept, and why

Add listener when the internet switched off there is event listener listened to the internet and retry to load page the effect comes from the out of React from the browser and when the internet gets back, the event stopped to listen and the error message disappeared (cleanup)

## What re-renders on Add to cart?

The Header re-render when the cart is added but the Product Cards didn't re-render because the separation of cart CartContext and CartActionsContext
