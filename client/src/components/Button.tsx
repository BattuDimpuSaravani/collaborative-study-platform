type ButtonProps = {
  text: string;
  onClick?: () => void;
};

function Button({
  text,
  onClick,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition"
    >
      {text}
    </button>
  );
}

export default Button;