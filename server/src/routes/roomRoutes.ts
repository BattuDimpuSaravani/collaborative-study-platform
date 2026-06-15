import { Router } from "express";
import {
  createRoom,
  joinRoom,
  getMyRooms,
  getRoomMessages,
  getAllRooms,
  deleteRoom,
  getCreatedRooms,
  leaveRoom,
  getRoomNote,
saveRoomNote,
uploadResource,
getRoomResources
} from "../controllers/roomController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

import { upload }
from "../middleware/uploadMiddleware.js";


const router = Router();

router.post(
  "/create",
  authenticateToken,
  createRoom
);

router.post(
  "/join/:roomId",
  authenticateToken,
  joinRoom
);

router.get(
  "/my",
  authenticateToken,
  getMyRooms
);

router.get(
  "/:roomId/messages",
  authenticateToken,
  getRoomMessages
);

router.get(
  "/",
  authenticateToken,
  getAllRooms
);

router.delete(
  "/:roomId",
  authenticateToken,
  deleteRoom
);

router.get(
  "/created",
  authenticateToken,
  getCreatedRooms
);

router.delete(
  "/leave/:roomId",
  authenticateToken,
  leaveRoom
);

router.get(
  "/:roomId/note",
  authenticateToken,
  getRoomNote
);

router.put(
  "/:roomId/note",
  authenticateToken,
  saveRoomNote
);

router.post(
  "/:roomId/resource",
  authenticateToken,
  upload.single("file"),
  uploadResource
);

router.get(
  "/:roomId/resources",
  authenticateToken,
  getRoomResources
);

export default router;