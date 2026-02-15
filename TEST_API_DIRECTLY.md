# 🧪 TEST API DIRECTLY

## Test the Backend API

Open these URLs in your browser to test if the backend is returning items:

### Test 1: Get Order by ID

Open this URL (replace ORDER_ID with actual order_id from database):
```
https://am-seven-coral.vercel.app/api/orders/4
```

This should return JSON with the order details including an `items` array.

### Test 2: Check Database Info

```
https://am-seven-coral.vercel.app/api/test/db-info
```

This shows database connection status and counts.

---

## What to Look For

In the response, you should see:
```json
{
  "success": true,
  "data": {
    "order_id": 4,
    "order_number": "ORD-1771147269070-801",
    "items": [
      {
        "order_item_id": 1,
        "product_name": "Special Offer 2",
        "quantity": 1,
        "unit_price": 999.00
      }
    ]
  }
}
```

If `items` is an empty array `[]`, then the backend is not fetching items correctly.

If `items` has data, then the problem is in the admin dashboard frontend.

---

## Quick Test

1. Open: `https://am-seven-coral.vercel.app/api/orders/4`
2. Look for the `items` array in the JSON response
3. Tell me if it's empty or has data!
