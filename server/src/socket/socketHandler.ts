import { Server, Socket } from "socket.io";
import pool from "../config/db.js";

const roomUsers: Record<
  number,
  string[]
> = {};

export const setupSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {

    console.log(
      `User Connected: ${socket.id}`
    );

    socket.on(
      "join-room",
      ({
        roomId,
        userName,
      }) => {

        socket.join(
          `room-${roomId}`
        );

        if (
          !roomUsers[roomId]
        ) {
          roomUsers[roomId] = [];
        }

        if (
          !roomUsers[
            roomId
          ].includes(
            userName
          )
        ) {
          roomUsers[
            roomId
          ].push(
            userName
          );
        }

        io.to(
          `room-${roomId}`
        ).emit(
          "online-users",
          roomUsers[
            roomId
          ]
        );

        console.log(
          `${userName} joined room-${roomId}`
        );
      }
    );

    socket.on(
      "send-message",
      async ({
        roomId,
        userId,
        message,
      }) => {
        try {
          await pool.query(
            `
            INSERT INTO messages
            (room_id, user_id, content)
            VALUES ($1,$2,$3)
            `,
            [
              roomId,
              userId,
              message,
            ]
          );

          io.to(
            `room-${roomId}`
          ).emit(
            "receive-message",
            {
              userId,
              message,
            }
          );
        } catch (
          error
        ) {
          console.error(
            error
          );
        }
      }
    );

    socket.on(
      "timer-start",
      ({
        roomId,
        duration,
      }) => {
        io.to(
          `room-${roomId}`
        ).emit(
          "timer-started",
          {
            duration,
          }
        );
      }
    );

    socket.on(
      "timer-pause",
      ({ roomId }) => {
        io.to(
          `room-${roomId}`
        ).emit(
          "timer-paused"
        );
      }
    );

    socket.on(
      "timer-reset",
      ({ roomId }) => {
        io.to(
          `room-${roomId}`
        ).emit(
          "timer-reset"
        );
      }
    );

    socket.on(
      "disconnect",
      () => {
        console.log(
          `User Disconnected: ${socket.id}`
        );
      }
    );
  });
};