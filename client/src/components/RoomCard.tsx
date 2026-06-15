import { useNavigate } from "react-router-dom";

type Props = {
  id: number;
  name: string;
  description: string;
  onDelete?: (
    roomId: number
  ) => void;
};

function RoomCard({
  id,
  name,
  description,
  onDelete,
}: Props){
  const navigate = useNavigate();

return (
  <div className="bg-white
p-6
rounded-2xl
shadow-md
hover:shadow-xl
hover:-translate-y-1
transition
cursor-pointer">

    <div
      onClick={() =>
        navigate(`/room/${id}`)
      }
      className="cursor-pointer"
    >
      <h3 className="font-bold text-xl">
        {name}
      </h3>

      <p className="text-gray-500 mt-2">
        {description}
      </p>
    </div>

    {onDelete && (
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(id);
        }}
        className="mt-4 bg-red-500 text-white px-3 py-2 rounded"
      >
        Delete Room
      </button>
    )}

  </div>
);
}

export default RoomCard;