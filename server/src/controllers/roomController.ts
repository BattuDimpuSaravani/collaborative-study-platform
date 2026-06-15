import type { Response, Request } from "express";
import pool from "../config/db.js";
import type { AuthRequest } from "../middleware/authMiddleware.js";

export const createRoom = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Room name is required",
      });
    }

    const result = await pool.query(
      `INSERT INTO rooms
       (name, description, created_by)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, description, req.user?.id],
    );

    await pool.query(
      `
  INSERT INTO room_members
  (user_id, room_id)
  VALUES ($1, $2)
  `,
      [req.user?.id, result.rows[0].id],
    );

    res.status(201).json({
      message: "Room created successfully",
      room: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const joinRoom = async (req: AuthRequest, res: Response) => {
  try {
    const roomId = Number(req.params.roomId);
    const userId = req.user?.id;

    const room = await pool.query("SELECT * FROM rooms WHERE id = $1", [
      roomId,
    ]);

    if (room.rows.length === 0) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    const existingMember = await pool.query(
      `SELECT * FROM room_members
       WHERE user_id = $1 AND room_id = $2`,
      [userId, roomId],
    );

    if (existingMember.rows.length > 0) {
      return res.status(400).json({
        message: "Already joined",
      });
    }

    await pool.query(
      `INSERT INTO room_members
       (user_id, room_id)
       VALUES ($1, $2)`,
      [userId, roomId],
    );

    res.json({
      message: "Joined room successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getMyRooms = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const result = await pool.query(
      `
      SELECT
        rooms.id,
        rooms.name,
        rooms.description,
        rooms.created_at
      FROM rooms
      INNER JOIN room_members
      ON rooms.id = room_members.room_id
      WHERE room_members.user_id = $1
      `,
      [userId],
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getRoomMessages = async (req: AuthRequest, res: Response) => {
  try {
    const roomId = Number(req.params.roomId);

    const result = await pool.query(
      `
      SELECT
        messages.id,
        messages.content,
        messages.created_at,
        users.name
      FROM messages
      INNER JOIN users
      ON users.id = messages.user_id
      WHERE room_id = $1
      ORDER BY created_at ASC
      `,
      [roomId],
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getAllRooms = async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      `
      SELECT *
      FROM rooms
      ORDER BY created_at DESC
      `,
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

export const deleteRoom = async (req: AuthRequest, res: Response) => {
  try {
    const roomId = Number(req.params.roomId);

    const room = await pool.query("SELECT * FROM rooms WHERE id = $1", [
      roomId,
    ]);

    if (room.rows.length === 0) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    if (room.rows[0].created_by !== req.user?.id) {
      return res.status(403).json({
        message: "Only creator can delete room",
      });
    }

    await pool.query("DELETE FROM messages WHERE room_id = $1", [roomId]);

    await pool.query("DELETE FROM room_members WHERE room_id = $1", [roomId]);

    await pool.query("DELETE FROM rooms WHERE id = $1", [roomId]);

    res.json({
      message: "Room deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getCreatedRooms = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const result = await pool.query(
      `
      SELECT *
      FROM rooms
      WHERE created_by = $1
      ORDER BY created_at DESC
      `,
      [userId],
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const leaveRoom = async (req: AuthRequest, res: Response) => {
  try {
    const roomId = Number(req.params.roomId);

    const userId = req.user?.id;

    await pool.query(
      `
      DELETE FROM room_members
      WHERE user_id = $1
      AND room_id = $2
      `,
      [userId, roomId],
    );

    res.json({
      message: "Left room successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const uploadResource = async (req: AuthRequest, res: Response) => {
  try {
    const roomId = Number(req.params.roomId);

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const result = await pool.query(
      `
        INSERT INTO resources
        (
          room_id,
          file_name,
          file_path
        )
        VALUES ($1,$2,$3)
        RETURNING *
        `,
      [roomId, req.file.originalname, req.file.filename],
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getRoomResources = async (req: AuthRequest, res: Response) => {
  try {
    const roomId = Number(req.params.roomId);

    const result = await pool.query(
      `
        SELECT *
        FROM resources
        WHERE room_id = $1
        ORDER BY uploaded_at DESC
        `,
      [roomId],
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getRoomNote = async (req: AuthRequest, res: Response) => {
  try {
    const roomId = Number(req.params.roomId);

    const result = await pool.query(
      `
        SELECT *
        FROM notes
        WHERE room_id = $1
        `,
      [roomId],
    );

    if (result.rows.length === 0) {
      return res.json({
        content: "",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const saveRoomNote = async (req: AuthRequest, res: Response) => {
  try {
    const roomId = Number(req.params.roomId);

    const { content } = req.body;

    const existing = await pool.query(
      `
        SELECT *
        FROM notes
        WHERE room_id = $1
        `,
      [roomId],
    );

    if (existing.rows.length === 0) {
      await pool.query(
        `
        INSERT INTO notes
        (room_id, content)
        VALUES ($1, $2)
        `,
        [roomId, content],
      );
    } else {
      await pool.query(
        `
        UPDATE notes
        SET content = $1,
        updated_at = NOW()
        WHERE room_id = $2
        `,
        [content, roomId],
      );
    }

    res.json({
      message: "Note saved",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const upload = multer({
  storage,
});

