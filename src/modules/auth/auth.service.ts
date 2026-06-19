import config from "../../config";
import { pool } from "../../db";
import bcrypt from "bcryptjs";
import jwt, { type JwtPayload } from "jsonwebtoken";
import type { IAuth } from "./auth.interface";
const registerUserIntoDB = async (payload: IAuth) => {
  const { name, email, password } = payload;

  //check if the user exists
  const userData = await pool.query(
    `
    SELECT * 
    FROM users
    WHERE email=$1

    `,
    [email],
  );

  if (userData.rows.length > 0) {
    throw new Error("user already exists");
  }

  //hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `
    INSERT INTO users (name, email,password)
    VALUES($1,$2,$3)
    RETURNING *
    `,
    [name, email, hashedPassword],
  );
  delete result.rows[0].password;
  return result;
};

const loginUserIntoDB = async (payload: IAuth) => {
  const { email, password } = payload;

  //check user exists
  const userData = await pool.query(
    `
    SELECT * 
    FROM users
    WHERE email = $1
    `,
    [email],
  );
  if (userData.rows.length === 0) {
    throw new Error("user does not exists");
  }
  const user = userData.rows[0];

  //compare the password
  const matchPassowrd = await bcrypt.compare(password, user.password);

  if (!matchPassowrd) {
    throw new Error("Invalid email or passowrd");
  }

  //generate token
  const jwtpayload = {
    id: user.id,
    name: user.name,
    email: user.email,
  };

  const accessToken = jwt.sign(jwtpayload, config.jwt_secret, {
    expiresIn: "1d",
  });

  const refreshToken = jwt.sign(jwtpayload, config.refresh_secret, {
    expiresIn: "30d",
  });

  delete user.password;
  return { accessToken: accessToken, refreshToken: refreshToken };
};

const generateRefreshToken = async (token: string) => {
  if (!token) {
    throw new Error("Unauthorized");
  }
  let decoded: JwtPayload;
  try {
    decoded = jwt.verify(
      token as string,
      config.refresh_secret as string,
    ) as JwtPayload;
  } catch {
    throw new Error("Invalid refresh token");
  }

  const userData = await pool.query(
    `
    SELECT * 
    FROM users
    WHERE email = $1
  `,
    [decoded.email],
  );

  if (userData.rows.length === 0) {
    throw new Error("User not found");
  }
  const user = userData.rows[0];
  if (!user) {
    throw new Error("Forbidden");
  }

  //token generate
  const jwtpayload = {
    id: user.id,
    name: user.name,
    email: user.email,
  };

  const accessToken = jwt.sign(jwtpayload, config.jwt_secret, {
    expiresIn: "15m",
  });

  return { accessToken };
};
export const authService = {
  registerUserIntoDB,
  loginUserIntoDB,
  generateRefreshToken,
};
