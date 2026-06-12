import jwt from 'jsonwebtoken';
import { headers } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET;

export function generateToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role, name: user.name, email: user.email },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function getUserFromToken(request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    return verifyToken(token);
  }
  
  // Optional: check cookies if token isn't in headers
  // const cookiesList = headers().get('cookie');
  // Handle cookie parsing here if needed
  
  return null;
}

export function requireLogin(request) {
  const user = getUserFromToken(request);
  if (!user) {
    return { error: 'Unauthorized. Please login.', status: 401 };
  }
  return { user };
}

export function requireAdmin(request) {
  const { user, error, status } = requireLogin(request);
  if (error) return { error, status };
  
  if (user.role !== 'admin') {
    return { error: 'Forbidden. Admin access required.', status: 403 };
  }
  
  return { user };
}
