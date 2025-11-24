import prisma from '../config/database.js';
import { deleteCloudinaryImage, deleteLocalImage, getCloudinaryPublicId, getLocalFilename, isUsingCloudinary, uploadToCloudinary } from '../middleware/upload.js';

/**
 * Get all products with optional filtering
 * GET /api/products
 */
export const getAllProducts = async (req, res, next) => {
    try {
        const { category, search } = req.query;

        const where = {};

        if (category && category !== 'all') {
            where.category = category;
        }

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { sku: { contains: search, mode: 'insensitive' } }
            ];
        }

        const products = await prisma.product.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });

        res.json({
            success: true,
            data: { products }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get single product by ID
 * GET /api/products/:id
 */
export const getProductById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const product = await prisma.product.findUnique({
            where: { id: parseInt(id) }
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            data: { product }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Create new product (Admin only)
 * POST /api/products
 */
export const createProduct = async (req, res, next) => {
    try {
        const {
            name,
            category,
            description,
            sku,
            moq,
            retailPrice,
            wholesalePrice,
            stockQuantity,
            imageUrl,
            cloudinaryId
        } = req.body;

        const product = await prisma.product.create({
            data: {
                name,
                category,
                description,
                sku,
                moq: parseInt(moq),
                retailPrice: parseFloat(retailPrice),
                wholesalePrice: parseFloat(wholesalePrice),
                stockQuantity: parseInt(stockQuantity),
                imageUrl,
                cloudinaryId
            }
        });

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: { product }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update product (Admin only)
 * PUT /api/products/:id
 */
export const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const {
            name,
            category,
            description,
            sku,
            moq,
            retailPrice,
            wholesalePrice,
            stockQuantity,
            imageUrl,
            cloudinaryId
        } = req.body;

        // Get existing product to check for old image
        const existingProduct = await prisma.product.findUnique({
            where: { id: parseInt(id) }
        });

        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // If image is being updated, delete old image
        if (imageUrl && imageUrl !== existingProduct.imageUrl) {
            if (isUsingCloudinary() && existingProduct.cloudinaryId) {
                await deleteCloudinaryImage(existingProduct.cloudinaryId);
            } else if (existingProduct.imageUrl) {
                const filename = getLocalFilename(existingProduct.imageUrl);
                if (filename) {
                    deleteLocalImage(filename);
                }
            }
        }

        // Update product
        const product = await prisma.product.update({
            where: { id: parseInt(id) },
            data: {
                ...(name !== undefined && { name }),
                ...(category !== undefined && { category }),
                ...(description !== undefined && { description }),
                ...(sku !== undefined && { sku }),
                ...(moq !== undefined && { moq: parseInt(moq) }),
                ...(retailPrice !== undefined && { retailPrice: parseFloat(retailPrice) }),
                ...(wholesalePrice !== undefined && { wholesalePrice: parseFloat(wholesalePrice) }),
                ...(stockQuantity !== undefined && { stockQuantity: parseInt(stockQuantity) }),
                ...(imageUrl !== undefined && { imageUrl }),
                ...(cloudinaryId !== undefined && { cloudinaryId })
            }
        });

        res.json({
            success: true,
            message: 'Product updated successfully',
            data: { product }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete product (Admin only)
 * DELETE /api/products/:id
 */
export const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Get product to delete associated image
        const product = await prisma.product.findUnique({
            where: { id: parseInt(id) }
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Delete image
        if (isUsingCloudinary() && product.cloudinaryId) {
            await deleteCloudinaryImage(product.cloudinaryId);
        } else if (product.imageUrl) {
            const filename = getLocalFilename(product.imageUrl);
            if (filename) {
                deleteLocalImage(filename);
            }
        }

        // Delete product
        await prisma.product.delete({
            where: { id: parseInt(id) }
        });

        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Upload product image
 * POST /api/products/upload-image
 */
export const uploadProductImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No image file provided'
            });
        }

        let imageData = {};

        if (isUsingCloudinary()) {
            // Upload to Cloudinary from buffer
            const result = await uploadToCloudinary(req.file.buffer);

            imageData = {
                imageUrl: result.secure_url,
                cloudinaryId: result.public_id
            };
        } else {
            // Local file upload
            const protocol = req.protocol;
            const host = req.get('host');
            imageData = {
                imageUrl: `${protocol}://${host}/uploads/products/${req.file.filename}`,
                cloudinaryId: null
            };
        }

        res.json({
            success: true,
            message: 'Image uploaded successfully',
            data: imageData
        });
    } catch (error) {
        next(error);
    }
};
