const validateRegister = (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || name.trim().length === 0) {
        return res.status(400).json({ message: 'Name is required' });
    }

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ message: 'Please provide a valid email' });
    }

    if (!password || password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    next();
};

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password' });
    }

    next();
};

const validateBookArgs = (req, res, next) => {
    const { title, author, price, category, stock } = req.body;

    // Allow partial updates for PUT, check required for POST
    if (req.method === 'POST') {
        if (!title || !author || !category) {
            return res.status(400).json({ message: 'Title, Author, and Category are required' });
        }
    }

    if (price !== undefined && (isNaN(price) || price < 0)) {
        return res.status(400).json({ message: 'Price must be a positive number' });
    }

    if (stock !== undefined && (isNaN(stock) || stock < 0)) {
        return res.status(400).json({ message: 'Stock must be a non-negative number' });
    }

    next();
};

module.exports = { validateRegister, validateLogin, validateBookArgs };
