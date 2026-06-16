import { useEffect, useState } from "react";
import {
  useParams,
  useNavigate,
} from "react-router-dom";

import {
  leaveRoom,
  getRoomNote,
  saveRoomNote,
  uploadResource,
getRoomResources,
getRoom,
} from "../services/api";

import socket from "../services/socket";

function StudyRoom() {
  const { id } = useParams();
const navigate =useNavigate();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    string[]
  >([]);

  const [timeLeft, setTimeLeft] =
  useState(1500);

const [isRunning, setIsRunning] =
  useState(false);

  const [onlineUsers, setOnlineUsers] =
  useState<string[]>([]);

  const [roomName, setRoomName] =
  useState("");

  const [note, setNote] =
  useState("");

  
  const [resources,
setResources] =
useState<any[]>([]);

const [selectedFile,
setSelectedFile] =
useState<File | null>(null);


  useEffect(() => {
    const userName =
  localStorage.getItem("userName") ||
  "Anonymous";

socket.emit("join-room", {
  roomId: Number(id),
  userName,
});

getRoom(
  Number(id)
).then((room) => {
  if (room) {
    setRoomName(
      room.name
    );
  }
});

getRoomNote(
  Number(id)
).then((data) => {
  setNote(
    data.content || ""
  );
});

getRoomResources(
  Number(id)
).then(
  setResources
);

getRoomNote(
  Number(id)
).then((data) => {
  setNote(
    data.content || ""
  );
});

    socket.on(
  "receive-message",
  (data) => {
    setMessages((prev) => [
      ...prev,
      data.message,
    ]);
  }
);

    socket.on(
  "online-users",
  (users: string[]) => {
    setOnlineUsers(users);
  }
);

    socket.on(
  "timer-started",
  ({ duration }) => {
    setTimeLeft(duration);
    setIsRunning(true);
  }
);

socket.on(
  "timer-paused",
  () => {
    setIsRunning(false);
  }
);

socket.on(
  "timer-reset",
  () => {
    setIsRunning(false);
    setTimeLeft(1500);
  }
);

    return () => {
      socket.off("receive-message");
      socket.off("online-users");
      socket.off("timer-started");
      socket.off("timer-paused");
      socket.off("timer-reset");
    };
  }, [id]);

  const sendMessage = () => {

    const userId =
  Number(
    localStorage.getItem(
      "userId"
    )
  );

   console.log("Sending:", {
    roomId: Number(id),
    userId,
    message,
  });

    socket.emit("send-message", {
      roomId: Number(id),
      userId,
      message,
    });

    setMessage("");
  };

const startTimer = () => {
  socket.emit("timer-start", {
    roomId: Number(id),
    duration: timeLeft,
  });
};

const pauseTimer = () => {
  socket.emit("timer-pause", {
    roomId: Number(id),
  });
};

const resetTimer = () => {
  socket.emit("timer-reset", {
    roomId: Number(id),
  });
};  

const handleLeaveRoom =
  async () => {
    await leaveRoom(
      Number(id)
    );

    navigate(
      "/dashboard"
    );
  };


  const handleSaveNote =
  async () => {
    await saveRoomNote(
      Number(id),
      note
    );

    alert(
      "Notes saved!"
    );
  };

  const handleUpload =
async () => {

  if (!selectedFile)
    return;

  await uploadResource(
    Number(id),
    selectedFile
  );

  const data =
    await getRoomResources(
      Number(id)
    );

  setResources(data);

  setSelectedFile(
    null
  );
};

  useEffect(() => {
  let interval: number;

  if (isRunning && timeLeft > 0) {
    interval = window.setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
  }

  return () => clearInterval(interval);
}, [isRunning, timeLeft]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">

  <div>

  <h1 className="text-4xl font-bold text-emerald-700">
    {roomName}
  </h1>

  <p className="text-gray-500 mt-1"> 
    Collaborate and study together in real time.
  </p>

</div>

  <button
    onClick={handleLeaveRoom}
    className="bg-red-600 text-white px-4 py-2 rounded cursor-pointer"
  >
    Leave Room
  </button>

</div>

      <div
  className="
  bg-white
  rounded-xl
  shadow
  p-6
  mb-6
  "
>
  <h2 className="text-xl font-bold mb-2">
    Online Users
  </h2>

  <div className="flex gap-3 flex-wrap">
    {onlineUsers.map((user) => (
      <span
        key={user}
        className="bg-green-100 text-green-700 px-3 py-1 rounded-full"
      >
        🟢 {user}
      </span>
    ))}
  </div>
</div>

<div
  className="
  bg-white
  rounded-xl
  shadow
  p-6
  mb-8
  "
>

  <h2 className="text-2xl font-bold mb-3">
    Shared Notes
  </h2>

  <textarea
    value={note}
    onChange={(e) =>
      setNote(
        e.target.value
      )
    }
    placeholder="Write study notes here..."
    className="w-full h-48 border rounded-lg p-4"
  />

  <button
    onClick={
      handleSaveNote
    }
    className="mt-3 bg-emerald-600 text-white px-4 py-2 rounded cursor-pointer"
  >
    Save Notes
  </button>

</div>
<div
  className="
  bg-white
  rounded-xl
  shadow
  p-6
  mb-8
  "
>

  <h2 className="text-2xl font-bold mb-3">
    Resources
  </h2>

  <div className="border-2 border-emerald-300 rounded-xl p-4 bg-emerald-50">

  <p className="font-medium mb-3 text-gray-700">
    Upload PDFs, notes and study materials
  </p>

  <div className="flex gap-2">

    <input 
      type="file"
      className="border border-gray-300 rounded-lg p-2 bg-white"
      onChange={(e) =>
        setSelectedFile(
          e.target.files?.[0] ||
          null
        )
      }
    />

    <button
      onClick={
        handleUpload
      }
      className="bg-emerald-600 text-white px-4 py-2 rounded cursor-pointer"
    >
      Upload
    </button>

    </div>

  </div>

  <div className="space-y-2">

    {resources.map(
      (resource) => (
        <a
          key={resource.id}
          href={`https://collaborative-study-platform-production.up.railway.app/uploads/${resource.file_path}`}
          target="_blank"
          rel="noreferrer"
          className="block bg-white p-3 rounded shadow"
        >
          📄 {resource.file_name}
        </a>
      )
    )}

  </div>

</div>

      <div
  className="
  bg-white
  rounded-xl
  shadow
  p-6
  mb-6
  "
>
  <h2 className="text-4xl font-bold">
    {Math.floor(timeLeft / 60)}
    :
    {(timeLeft % 60)
      .toString()
      .padStart(2, "0")}
  </h2>

  <div className="flex gap-2 mt-4 ">
    <button
      onClick={startTimer}
      className="bg-green-600 text-white px-4 py-2 cursor-pointer"
    >
      Start
    </button>

    <button
      onClick={pauseTimer}
      className="bg-yellow-500 text-white px-4 py-2 cursor-pointer"
    >
      Pause
    </button>

    <button
      onClick={resetTimer}
      className="bg-red-600 text-white px-4 py-2 cursor-pointer"
    >
      Reset
    </button>
  </div>
</div>

<h2 className="text-2xl font-bold mb-3">
  Room Chat
</h2>

<p className="text-gray-500 mb-4">
  Discuss topics and collaborate with other members.
</p>

<div
  className="
  bg-white
  border
  rounded-xl
  shadow
  h-60
  p-4
  overflow-y-auto
  "
>
  {messages.length === 0 && (
  <p className="text-gray-400 text-center mt-20">
    No messages yet. Start the conversation..
  </p>
)}
        {messages.map((msg, index) => (

  <div
    key={index}
    className="
    bg-emerald-100
    rounded-lg
    px-3
    py-2
    mb-2
    w-fit
    "
  >
    {msg}
  </div>

))}
      </div>

      <div className="flex gap-2 mt-4">
        <input placeholder="Type your message here..."
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
          className="border
rounded-lg
flex-1
p-3
bg-white
"
        />

        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 cursor-pointer"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default StudyRoom;



