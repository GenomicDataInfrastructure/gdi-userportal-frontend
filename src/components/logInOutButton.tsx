type ButtonProps = {
  message: string;
  handleClick: () => void;
};

function LogInOutButton({ message, handleClick }: ButtonProps) {
  return (
    <button
      className="rounded-lg border-2 bg-secondary px-4 py-2 text-sm font-bold text-white hover:opacity-90"
      onClick={handleClick}
    >
      {message}
    </button>
  );
}

export default LogInOutButton;
