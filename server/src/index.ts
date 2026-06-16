import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

import authRoutes from "./routes/authRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";

import { setupSocket } from "./socket/socketHandler.js";
import path from "path";

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  "/uploads",
  express.static(
    path.join(
      process.cwd(),
      "uploads"
    )
  )
);

app.use("/auth", authRoutes);
app.use("/rooms", roomRoutes);

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

setupSocket(io);

console.log(
  "PORT ENV:",
  process.env.PORT
);

const PORT =
  Number(process.env.PORT) || 5000;

httpServer.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});
export { io };