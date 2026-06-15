import {
  useEffect,
  useState,
} from "react";

import RoomCard from "../components/RoomCard";

import {
  getMyRooms,
  createRoom,
  getAllRooms,
  joinRoom,
  deleteRoom,
  getCreatedRooms,
} from "../services/api";

type Room = {
  id: number;
  name: string;
  description: string;
};

function Dashboard() {
  const [rooms, setRooms] =
    useState<Room[]>([]);

  const [allRooms, setAllRooms] =
  useState<Room[]>([]);

  const [showModal, setShowModal] =
    useState(false);

  const [roomName, setRoomName] =
    useState("");

  const [roomDescription, setRoomDescription] = useState("");

  const [createdRooms, setCreatedRooms] =
  useState<Room[]>([]);

  const loadRooms = async () => {
    const data =
      await getMyRooms();

    setRooms(data);
  };

  const loadCreatedRooms =
async () => {
  const data =
    await getCreatedRooms();

  setCreatedRooms(data);
};

  const loadAllRooms =
  async () => {
    const data =
      await getAllRooms();

    setAllRooms(data);
  };

  useEffect(() => {
    loadRooms();
    loadAllRooms();
    loadCreatedRooms();
  }, []);

  const handleCreateRoom =
    async () => {
      const data =
        await createRoom(
          roomName,
          roomDescription
        );

      if (data.room) {
        setShowModal(false);

        setRoomName("");

        setRoomDescription("");

        loadRooms();
        loadCreatedRooms();
        loadAllRooms();
      }
    };

     const handleJoinRoom =
  async (roomId: number) => {
    await joinRoom(roomId);

    loadRooms();
    loadCreatedRooms();
    loadAllRooms();

  };

  const handleDeleteRoom =
  async (roomId: number) => {

    console.log(
      "Deleting room:",
      roomId
    );

    const data =
      await deleteRoom(roomId);
    console.log(data);

    loadRooms();
    loadCreatedRooms();
    loadAllRooms();
  }; 

  return (
<div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-8">

      <div className="flex justify-between items-start">

          <div>
  <h1 className="text-5xl font-bold text-emerald-700">
    📚 StudySync
  </h1>

  <p className="text-gray-600 mt-2">
    Collaborative study rooms for focused learning
  </p>
</div>
        <button
          onClick={() =>
            setShowModal(true)
          }
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg"
        >
          Create Room
        </button>

      </div>

<h2 className="text-3xl font-bold text-emerald-700 mt-12 mb-4">
  Created Rooms
</h2>

<div className="grid md:grid-cols-3 gap-6">

  {createdRooms.map((room) => (
    <RoomCard
      key={room.id}
      id={room.id}
      name={room.name}
      description={room.description}
      onDelete={handleDeleteRoom}
    />
  ))}

</div>

<h2 className="text-3xl font-bold text-emerald-700 mt-12 mb-4">
  Joined Rooms
</h2>

<div className="grid md:grid-cols-3 gap-6">

  {rooms
    .filter(
      (room) =>
        !createdRooms.some(
          (createdRoom) =>
            createdRoom.id === room.id
        )
    )
    .map((room) => (
      <RoomCard
        key={room.id}
        id={room.id}
        name={room.name}
        description={room.description}
      />
    ))}

</div>
<h2 className="text-3xl font-bold text-emerald-700 mt-8 mb-4">
  Explore Rooms
</h2>

<div className="grid md:grid-cols-3 gap-6">

  {allRooms
    .filter(
      (room) =>
        !rooms.some(
          (myRoom) =>
            myRoom.id === room.id
        )
    )
    .map((room) => (
      <div
        key={room.id}
        className="bg-white p-5 rounded-xl shadow"
      >
        <h3 className="font-bold text-xl">
          {room.name}
        </h3>

        <p className="text-gray-500 mt-2">
          {room.description}
        </p>

        <button
          onClick={() =>
            handleJoinRoom(room.id)
          }
          className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded"
        >
          Join Room
        </button>
      </div>
    ))}

</div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white p-6 rounded-xl w-96">

            <h2 className="text-2xl font-bold mb-4">
              Create Room
            </h2>

            <input
              value={roomName}
              onChange={(e) =>
                setRoomName(
                  e.target.value
                )
              }
              placeholder="Room Name"
              className="w-full border p-3 rounded mb-3"
            />

            <textarea
              value={
                roomDescription
              }
              onChange={(e) =>
                setRoomDescription(
                  e.target.value
                )
              }
              placeholder="Description"
              className="w-full border p-3 rounded mb-3"
            />

            <div className="flex gap-2">

              <button
                onClick={() =>
                  setShowModal(
                    false
                  )
                }
                className="flex-1 bg-gray-300 p-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={
                  handleCreateRoom
                }
                className="flex-1 bg-emerald-600 text-white p-2 rounded"
              >
                Create
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Dashboard;