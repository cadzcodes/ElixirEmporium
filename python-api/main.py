from typing import List, Dict, Optional
from sqlalchemy import text, create_engine
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel, constr
from datetime import datetime
from sqlalchemy.exc import SQLAlchemyError

app = FastAPI()

# Database connection (update with your Laravel .env values)
DB_USER = "root"
DB_PASS = "root"
DB_HOST = "mysql"
DB_NAME = "laravel"

engine = create_engine(
    f"mysql+pymysql://{DB_USER}:{DB_PASS}@{DB_HOST}/{DB_NAME}"
)

# -------- Cart Routes -------- #


@app.get("/cart/{user_id}")
def get_cart(user_id: int):
    with engine.connect() as conn:
        query = text("""
            SELECT 
                ci.id,
                ci.product_id,
                p.name,
                p.price,
                p.image,
                ci.quantity
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            WHERE ci.user_id = :user_id
        """)
        result = conn.execute(query, {"user_id": user_id}).mappings().all()
        return list(result)


# -------- Product Routes -------- #


@app.get("/products")
def get_products():
    with engine.connect() as conn:
        query = text("""
            SELECT id, name, slug, image, tags
            FROM products
            WHERE availability = 'in-stock'
        """)
        result = [dict(row) for row in conn.execute(query).mappings().all()]
    return result


@app.get("/products/{slug}")
def get_product(slug: str):
    with engine.connect() as conn:
        query = text("""
            SELECT *
            FROM products
            WHERE slug = :slug
            LIMIT 1
        """)
        row = conn.execute(query, {"slug": slug}).mappings().first()
        if not row:
            raise HTTPException(status_code=404, detail="Product not found")
    return dict(row)


# -------- Adresses Routes -------- #


@app.get("/addresses/{user_id}")
def get_addresses(user_id: int) -> List[Dict]:
    with engine.connect() as conn:
        query = text("""
            SELECT id, full_name, phone, address, unit_number, province, city, barangay, type, is_default
            FROM addresses
            WHERE user_id = :user_id
        """)
        rows = conn.execute(query, {"user_id": user_id}).mappings().all()

    addresses = []
    for row in rows:
        formatted_address = ", ".join(filter(None, [
            row["unit_number"],
            row["barangay"],
            row["city"],
            row["province"]
        ]))
        addresses.append({
            "id": row["id"],
            "full_name": row["full_name"],
            "phone": row["phone"],
            "address": row["address"],
            "unit_number": row["unit_number"],
            "province": row["province"],
            "city": row["city"],
            "barangay": row["barangay"],
            "type": row["type"],
            "is_default": row["is_default"],
            "formatted_address": formatted_address
        })

    return addresses


class AddressCreate(BaseModel):
    full_name: constr(max_length=255)
    phone: constr(max_length=20)
    address: str
    province: str
    city: str
    barangay: str
    unit_number: Optional[str] = None
    type: Optional[str] = None
    is_default: bool = False
    user_id: Optional[int] = None  # Laravel will pass or we get from header


@app.post("/addresses")
def create_address(request: Request, data: AddressCreate):
    try:
        # Get user_id from body or header
        user_id = data.user_id or int(request.headers.get("X-User-ID"))

        with engine.begin() as conn:
            # Reset default flag if new address is default
            if data.is_default:
                conn.execute(
                    text("UPDATE addresses SET is_default = false WHERE user_id = :uid"),
                    {"uid": user_id}
                )

            # Insert new address (no RETURNING here)
            now = datetime.utcnow()
            insert_stmt = text("""
                INSERT INTO addresses (
                    user_id, full_name, phone, address, unit_number,
                    province, city, barangay, type, is_default, created_at, updated_at
                ) VALUES (
                    :user_id, :full_name, :phone, :address, :unit_number,
                    :province, :city, :barangay, :type, :is_default, :created_at, :updated_at
                )
            """)
            result = conn.execute(insert_stmt, {
                "user_id": user_id,
                "full_name": data.full_name,
                "phone": data.phone,
                "address": data.address,
                "unit_number": data.unit_number,
                "province": data.province,
                "city": data.city,
                "barangay": data.barangay,
                "type": data.type,
                "is_default": data.is_default,
                "created_at": now,
                "updated_at": now
            })

            # Get last inserted ID for MySQL
            new_id = result.lastrowid

        return {
            "message": "Address saved successfully",
            "address": {
                "id": new_id,
                "user_id": user_id,
                **data.dict(exclude={"user_id"})
            }
        }

    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/addresses/{address_id}")
