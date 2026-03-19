#!/bin/bash

echo "🚀 Creating Strapi Content Types..."

BASE="./src/api"

# ----------------------
# PRODUCTS
# ----------------------
mkdir -p $BASE/product/content-types/product

cat > $BASE/product/content-types/product/schema.json <<EOL
{
  "kind": "collectionType",
  "collectionName": "products",
  "info": {
    "singularName": "product",
    "pluralName": "products",
    "displayName": "Product"
  },
  "attributes": {
    "name": { "type": "string", "required": true },
    "category": {
      "type": "enumeration",
      "enum": ["Wigs", "Bundles", "Closures & Frontals", "Hair Care"]
    },
    "price": { "type": "decimal", "required": true },
    "description": { "type": "richtext" },
    "stock": { "type": "integer", "default": 0 },
    "images": { "type": "media", "multiple": true }
  }
}
EOL

# ----------------------
# ORDERS
# ----------------------
mkdir -p $BASE/order/content-types/order

cat > $BASE/order/content-types/order/schema.json <<EOL
{
  "kind": "collectionType",
  "collectionName": "orders",
  "info": {
    "singularName": "order",
    "pluralName": "orders",
    "displayName": "Order"
  },
  "attributes": {
    "user": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "plugin::users-permissions.user"
    },
    "items": { "type": "json" },
    "total_price": { "type": "decimal" },
    "status": {
      "type": "enumeration",
      "enum": ["pending", "confirmed", "delivered"]
    }
  }
}
EOL

# ----------------------
# REVIEWS
# ----------------------
mkdir -p $BASE/review/content-types/review

cat > $BASE/review/content-types/review/schema.json <<EOL
{
  "kind": "collectionType",
  "collectionName": "reviews",
  "info": {
    "singularName": "review",
    "pluralName": "reviews",
    "displayName": "Review"
  },
  "attributes": {
    "user": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "plugin::users-permissions.user"
    },
    "product": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::product.product"
    },
    "rating": { "type": "integer", "min": 1, "max": 5 },
    "comment": { "type": "text" }
  }
}
EOL

echo "✅ Content types created!"

echo "🔄 Restart Strapi now:"
echo "npm run develop"