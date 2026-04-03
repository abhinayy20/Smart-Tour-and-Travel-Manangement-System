const Package = require('../models/Package');

// Get all packages
exports.getAllPackages = async (req, res) => {
    try {
        const { category, sortBy, limit = 10, page = 1 } = req.query;

        let query = { isActive: true };

        if (category) {
            query.category = category;
        }

        let packages = Package.find(query);

        if (sortBy === 'price-low') {
            packages = packages.sort({ 'price.discountedPrice': 1 });
        } else if (sortBy === 'price-high') {
            packages = packages.sort({ 'price.discountedPrice': -1 });
        } else {
            packages = packages.sort({ createdAt: -1 });
        }

        const total = await Package.countDocuments(query);
        const totalPages = Math.ceil(total / limit);

        packages = await packages
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        res.json({
            success: true,
            data: packages,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalPackages: total,
                packagesPerPage: parseInt(limit)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get single package
exports.getPackageById = async (req, res) => {
    try {
        const pkg = await Package.findById(req.params.id);

        if (!pkg) {
            return res.status(404).json({ success: false, message: 'Package not found' });
        }

        res.json({
            success: true,
            data: pkg
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Admin: Create package
exports.createPackage = async (req, res) => {
    try {
        const packageData = req.body;
        const newPackage = new Package(packageData);
        await newPackage.save();

        res.status(201).json({
            success: true,
            message: 'Package created successfully',
            data: newPackage
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Admin: Update package
exports.updatePackage = async (req, res) => {
    try {
        const pkg = await Package.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!pkg) {
            return res.status(404).json({ success: false, message: 'Package not found' });
        }

        res.json({
            success: true,
            message: 'Package updated successfully',
            data: pkg
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Admin: Delete package
exports.deletePackage = async (req, res) => {
    try {
        const pkg = await Package.findByIdAndDelete(req.params.id);

        if (!pkg) {
            return res.status(404).json({ success: false, message: 'Package not found' });
        }

        res.json({
            success: true,
            message: 'Package deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