def delete_address(address_id: int, request: Request):
    try:
        # Get user ID from Laravel header
        user_id = int(request.headers.get("X-User-ID", 0))
        if not user_id:
            raise HTTPException(status_code=401, detail="Unauthorized")

        with engine.begin() as conn:
            # Check if address exists and belongs to the user
            result = conn.execute(
                text("SELECT id FROM addresses WHERE id = :id AND user_id = :uid"),
                {"id": address_id, "uid": user_id}
            ).fetchone()

            if not result:
                raise HTTPException(
                    status_code=404, detail="Address not found")

            # Delete the address
            conn.execute(
                text("DELETE FROM addresses WHERE id = :id AND user_id = :uid"),
                {"id": address_id, "uid": user_id}
            )

        return {"message": "Address deleted successfully"}

    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=str(e))

# -------- Orders Routes -------- #


@app.get("/orders/{order_id}")
def get_order(order_id: int, request: Request):
    try:
        # Get user ID from header (to ensure the order belongs to the authenticated user)
        user_id = int(request.headers.get("X-User-ID", 0))
        if not user_id:
            raise HTTPException(status_code=401, detail="Unauthorized")

        with engine.connect() as conn:
            # Fetch the order with address
            order_query = text("""
                SELECT o.id, o.status, o.payment_method, o.shipping_fee,
                       o.total, o.eta, o.created_at,
                       a.full_name, a.phone, a.address, a.unit_number, 
                       a.barangay, a.city, a.province, a.type
                FROM orders o
                LEFT JOIN addresses a ON o.address_id = a.id
                WHERE o.id = :oid AND o.user_id = :uid
                LIMIT 1
            """)
            order = conn.execute(
                order_query, {"oid": order_id, "uid": user_id}).mappings().first()

            if not order:
                raise HTTPException(status_code=404, detail="Order not found")

            # Fetch order items with product info
            items_query = text("""
                SELECT oi.product_id, p.name AS product_name, oi.quantity,
                       p.image, oi.unit_price, (oi.unit_price * oi.quantity) AS subtotal
                FROM order_items oi
                JOIN products p ON oi.product_id = p.id
                WHERE oi.order_id = :oid
            """)
            items = conn.execute(
                items_query, {"oid": order_id}).mappings().all()

        # Format address2 like in Laravel
        address2 = ", ".join(filter(None, [
            order["unit_number"],
            order["barangay"],
            order["city"],
            order["province"]
        ]))

        return {
            "id": order["id"],
            "status": order["status"],
            "payment_method": order["payment_method"],
            "shipping_fee": order["shipping_fee"],
            "total": order["total"],
            "eta": order["eta"],
            "created_at": order["created_at"],
            "items": [
                {
                    "product_id": i["product_id"],
                    "product_name": i["product_name"] or "Product",
                    "quantity": i["quantity"],
                    "image": i["image"],
                    "unit_price": i["unit_price"],
                    "subtotal": i["subtotal"]
                }
                for i in items
            ],
            "shipping": {
                "name": order["full_name"],
                "phone": order["phone"],
                "address1": order["address"],
                "address2": address2,
                "type": order["type"]
            } if order["full_name"] else None
        }

    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/orders/user/{user_id}")
def get_my_orders(user_id: int) -> List[Dict]:
    try:
        with engine.connect() as conn:
            # Get orders for the user
            orders_query = text("""
                SELECT id, status, created_at, total
                FROM orders
                WHERE user_id = :uid
                ORDER BY created_at DESC
            """)
            orders = conn.execute(
                orders_query, {"uid": user_id}).mappings().all()

            results = []
            for order in orders:
                # Get items for each order
                items_query = text("""
                    SELECT oi.product_id, oi.quantity, p.name, p.image
                    FROM order_items oi
                    LEFT JOIN products p ON oi.product_id = p.id
                    WHERE oi.order_id = :oid
                """)
                items = conn.execute(
                    items_query, {"oid": order["id"]}).mappings().all()

                # Format products array
                products = [
                    {
                        "name": item["name"] or "Product",
                        "image": item["image"],
                        "qty": item["quantity"]
                    }
                    for item in items
                ]

                results.append({
                    "id": order["id"],
                    "status": order["status"],
                    "created_at": datetime.strftime(order["created_at"], "%b %d, %Y"),
                    "total": order["total"],
                    "item_count": sum(i["quantity"] for i in items),
                    "products": products
                })

        return results

    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=str(e))

