import { createRoute, z } from '@hono/zod-openapi'

const ProductSchema = z
  .object({
    id: z.string().openapi({ example: 'B00123456' }),
    name: z.string().openapi({ example: 'Echo Dot (3rd Gen)' }),
    description: z.string().openapi({ example: 'Smart speaker with Alexa.' }).optional(),
    price: z.number().openapi({ example: 49.99 }),
    category: z.string().openapi({ example: 'Electronics' }),
    availability: z.boolean().optional(),
  })
  .openapi('Product')

const ProductInputSchema = z
  .object({
    name: z.string().openapi({ example: 'Echo Dot (3rd Gen)' }),
    description: z.string().openapi({ example: 'Smart speaker with Alexa.' }).optional(),
    price: z.number().openapi({ example: 49.99 }),
    category: z.string().openapi({ example: 'Electronics' }),
    availability: z.boolean().optional(),
  })
  .openapi('ProductInput')

const OrderSchema = z
  .object({
    id: z.string().openapi({ example: 'ORDER123456' }),
    customerId: z.string().openapi({ example: 'CUST78910' }),
    orderDate: z.string().datetime().openapi({ example: '2025-01-15T10:30:00Z' }),
    products: z.array(
      z.object({
        productId: z.string().openapi({ example: 'B00123456' }),
        quantity: z.number().int().openapi({ example: 2 }),
      }),
    ),
    totalAmount: z.number().openapi({ example: 99.98 }),
    status: z.string().openapi({ example: 'pending' }),
  })
  .openapi('Order')

const OrderInputSchema = z
  .object({
    customerId: z.string().openapi({ example: 'CUST78910' }),
    products: z.array(
      z.object({
        productId: z.string().openapi({ example: 'B00123456' }),
        quantity: z.number().int().openapi({ example: 2 }),
      }),
    ),
  })
  .openapi('OrderInput')

const OrderUpdateSchema = z
  .object({ status: z.string().openapi({ example: 'shipped' }) })
  .openapi('OrderUpdate')

export const getProductsRoute = createRoute({
  tags: [],
  method: 'get',
  path: '/products',
  summary: 'List Products',
  description:
    'Retrieve a list of products available in the marketplace. Supports filtering by category and search query.',
  request: {
    query: z.object({
      category: z.string().optional(),
      search: z.string().optional(),
      limit: z.string().pipe(z.coerce.number().int().default(20)).optional(),
      offset: z.string().pipe(z.coerce.number().int()).optional(),
    }),
  },
  responses: {
    200: {
      description: 'A list of products.',
      content: { 'application/json': { schema: z.array(ProductSchema) } },
    },
  },
})

export const getProductsProductIdRoute = createRoute({
  tags: [],
  method: 'get',
  path: '/products/{productId}',
  summary: 'Get Product Details',
  description: 'Retrieve detailed information about a specific product.',
  request: { params: z.object({ productId: z.string() }) },
  responses: {
    200: {
      description: 'Product details retrieved successfully.',
      content: { 'application/json': { schema: ProductSchema } },
    },
    404: { description: 'Product not found.' },
  },
})

export const putProductsProductIdRoute = createRoute({
  tags: [],
  method: 'put',
  path: '/products/{productId}',
  summary: 'Update Product',
  description: 'Update product information. This endpoint is intended for vendor use.',
  request: {
    body: { required: true, content: { 'application/json': { schema: ProductInputSchema } } },
    params: z.object({ productId: z.string() }),
  },
  responses: {
    200: {
      description: 'Product updated successfully.',
      content: { 'application/json': { schema: ProductSchema } },
    },
    404: { description: 'Product not found.' },
  },
})

export const deleteProductsProductIdRoute = createRoute({
  tags: [],
  method: 'delete',
  path: '/products/{productId}',
  summary: 'Delete Product',
  description: 'Delete a product from the marketplace. This action is restricted to vendors.',
  request: { params: z.object({ productId: z.string() }) },
  responses: {
    204: { description: 'Product deleted successfully.' },
    404: { description: 'Product not found.' },
  },
})

export const getOrdersRoute = createRoute({
  tags: [],
  method: 'get',
  path: '/orders',
  summary: 'List Orders',
  description: 'Retrieve a list of orders for the authenticated customer.',
  security: [{ apiKeyAuth: [] }],
  request: {
    query: z.object({
      status: z.string().optional(),
      limit: z.string().pipe(z.coerce.number().int().default(20)).optional(),
      offset: z.string().pipe(z.coerce.number().int()).optional(),
    }),
  },
  responses: {
    200: {
      description: 'A list of orders.',
      content: { 'application/json': { schema: z.array(OrderSchema) } },
    },
  },
})

export const postOrdersRoute = createRoute({
  tags: [],
  method: 'post',
  path: '/orders',
  summary: 'Create Order',
  description: 'Place a new order in the marketplace.',
  security: [{ apiKeyAuth: [] }],
  request: {
    body: { required: true, content: { 'application/json': { schema: OrderInputSchema } } },
  },
  responses: {
    201: {
      description: 'Order created successfully.',
      content: { 'application/json': { schema: OrderSchema } },
    },
  },
})

export const getOrdersOrderIdRoute = createRoute({
  tags: [],
  method: 'get',
  path: '/orders/{orderId}',
  summary: 'Get Order Details',
  description: 'Retrieve detailed information about a specific order.',
  security: [{ apiKeyAuth: [] }],
  request: { params: z.object({ orderId: z.string() }) },
  responses: {
    200: {
      description: 'Order details retrieved successfully.',
      content: { 'application/json': { schema: OrderSchema } },
    },
    404: { description: 'Order not found.' },
  },
})

export const putOrdersOrderIdRoute = createRoute({
  tags: [],
  method: 'put',
  path: '/orders/{orderId}',
  summary: 'Update Order',
  description: 'Update order status or details such as shipping information.',
  security: [{ apiKeyAuth: [] }],
  request: {
    body: { required: true, content: { 'application/json': { schema: OrderUpdateSchema } } },
    params: z.object({ orderId: z.string() }),
  },
  responses: {
    200: {
      description: 'Order updated successfully.',
      content: { 'application/json': { schema: OrderSchema } },
    },
    404: { description: 'Order not found.' },
  },
})

export const deleteOrdersOrderIdRoute = createRoute({
  tags: [],
  method: 'delete',
  path: '/orders/{orderId}',
  summary: 'Cancel Order',
  description: 'Cancel an existing order.',
  security: [{ apiKeyAuth: [] }],
  request: { params: z.object({ orderId: z.string() }) },
  responses: {
    204: { description: 'Order canceled successfully.' },
    404: { description: 'Order not found.' },
  },
})
