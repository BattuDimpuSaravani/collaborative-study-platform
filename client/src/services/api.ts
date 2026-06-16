const API_URL = "https://collaborative-study-platform-production.up.railway.app";

export async function loginUser(
  email: string,
  password: string
) {
  const response = await fetch(
    `${API_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  return response.json();
}

export async function registerUser(
  name: string,
  email: string,
  password: string
) {
  const response = await fetch(
    `${API_URL}/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    }
  );

  return response.json();
}

export async function getMyRooms() {
  const token =
    localStorage.getItem(
      "token"
    );

  const response =
    await fetch(
      `${API_URL}/rooms/my`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

  return response.json();
}

export async function getAllRooms() {
  const token =
    localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/rooms`,
    {
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    }
  );

  return response.json();
}

export async function joinRoom(
  roomId: number
) {
  const token =
    localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/rooms/join/${roomId}`,
    {
      method: "POST",
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    }
  );

  return response.json();
}

export async function createRoom(
  name: string,
  description: string
) {
  const token =
    localStorage.getItem(
      "token"
    );

  const response =
    await fetch(
      `${API_URL}/rooms/create`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${token}`,
        },

        body: JSON.stringify({
          name,
          description,
        }),
      }
    );

  return response.json();
}

export async function deleteRoom(
  roomId: number
) {
  const token =
    localStorage.getItem(
      "token"
    );

  const response =
    await fetch(
      `${API_URL}/rooms/${roomId}`,
      {
        method: "DELETE",
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

  return response.json();
}

export async function getCreatedRooms() {
  const token =
    localStorage.getItem(
      "token"
    );

  const response =
    await fetch(
      `${API_URL}/rooms/created`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

  return response.json();
}

export async function leaveRoom(
  roomId: number
) {
  const token =
    localStorage.getItem(
      "token"
    );

  const response =
    await fetch(
      `${API_URL}/rooms/leave/${roomId}`,
      {
        method: "DELETE",
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

  return response.json();
}

export async function getRoomNote(
  roomId: number
) {
  const token =
    localStorage.getItem(
      "token"
    );

  const response =
    await fetch(
      `${API_URL}/rooms/${roomId}/note`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

  return response.json();
}

export async function saveRoomNote(
  roomId: number,
  content: string
) {
  const token =
    localStorage.getItem(
      "token"
    );

  const response =
    await fetch(
      `${API_URL}/rooms/${roomId}/note`,
      {
        method: "PUT",
        headers: {
          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${token}`,
        },

        body: JSON.stringify({
          content,
        }),
      }
    );

  return response.json();
}

export async function uploadResource(
  roomId: number,
  file: File
) {
  const token =
    localStorage.getItem(
      "token"
    );

  const formData =
    new FormData();

  formData.append(
    "file",
    file
  );

  const response =
    await fetch(
      `${API_URL}/rooms/${roomId}/resource`,
      {
        method: "POST",
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
        body: formData,
      }
    );

  return response.json();
}

export async function getRoomResources(
  roomId: number
) {
  const token =
    localStorage.getItem(
      "token"
    );

  const response =
    await fetch(
      `${API_URL}/rooms/${roomId}/resources`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

  return response.json();
}

export async function getRoom(
  roomId: number
) {
  const token =
    localStorage.getItem(
      "token"
    );

  const response =
    await fetch(
      `${API_URL}/rooms`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

  const rooms =
    await response.json();

  return rooms.find(
    (room: any) =>
      room.id === roomId
  );
}