
export const PORT = process.env.PORT || 4000
export const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost/myserver';
export const jwtSecret = process.env.jwtSecret || 'awesome_secret';
export const jwtOptions = {
    expiresIn:  "10 days",
    algorithm:  "HS256"
};

export const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY || '';
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || '';
export const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME || ''
export const MODEL_URL = process.env.MODEL_URL || 'http://127.0.0.1:8123'